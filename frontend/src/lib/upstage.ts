import type { RiskItem, RiskLevel } from '@/types/database';

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const DOCUMENT_PARSE_URL = 'https://api.upstage.ai/v1/document-ai/document-parse';
const SOLAR_CHAT_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

interface DocumentParseResponse {
  content: {
    markdown: string;
    html?: string;
    text?: string;
  };
  elements?: Array<{
    id: number;
    category: string;
    content: { text: string; markdown?: string };
    page: number;
  }>;
  usage: { pages: number };
}

interface ContractAnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  riskItems: RiskItem[];
  keyClauses: string[];
  recommendations: string[];
}

export async function parseDocument(fileBuffer: Buffer, fileName: string): Promise<string> {
  if (!UPSTAGE_API_KEY) {
    throw new Error('UPSTAGE_API_KEY is not configured');
  }

  const formData = new FormData();
  const uint8Array = new Uint8Array(fileBuffer);
  const blob = new Blob([uint8Array], { type: 'application/pdf' });
  formData.append('document', blob, fileName);
  formData.append('output_formats', JSON.stringify(['markdown']));
  formData.append('model', 'document-parse');
  formData.append('ocr', 'auto');

  const response = await fetch(DOCUMENT_PARSE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTAGE_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Document Parse API error: ${response.status} - ${error}`);
  }

  const result: DocumentParseResponse = await response.json();
  return result.content.markdown;
}

export async function analyzeContract(parsedContent: string): Promise<ContractAnalysisResult> {
  if (!UPSTAGE_API_KEY) {
    throw new Error('UPSTAGE_API_KEY is not configured');
  }

  const systemPrompt = `당신은 계약서 분석 전문가입니다. 제공된 계약서 내용을 분석하여 위험 요소를 식별하고 평가해주세요.

응답은 반드시 다음 JSON 형식으로만 제공해주세요:
{
  "riskLevel": "low" | "medium" | "high",
  "riskScore": 0-100 사이의 숫자,
  "summary": "계약서 전체 요약 (2-3문장)",
  "riskItems": [
    {
      "title": "위험 항목 제목",
      "description": "위험에 대한 상세 설명",
      "recommendation": "권장 조치사항",
      "severity": "low" | "medium" | "high",
      "clause": "관련 조항 텍스트 (있는 경우)"
    }
  ],
  "keyClauses": ["주요 조항 1", "주요 조항 2", ...],
  "recommendations": ["전체 권장사항 1", "전체 권장사항 2", ...]
}

위험 평가 기준:
- 불공정한 조항 (일방적 해지권, 과도한 위약금 등)
- 모호하거나 불명확한 표현
- 책임 제한 또는 면책 조항
- 분쟁 해결 조항의 불리함
- 지적재산권 관련 위험
- 비밀유지 의무의 범위
- 계약 기간 및 갱신 조건`;

  const response = await fetch(SOLAR_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'solar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `다음 계약서를 분석해주세요:\n\n${parsedContent}` },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Solar LLM API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  const content = result.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from Solar LLM');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse analysis result as JSON');
  }

  const analysis = JSON.parse(jsonMatch[0]) as ContractAnalysisResult;

  if (!analysis.riskLevel || !['low', 'medium', 'high'].includes(analysis.riskLevel)) {
    analysis.riskLevel = 'medium';
  }
  if (typeof analysis.riskScore !== 'number' || analysis.riskScore < 0 || analysis.riskScore > 100) {
    analysis.riskScore = 50;
  }
  if (!analysis.summary) {
    analysis.summary = '계약서 분석이 완료되었습니다.';
  }
  if (!Array.isArray(analysis.riskItems)) {
    analysis.riskItems = [];
  }
  if (!Array.isArray(analysis.keyClauses)) {
    analysis.keyClauses = [];
  }
  if (!Array.isArray(analysis.recommendations)) {
    analysis.recommendations = [];
  }

  return analysis;
}

export async function parseAndAnalyzeDocument(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ parsedContent: string; analysis: ContractAnalysisResult }> {
  const parsedContent = await parseDocument(fileBuffer, fileName);
  const analysis = await analyzeContract(parsedContent);
  return { parsedContent, analysis };
}
