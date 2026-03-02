import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const UPSTAGE_API_KEY = process.env.UPSTAGE_API_KEY;
const SOLAR_CHAT_URL = 'https://api.upstage.ai/v1/solar/chat/completions';

// 계약서 유형별 시스템 프롬프트
const CONTRACT_PROMPTS: Record<string, string> = {
  employment: `당신은 한국 노동법에 정통한 법률 문서 작성 전문가입니다.
근로기준법을 준수하는 표준 근로계약서를 작성해주세요.

필수 포함 조항:
- 근로계약기간
- 근무장소
- 업무내용
- 근로시간 및 휴게시간
- 임금 (구성항목, 계산방법, 지급일)
- 연차유급휴가
- 사회보험 적용
- 해고 및 퇴직

작성 형식:
- 조항별로 제1조, 제2조 형식으로 구분
- 명확하고 이해하기 쉬운 문장 사용
- 법적으로 유효한 표현 사용`,

  service: `당신은 계약서 작성 전문가입니다.
용역계약서(업무위탁계약서)를 작성해주세요.

필수 포함 조항:
- 용역의 내용 및 범위
- 계약기간
- 용역대금 및 지급조건
- 용역 수행 방법
- 비밀유지 의무
- 지식재산권 귀속
- 계약 해지 조건
- 손해배상
- 분쟁해결

작성 형식:
- 조항별로 제1조, 제2조 형식으로 구분
- 갑(의뢰인)과 을(수급인) 명확히 구분`,

  nda: `당신은 계약서 작성 전문가입니다.
비밀유지계약서(NDA)를 작성해주세요.

필수 포함 조항:
- 비밀정보의 정의 및 범위
- 비밀유지 의무
- 비밀정보의 사용 제한
- 비밀유지 기간
- 예외 사항
- 비밀정보의 반환 또는 폐기
- 손해배상
- 분쟁해결

작성 형식:
- 조항별로 제1조, 제2조 형식으로 구분
- 쌍방 또는 일방 비밀유지 여부 명시`,

  lease: `당신은 부동산 계약서 작성 전문가입니다.
주택임대차보호법을 준수하는 임대차계약서를 작성해주세요.

필수 포함 조항:
- 부동산의 표시
- 임대차 기간
- 보증금 및 차임
- 임대인/임차인의 의무
- 계약의 해지
- 원상복구
- 특약사항

작성 형식:
- 조항별로 제1조, 제2조 형식으로 구분
- 임대인(갑)과 임차인(을) 명확히 구분`,

  freelance: `당신은 계약서 작성 전문가입니다.
프리랜서 업무위탁계약서를 작성해주세요.

필수 포함 조항:
- 업무 내용 및 범위
- 계약기간
- 대금 및 지급조건
- 업무 수행 방법 (독립 계약자 명시)
- 비밀유지
- 지식재산권
- 계약 해지
- 손해배상

주의사항:
- 근로자가 아닌 독립 계약자임을 명확히
- 4대보험 미적용 명시`,

  investment: `당신은 스타트업 투자계약 전문가입니다.
투자계약서를 작성해주세요.

필수 포함 조항:
- 투자금액 및 주식 발행
- 투자 조건 (Valuation)
- 투자자의 권리 (이사회 참관권, 정보청구권 등)
- 주식매수선택권
- 희석화 방지
- 동반매도권/우선매수권
- 진술 및 보장
- 계약 위반시 조치

작성 형식:
- 조항별로 제1조, 제2조 형식으로 구분
- 투자자와 회사 명확히 구분`,
};

interface ContractGenerateRequest {
  contractType: 'employment' | 'service' | 'nda' | 'lease' | 'freelance' | 'investment';
  partyA: {
    name: string;
    representative?: string;
    businessNumber?: string;
    address?: string;
  };
  partyB: {
    name: string;
    birthDate?: string;
    address?: string;
    contact?: string;
  };
  terms: {
    startDate?: string;
    endDate?: string;
    position?: string;
    workplace?: string;
    workingHours?: string;
    salaryType?: string;
    salaryAmount?: string;
    paymentDate?: string;
    [key: string]: string | undefined;
  };
  additionalClauses?: string[];
}

