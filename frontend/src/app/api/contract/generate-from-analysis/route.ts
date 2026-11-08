import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const SOLAR_CHAT_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

// 분석 결과(위험 요소·권장사항)를 반영해 개선된 계약서를 다시 작성한다.
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    const startTime = Date.now();

    try {
      const { documentId } = await req.json();

      if (!documentId || typeof documentId !== 'string') {
        return NextResponse.json({ error: '문서 ID가 필요합니다.' }, { status: 400 });
      }

      if (!UPSTAGE_API_KEY) {
        return NextResponse.json({ error: 'AI 서비스가 설정되지 않았습니다.' }, { status: 500 });
      }

      const { data: document, error: docError } = await supabaseAdmin
        .from('documents')
        .select('id, file_name, parsed_content, status')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();

      if (docError || !document) {
        return NextResponse.json({ error: '문서를 찾을 수 없습니다.' }, { status: 404 });
      }

      if (document.status !== 'completed' || !document.parsed_content) {
        return NextResponse.json(
          { error: '분석이 완료된 문서에서만 계약서를 생성할 수 있습니다.' },
          { status: 400 }
        );
      }

      const { data: analysis } = await supabaseAdmin
        .from('analyses')
        .select('summary, risk_items, recommendations')
        .eq('document_id', documentId)
        .single();

      const riskItems = (analysis?.risk_items || []) as { title?: string; description?: string; suggestion?: string }[];
      const recommendations = (analysis?.recommendations || []) as string[];

      const systemPrompt = `당신은 한국 법률 문서 작성 전문가입니다.
원본 계약서와 AI 위험 분석 결과를 바탕으로, 위험 요소를 해소한 개선된 계약서를 작성합니다.

작성 원칙:
- 원본의 계약 유형, 당사자, 핵심 거래 조건은 유지
- 불공정·모호한 조항은 균형 있고 명확하게 수정
- 누락된 필수 조항은 추가
- 조항별로 제1조, 제2조 형식으로 구분
- 원본에 없는 구체적 금액·날짜는 지어내지 말고 ○○ 등 빈칸으로 남김
- 계약서 본문만 출력 (설명·머리말 제외)`;

      const userPrompt = `## 원본 계약서 (${document.file_name})
${document.parsed_content.substring(0, 12000)}

## 분석 요약
${analysis?.summary || '(없음)'}

## 발견된 위험 요소
${riskItems.length ? riskItems.map((r) => `- ${r.title || ''}: ${r.description || ''}${r.suggestion ? ` (개선 방향: ${r.suggestion})` : ''}`).join('\n') : '(없음)'}

## 권장사항
${recommendations.length ? recommendations.map((r) => `- ${r}`).join('\n') : '(없음)'}

위 위험 요소와 권장사항을 모두 반영하여 개선된 계약서 전문을 작성해주세요.`;

      const response = await fetch(SOLAR_CHAT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTAGE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'solar-pro4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Solar LLM API error:', error);
        throw new Error(`AI 서비스 오류: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('계약서 생성에 실패했습니다.');
      }

      const baseName = document.file_name.replace(/\.[^.]+$/, '');

      return NextResponse.json({
        success: true,
        contract: {
          id: crypto.randomUUID(),
          content,
          title: `${baseName} (개선본)`,
          processingTimeMs: Date.now() - startTime,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Contract from analysis error:', error);
      const message = error instanceof Error ? error.message : '계약서 생성 중 오류가 발생했습니다.';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
