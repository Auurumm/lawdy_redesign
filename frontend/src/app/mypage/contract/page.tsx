'use client';

import { useState, useEffect, useRef } from 'react';
import { downloadContractAsPDF, downloadContractAsWord, downloadContractAsText } from '@/lib/contractDownload';

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
// Typing Effect Component
// ============================================
function TypingEffect({ content, speed = 10, onComplete }: { content: string; speed?: number; onComplete?: () => void }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        const charsToAdd = Math.min(3, content.length - currentIndex);
        setDisplayedContent(content.slice(0, currentIndex + charsToAdd));
        setCurrentIndex(currentIndex + charsToAdd);
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, speed);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, content, speed, isComplete, onComplete]);

  const handleSkip = () => {
    setDisplayedContent(content);
    setCurrentIndex(content.length);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <div className="position-relative">
      <div ref={containerRef} className="bg-light border rounded-3 p-4 overflow-auto" style={{ maxHeight: 500 }}>
        <pre className="mb-0 fs-7" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
          {displayedContent}
          {!isComplete && <span className="text-primary" style={{ animation: 'pulse 1s infinite' }}>|</span>}
        </pre>
      </div>
      {!isComplete && (
        <button
          onClick={handleSkip}
          className="btn btn-sm btn-light border position-absolute shadow-sm"
          style={{ bottom: 16, right: 16, fontSize: 12 }}
        >
          건너뛰기 <i className="bi bi-arrow-right" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Generating Animation
// ============================================
function GeneratingAnimation({ contractType }: { contractType: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { icon: 'bi-clipboard-check', text: '계약 당사자 정보 확인 중...' },
    { icon: 'bi-shield-check', text: `${contractTypeNames[contractType]} 조항 분석 중...` },
    { icon: 'bi-pencil', text: 'AI가 계약서 작성 중...' },
    { icon: 'bi-search', text: '법적 요건 검토 중...' },
    { icon: 'bi-check2-all', text: '최종 검수 중...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentStep(prev => (prev + 1) % steps.length), 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="position-relative mb-4">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 80, height: 80, background: 'rgba(0,70,255,0.1)' }}
        >
          <i className={`bi ${steps[currentStep].icon} fs-1`} style={{ color: 'var(--tc-theme-primary)' }} />
        </div>
        <div
          className="position-absolute top-0 start-0 rounded-circle"
          style={{
            width: 80, height: 80,
            border: '4px solid transparent',
            borderTopColor: 'var(--tc-theme-primary)',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
      <p className="fw-semibold fs-6 mb-2">{steps[currentStep].text}</p>
      <div className="d-flex gap-2 mt-3">
        {steps.map((_, index) => (
          <div
            key={index}
            className="rounded-circle"
            style={{
              width: 8, height: 8,
              background: index === currentStep ? 'var(--tc-theme-primary)' : '#dee2e6',
              transition: 'all 0.3s',
              transform: index === currentStep ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
      <p className="text-muted fs-7 mt-4">AI가 법적 요건을 충족하는 계약서를 작성하고 있습니다...</p>
    </div>
  );
}

// ============================================
// Form Field Components (Bootstrap)
// ============================================
function InputField({ label, name, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="form-label fs-7 fw-medium text-muted mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="form-control form-control-sm" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="form-label fs-7 fw-medium text-muted mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select name={name} value={value} onChange={onChange} className="form-select form-select-sm">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder, rows = 3 }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="form-label fs-7 fw-medium text-muted mb-1">{label}</label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="form-control form-control-sm" />
    </div>
  );
}

// ============================================
// Party Section Helper
// ============================================
function PartySection({ badge, badgeColor, title, children }: {
  badge: string; badgeColor: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span
          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
          style={{ width: 24, height: 24, fontSize: 11, background: badgeColor }}
        >
          {badge}
        </span>
        <h6 className="fw-bold mb-0">{title}</h6>
      </div>
      <div className="row g-3">{children}</div>
    </div>
  );
}

function TermsSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span style={{ color: 'var(--tc-theme-primary)' }}>{icon}</span>
        <h6 className="fw-bold mb-0">{title}</h6>
      </div>
      {children}
    </div>
  );
}

// ============================================
// Form Components (Employment, Service, NDA, Lease, Freelance, Investment)
// ============================================
function EmploymentForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="사용자(회사) 정보">
        <div className="col-md-6"><InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="회사 주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="근로자 정보">
        <div className="col-md-6"><InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required /></div>
        <div className="col-md-6"><InputField label="생년월일" name="partyBBirthDate" value={formData.partyBBirthDate || ''} onChange={onChange} type="date" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." /></div>
        <div className="col-md-6"><InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" /></div>
      </PartySection>
      <TermsSection icon="📋" title="근로 조건">
        <div className="row g-3">
          <div className="col-md-6"><InputField label="근무 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-md-6"><InputField label="근무 종료일 (무기계약시 비워두세요)" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" /></div>
          <div className="col-md-6"><InputField label="담당 업무" name="position" value={formData.position || ''} onChange={onChange} placeholder="소프트웨어 개발" /></div>
          <div className="col-md-6"><InputField label="근무 장소" name="workplace" value={formData.workplace || ''} onChange={onChange} placeholder="본사" /></div>
          <div className="col-md-6"><SelectField label="근무 시간" name="workingHours" value={formData.workingHours || '09:00 ~ 18:00 (주 40시간)'} onChange={onSelectChange} options={['09:00 ~ 18:00 (주 40시간)', '10:00 ~ 19:00 (주 40시간)', '자율 출퇴근제', '교대 근무제']} /></div>
          <div className="col-md-6"><SelectField label="계약 유형" name="contractType" value={formData.contractType || '정규직'} onChange={onSelectChange} options={['정규직', '계약직', '수습', '파트타임', '인턴']} /></div>
        </div>
      </TermsSection>
      <TermsSection icon="💰" title="급여 조건">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="급여 형태" name="salaryType" value={formData.salaryType || '연봉제'} onChange={onSelectChange} options={['연봉제', '월급제', '시급제']} required /></div>
          <div className="col-md-6"><InputField label="급여액 (원)" name="salaryAmount" value={formData.salaryAmount || ''} onChange={onChange} placeholder="50,000,000" required /></div>
          <div className="col-md-6"><SelectField label="지급일" name="paymentDate" value={formData.paymentDate || '매월 25일'} onChange={onSelectChange} options={['매월 10일', '매월 15일', '매월 25일', '매월 말일']} /></div>
          <div className="col-md-6"><SelectField label="4대보험" name="insurance" value={formData.insurance || '가입'} onChange={onSelectChange} options={['가입', '미가입']} /></div>
        </div>
      </TermsSection>
    </>
  );
}

function ServiceForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="의뢰인(갑) 정보">
        <div className="col-md-6"><InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="수급인(을) 정보">
        <div className="col-md-6"><InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 개발사" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="김개발" /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." /></div>
      </PartySection>
      <TermsSection icon="📋" title="용역 내용">
        <div className="row g-3">
          <div className="col-12"><InputField label="프로젝트명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹사이트 개발 프로젝트" required /></div>
          <div className="col-12"><TextAreaField label="용역 범위 및 내용" name="serviceScope" value={formData.serviceScope || ''} onChange={onChange} placeholder="용역의 구체적인 범위와 내용을 입력하세요..." rows={4} /></div>
          <div className="col-md-6"><InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-md-6"><InputField label="납품 기한" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required /></div>
        </div>
      </TermsSection>
      <TermsSection icon="💰" title="대금 조건">
        <div className="row g-3">
          <div className="col-md-6"><InputField label="용역 대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="10,000,000" required /></div>
          <div className="col-md-6"><SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '계약금/중도금/잔금'} onChange={onSelectChange} options={['일시불', '계약금/잔금', '계약금/중도금/잔금', '월별 분할']} /></div>
          <div className="col-md-6"><InputField label="계약금 (원)" name="advancePayment" value={formData.advancePayment || ''} onChange={onChange} placeholder="3,000,000" /></div>
          <div className="col-md-6"><InputField label="잔금 (원)" name="finalPayment" value={formData.finalPayment || ''} onChange={onChange} placeholder="7,000,000" /></div>
        </div>
      </TermsSection>
    </>
  );
}

function NDAForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="정보제공자(갑) 정보">
        <div className="col-md-6"><InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="정보수령자(을) 정보">
        <div className="col-md-6"><InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} /></div>
        <div className="col-md-6"><InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} /></div>
      </PartySection>
      <TermsSection icon="🔒" title="비밀유지 조건">
        <div className="row g-3">
          <div className="col-12"><SelectField label="비밀유지 유형" name="ndaType" value={formData.ndaType || '쌍방'} onChange={onSelectChange} options={['쌍방 (상호)', '일방 (갑→을)', '일방 (을→갑)']} /></div>
          <div className="col-12"><InputField label="비밀유지 목적" name="purpose" value={formData.purpose || ''} onChange={onChange} placeholder="사업 협력 검토, 기술 협력 등" required /></div>
          <div className="col-12"><TextAreaField label="비밀정보의 범위" name="confidentialScope" value={formData.confidentialScope || ''} onChange={onChange} placeholder="기술정보, 영업정보, 고객정보 등..." rows={3} /></div>
          <div className="col-md-6"><InputField label="비밀유지 기간 (년)" name="confidentialPeriod" value={formData.confidentialPeriod || ''} onChange={onChange} placeholder="3" required /></div>
          <div className="col-md-6"><InputField label="계약일" name="contractDate" value={formData.contractDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-12"><InputField label="위약금 (원)" name="penaltyAmount" value={formData.penaltyAmount || ''} onChange={onChange} placeholder="100,000,000" /></div>
        </div>
      </TermsSection>
    </>
  );
}

function LeaseForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="임대인(갑) 정보">
        <div className="col-md-6"><InputField label="성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="홍길동" required /></div>
        <div className="col-md-6"><InputField label="주민등록번호" name="partyAIdNumber" value={formData.partyAIdNumber || ''} onChange={onChange} placeholder="000000-0000000" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
        <div className="col-md-6"><InputField label="연락처" name="partyAContact" value={formData.partyAContact || ''} onChange={onChange} placeholder="010-0000-0000" /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="임차인(을) 정보">
        <div className="col-md-6"><InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required /></div>
        <div className="col-md-6"><InputField label="주민등록번호" name="partyBIdNumber" value={formData.partyBIdNumber || ''} onChange={onChange} placeholder="000000-0000000" /></div>
        <div className="col-md-6"><InputField label="현 주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." /></div>
        <div className="col-md-6"><InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" /></div>
      </PartySection>
      <TermsSection icon="🏢" title="부동산 정보">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="부동산 유형" name="propertyType" value={formData.propertyType || '아파트'} onChange={onSelectChange} options={['아파트', '빌라/연립', '단독주택', '오피스텔', '상가', '사무실']} /></div>
          <div className="col-md-6"><InputField label="면적 (㎡)" name="propertySize" value={formData.propertySize || ''} onChange={onChange} placeholder="84" /></div>
          <div className="col-md-6"><InputField label="부동산 소재지" name="propertyAddress" value={formData.propertyAddress || ''} onChange={onChange} placeholder="서울시 강남구 테헤란로 123" required /></div>
          <div className="col-md-6"><InputField label="등기부상 면적" name="registeredSize" value={formData.registeredSize || ''} onChange={onChange} placeholder="전용 84.12㎡" /></div>
        </div>
      </TermsSection>
      <TermsSection icon="💰" title="계약 조건">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="계약 유형" name="leaseType" value={formData.leaseType || '월세'} onChange={onSelectChange} options={['전세', '월세', '반전세']} /></div>
          <div className="col-md-6"><InputField label="보증금 (원)" name="deposit" value={formData.deposit || ''} onChange={onChange} placeholder="50,000,000" required /></div>
          <div className="col-md-6"><InputField label="월 차임 (원)" name="monthlyRent" value={formData.monthlyRent || ''} onChange={onChange} placeholder="1,000,000" /></div>
          <div className="col-md-6"><InputField label="관리비 (원)" name="maintenanceFee" value={formData.maintenanceFee || ''} onChange={onChange} placeholder="200,000" /></div>
          <div className="col-md-6"><InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-md-6"><InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-md-6"><SelectField label="차임 지급일" name="paymentDate" value={formData.paymentDate || '매월 말일'} onChange={onSelectChange} options={['매월 1일', '매월 10일', '매월 25일', '매월 말일']} /></div>
        </div>
      </TermsSection>
    </>
  );
}

function FreelanceForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="의뢰인(갑) 정보">
        <div className="col-md-6"><InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="프리랜서(을) 정보">
        <div className="col-md-6"><InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required /></div>
        <div className="col-md-6"><InputField label="생년월일" name="partyBBirthDate" value={formData.partyBBirthDate || ''} onChange={onChange} type="date" /></div>
        <div className="col-md-6"><InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." /></div>
        <div className="col-md-6"><InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" /></div>
      </PartySection>
      <TermsSection icon="💻" title="업무 내용">
        <div className="row g-3">
          <div className="col-12"><InputField label="프로젝트/업무명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹 애플리케이션 개발" required /></div>
          <div className="col-12"><TextAreaField label="업무 내용 및 범위" name="workScope" value={formData.workScope || ''} onChange={onChange} placeholder="구체적인 업무 내용을 입력하세요..." rows={3} /></div>
          <div className="col-md-6"><InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required /></div>
          <div className="col-md-6"><InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required /></div>
        </div>
      </TermsSection>
      <TermsSection icon="💰" title="대금 조건">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="대금 유형" name="paymentType" value={formData.paymentType || '프로젝트 단위'} onChange={onSelectChange} options={['프로젝트 단위', '월 정액', '시간 단위']} /></div>
          <div className="col-md-6"><InputField label="대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="5,000,000" required /></div>
          <div className="col-md-6"><SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '완료 후 일시불'} onChange={onSelectChange} options={['완료 후 일시불', '선금/잔금', '월별 지급']} /></div>
          <div className="col-md-6"><InputField label="세금계산서 발행" name="taxInvoice" value={formData.taxInvoice || ''} onChange={onChange} placeholder="매월 말일" /></div>
        </div>
        <div className="alert alert-warning mt-3 py-2">
          <p className="mb-0" style={{ fontSize: 12 }}>※ 프리랜서 계약은 근로계약이 아닌 업무위탁계약으로, 4대보험이 적용되지 않습니다.</p>
        </div>
      </TermsSection>
    </>
  );
}