export async function POST(request: NextRequest) {
  // 인증 체크 - 로그인한 사용자만 사용 가능
  return withAuth(request, async (req, userId) => {
    const startTime = Date.now();

    try {
      const body: ContractGenerateRequest = await req.json();
      const { contractType, partyA, partyB, terms, additionalClauses } = body;

      // 유효성 검사
      if (!contractType || !CONTRACT_PROMPTS[contractType]) {
        return NextResponse.json(
          { error: '유효하지 않은 계약서 유형입니다.' },
          { status: 400 }
        );
      }

      if (!partyA?.name || !partyB?.name) {
        return NextResponse.json(
          { error: '계약 당사자 정보가 필요합니다.' },
          { status: 400 }
        );
      }

      if (!UPSTAGE_API_KEY) {
        return NextResponse.json(
          { error: 'AI 서비스가 설정되지 않았습니다.' },
          { status: 500 }
        );
      }

      // 계약서 유형별 시스템 프롬프트
      const systemPrompt = CONTRACT_PROMPTS[contractType];

      // 사용자 입력 정보를 기반으로 프롬프트 생성
      const userPrompt = buildUserPrompt(contractType, partyA, partyB, terms, additionalClauses);

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
      const contractContent = result.choices[0]?.message?.content;

      if (!contractContent) {
        throw new Error('계약서 생성에 실패했습니다.');
      }

      const processingTime = Date.now() - startTime;

      // 생성된 계약서를 DB에 저장
      const { data: savedContract, error: saveError } = await supabaseAdmin
        .from('generated_contracts')
        .insert({
          user_id: userId,
          contract_type: contractType,
          title: `${getContractTypeName(contractType)} - ${partyA.name}`,
          party_a_name: partyA.name,
          party_a_representative: partyA.representative,
          party_a_business_number: partyA.businessNumber,
          party_a_address: partyA.address,
          party_b_name: partyB.name,
          party_b_birth_date: partyB.birthDate || null,
          party_b_address: partyB.address,
          party_b_contact: partyB.contact,
          terms: terms,
          additional_clauses: additionalClauses || [],
          content: contractContent,
          processing_time_ms: processingTime,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Failed to save contract:', saveError);
        // 저장 실패해도 생성된 계약서는 반환
      }

      return NextResponse.json({
        success: true,
        contract: {
          id: savedContract?.id,
          type: contractType,
          content: contractContent,
          partyA,
          partyB,
          terms,
          processingTimeMs: processingTime,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Contract generation error:', error);
      const errorMessage = error instanceof Error ? error.message : '계약서 생성 중 오류가 발생했습니다.';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  });
}

// 계약서 목록 조회 (사용자별)
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const contractType = searchParams.get('type');
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('generated_contracts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (contractType) {
        query = query.eq('contract_type', contractType);
      }

      const { data: contracts, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        data: contracts || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (error) {
      console.error('Get contracts error:', error);
      return NextResponse.json(
        { error: '계약서 목록을 가져오는데 실패했습니다.' },
        { status: 500 }
      );
    }
  });
}

function getContractTypeName(type: string): string {
  const names: Record<string, string> = {
    employment: '근로계약서',
    service: '용역계약서',
    nda: '비밀유지계약서',
    lease: '임대차계약서',
    freelance: '프리랜서 계약서',
    investment: '투자계약서',
  };
  return names[type] || '계약서';
}

function buildUserPrompt(
  contractType: string,
  partyA: ContractGenerateRequest['partyA'],
  partyB: ContractGenerateRequest['partyB'],
  terms: ContractGenerateRequest['terms'],
  additionalClauses?: string[]
): string {
  const contractTypeNames: Record<string, string> = {
    employment: '근로계약서',
    service: '용역계약서',
    nda: '비밀유지계약서',
    lease: '임대차계약서',
    freelance: '프리랜서 계약서',
    investment: '투자계약서',
  };

  let prompt = `다음 정보를 기반으로 ${contractTypeNames[contractType]}를 작성해주세요.

## 갑(사용자/의뢰인/임대인/회사) 정보
- 상호/성명: ${partyA.name}`;

  if (partyA.representative) prompt += `\n- 대표자: ${partyA.representative}`;
  if (partyA.businessNumber) prompt += `\n- 사업자등록번호: ${partyA.businessNumber}`;
  if (partyA.address) prompt += `\n- 주소: ${partyA.address}`;

  prompt += `\n\n## 을(근로자/수급인/임차인/투자자) 정보
- 성명: ${partyB.name}`;

  if (partyB.birthDate) prompt += `\n- 생년월일: ${partyB.birthDate}`;
  if (partyB.address) prompt += `\n- 주소: ${partyB.address}`;
  if (partyB.contact) prompt += `\n- 연락처: ${partyB.contact}`;

  prompt += `\n\n## 계약 조건`;

  if (terms.startDate) prompt += `\n- 계약 시작일: ${terms.startDate}`;
  if (terms.endDate) prompt += `\n- 계약 종료일: ${terms.endDate}`;
  if (terms.position) prompt += `\n- 담당 업무/직위: ${terms.position}`;
  if (terms.workplace) prompt += `\n- 근무 장소: ${terms.workplace}`;
  if (terms.workingHours) prompt += `\n- 근무 시간: ${terms.workingHours}`;
  if (terms.salaryType) prompt += `\n- 급여 형태: ${terms.salaryType}`;
  if (terms.salaryAmount) prompt += `\n- 급여액: ${terms.salaryAmount}원`;
  if (terms.paymentDate) prompt += `\n- 지급일: ${terms.paymentDate}`;

  // 기타 terms 추가
  Object.entries(terms).forEach(([key, value]) => {
    if (value && !['startDate', 'endDate', 'position', 'workplace', 'workingHours', 'salaryType', 'salaryAmount', 'paymentDate'].includes(key)) {
      prompt += `\n- ${key}: ${value}`;
    }
  });

  if (additionalClauses && additionalClauses.length > 0) {
    prompt += `\n\n## 추가 특약 조항 (포함해주세요)`;
    additionalClauses.forEach((clause, index) => {
      prompt += `\n${index + 1}. ${clause}`;
    });
  }

  prompt += `\n\n위 정보를 바탕으로 완전한 계약서를 작성해주세요. 계약 날짜는 오늘 날짜로 작성하고, 서명란도 포함해주세요.`;

  return prompt;
}