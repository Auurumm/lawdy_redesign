import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAuth } from '@/lib/auth';

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const SOLAR_CHAT_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, userId) => {
    const { id } = await params;

    try {
      const { data: document, error: docError } = await supabaseAdmin
        .from('documents')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (docError || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const { data: messages, error } = await supabaseAdmin
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('document_id', id)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ messages: messages || [] });
    } catch (error) {
      console.error('Get chat messages error:', error);
      return NextResponse.json(
        { error: '대화 내역을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, userId) => {
    const { id } = await params;

    try {
      const { message } = await req.json();

      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          { error: '메시지를 입력해주세요.' },
          { status: 400 }
        );
      }

      const { data: document, error: docError } = await supabaseAdmin
        .from('documents')
        .select('id, file_name, parsed_content, status')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (docError || !document) {
        return NextResponse.json(
          { error: '문서를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      if (document.status !== 'completed') {
        return NextResponse.json(
          { error: '분석이 완료된 문서에서만 대화할 수 있습니다.' },
          { status: 400 }
        );
      }

      const { data: analysis } = await supabaseAdmin
        .from('analyses')
        .select('summary, risk_items, recommendations')
        .eq('document_id', id)
        .single();

      const { data: previousMessages } = await supabaseAdmin
        .from('chat_messages')
        .select('role, content')
        .eq('document_id', id)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(20);

      await supabaseAdmin
        .from('chat_messages')
        .insert({
          document_id: id,
          user_id: userId,
          role: 'user',
          content: message,
        });

      const systemPrompt = `당신은 계약서 분석 전문가입니다. 사용자가 업로드한 계약서에 대해 질문에 답변해주세요.

문서명: ${document.file_name}

계약서 내용:
${document.parsed_content?.substring(0, 8000) || '(내용 없음)'}

${analysis ? `
분석 요약: ${analysis.summary}

발견된 위험 요소:
${(analysis.risk_items || []).map((item: { title: string; description: string }) => `- ${item.title}: ${item.description}`).join('\n')}

권장사항:
${(analysis.recommendations || []).map((rec: string) => `- ${rec}`).join('\n')}
` : ''}

사용자의 질문에 친절하고 정확하게 답변해주세요. 계약서 내용을 기반으로 답변하되, 법적 조언이 아닌 정보 제공 목적임을 명심하세요.`;

      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...(previousMessages || []).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await fetch(SOLAR_CHAT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTAGE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'solar-pro',
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Solar LLM API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      const assistantMessage = result.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';

      const { data: savedMessage, error: saveError } = await supabaseAdmin
        .from('chat_messages')
        .insert({
          document_id: id,
          user_id: userId,
          role: 'assistant',
          content: assistantMessage,
        })
        .select('id, role, content, created_at')
        .single();

      if (saveError) throw saveError;

      return NextResponse.json({
        message: {
          id: savedMessage.id,
          role: savedMessage.role,
          content: savedMessage.content,
          createdAt: savedMessage.created_at,
        },
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : '대화 처리 중 오류가 발생했습니다.';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  });
}