function InvestmentForm({ formData, onChange, onSelectChange }: { formData: Record<string, string>; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <>
      <PartySection badge="갑" badgeColor="var(--tc-theme-primary)" title="회사(갑) 정보">
        <div className="col-md-6"><InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required /></div>
        <div className="col-md-6"><InputField label="대표이사" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required /></div>
        <div className="col-md-6"><InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" /></div>
        <div className="col-md-6"><InputField label="본점 소재지" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." /></div>
      </PartySection>
      <PartySection badge="을" badgeColor="#6c757d" title="투자자(을) 정보">
        <div className="col-md-6"><InputField label="투자자명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 투자사 / 김투자" required /></div>
        <div className="col-md-6"><InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="이투자" /></div>
        <div className="col-md-6"><InputField label="사업자등록번호/주민번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} /></div>
        <div className="col-md-6"><InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} /></div>
      </PartySection>
      <TermsSection icon="📈" title="투자 조건">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="투자 유형" name="investmentType" value={formData.investmentType || '보통주'} onChange={onSelectChange} options={['보통주', '우선주', '전환사채(CB)', '신주인수권부사채(BW)', 'SAFE']} /></div>
          <div className="col-md-6"><InputField label="투자금액 (원)" name="investmentAmount" value={formData.investmentAmount || ''} onChange={onChange} placeholder="500,000,000" required /></div>
          <div className="col-md-6"><InputField label="Pre-money 밸류에이션 (원)" name="preMoneyValuation" value={formData.preMoneyValuation || ''} onChange={onChange} placeholder="5,000,000,000" required /></div>
          <div className="col-md-6"><InputField label="발행 주식 수 (주)" name="shareCount" value={formData.shareCount || ''} onChange={onChange} placeholder="50,000" /></div>
          <div className="col-md-6"><InputField label="1주당 발행가액 (원)" name="pricePerShare" value={formData.pricePerShare || ''} onChange={onChange} placeholder="10,000" /></div>
          <div className="col-md-6"><InputField label="투자 후 지분율 (%)" name="equityPercentage" value={formData.equityPercentage || ''} onChange={onChange} placeholder="10" /></div>
        </div>
      </TermsSection>
      <TermsSection icon="⚖️" title="투자자 권리">
        <div className="row g-3">
          <div className="col-md-6"><SelectField label="이사회 참관권" name="boardObserver" value={formData.boardObserver || '있음'} onChange={onSelectChange} options={['있음', '없음']} /></div>
          <div className="col-md-6"><SelectField label="정보청구권" name="informationRight" value={formData.informationRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} /></div>
          <div className="col-md-6"><SelectField label="우선매수권" name="preemptiveRight" value={formData.preemptiveRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} /></div>
          <div className="col-md-6"><SelectField label="동반매도권" name="tagAlong" value={formData.tagAlong || '있음'} onChange={onSelectChange} options={['있음', '없음']} /></div>
          <div className="col-md-6"><SelectField label="희석화 방지" name="antiDilution" value={formData.antiDilution || 'Weighted Average'} onChange={onSelectChange} options={['없음', 'Full Ratchet', 'Weighted Average']} /></div>
          <div className="col-12"><TextAreaField label="기타 특약사항" name="specialTerms" value={formData.specialTerms || ''} onChange={onChange} placeholder="추가적인 투자 조건이나 특약사항을 입력하세요..." rows={3} /></div>
        </div>
      </TermsSection>
    </>
  );
}

