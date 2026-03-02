'use client';

import { useState, useEffect, useRef } from 'react';
import { downloadContractAsPDF, downloadContractAsWord, downloadContractAsText } from '@/lib/contractDownload';

// 계약서 유형 이름
const contractTypeNames: Record<string, string> = {
  employment: '근로계약서',
  service: '용역계약서',
  nda: '비밀유지계약서',
  lease: '임대차계약서',
  freelance: '프리랜서 계약서',
  investment: '투자계약서',
};

interface GeneratedContract {
  id: string;
  contract_type: string;
  title: string;
  party_a_name: string;
  party_b_name: string;
  content: string;
  created_at: string;
}

// ============================================
// 타이핑 효과 컴포넌트
// ============================================
function TypingEffect({ 
  content, 
  speed = 10, 
  onComplete 
}: { 
  content: string; 
  speed?: number; 
  onComplete?: () => void;
}) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        // 한 번에 여러 글자씩 추가 (더 자연스러운 속도)
        const charsToAdd = Math.min(3, content.length - currentIndex);
        setDisplayedContent(content.slice(0, currentIndex + charsToAdd));
        setCurrentIndex(currentIndex + charsToAdd);
        
        // 자동 스크롤
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, content, speed, isComplete, onComplete]);

  // 스킵 기능
  const handleSkip = () => {
    setDisplayedContent(content);
    setCurrentIndex(content.length);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="bg-[#f8f9fa] border border-[#e1e3ea] rounded-lg p-5 max-h-[500px] overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
          {displayedContent}
          {!isComplete && <span className="animate-pulse text-primary">|</span>}
        </pre>
      </div>
      
      {!isComplete && (
        <button
          onClick={handleSkip}
          className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 border border-[#e1e3ea] rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
        >
          건너뛰기 →
        </button>
      )}
    </div>
  );
}

// ============================================
// 생성 중 애니메이션 컴포넌트
// ============================================
function GeneratingAnimation({ contractType }: { contractType: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: '📋', text: '계약 당사자 정보 확인 중...' },
    { icon: '⚖️', text: `${contractTypeNames[contractType]} 조항 분석 중...` },
    { icon: '✍️', text: 'AI가 계약서 작성 중...' },
    { icon: '🔍', text: '법적 요건 검토 중...' },
    { icon: '✨', text: '최종 검수 중...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* AI 아이콘 애니메이션 */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-4xl animate-bounce">{steps[currentStep].icon}</span>
        </div>
        {/* 회전하는 링 */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      
      {/* 현재 단계 텍스트 */}
      <p className="text-lg font-semibold text-gray-900 mb-2">
        {steps[currentStep].text}
      </p>
      
      {/* 진행 상태 점 */}
      <div className="flex gap-2 mt-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep ? 'bg-primary scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-sm text-[#737684] mt-6">
        AI가 법적 요건을 충족하는 계약서를 작성하고 있습니다...
      </p>
    </div>
  );
}

// ============================================
// 공통 입력 필드 컴포넌트
// ============================================
function InputField({ label, name, value, onChange, placeholder, type = 'text', required = false }: {
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
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#e1e3ea] rounded-lg text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-[#e1e3ea] rounded-lg text-sm focus:outline-none focus:border-primary bg-white"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder, rows = 3 }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-[#e1e3ea] rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
      />
    </div>
  );
}

// ============================================
// 계약서 유형별 폼 컴포넌트
// ============================================

function EmploymentForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">사용자(회사) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
          <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required />
          <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="회사 주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">근로자 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
          <InputField label="생년월일" name="partyBBirthDate" value={formData.partyBBirthDate || ''} onChange={onChange} type="date" />
          <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">📋</span>
          <h4 className="font-bold text-gray-900">근로 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="근무 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
          <InputField label="근무 종료일 (무기계약시 비워두세요)" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" />
          <InputField label="담당 업무" name="position" value={formData.position || ''} onChange={onChange} placeholder="소프트웨어 개발" />
          <InputField label="근무 장소" name="workplace" value={formData.workplace || ''} onChange={onChange} placeholder="본사" />
          <SelectField label="근무 시간" name="workingHours" value={formData.workingHours || '09:00 ~ 18:00 (주 40시간)'} onChange={onSelectChange} options={['09:00 ~ 18:00 (주 40시간)', '10:00 ~ 19:00 (주 40시간)', '자율 출퇴근제', '교대 근무제']} />
          <SelectField label="계약 유형" name="contractType" value={formData.contractType || '정규직'} onChange={onSelectChange} options={['정규직', '계약직', '수습', '파트타임', '인턴']} />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">💰</span>
          <h4 className="font-bold text-gray-900">급여 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="급여 형태" name="salaryType" value={formData.salaryType || '연봉제'} onChange={onSelectChange} options={['연봉제', '월급제', '시급제']} required />
          <InputField label="급여액 (원)" name="salaryAmount" value={formData.salaryAmount || ''} onChange={onChange} placeholder="50,000,000" required />
          <SelectField label="지급일" name="paymentDate" value={formData.paymentDate || '매월 25일'} onChange={onSelectChange} options={['매월 10일', '매월 15일', '매월 25일', '매월 말일']} />
          <SelectField label="4대보험" name="insurance" value={formData.insurance || '가입'} onChange={onSelectChange} options={['가입', '미가입']} />
        </div>
      </div>
    </div>
  );
}

function ServiceForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">의뢰인(갑) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
          <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
          <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">수급인(을) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 개발사" required />
          <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="김개발" />
          <InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">📋</span>
          <h4 className="font-bold text-gray-900">용역 내용</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <InputField label="프로젝트명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹사이트 개발 프로젝트" required />
          <TextAreaField label="용역 범위 및 내용" name="serviceScope" value={formData.serviceScope || ''} onChange={onChange} placeholder="용역의 구체적인 범위와 내용을 입력하세요..." rows={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
            <InputField label="납품 기한" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">💰</span>
          <h4 className="font-bold text-gray-900">대금 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="용역 대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="10,000,000" required />
          <SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '계약금/중도금/잔금'} onChange={onSelectChange} options={['일시불', '계약금/잔금', '계약금/중도금/잔금', '월별 분할']} />
          <InputField label="계약금 (원)" name="advancePayment" value={formData.advancePayment || ''} onChange={onChange} placeholder="3,000,000" />
          <InputField label="잔금 (원)" name="finalPayment" value={formData.finalPayment || ''} onChange={onChange} placeholder="7,000,000" />
        </div>
      </div>
    </div>
  );
}

function NDAForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">정보제공자(갑) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
          <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
          <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">정보수령자(을) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
          <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="" />
          <InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="" />
          <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">🔒</span>
          <h4 className="font-bold text-gray-900">비밀유지 조건</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <SelectField label="비밀유지 유형" name="ndaType" value={formData.ndaType || '쌍방'} onChange={onSelectChange} options={['쌍방 (상호)', '일방 (갑→을)', '일방 (을→갑)']} />
          <InputField label="비밀유지 목적" name="purpose" value={formData.purpose || ''} onChange={onChange} placeholder="사업 협력 검토, 기술 협력 등" required />
          <TextAreaField label="비밀정보의 범위" name="confidentialScope" value={formData.confidentialScope || ''} onChange={onChange} placeholder="기술정보, 영업정보, 고객정보 등 비밀로 유지할 정보의 범위를 입력하세요..." rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField label="비밀유지 기간 (년)" name="confidentialPeriod" value={formData.confidentialPeriod || ''} onChange={onChange} placeholder="3" required />
            <InputField label="계약일" name="contractDate" value={formData.contractDate || ''} onChange={onChange} type="date" required />
          </div>
          <InputField label="위약금 (원)" name="penaltyAmount" value={formData.penaltyAmount || ''} onChange={onChange} placeholder="100,000,000" />
        </div>
      </div>
    </div>
  );
}

function LeaseForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">임대인(갑) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="홍길동" required />
          <InputField label="주민등록번호" name="partyAIdNumber" value={formData.partyAIdNumber || ''} onChange={onChange} placeholder="000000-0000000" />
          <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          <InputField label="연락처" name="partyAContact" value={formData.partyAContact || ''} onChange={onChange} placeholder="010-0000-0000" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">임차인(을) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
          <InputField label="주민등록번호" name="partyBIdNumber" value={formData.partyBIdNumber || ''} onChange={onChange} placeholder="000000-0000000" />
          <InputField label="현 주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">🏢</span>
          <h4 className="font-bold text-gray-900">부동산 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="부동산 유형" name="propertyType" value={formData.propertyType || '아파트'} onChange={onSelectChange} options={['아파트', '빌라/연립', '단독주택', '오피스텔', '상가', '사무실']} />
          <InputField label="면적 (㎡)" name="propertySize" value={formData.propertySize || ''} onChange={onChange} placeholder="84" />
          <InputField label="부동산 소재지" name="propertyAddress" value={formData.propertyAddress || ''} onChange={onChange} placeholder="서울시 강남구 테헤란로 123, 101동 1001호" required />
          <InputField label="등기부상 면적" name="registeredSize" value={formData.registeredSize || ''} onChange={onChange} placeholder="전용 84.12㎡" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">💰</span>
          <h4 className="font-bold text-gray-900">계약 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="계약 유형" name="leaseType" value={formData.leaseType || '월세'} onChange={onSelectChange} options={['전세', '월세', '반전세']} />
          <InputField label="보증금 (원)" name="deposit" value={formData.deposit || ''} onChange={onChange} placeholder="50,000,000" required />
          <InputField label="월 차임 (원)" name="monthlyRent" value={formData.monthlyRent || ''} onChange={onChange} placeholder="1,000,000" />
          <InputField label="관리비 (원)" name="maintenanceFee" value={formData.maintenanceFee || ''} onChange={onChange} placeholder="200,000" />
          <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
          <InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
          <SelectField label="차임 지급일" name="paymentDate" value={formData.paymentDate || '매월 말일'} onChange={onSelectChange} options={['매월 1일', '매월 10일', '매월 25일', '매월 말일']} />
        </div>
      </div>
    </div>
  );
}

function FreelanceForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">의뢰인(갑) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
          <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
          <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">프리랜서(을) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
          <InputField label="생년월일" name="partyBBirthDate" value={formData.partyBBirthDate || ''} onChange={onChange} type="date" />
          <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">💻</span>
          <h4 className="font-bold text-gray-900">업무 내용</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <InputField label="프로젝트/업무명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹 애플리케이션 개발" required />
          <TextAreaField label="업무 내용 및 범위" name="workScope" value={formData.workScope || ''} onChange={onChange} placeholder="구체적인 업무 내용을 입력하세요..." rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
            <InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">💰</span>
          <h4 className="font-bold text-gray-900">대금 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="대금 유형" name="paymentType" value={formData.paymentType || '프로젝트 단위'} onChange={onSelectChange} options={['프로젝트 단위', '월 정액', '시간 단위']} />
          <InputField label="대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="5,000,000" required />
          <SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '완료 후 일시불'} onChange={onSelectChange} options={['완료 후 일시불', '선금/잔금', '월별 지급']} />
          <InputField label="세금계산서 발행" name="taxInvoice" value={formData.taxInvoice || ''} onChange={onChange} placeholder="매월 말일" />
        </div>
        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-700">※ 프리랜서 계약은 근로계약이 아닌 업무위탁계약으로, 4대보험이 적용되지 않습니다.</p>
        </div>
      </div>
    </div>
  );
}

