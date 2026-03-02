'use client';

import { useState } from 'react';

interface ContractData {
  type: string;
  content: string;
  generatedAt: string;
}

export default function ContractForm() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<ContractData | null>(null);
  const [error, setError] = useState<string>('');

  // 폼 데이터
  const [formData, setFormData] = useState({
    // 갑 정보
    partyAName: '',
    partyARepresentative: '',
    partyABusinessNumber: '',
    partyAAddress: '',
    // 을 정보
    partyBName: '',
    partyBBirthDate: '',
    partyBAddress: '',
    partyBContact: '',
    // 계약 조건
    startDate: '',
    position: '',
    workplace: '',
    workingHours: '09:00 ~ 18:00 (주 40시간)',
    salaryType: '연봉제',
    salaryAmount: '',
    paymentDate: '매월 25일',
  });

  // 추가 특약 조항
  const [additionalClauses, setAdditionalClauses] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClauseToggle = (clause: string) => {
    setAdditionalClauses(prev =>
      prev.includes(clause)
        ? prev.filter(c => c !== clause)
        : [...prev, clause]
    );
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/contract/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractType: selectedType,
          partyA: {
            name: formData.partyAName,
            representative: formData.partyARepresentative,
            businessNumber: formData.partyABusinessNumber,
            address: formData.partyAAddress,
          },
          partyB: {
            name: formData.partyBName,
            birthDate: formData.partyBBirthDate,
            address: formData.partyBAddress,
            contact: formData.partyBContact,
          },
          terms: {
            startDate: formData.startDate,
            position: formData.position,
            workplace: formData.workplace,
            workingHours: formData.workingHours,
            salaryType: formData.salaryType,
            salaryAmount: formData.salaryAmount,
            paymentDate: formData.paymentDate,
          },
          additionalClauses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '계약서 생성에 실패했습니다.');
      }

      setGeneratedContract(data.contract);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계약서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="flex flex-col items-center pt-8 md:pt-10 px-5 md:px-0 pb-20">
      {/* 헤더 영역 */}
      <div className="flex flex-col items-center w-full md:w-[742px] mb-8">
        <p className="text-sm md:text-base font-bold leading-[22px]">
          <span className="text-primary">Lawdy</span>
          <span className="text-gray-600">가 계약서 작성을 도와드립니다.</span>
        </p>

        <div className="h-2 md:h-4" />

        <div className="text-center text-lg md:text-[32px] text-gray-900">
          <p className="font-normal leading-6 md:leading-[42px]">간단한 정보 입력만으로</p>
          <p className="font-bold leading-6 md:leading-[42px]">
            <span className="text-primary">AI 기반</span> 맞춤형 계약서를 생성하세요.
          </p>
        </div>
      </div>

      {/* 진행 상태 표시 */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-center justify-between px-4">
          <StepIndicator number={1} label="유형 선택" active={step >= 1} />
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          <StepIndicator number={2} label="정보 입력" active={step >= 2} />
          <div className={`flex-1 h-1 mx-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
          <StepIndicator number={3} label="완료" active={step >= 3} />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="w-full max-w-4xl mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Step 1: 계약서 유형 선택 */}
      {step === 1 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-2">어떤 계약서가 필요하신가요?</h3>
            <p className="text-gray-500 mb-8">작성하실 계약서 유형을 선택해주세요.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ContractTypeCard
                icon="👤"
                title="근로계약서"
                description="정규직, 계약직, 수습, 파트타임 등"
                onClick={() => handleSelectType('employment')}
              />
              <ContractTypeCard
                icon="💼"
                title="용역계약서"
                description="프로젝트, 외주, IT 개발, 컨설팅"
                onClick={() => handleSelectType('service')}
              />
              <ContractTypeCard
                icon="🔒"
                title="비밀유지계약서 (NDA)"
                description="영업비밀, 기술정보 보호"
                onClick={() => handleSelectType('nda')}
              />
              <ContractTypeCard
                icon="🏢"
                title="임대차계약서"
                description="주택, 상가, 오피스 부동산"
                onClick={() => handleSelectType('lease')}
              />
              <ContractTypeCard
                icon="💻"
                title="프리랜서 계약서"
                description="개인 사업자, 프리랜서 업무 위탁"
                onClick={() => handleSelectType('freelance')}
              />
              <ContractTypeCard
                icon="📈"
                title="투자계약서"
                description="스타트업 투자, 주주간 계약"
                onClick={() => handleSelectType('investment')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 정보 입력 */}
      {step === 2 && (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-2">계약 정보를 입력해주세요</h3>
            <p className="text-gray-500 mb-8">정확한 정보를 입력하시면 AI가 맞춤형 계약서를 생성합니다.</p>

            <form className="space-y-8">
              {/* 사용자(갑) 정보 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">갑</span>
                  <h4 className="text-lg font-bold text-gray-900">사용자(갑) 정보</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="회사명"
                    name="partyAName"
                    value={formData.partyAName}
                    onChange={handleInputChange}
                    placeholder="주식회사 로우디"
                    required
                  />
                  <InputField
                    label="대표자명"
                    name="partyARepresentative"
                    value={formData.partyARepresentative}
                    onChange={handleInputChange}
                    placeholder="홍길동"
                    required
                  />
                  <InputField
                    label="사업자등록번호"
                    name="partyABusinessNumber"
                    value={formData.partyABusinessNumber}
                    onChange={handleInputChange}
                    placeholder="000-00-00000"
                  />
                  <InputField
                    label="회사 주소"
                    name="partyAAddress"
                    value={formData.partyAAddress}
                    onChange={handleInputChange}
                    placeholder="서울시 강남구..."
                  />
                </div>
              </div>

              {/* 근로자(을) 정보 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-gray-400 text-white text-sm font-bold flex items-center justify-center">을</span>
                  <h4 className="text-lg font-bold text-gray-900">근로자(을) 정보</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="성명"
                    name="partyBName"
                    value={formData.partyBName}
                    onChange={handleInputChange}
                    placeholder="김철수"
                    required
                  />
                  <InputField
                    label="생년월일"
                    name="partyBBirthDate"
                    value={formData.partyBBirthDate}
                    onChange={handleInputChange}
                    type="date"
                  />
                  <InputField
                    label="주소"
                    name="partyBAddress"
                    value={formData.partyBAddress}
                    onChange={handleInputChange}
                    placeholder="서울시 서초구..."
                  />
                  <InputField
                    label="연락처"
                    name="partyBContact"
                    value={formData.partyBContact}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              {/* 근로 조건 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-primary text-xl">📋</span>
                  <h4 className="text-lg font-bold text-gray-900">근로 조건</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="근무 시작일"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    type="date"
                    required
                  />
                  <InputField
                    label="담당 업무"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="소프트웨어 개발"
                  />
                  <InputField
                    label="근무 장소"
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleInputChange}
                    placeholder="본사"
                  />
                  <SelectField
                    label="근무 시간"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    options={['09:00 ~ 18:00 (주 40시간)', '10:00 ~ 19:00 (주 40시간)', '자율 출퇴근제']}
                  />
                </div>
              </div>

              {/* 급여 조건 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-primary text-xl">💰</span>
                  <h4 className="text-lg font-bold text-gray-900">급여 조건</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="급여 형태"
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleInputChange}
                    options={['연봉제', '월급제', '시급제']}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      급여액 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="salaryAmount"
                        value={formData.salaryAmount}
                        onChange={handleInputChange}
                        placeholder="50,000,000"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-600">원</span>
                    </div>
                  </div>
                  <SelectField
                    label="지급일"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                    options={['매월 25일', '매월 말일', '매월 10일']}
                  />
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  ← 이전
                </button>
                <button
                  type="button"
                  onClick={handleGenerateContract}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      AI가 계약서를 생성 중입니다...
                    </>
                  ) : (
                    '계약서 생성하기 →'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 3: 완료 / 미리보기 */}
      {step === 3 && generatedContract && (
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* 미리보기 영역 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    📄 계약서 미리보기
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">생성 완료</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-[500px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedContract.content}
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 패널 */}
            <div className="lg:col-span-2 space-y-4">
              {/* 다운로드 */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ⬇️ 다운로드
                </h4>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    📑 PDF 다운로드
                  </button>
                  <button className="w-full py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                    📝 Word 다운로드
                  </button>
                  <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    📄 HWP 다운로드
                  </button>
                </div>
              </div>

              {/* AI 추천 특약 */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ✨ AI 추천 특약 조항
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={additionalClauses.includes('비밀유지 의무 조항')}
                      onChange={() => handleClauseToggle('비밀유지 의무 조항')}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">비밀유지 의무 조항</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={additionalClauses.includes('경업금지 조항')}
                      onChange={() => handleClauseToggle('경업금지 조항')}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">경업금지 조항</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={additionalClauses.includes('재택근무 관련 조항')}
                      onChange={() => handleClauseToggle('재택근무 관련 조항')}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">재택근무 관련 조항</span>
                  </label>
                </div>
                <button
                  onClick={() => {
                    setStep(2);
                  }}
                  className="w-full mt-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
                >
                  선택한 조항으로 재생성
                </button>
              </div>

              {/* 전문가 상담 */}
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold mb-1">전문가 검토가 필요하신가요?</h4>
                    <p className="text-sm text-white/80 mb-3">복잡한 계약이라면 법률 전문가의 검토를 받아보세요.</p>
                    <button className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                      상담 신청하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => {
                setStep(1);
                setGeneratedContract(null);
                setSelectedType('');
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              새 계약서 작성하기
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

// 스텝 인디케이터 컴포넌트
function StepIndicator({ number, label, active }: { number: number; label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
          active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
        }`}
      >
        {number}
      </div>
      <span className={`mt-2 text-xs font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

// 계약서 유형 카드 컴포넌트
function ContractTypeCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 border border-gray-200 rounded-xl text-left hover:border-primary hover:shadow-md transition-all group"
    >
      <span className="text-3xl">{icon}</span>
      <h4 className="mt-3 font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h4>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </button>
  );
}

// 입력 필드 컴포넌트
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

// 셀렉트 필드 컴포넌트
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}