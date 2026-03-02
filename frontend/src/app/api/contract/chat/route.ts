import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const SOLAR_CHAT_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

// 계약서 유형별 필수 필드 목록
const REQUIRED_FIELDS: Record<string, string[]> = {
  employment: [
    'partyAName', 'partyARepresentative',
    'partyBName',
    'startDate', 'position', 'salaryType', 'salaryAmount',
  ],
  service: [
    'partyAName', 'partyBName',
    'projectName', 'serviceScope', 'startDate', 'endDate',
    'totalAmount',
  ],
  nda: [
    'partyAName', 'partyBName',
    'ndaType', 'purpose', 'confidentialScope', 'confidentialPeriod',
  ],
  lease: [
    'partyAName', 'partyBName',
    'propertyAddress', 'leaseType', 'deposit',
    'startDate', 'endDate',
  ],
  freelance: [
    'partyAName', 'partyBName',
    'projectName', 'workScope', 'startDate', 'endDate',
    'totalAmount',
  ],
  investment: [
    'partyAName', 'partyARepresentative',
    'partyBName',
    'investmentType', 'investmentAmount', 'preMoneyValuation',
  ],
};

// 계약서 유형별 필드 한글 설명
const FIELD_DESCRIPTIONS: Record<string, Record<string, string>> = {
  employment: {
    partyAName: '회사명',
    partyARepresentative: '대표자명',
    partyABusinessNumber: '사업자등록번호',
    partyAAddress: '회사 주소',
    partyBName: '근로자 성명',
    partyBBirthDate: '근로자 생년월일',
    partyBAddress: '근로자 주소',
    partyBContact: '근로자 연락처',
    startDate: '근무 시작일',
    endDate: '근무 종료일',
    position: '담당 업무/직위',
    workplace: '근무 장소',
    workingHours: '근무 시간',
    salaryType: '급여 형태(연봉/월급/시급)',
    salaryAmount: '급여액(원)',
    paymentDate: '급여 지급일',
  },
  service: {
    partyAName: '의뢰인(갑) 회사명/성명',
    partyARepresentative: '의뢰인 대표자명',
    partyBName: '수급인(을) 회사명/성명',
    partyBRepresentative: '수급인 대표자명',
    projectName: '프로젝트명',
    serviceScope: '용역 범위 및 내용',
    startDate: '계약 시작일',
    endDate: '납품 기한',
    totalAmount: '용역 대금(원)',
    paymentMethod: '지급 방식',
  },
  nda: {
    partyAName: '정보제공자(갑) 회사명/성명',
    partyARepresentative: '갑 대표자명',
    partyBName: '정보수령자(을) 회사명/성명',
    partyBRepresentative: '을 대표자명',
    ndaType: '비밀유지 유형(쌍방/일방)',
    purpose: '비밀유지 목적',
    confidentialScope: '비밀정보 범위',
    confidentialPeriod: '비밀유지 기간(년)',
    penaltyAmount: '위약금(원)',
  },
  lease: {
    partyAName: '임대인(갑) 성명',
    partyAAddress: '임대인 주소',
    partyAContact: '임대인 연락처',
    partyBName: '임차인(을) 성명',
    partyBAddress: '임차인 주소',
    partyBContact: '임차인 연락처',
    propertyType: '부동산 유형',
    propertyAddress: '부동산 소재지',
    propertySize: '면적(m2)',
    leaseType: '계약 유형(전세/월세)',
    deposit: '보증금(원)',
    monthlyRent: '월 차임(원)',
    startDate: '계약 시작일',
    endDate: '계약 종료일',
  },
  freelance: {
    partyAName: '의뢰인(갑) 회사명/성명',
    partyARepresentative: '의뢰인 대표자명',
    partyBName: '프리랜서(을) 성명',
    partyBContact: '프리랜서 연락처',
    projectName: '프로젝트/업무명',
    workScope: '업무 내용 및 범위',
    startDate: '계약 시작일',
    endDate: '계약 종료일',
    totalAmount: '대금(원)',
    paymentMethod: '지급 방식',
  },
  investment: {
    partyAName: '회사(갑) 명',
    partyARepresentative: '대표이사',
    partyABusinessNumber: '사업자등록번호',
    partyBName: '투자자(을) 명',
    partyBRepresentative: '투자자 대표자명',
    investmentType: '투자 유형(보통주/우선주/CB 등)',
    investmentAmount: '투자금액(원)',
    preMoneyValuation: 'Pre-money 밸류에이션(원)',
    shareCount: '발행 주식 수',
    equityPercentage: '투자 후 지분율(%)',
  },
};

