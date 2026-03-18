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

      if (error) {
        console.warn('chat_messages query failed (table may not exist):', error.message);
        return NextResponse.json({ messages: [] });
      }

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

      if (!UPSTAGE_API_KEY) {
        return NextResponse.json(
          { error: 'AI 서비스가 설정되지 않았습니다.' },
          { status: 500 }
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

      // chat_messages 테이블이 없을 수 있으므로 에러 무시
      let previousMessages: { role: string; content: string }[] = [];
      try {
        const { data, error } = await supabaseAdmin
          .from('chat_messages')
          .select('role, content')
          .eq('document_id', id)
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(20);
        if (!error && data) {
          previousMessages = data;
        }
      } catch {
        // 테이블 미존재시 무시
      }

      // 사용자 메시지 저장 (테이블 없으면 무시)
      try {
        await supabaseAdmin
          .from('chat_messages')
          .insert({
            document_id: id,
            user_id: userId,
            role: 'user',
            content: message,
          });
      } catch {
        // 테이블 미존재시 무시
      }

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

      // AI 응답 저장 (테이블 없으면 무시하고 응답은 반환)
      let savedMessage = null;
      try {
        const { data, error: saveError } = await supabaseAdmin
          .from('chat_messages')
          .insert({
            document_id: id,
            user_id: userId,
            role: 'assistant',
            content: assistantMessage,
          })
          .select('id, role, content, created_at')
          .single();

        if (!saveError) {
          savedMessage = data;
        }
      } catch {
        // 테이블 미존재시 무시
      }

      return NextResponse.json({
        message: {
          id: savedMessage?.id || crypto.randomUUID(),
          role: 'assistant',
          content: assistantMessage,
          createdAt: savedMessage?.created_at || new Date().toISOString(),
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
