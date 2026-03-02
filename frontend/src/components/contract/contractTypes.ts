// 계약서 유형별 스텝 정의, 필드 설정, 추천 특약 목록

export type ContractType = 'employment' | 'service' | 'nda' | 'lease' | 'freelance' | 'investment';

export interface SubStep {
  id: string;
  title: string;
  icon: string;
  badgeLabel?: string;  // 갑/을 표시용
  badgeColor?: string;
}

export interface ContractTypeConfig {
  type: ContractType;
  icon: string;
  title: string;
  description: string;
  subSteps: SubStep[];
  recommendedClauses: string[];
}

export const contractTypeNames: Record<string, string> = {
  employment: '근로계약서',
  service: '용역계약서',
  nda: '비밀유지계약서',
  lease: '임대차계약서',
  freelance: '프리랜서 계약서',
  investment: '투자계약서',
};

export const contractTypeConfigs: Record<ContractType, ContractTypeConfig> = {
  employment: {
    type: 'employment',
    icon: '👤',
    title: '근로계약서',
    description: '정규직, 계약직, 수습, 파트타임 등',
    subSteps: [
      { id: 'partyA', title: '회사(갑) 정보', icon: '🏢', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '근로자(을) 정보', icon: '👤', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'conditions', title: '근로 조건', icon: '📋' },
      { id: 'salary', title: '급여 조건', icon: '💰' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '비밀유지 의무 조항',
      '경업금지 조항',
      '재택근무 관련 조항',
      '지식재산권 귀속 조항',
      '수습기간 조항',
      '퇴직금 중간정산 조항',
    ],
  },
  service: {
    type: 'service',
    icon: '💼',
    title: '용역계약서',
    description: '프로젝트, 외주, IT 개발, 컨설팅',
    subSteps: [
      { id: 'partyA', title: '의뢰인(갑) 정보', icon: '🏢', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '수급인(을) 정보', icon: '💼', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'conditions', title: '용역 내용', icon: '📋' },
      { id: 'payment', title: '대금 조건', icon: '💰' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '하자보수 의무 조항',
      '지식재산권 귀속 조항',
      '비밀유지 의무 조항',
      '재하도급 제한 조항',
      '손해배상 한도 조항',
      '계약 해지 사전통보 조항',
    ],
  },
  nda: {
    type: 'nda',
    icon: '🔒',
    title: '비밀유지계약서',
    description: '영업비밀, 기술정보 보호',
    subSteps: [
      { id: 'partyA', title: '정보제공자(갑) 정보', icon: '🏢', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '정보수령자(을) 정보', icon: '🔒', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'conditions', title: '비밀유지 조건', icon: '📋' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '경쟁사 정보 공유 금지 조항',
      '비밀정보 복사 제한 조항',
      '퇴직 후 비밀유지 기간 연장 조항',
      '비밀정보 반환 절차 명시 조항',
      '위반시 가처분 신청 동의 조항',
    ],
  },
  lease: {
    type: 'lease',
    icon: '🏢',
    title: '임대차계약서',
    description: '주택, 상가, 오피스 부동산',
    subSteps: [
      { id: 'partyA', title: '임대인(갑) 정보', icon: '🏠', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '임차인(을) 정보', icon: '🔑', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'property', title: '부동산 정보', icon: '🏢' },
      { id: 'conditions', title: '계약 조건', icon: '💰' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '반려동물 허용 조항',
      '시설 수리비 부담 기준 조항',
      '중도 해지시 위약금 조항',
      '전대차(전전세) 금지 조항',
      '계약갱신요구권 행사 조항',
      '인테리어 원상복구 범위 조항',
    ],
  },
  freelance: {
    type: 'freelance',
    icon: '💻',
    title: '프리랜서 계약서',
    description: '개인 사업자, 프리랜서 업무 위탁',
    subSteps: [
      { id: 'partyA', title: '의뢰인(갑) 정보', icon: '🏢', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '프리랜서(을) 정보', icon: '💻', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'conditions', title: '업무 내용', icon: '📋' },
      { id: 'payment', title: '대금 조건', icon: '💰' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '지식재산권 귀속 조항',
      '비밀유지 의무 조항',
      '경업금지 조항',
      '계약 해지 사전통보 조항',
      '추가 업무 발생시 별도 계약 조항',
      '포트폴리오 사용 허가 조항',
    ],
  },
  investment: {
    type: 'investment',
    icon: '📈',
    title: '투자계약서',
    description: '스타트업 투자, 주주간 계약',
    subSteps: [
      { id: 'partyA', title: '회사(갑) 정보', icon: '🏢', badgeLabel: '갑', badgeColor: 'bg-primary' },
      { id: 'partyB', title: '투자자(을) 정보', icon: '📈', badgeLabel: '을', badgeColor: 'bg-gray-400' },
      { id: 'conditions', title: '투자 조건', icon: '📊' },
      { id: 'rights', title: '투자자 권리', icon: '⚖️' },
      { id: 'specialTerms', title: '특약 조항', icon: '✨' },
    ],
    recommendedClauses: [
      '투자금 사용처 제한 조항',
      'Key-man 조항',
      '경영권 변경시 투자자 동의 조항',
      '후속 투자 우선 참여권 조항',
      'IPO 추진 의무 조항',
      '지분 Lock-up 조항',
    ],
  },
};

// AI 대화 모드에서 사용할 필드 목록 (계약서 유형별)
export const contractFieldDescriptions: Record<ContractType, string> = {
  employment: `필요한 정보:
1. 갑(회사) 정보: 회사명, 대표자명, 사업자등록번호, 주소
2. 을(근로자) 정보: 성명, 생년월일, 주소, 연락처
3. 근로 조건: 근무 시작일, 종료일(무기계약 가능), 담당 업무, 근무 장소, 근무 시간, 계약 유형(정규직/계약직 등)
4. 급여 조건: 급여 형태(연봉/월급/시급), 급여액, 지급일, 4대보험 여부
5. 특약 조항: 비밀유지, 경업금지, 재택근무 등 추가 조항`,

  service: `필요한 정보:
1. 갑(의뢰인) 정보: 회사명, 대표자명, 사업자등록번호, 주소
2. 을(수급인) 정보: 회사명, 대표자명, 사업자등록번호, 주소
3. 용역 내용: 프로젝트명, 용역 범위/내용, 시작일, 납품 기한
4. 대금 조건: 총 대금, 지급 방식(일시불/분할), 계약금, 잔금
5. 특약 조항: 하자보수, 지식재산권, 비밀유지 등`,

  nda: `필요한 정보:
1. 갑(정보제공자) 정보: 회사명/성명, 대표자명, 사업자등록번호, 주소
2. 을(정보수령자) 정보: 회사명/성명, 대표자명, 사업자등록번호, 주소
3. 비밀유지 조건: 비밀유지 유형(쌍방/일방), 목적, 비밀정보 범위, 비밀유지 기간, 계약일, 위약금
4. 특약 조항: 경쟁사 정보공유 금지, 반환 절차 등`,

  lease: `필요한 정보:
1. 갑(임대인) 정보: 성명, 주민등록번호, 주소, 연락처
2. 을(임차인) 정보: 성명, 주민등록번호, 주소, 연락처
3. 부동산 정보: 유형(아파트/빌라 등), 면적, 소재지, 등기부상 면적
4. 계약 조건: 전세/월세, 보증금, 월 차임, 관리비, 시작일, 종료일, 지급일
5. 특약 조항: 반려동물, 시설수리, 중도해지 등`,

  freelance: `필요한 정보:
1. 갑(의뢰인) 정보: 회사명, 대표자명, 사업자등록번호, 주소
2. 을(프리랜서) 정보: 성명, 생년월일, 주소, 연락처
3. 업무 내용: 프로젝트명, 업무 범위/내용, 시작일, 종료일
4. 대금 조건: 대금 유형(프로젝트/월정액/시급), 금액, 지급 방식, 세금계산서 발행일
5. 특약 조항: 지식재산권, 비밀유지, 포트폴리오 사용 등`,

  investment: `필요한 정보:
1. 갑(회사) 정보: 회사명, 대표이사, 사업자등록번호, 본점 소재지
2. 을(투자자) 정보: 투자자명, 대표자, 사업자번호/주민번호, 주소
3. 투자 조건: 투자 유형(보통주/우선주/CB 등), 투자금액, Pre-money 밸류에이션, 주식 수, 주당 가격, 지분율
4. 투자자 권리: 이사회 참관권, 정보청구권, 우선매수권, 동반매도권, 희석화 방지
5. 특약 조항: 투자금 사용처 제한, Key-man, IPO 의무 등`,
};