const CONTRACT_TYPE_NAMES: Record<string, string> = {
  employment: '근로계약서',
  service: '용역계약서',
  nda: '비밀유지계약서',
  lease: '임대차계약서',
  freelance: '프리랜서 계약서',
  investment: '투자계약서',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  contractType: string;
  messages: ChatMessage[];
  currentExtractedData: Record<string, string>;
}

// 한글 설명 → 영문 필드키 역매핑 생성
function buildReverseMap(fieldDescs: Record<string, string>): Record<string, string> {
  const reverseMap: Record<string, string> = {};
  for (const [key, desc] of Object.entries(fieldDescs)) {
    reverseMap[desc] = key;
    // 괄호 제거 버전도 추가 (e.g. "급여 형태" for "급여 형태(연봉/월급/시급)")
    const withoutParen = desc.replace(/\(.*\)/, '').trim();
    if (withoutParen !== desc) {
      reverseMap[withoutParen] = key;
    }
  }
  return reverseMap;
}

// LLM이 한글 키를 사용했을 때 영문 키로 변환
function normalizeExtractedData(
  rawData: Record<string, string>,
  reverseMap: Record<string, string>,
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawData)) {
    if (!value || (typeof value === 'string' && !value.trim())) continue;
    const strValue = String(value).trim();
    // 이미 영문 키인 경우
    if (/^[a-zA-Z]/.test(key)) {
      normalized[key] = strValue;
    } else {
      // 한글 키 → 영문 키 변환 시도
      const englishKey = reverseMap[key] || reverseMap[key.replace(/\(.*\)/, '').trim()];
      if (englishKey) {
        normalized[englishKey] = strValue;
      } else {
        // 부분 매칭 시도
        const matchedKey = Object.entries(reverseMap).find(([desc]) =>
          key.includes(desc) || desc.includes(key)
        );
        if (matchedKey) {
          normalized[matchedKey[1]] = strValue;
        } else {
          normalized[key] = strValue;
        }
      }
    }
  }
  return normalized;
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body: ChatRequest = await req.json();
      const { contractType, messages, currentExtractedData } = body;

      if (!contractType || !CONTRACT_TYPE_NAMES[contractType]) {
        return NextResponse.json(
          { error: '유효하지 않은 계약서 유형입니다.' },
          { status: 400 }
        );
      }

      if (!UPSTAGE_API_KEY) {
        return NextResponse.json(
          { error: 'AI 서비스가 설정되지 않았습니다.' },
          { status: 500 }
        );
      }

      const requiredFields = REQUIRED_FIELDS[contractType] || [];
      const fieldDescs = FIELD_DESCRIPTIONS[contractType] || {};
      const reverseMap = buildReverseMap(fieldDescs);

      // 어떤 필드가 아직 수집되지 않았는지 파악
      const missingFields = requiredFields.filter(f => !currentExtractedData[f]?.trim());
      const collectedFields = requiredFields.filter(f => currentExtractedData[f]?.trim());

      const progress = requiredFields.length > 0
        ? Math.round((collectedFields.length / requiredFields.length) * 100)
        : 0;

      // 필드 목록을 "키(설명)" 형태로 명시
      const fieldList = Object.entries(fieldDescs).map(([key, desc]) => {
        const collected = currentExtractedData[key]?.trim();
        const isRequired = requiredFields.includes(key);
        return `- "${key}" = ${desc}${isRequired ? ' [필수]' : ' [선택]'}: ${collected ? `수집완료 "${collected}"` : '미수집'}`;
      }).join('\n');

      // 예시 JSON 생성 (미수집 필드 중 처음 2개로)
      const exampleFields = missingFields.slice(0, 2);
      const exampleJson: Record<string, string> = {};
      exampleFields.forEach(f => {
        exampleJson[f] = `(${fieldDescs[f] || f} 값)`;
      });

      const systemPrompt = `당신은 ${CONTRACT_TYPE_NAMES[contractType]} 작성을 도와주는 친절한 AI 어시스턴트입니다.
사용자와 자연스러운 대화를 통해 계약서 작성에 필요한 정보를 수집합니다.

## 수집해야 할 정보 (영문키 = 한글설명)
${fieldList}

## 현재 진행률: ${progress}%
## 미수집 필수 항목: ${missingFields.map(f => `${f}(${fieldDescs[f] || f})`).join(', ') || '없음 (모두 수집됨)'}

## 대화 규칙
1. 한 번에 2-3개 이하의 항목만 질문하세요.
2. 사용자의 답변에서 정보를 추출하세요.
3. 이미 수집된 정보는 다시 질문하지 마세요.
4. 친절하고 자연스러운 한국어로 대화하세요.
5. 모든 필수 정보가 수집되면 "정보 수집이 완료되었습니다"라고 안내하세요.

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요. extractedData의 키는 반드시 위 목록의 영문키를 사용하세요.
\`\`\`json
{
  "reply": "사용자에게 보여줄 자연어 메시지",
  "extractedData": ${JSON.stringify(exampleJson)},
  "isComplete": false
}
\`\`\`

중요: extractedData의 키는 반드시 영문키(partyAName, partyBName, startDate 등)를 사용하세요. 한글 키를 사용하지 마세요.
extractedData에는 이번 대화에서 새로 추출한 정보만 포함하세요.
isComplete는 모든 필수 항목이 수집되었을 때만 true로 설정하세요.`;

      const chatMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
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
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Solar LLM API error:', errorText);
        throw new Error(`AI 서비스 오류: ${response.status}`);
      }

      const result = await response.json();
      const rawContent = result.choices[0]?.message?.content || '';

      // JSON 파싱 시도
      let reply = rawContent;
      let extractedData: Record<string, string> = {};
      let isComplete = false;

      try {
        // ```json ... ``` 블록 우선 추출
        const codeBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = codeBlockMatch
          ? codeBlockMatch[1].trim()
          : rawContent;

        // JSON 객체 추출
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          reply = parsed.reply || rawContent;

          // extractedData 키 정규화 (한글→영문 변환)
          const rawExtracted = parsed.extractedData || {};
          extractedData = normalizeExtractedData(rawExtracted, reverseMap);

          isComplete = parsed.isComplete === true;
        }
      } catch {
        // JSON 파싱 실패시 텍스트를 그대로 reply로 사용
        reply = rawContent;
      }

      // 기존 데이터와 병합
      const mergedData = { ...currentExtractedData, ...extractedData };

      // isComplete 재검증: 필수 필드가 실제로 모두 채워졌는지 확인
      const actualMissing = requiredFields.filter(f => !mergedData[f]?.trim());
      if (actualMissing.length > 0) {
        isComplete = false;
      }

      const actualProgress = requiredFields.length > 0
        ? Math.round(((requiredFields.length - actualMissing.length) / requiredFields.length) * 100)
        : 100;

      return NextResponse.json({
        reply,
        extractedData: mergedData,
        isComplete,
        progress: actualProgress,
      });
    } catch (error) {
      console.error('Contract chat error:', error);
      const errorMessage = error instanceof Error ? error.message : '대화 처리 중 오류가 발생했습니다.';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  });
}
