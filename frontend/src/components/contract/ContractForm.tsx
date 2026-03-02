'use client';

import { useState } from 'react';
import { contractTypeConfigs, contractTypeNames, type ContractType, type ContractTypeConfig } from './contractTypes';
import ChatMode from './ChatMode';

interface ContractData {
  type: string;
  content: string;
  generatedAt: string;
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
      />
    </div>
  );
}

// ============================================
// 서브스텝 인디케이터
// ============================================
function SubStepIndicator({ config, currentSubStep, onStepClick }: {
  config: ContractTypeConfig;
  currentSubStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6">
      {config.subSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => index <= currentSubStep ? onStepClick(index) : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              index === currentSubStep
                ? 'bg-primary text-white shadow-sm'
                : index < currentSubStep
                ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span>{step.icon}</span>
            <span>{step.title}</span>
          </button>
          {index < config.subSteps.length - 1 && (
            <div className={`w-4 h-0.5 mx-0.5 ${index < currentSubStep ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// 스텝 인디케이터 (메인 스텝 1-2-3)
// ============================================
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

// ============================================
// 특약 조항 스텝
// ============================================
function SpecialTermsStep({ config, selectedClauses, onClauseToggle, customTerms, onCustomTermsChange }: {
  config: ContractTypeConfig;
  selectedClauses: string[];
  onClauseToggle: (clause: string) => void;
  customTerms: string;
  onCustomTermsChange: (value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">AI 추천 특약 조항</h4>
        <p className="text-gray-500 mb-4">계약서 유형에 맞는 추천 특약을 선택하세요.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.recommendedClauses.map((clause) => (
            <label
              key={clause}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedClauses.includes(clause)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedClauses.includes(clause)}
                onChange={() => onClauseToggle(clause)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">{clause}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">직접 입력 특약</h4>
        <p className="text-gray-500 mb-3">추가로 포함하고 싶은 특약 사항을 자유롭게 입력하세요.</p>
        <textarea
          value={customTerms}
          onChange={(e) => onCustomTermsChange(e.target.value)}
          placeholder="예: 갑은 을에게 업무용 노트북을 지급하며, 을은 계약 종료 시 이를 반환한다."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}

// ============================================
// 서브스텝 폼 렌더링
// ============================================
function FormSubStep({ selectedType, subStepId, formData, onChange, onSelectChange }: {
  selectedType: ContractType;
  subStepId: string;
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  if (selectedType === 'employment') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
            <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required />
            <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="회사 주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
            <InputField label="생년월일" name="partyBBirthDate" value={formData.partyBBirthDate || ''} onChange={onChange} type="date" />
            <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
            <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="근무 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
            <InputField label="담당 업무" name="position" value={formData.position || ''} onChange={onChange} placeholder="소프트웨어 개발" />
            <InputField label="근무 장소" name="workplace" value={formData.workplace || ''} onChange={onChange} placeholder="본사" />
            <SelectField label="근무 시간" name="workingHours" value={formData.workingHours || '09:00 ~ 18:00 (주 40시간)'} onChange={onSelectChange} options={['09:00 ~ 18:00 (주 40시간)', '10:00 ~ 19:00 (주 40시간)', '자율 출퇴근제']} />
          </div>
        );
      case 'salary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="급여 형태" name="salaryType" value={formData.salaryType || '연봉제'} onChange={onSelectChange} options={['연봉제', '월급제', '시급제']} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                급여액 <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="salaryAmount"
                  value={formData.salaryAmount || ''}
                  onChange={onChange}
                  placeholder="50,000,000"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-gray-600">원</span>
              </div>
            </div>
            <SelectField label="지급일" name="paymentDate" value={formData.paymentDate || '매월 25일'} onChange={onSelectChange} options={['매월 25일', '매월 말일', '매월 10일']} />
          </div>
        );
    }
  }

  if (selectedType === 'service') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
            <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
            <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 개발사" required />
            <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="김개발" />
            <InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 gap-4">
            <InputField label="프로젝트명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹사이트 개발 프로젝트" required />
            <TextAreaField label="용역 범위 및 내용" name="serviceScope" value={formData.serviceScope || ''} onChange={onChange} placeholder="용역의 구체적인 범위와 내용을 입력하세요..." rows={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
              <InputField label="납품 기한" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="용역 대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="10,000,000" required />
            <SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '계약금/중도금/잔금'} onChange={onSelectChange} options={['일시불', '계약금/잔금', '계약금/중도금/잔금', '월별 분할']} />
            <InputField label="계약금 (원)" name="advancePayment" value={formData.advancePayment || ''} onChange={onChange} placeholder="3,000,000" />
            <InputField label="잔금 (원)" name="finalPayment" value={formData.finalPayment || ''} onChange={onChange} placeholder="7,000,000" />
          </div>
        );
    }
  }

  if (selectedType === 'nda') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
            <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
            <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명/성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
            <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="" />
            <InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="" />
            <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="" />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 gap-4">
            <SelectField label="비밀유지 유형" name="ndaType" value={formData.ndaType || '쌍방'} onChange={onSelectChange} options={['쌍방 (상호)', '일방 (갑→을)', '일방 (을→갑)']} />
            <InputField label="비밀유지 목적" name="purpose" value={formData.purpose || ''} onChange={onChange} placeholder="사업 협력 검토, 기술 협력 등" required />
            <TextAreaField label="비밀정보의 범위" name="confidentialScope" value={formData.confidentialScope || ''} onChange={onChange} placeholder="기술정보, 영업정보 등 비밀 범위 입력..." rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="비밀유지 기간 (년)" name="confidentialPeriod" value={formData.confidentialPeriod || ''} onChange={onChange} placeholder="3" required />
              <InputField label="위약금 (원)" name="penaltyAmount" value={formData.penaltyAmount || ''} onChange={onChange} placeholder="100,000,000" />
            </div>
          </div>
        );
    }
  }

  if (selectedType === 'lease') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="홍길동" required />
            <InputField label="연락처" name="partyAContact" value={formData.partyAContact || ''} onChange={onChange} placeholder="010-0000-0000" />
            <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
            <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
            <InputField label="현 주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          </div>
        );
      case 'property':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="부동산 유형" name="propertyType" value={formData.propertyType || '아파트'} onChange={onSelectChange} options={['아파트', '빌라/연립', '단독주택', '오피스텔', '상가', '사무실']} />
            <InputField label="면적 (m2)" name="propertySize" value={formData.propertySize || ''} onChange={onChange} placeholder="84" />
            <InputField label="부동산 소재지" name="propertyAddress" value={formData.propertyAddress || ''} onChange={onChange} placeholder="서울시 강남구 테헤란로 123" required />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="계약 유형" name="leaseType" value={formData.leaseType || '월세'} onChange={onSelectChange} options={['전세', '월세', '반전세']} />
            <InputField label="보증금 (원)" name="deposit" value={formData.deposit || ''} onChange={onChange} placeholder="50,000,000" required />
            <InputField label="월 차임 (원)" name="monthlyRent" value={formData.monthlyRent || ''} onChange={onChange} placeholder="1,000,000" />
            <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
            <InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
          </div>
        );
    }
  }

  if (selectedType === 'freelance') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명/성명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
            <InputField label="대표자명" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" />
            <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="주소" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="성명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="김철수" required />
            <InputField label="연락처" name="partyBContact" value={formData.partyBContact || ''} onChange={onChange} placeholder="010-0000-0000" />
            <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="서울시 서초구..." />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 gap-4">
            <InputField label="프로젝트/업무명" name="projectName" value={formData.projectName || ''} onChange={onChange} placeholder="웹 애플리케이션 개발" required />
            <TextAreaField label="업무 내용 및 범위" name="workScope" value={formData.workScope || ''} onChange={onChange} placeholder="구체적인 업무 내용을 입력하세요..." rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="계약 시작일" name="startDate" value={formData.startDate || ''} onChange={onChange} type="date" required />
              <InputField label="계약 종료일" name="endDate" value={formData.endDate || ''} onChange={onChange} type="date" required />
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="대금 유형" name="paymentType" value={formData.paymentType || '프로젝트 단위'} onChange={onSelectChange} options={['프로젝트 단위', '월 정액', '시간 단위']} />
            <InputField label="대금 (원)" name="totalAmount" value={formData.totalAmount || ''} onChange={onChange} placeholder="5,000,000" required />
            <SelectField label="지급 방식" name="paymentMethod" value={formData.paymentMethod || '완료 후 일시불'} onChange={onSelectChange} options={['완료 후 일시불', '선금/잔금', '월별 지급']} />
          </div>
        );
    }
  }

  if (selectedType === 'investment') {
    switch (subStepId) {
      case 'partyA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="회사명" name="partyAName" value={formData.partyAName || ''} onChange={onChange} placeholder="주식회사 로우디" required />
            <InputField label="대표이사" name="partyARepresentative" value={formData.partyARepresentative || ''} onChange={onChange} placeholder="홍길동" required />
            <InputField label="사업자등록번호" name="partyABusinessNumber" value={formData.partyABusinessNumber || ''} onChange={onChange} placeholder="000-00-00000" />
            <InputField label="본점 소재지" name="partyAAddress" value={formData.partyAAddress || ''} onChange={onChange} placeholder="서울시 강남구..." />
          </div>
        );
      case 'partyB':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="투자자명" name="partyBName" value={formData.partyBName || ''} onChange={onChange} placeholder="주식회사 투자사" required />
            <InputField label="대표자명" name="partyBRepresentative" value={formData.partyBRepresentative || ''} onChange={onChange} placeholder="이투자" />
            <InputField label="사업자등록번호" name="partyBBusinessNumber" value={formData.partyBBusinessNumber || ''} onChange={onChange} placeholder="" />
            <InputField label="주소" name="partyBAddress" value={formData.partyBAddress || ''} onChange={onChange} placeholder="" />
          </div>
        );
      case 'conditions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="투자 유형" name="investmentType" value={formData.investmentType || '보통주'} onChange={onSelectChange} options={['보통주', '우선주', '전환사채(CB)', '신주인수권부사채(BW)', 'SAFE']} />
            <InputField label="투자금액 (원)" name="investmentAmount" value={formData.investmentAmount || ''} onChange={onChange} placeholder="500,000,000" required />
            <InputField label="Pre-money 밸류에이션 (원)" name="preMoneyValuation" value={formData.preMoneyValuation || ''} onChange={onChange} placeholder="5,000,000,000" required />
            <InputField label="발행 주식 수 (주)" name="shareCount" value={formData.shareCount || ''} onChange={onChange} placeholder="50,000" />
          </div>
        );
      case 'rights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="이사회 참관권" name="boardObserver" value={formData.boardObserver || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
            <SelectField label="정보청구권" name="informationRight" value={formData.informationRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
            <SelectField label="우선매수권" name="preemptiveRight" value={formData.preemptiveRight || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
            <SelectField label="동반매도권" name="tagAlong" value={formData.tagAlong || '있음'} onChange={onSelectChange} options={['있음', '없음']} />
            <SelectField label="희석화 방지" name="antiDilution" value={formData.antiDilution || 'Weighted Average'} onChange={onSelectChange} options={['없음', 'Full Ratchet', 'Weighted Average']} />
          </div>
        );
    }
  }

  return null;
}

// ============================================
// 메인 ContractForm 컴포넌트
// ============================================
export default function ContractForm() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ContractType | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<ContractData | null>(null);
  const [error, setError] = useState<string>('');

  // 위자드 상태
  const [subStep, setSubStep] = useState(0);
  const [inputMode, setInputMode] = useState<'form' | 'chat'>('form');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [customTerms, setCustomTerms] = useState('');

  const config = selectedType ? contractTypeConfigs[selectedType] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClauseToggle = (clause: string) => {
    setSelectedClauses(prev =>
      prev.includes(clause) ? prev.filter(c => c !== clause) : [...prev, clause]
    );
  };

  const handleSelectType = (type: ContractType) => {
    setSelectedType(type);
    setFormData({});
    setSelectedClauses([]);
    setCustomTerms('');
    setSubStep(0);
    setInputMode('form');
    setStep(2);
  };

  const buildAdditionalClauses = (): string[] => {
    const clauses = [...selectedClauses];
    if (customTerms.trim()) {
      clauses.push(customTerms.trim());
    }
    return clauses;
  };

  const handleGenerateContract = async (dataOverride?: Record<string, string>) => {
    const data = dataOverride || formData;
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/contract/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: selectedType,
          partyA: {
            name: data.partyAName,
            representative: data.partyARepresentative,
            businessNumber: data.partyABusinessNumber,
            address: data.partyAAddress,
          },
          partyB: {
            name: data.partyBName,
            birthDate: data.partyBBirthDate,
            address: data.partyBAddress,
            contact: data.partyBContact,
          },
          terms: data,
          additionalClauses: buildAdditionalClauses(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '계약서 생성에 실패했습니다.');
      }

      setGeneratedContract(result.contract);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계약서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatComplete = (extractedData: Record<string, string>) => {
    handleGenerateContract(extractedData);
  };

  const handleNextSubStep = () => {
    if (config && subStep < config.subSteps.length - 1) {
      setSubStep(subStep + 1);
    }
  };

  const handlePrevSubStep = () => {
    if (subStep > 0) {
      setSubStep(subStep - 1);
    }
  };

  const isLastSubStep = config ? subStep === config.subSteps.length - 1 : false;
  const currentSubStepId = config ? config.subSteps[subStep]?.id : '';

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
              {Object.values(contractTypeConfigs).map((item) => (
                <button
                  key={item.type}
                  onClick={() => handleSelectType(item.type)}
                  className="p-6 border border-gray-200 rounded-xl text-left hover:border-primary hover:shadow-md transition-all group"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h4 className="mt-3 font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 정보 입력 위자드 */}
      {step === 2 && config && (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
            {/* 헤더 + 모드 토글 */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">계약 정보를 입력해주세요</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setInputMode('form')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    inputMode === 'form' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  직접 입력
                </button>
                <button
                  onClick={() => setInputMode('chat')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    inputMode === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  💬 AI 대화
                </button>
              </div>
            </div>
            <p className="text-gray-500 mb-6">정확한 정보를 입력하시면 AI가 맞춤형 계약서를 생성합니다.</p>

            {inputMode === 'form' ? (
              <>
                {/* 서브스텝 인디케이터 */}
                <SubStepIndicator config={config} currentSubStep={subStep} onStepClick={setSubStep} />

                {/* 서브스텝 제목 */}
                <div className="flex items-center gap-2 mb-4">
                  {config.subSteps[subStep].badgeLabel && (
                    <span className={`w-7 h-7 rounded-full ${config.subSteps[subStep].badgeColor} text-white text-sm font-bold flex items-center justify-center`}>
                      {config.subSteps[subStep].badgeLabel}
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-gray-900">{config.subSteps[subStep].title}</h4>
                </div>

                <form className="space-y-8">
                  {currentSubStepId === 'specialTerms' ? (
                    <SpecialTermsStep
                      config={config}
                      selectedClauses={selectedClauses}
                      onClauseToggle={handleClauseToggle}
                      customTerms={customTerms}
                      onCustomTermsChange={setCustomTerms}
                    />
                  ) : (
                    <FormSubStep
                      selectedType={selectedType as ContractType}
                      subStepId={currentSubStepId}
                      formData={formData}
                      onChange={handleInputChange}
                      onSelectChange={handleSelectChange}
                    />
                  )}

                  {/* 버튼 */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={subStep === 0 ? () => setStep(1) : handlePrevSubStep}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      ← {subStep === 0 ? '이전' : '이전'}
                    </button>
                    {isLastSubStep ? (
                      <button
                        type="button"
                        onClick={() => handleGenerateContract()}
                        disabled={isGenerating || !formData.partyAName || !formData.partyBName}
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
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextSubStep}
                        className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        다음 →
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              <ChatMode
                contractType={selectedType as ContractType}
                onComplete={handleChatComplete}
                onBack={() => setStep(1)}
              />
            )}
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
                    📄 텍스트 다운로드
                  </button>
                </div>
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
                setFormData({});
                setSubStep(0);
                setSelectedClauses([]);
                setCustomTerms('');
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