// ============================================
// Main Contract Page
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
    if (activeSubTab === 'list') loadContracts();
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectType = (type: string) => { setSelectedType(type); setFormData({}); setStep(2); };

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
          partyA: { name: formData.partyAName, representative: formData.partyARepresentative, businessNumber: formData.partyABusinessNumber, address: formData.partyAAddress, idNumber: formData.partyAIdNumber, contact: formData.partyAContact },
          partyB: { name: formData.partyBName, representative: formData.partyBRepresentative, businessNumber: formData.partyBBusinessNumber, birthDate: formData.partyBBirthDate, address: formData.partyBAddress, contact: formData.partyBContact, idNumber: formData.partyBIdNumber },
          terms: formData,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '계약서 생성에 실패했습니다.');
      setGeneratedContract({ content: data.contract.content, id: data.contract.id });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계약서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async (content: string, title: string) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const margin = 20;
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
      doc.setFontSize(18);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content, maxWidth);
      let y = 35;
      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += 6;
      }
      doc.save(`${title}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF 다운로드에 실패했습니다.');
    }
  };

  const handleDownloadText = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setStep(1); setSelectedType(''); setGeneratedContract(null); setError(''); setFormData({}); setIsTypingComplete(false);
  };

  const renderForm = () => {
    const props = { formData, onChange: handleInputChange, onSelectChange: handleSelectChange };
    switch (selectedType) {
      case 'employment': return <EmploymentForm {...props} />;
      case 'service': return <ServiceForm {...props} />;
      case 'nda': return <NDAForm {...props} />;
      case 'lease': return <LeaseForm {...props} />;
      case 'freelance': return <FreelanceForm {...props} />;
      case 'investment': return <InvestmentForm {...props} />;
      default: return null;
    }
  };

  const contractTypeIcons: Record<string, string> = {
    employment: 'bi-person-badge', service: 'bi-briefcase', nda: 'bi-lock',
    lease: 'bi-building', freelance: 'bi-laptop', investment: 'bi-graph-up-arrow',
  };

  const currentTitle = `${contractTypeNames[selectedType] || '계약서'} - ${formData.partyAName || ''}`;

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">계약서 작성</h2>
        <p className="text-muted fs-6 mb-0">AI가 맞춤형 계약서를 생성해드립니다.</p>
      </div>

      {/* Sub-tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          onClick={() => { setActiveSubTab('create'); resetForm(); }}
          className={`btn btn-sm rounded-pill fw-semibold ${activeSubTab === 'create' ? 'btn-dark' : 'btn-outline-dark'}`}
        >
          새 계약서 작성
        </button>
        <button
          onClick={() => setActiveSubTab('list')}
          className={`btn btn-sm rounded-pill fw-semibold ${activeSubTab === 'list' ? 'btn-dark' : 'btn-outline-dark'}`}
        >
          생성한 계약서
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {error}
        </div>
      )}

      {activeSubTab === 'create' ? (
        <>
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">어떤 계약서가 필요하신가요?</h5>
                <p className="text-muted fs-7 mb-4">작성하실 계약서 유형을 선택해주세요.</p>
                <div className="row g-3">
                  {[
                    { type: 'employment', title: '근로계약서', desc: '정규직, 계약직, 수습, 파트타임 등' },
                    { type: 'service', title: '용역계약서', desc: '프로젝트, 외주, IT 개발, 컨설팅' },
                    { type: 'nda', title: '비밀유지계약서', desc: '영업비밀, 기술정보 보호' },
                    { type: 'lease', title: '임대차계약서', desc: '주택, 상가, 오피스 부동산' },
                    { type: 'freelance', title: '프리랜서 계약서', desc: '개인 사업자, 프리랜서 업무 위탁' },
                    { type: 'investment', title: '투자계약서', desc: '스타트업 투자, 주주간 계약' },
                  ].map((item) => (
                    <div key={item.type} className="col-md-6 col-lg-4">
                      <button
                        onClick={() => handleSelectType(item.type)}
                        className="card border rounded-4 p-4 text-start w-100 hover-up"
                        style={{ background: 'transparent', cursor: 'pointer' }}
                      >
                        <i className={`bi ${contractTypeIcons[item.type]} fs-3 mb-2 d-block`} style={{ color: 'var(--tc-theme-primary)' }} />
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: 12 }}>{item.desc}</p>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Form Input */}
          {step === 2 && !isGenerating && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className={`bi ${contractTypeIcons[selectedType]} fs-4`} style={{ color: 'var(--tc-theme-primary)' }} />
                  <h5 className="fw-bold mb-0">{contractTypeNames[selectedType]} 작성</h5>
                </div>
                <p className="text-muted fs-7 mb-4">정확한 정보를 입력하시면 AI가 맞춤형 계약서를 생성합니다.</p>

                {renderForm()}

                <div className="d-flex justify-content-between pt-4 mt-4 border-top">
                  <button onClick={() => setStep(1)} className="btn btn-outline-secondary btn-sm rounded-3">
                    <i className="bi bi-arrow-left me-1" /> 유형 다시 선택
                  </button>
                  <button
                    onClick={handleGenerateContract}
                    disabled={isGenerating || !formData.partyAName || !formData.partyBName}
                    className="btn btn-sm rounded-3 text-white fw-semibold"
                    style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}
                  >
                    계약서 생성하기 <i className="bi bi-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2.5: Generating Animation */}
          {step === 2 && isGenerating && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <GeneratingAnimation contractType={selectedType} />
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && generatedContract && (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h6 className="fw-bold mb-0">
                        <i className="bi bi-pencil me-2" />
                        AI가 {contractTypeNames[selectedType]}를 작성하고 있습니다...
                      </h6>
                      {isTypingComplete && (
                        <span className="badge bg-success rounded-pill">
                          <i className="bi bi-check me-1" />작성 완료
                        </span>
                      )}
                    </div>
                    <TypingEffect content={generatedContract.content} speed={8} onComplete={() => setIsTypingComplete(true)} />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 d-flex flex-column gap-3">
                {/* Download */}
                <div className={`card border-0 shadow-sm rounded-4 ${isTypingComplete ? '' : 'opacity-50'}`}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3"><i className="bi bi-download me-2" />다운로드</h6>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => handleDownloadPDF(generatedContract.content, currentTitle)}
                        disabled={!isTypingComplete}
                        className="btn btn-sm text-white fw-semibold"
                        style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}
                      >
                        <i className="bi bi-file-earmark-pdf me-1" /> PDF 다운로드
                      </button>
                      <button
                        onClick={() => handleDownloadText(generatedContract.content, currentTitle)}
                        disabled={!isTypingComplete}
                        className="btn btn-sm btn-outline-primary fw-semibold"
                      >
                        <i className="bi bi-file-earmark-text me-1" /> 텍스트 다운로드
                      </button>
                    </div>
                    {!isTypingComplete && (
                      <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: 11 }}>작성이 완료되면 다운로드할 수 있습니다</p>
                    )}
                  </div>
                </div>

                {/* Additional Actions */}
                <div className={`card border-0 shadow-sm rounded-4 ${isTypingComplete ? '' : 'opacity-50'}`}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3"><i className="bi bi-lightning me-2" />추가 작업</h6>
                    <div className="d-grid gap-2">
                      <button onClick={resetForm} disabled={!isTypingComplete} className="btn btn-sm btn-outline-secondary fw-semibold">
                        새 계약서 작성하기
                      </button>
                      <button onClick={() => setActiveSubTab('list')} disabled={!isTypingComplete} className="btn btn-sm btn-outline-secondary fw-semibold">
                        생성한 계약서 목록
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Contract List Tab */
        <div className="d-flex flex-column gap-3">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted fs-7">로딩 중...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-text fs-1 text-muted d-block mb-3" />
              <p className="text-muted mb-2">아직 생성한 계약서가 없습니다.</p>
              <button onClick={() => setActiveSubTab('create')} className="btn btn-sm btn-primary rounded-pill" style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}>
                첫 계약서 작성하기
              </button>
            </div>
          ) : selectedContract ? (
            <div>
              <button onClick={() => setSelectedContract(null)} className="btn btn-sm btn-outline-secondary rounded-pill mb-3">
                <i className="bi bi-arrow-left me-1" /> 목록으로
              </button>
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">{selectedContract.title}</h5>
                      <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                        {new Date(selectedContract.created_at).toLocaleDateString('ko-KR')} 생성
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <button onClick={() => handleDownloadPDF(selectedContract.content, selectedContract.title)} className="btn btn-sm text-white" style={{ background: 'var(--tc-theme-primary)' }}>
                        <i className="bi bi-file-pdf me-1" />PDF
                      </button>
                      <button onClick={() => handleDownloadText(selectedContract.content, selectedContract.title)} className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-file-text me-1" />TXT
                      </button>
                    </div>
                  </div>
                  <div className="bg-light border rounded-3 p-4 overflow-auto" style={{ maxHeight: 500 }}>
                    <pre className="mb-0 fs-7" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
                      {selectedContract.content}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            contracts.map((contract) => (
              <div
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                className="card border-0 shadow-sm rounded-4 hover-up"
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: 'rgba(0,70,255,0.08)' }}
                    >
                      <i className={`bi ${contractTypeIcons[contract.contract_type] || 'bi-file-text'}`} style={{ color: 'var(--tc-theme-primary)' }} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold fs-7">{contract.title || contractTypeNames[contract.contract_type]}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                        {new Date(contract.created_at).toLocaleDateString('ko-KR')} &middot; {contract.party_a_name} ↔ {contract.party_b_name}
                      </p>
                    </div>
                  </div>
                  <span className="fs-7 fw-semibold" style={{ color: 'var(--tc-theme-primary)' }}>
                    보기 <i className="bi bi-arrow-right" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