function InvestmentForm({ formData, onChange, onSelectChange }: {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">갑</span>
          <h4 className="font-bold text-gray-900">회사(갑) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
          <InputField label="대표이사" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required />
          <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
          <InputField label="본점 소재지" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">을</span>
          <h4 className="font-bold text-gray-900">투자자(을) 정보</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField label="투자자명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 투자사 / 김투자" required />
          <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="이투자" />
          <InputField label="사업자등록번호/주민번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="" />
          <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">📈</span>
          <h4 className="font-bold text-gray-900">투자 조건</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="투자 유형" name="investmentType" value={formData.investmentType || '보통주'} onChange={onSelectChange} options={['보통주', '우선주', '전환사채(CB)', '신주인수권부사채(BW)', 'SAFE']} />
          <InputField label="투자금액 (원)" name="investmentAmount" value={formData.investmentAmount || ''} onChange={onChange} placeholder="500,000,000" required />
          <InputField label="Pre-money 밸류에이션 (원)" name="preMoneyValuation" value={formData.preMoneyValuation || ''} onChange={onChange} placeholder="5,000,000,000" required />
          <InputField label="발행 주식 수 (주)" name="shareCount" value={formData.shareCount || ''} onChange={onChange} placeholder="50,000" />
          <InputField label="1주당 발행가액 (원)" name="pricePerShare" value={formData.pricePerShare || ''} onChange={onChange} placeholder="10,000" />
          <InputField label="투자 후 지분율 (%)" name="equityPercentage" value={formData.equityPercentage || ''} onChange={onChange} placeholder="10" />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">⚖️</span>
          <h4 className="font-bold text-gray-900">투자자 권리</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="이사회 참관권" name="boardObserver" value={formData.boardObserver || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
          <SelectField label="정보청구권" name="informationRight" value={formData.informationRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
          <SelectField label="우선매수권" name="preemptiveRight" value={formData.preemptiveRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
          <SelectField label="동반매도권" name="tagAlong" value={formData.tagAlong || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
          <SelectField label="희석화 방지" name="antiDilution" value={formData.antiDilution || 'Weighted Average'} onChange={onSelectChange} options={['없음', 'Full Ratchet', 'Weighted Average']} />
        </div>
        <div className="mt-3">
          <TextAreaField label="기타 특약사항" name="specialTerms" value={formData.specialTerms || ''} onChange={onChange} placeholder="추가적인 투자 조건이나 특약사항을 입력하세요..." rows={3} />
        </div>
      </div>
    </div>
  );
}

// ============================================
// 메인 ContractContent 컴포넌트
// ============================================
export default function ContractPage() {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list'>('create');
  const [contracts, setContracts] = useState<GeneratedContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<GeneratedContract | null>(null);

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<{ content: string; id?: string } | null>(null);
  const [error, setError] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeSubTab === 'list') {
      loadContracts();
    }
  }, [activeSubTab]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contract/generate');
      if (res.ok) {
        const data = await res.json();
        setContracts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load contracts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setFormData({});
    setStep(2);
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    setError('');
    setIsTypingComplete(false);

    try {
      const response = await fetch('/api/contract/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: selectedType,
          partyA: {
            name: formData.partyAName,
            representative: formData.partyARepresentative,
            businessNumber: formData.partyABusinessNumber,
            address: formData.partyAAddress,
            idNumber: formData.partyAIdNumber,
            contact: formData.partyAContact,
          },
          partyB: {
            name: formData.partyBName,
            representative: formData.partyBRepresentative,
            businessNumber: formData.partyBBusinessNumber,
            birthDate: formData.partyBBirthDate,
            address: formData.partyBAddress,
            contact: formData.partyBContact,
            idNumber: formData.partyBIdNumber,
          },
          terms: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '계약서 생성에 실패했습니다.');
      }

      setGeneratedContract({ content: data.contract.content, id: data.contract.id });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계약서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'word' | 'text', content: string, title: string) => {
    try {
      switch (format) {
        case 'pdf':
          await downloadContractAsPDF(content, title);
          break;
        case 'word':
          await downloadContractAsWord(content, title);
          break;
        case 'text':
          downloadContractAsText(content, title);
          break;
      }
    } catch (err) {
      console.error('다운로드 오류:', err);
      alert(err instanceof Error ? err.message : '다운로드에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedType('');
    setGeneratedContract(null);
    setError('');
    setFormData({});
    setIsTypingComplete(false);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'employment':
        return <EmploymentForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 'service':
        return <ServiceForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 'nda':
        return <NDAForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 'lease':
        return <LeaseForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 'freelance':
        return <FreelanceForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 'investment':
        return <InvestmentForm formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      default:
        return null;
    }
  };

  const currentTitle = `${contractTypeNames[selectedType] || '계약서'} - ${formData.partyAName || ''}`;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 leading-[30px]">계약서 작성</h1>
        <p className="text-base font-semibold text-[#737684] leading-[22px]">AI가 맞춤형 계약서를 생성해드립니다.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveSubTab('create'); resetForm(); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            activeSubTab === 'create' ? 'bg-gray-900 text-white' : 'bg-white border border-[#e1e3ea] text-gray-900'
          }`}
        >
          새 계약서 작성
        </button>
        <button
          onClick={() => setActiveSubTab('list')}
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            activeSubTab === 'list' ? 'bg-gray-900 text-white' : 'bg-white border border-[#e1e3ea] text-gray-900'
          }`}
        >
          생성한 계약서
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {activeSubTab === 'create' ? (
        <>
          {/* Step 1: 유형 선택 */}
          {step === 1 && (
            <div className="bg-white rounded-[12px] border border-[#e1e3ea] p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">어떤 계약서가 필요하신가요?</h3>
              <p className="text-sm text-[#737684] mb-6">작성하실 계약서 유형을 선택해주세요.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'employment', icon: '👤', title: '근로계약서', desc: '정규직, 계약직, 수습, 파트타임 등' },
                  { type: 'service', icon: '💼', title: '용역계약서', desc: '프로젝트, 외주, IT 개발, 컨설팅' },
                  { type: 'nda', icon: '🔒', title: '비밀유지계약서', desc: '영업비밀, 기술정보 보호' },
                  { type: 'lease', icon: '🏢', title: '임대차계약서', desc: '주택, 상가, 오피스 부동산' },
                  { type: 'freelance', icon: '💻', title: '프리랜서 계약서', desc: '개인 사업자, 프리랜서 업무 위탁' },
                  { type: 'investment', icon: '📈', title: '투자계약서', desc: '스타트업 투자, 주주간 계약' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleSelectType(item.type)}
                    className="p-5 border border-[#e1e3ea] rounded-xl text-left hover:border-primary hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="mt-2 font-bold text-gray-900 group-hover:text-primary">{item.title}</h4>
                    <p className="mt-1 text-xs text-[#737684]">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: 정보 입력 */}
          {step === 2 && !isGenerating && (
            <div className="bg-white rounded-[12px] border border-[#e1e3ea] p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{
                  selectedType === 'employment' ? '👤' :
                  selectedType === 'service' ? '💼' :
                  selectedType === 'nda' ? '🔒' :
                  selectedType === 'lease' ? '🏢' :
                  selectedType === 'freelance' ? '💻' : '📈'
                }</span>
                <h3 className="text-lg font-bold text-gray-900">{contractTypeNames[selectedType]} 작성</h3>
              </div>
              <p className="text-sm text-[#737684] mb-6">정확한 정보를 입력하시면 AI가 맞춤형 계약서를 생성합니다.</p>

              {renderForm()}

              <div className="flex justify-between pt-6 mt-6 border-t border-[#e1e3ea]">
                <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-[#e1e3ea] rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  ← 유형 다시 선택
                </button>
                <button
                  onClick={handleGenerateContract}
                  disabled={isGenerating || !formData.partyAName || !formData.partyBName}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  계약서 생성하기 →
                </button>
              </div>
            </div>
          )}

          {/* Step 2.5: 생성 중 애니메이션 */}
          {step === 2 && isGenerating && (
            <div className="bg-white rounded-[12px] border border-[#e1e3ea] p-6">
              <GeneratingAnimation contractType={selectedType} />
            </div>
          )}

          {/* Step 3: 결과 (타이핑 효과) */}
          {step === 3 && generatedContract && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[12px] border border-[#e1e3ea] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      ✍️ AI가 {contractTypeNames[selectedType]}를 작성하고 있습니다...
                    </h3>
                    {isTypingComplete && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        ✓ 작성 완료
                      </span>
                    )}
                  </div>

                  <TypingEffect 
                    content={generatedContract.content} 
                    speed={8}
                    onComplete={() => setIsTypingComplete(true)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className={`bg-white rounded-[12px] border border-[#e1e3ea] p-5 transition-opacity ${isTypingComplete ? 'opacity-100' : 'opacity-50'}`}>
                  <h4 className="font-bold text-gray-900 mb-4">⬇️ 다운로드</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('pdf', generatedContract.content, currentTitle)}
                      disabled={!isTypingComplete}
                      className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📑 PDF 다운로드
                    </button>
                    <button
                      onClick={() => handleDownload('word', generatedContract.content, currentTitle)}
                      disabled={!isTypingComplete}
                      className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📝 Word 다운로드
                    </button>
                    <button
                      onClick={() => handleDownload('text', generatedContract.content, currentTitle)}
                      disabled={!isTypingComplete}
                      className="w-full py-2.5 border border-[#e1e3ea] text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📄 텍스트 다운로드
                    </button>
                  </div>
                  {!isTypingComplete && (
                    <p className="text-xs text-[#737684] mt-2 text-center">작성이 완료되면 다운로드할 수 있습니다</p>
                  )}
                </div>

                <div className={`bg-white rounded-[12px] border border-[#e1e3ea] p-5 transition-opacity ${isTypingComplete ? 'opacity-100' : 'opacity-50'}`}>
                  <h4 className="font-bold text-gray-900 mb-4">✨ 추가 작업</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={resetForm} 
                      disabled={!isTypingComplete}
                      className="w-full py-2.5 border border-[#e1e3ea] text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      새 계약서 작성하기
                    </button>
                    <button 
                      onClick={() => setActiveSubTab('list')} 
                      disabled={!isTypingComplete}
                      className="w-full py-2.5 border border-[#e1e3ea] text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      생성한 계약서 목록
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* 생성한 계약서 목록 */
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-[#737684]">로딩 중...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#737684]">아직 생성한 계약서가 없습니다.</p>
              <button onClick={() => setActiveSubTab('create')} className="mt-4 text-primary font-semibold">
                첫 계약서 작성하기
              </button>
            </div>
          ) : (
            <>
              {selectedContract ? (
                <div>
                  <button onClick={() => setSelectedContract(null)} className="mb-4 text-sm text-primary font-semibold flex items-center gap-1">
                    ← 목록으로
                  </button>
                  <div className="bg-white rounded-[12px] border border-[#e1e3ea] p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedContract.title}</h3>
                        <p className="text-xs text-[#737684]">
                          {new Date(selectedContract.created_at).toLocaleDateString('ko-KR')} 생성
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDownload('pdf', selectedContract.content, selectedContract.title)} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold">PDF</button>
                        <button onClick={() => handleDownload('word', selectedContract.content, selectedContract.title)} className="px-4 py-2 border border-primary text-primary rounded-lg text-xs font-semibold">Word</button>
                        <button onClick={() => handleDownload('text', selectedContract.content, selectedContract.title)} className="px-4 py-2 border border-[#e1e3ea] text-gray-700 rounded-lg text-xs font-semibold">TXT</button>
                      </div>
                    </div>
                    <div className="bg-[#f8f9fa] border border-[#e1e3ea] rounded-lg p-5 max-h-[500px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {selectedContract.content}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                contracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className="bg-white rounded-[12px] border border-[#e1e3ea] p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f2f3f8] rounded-lg flex items-center justify-center text-lg">
                        {contract.contract_type === 'employment' ? '👤' :
                         contract.contract_type === 'service' ? '💼' :
                         contract.contract_type === 'nda' ? '🔒' :
                         contract.contract_type === 'lease' ? '🏢' :
                         contract.contract_type === 'freelance' ? '💻' : '📈'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{contract.title || contractTypeNames[contract.contract_type]}</p>
                        <p className="text-xs text-[#737684]">
                          {new Date(contract.created_at).toLocaleDateString('ko-KR')} · {contract.party_a_name} ↔ {contract.party_b_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-semibold">보기 →</span>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}