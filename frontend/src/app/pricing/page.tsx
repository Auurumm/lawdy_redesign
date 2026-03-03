'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"

const freeFeatures = [
  'AI 계약 분석 (1일 1건)',
  '계약서 생성 (1일 1건)',
  'AI 대화 기반 작성',
  'PDF 다운로드 (워터마크 포함)',
  '계약 이력 저장 (최근 5건)',
]

const proFeatures = [
  'AI 계약 분석 (무제한)',
  '계약서 생성 (무제한)',
  'AI 대화 기반 작성',
  '추천 특약 자동 제안',
  'PDF 다운로드 (워터마크 없음)',
  '계약 이력 저장 (무제한)',
  '기본 통계 대시보드',
  '이메일 고객지원',
]

const enterpriseExtra = [
  '팀 계정 관리',
  '관리자 콘솔',
  '계약 통합 관리 대시보드',
  '우선 기술 지원',
  '기업 맞춤 템플릿',
  'API 연동 (선택)',
]

const faqItems = [
  {
    question: 'Free 플랜으로 어디까지 이용할 수 있나요?',
    answer: 'Free 플랜은 회원가입만으로 바로 시작할 수 있습니다. AI 계약 분석과 계약서 생성을 각각 하루 1건씩 이용 가능하며, 최근 5건까지 이력이 저장됩니다. 더 많은 기능이 필요하시면 Pro 플랜으로 업그레이드해 주세요.',
  },
  {
    question: '결제 방식은 어떻게 되나요?',
    answer: 'Pro 플랜은 월 단위 구독 결제이며, 신용카드 및 계좌이체를 지원합니다. Enterprise 플랜은 연 단위 계약도 가능하며, 별도 협의를 통해 진행됩니다.',
  },
  {
    question: 'Enterprise 플랜의 최소 인원이 있나요?',
    answer: 'Enterprise 플랜은 최소 5명(시트) 이상부터 이용 가능합니다. 인원 수에 따른 맞춤 견적은 문의를 통해 안내받으실 수 있습니다.',
  },
  {
    question: '플랜 변경이 가능한가요?',
    answer: '네, 언제든지 플랜을 변경하실 수 있습니다. Pro에서 Enterprise로 업그레이드 시 기존 데이터와 분석 이력이 모두 유지됩니다.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <Layout>
      <PageHeader title="요금제" current_page="요금제" />

      {/* Hero + Plan Cards */}
      <section className="position-relative overflow-hidden py-120">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
              <span className="small-line" />
              <span className="btn-text text-primary">PRICING</span>
              <span className="small-line" />
            </div>
            <h2 className="text-dark fw-bold mb-3">
              비즈니스에 맞는 플랜을 선택하세요
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              개인부터 기업까지, 규모에 맞는 최적의 요금제로<br />
              AI 계약 분석 서비스를 시작하세요.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Free Card */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-2">Free</h5>
                  <p className="text-muted small mb-4">
                    서비스를 체험해보고 싶은 개인 사용자
                  </p>
                  <div className="mb-4">
                    <span className="fs-2 fw-bold text-dark">0</span>
                    <span className="text-muted">원</span>
                    <p className="text-muted small mt-1 mb-0">회원가입만으로 시작</p>
                  </div>
                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {freeFeatures.map((feature) => (
                      <li key={feature} className="d-flex align-items-center gap-2 mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '24px', height: '24px', background: '#e0e0e0' }}
                        >
                          <i className="bi bi-check2 text-dark" style={{ fontSize: '12px' }} />
                        </div>
                        <span className="text-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="btn btn-outline-dark hover-up w-100">
                    <span>무료로 시작하기</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Card */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 rounded-4 h-100 p-4 bg-dark-1 position-relative overflow-hidden">
                <span
                  className="badge position-absolute"
                  style={{
                    top: '20px',
                    right: '20px',
                    background: 'var(--tc-theme-primary)',
                    fontSize: '12px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                  }}
                >
                  추천
                </span>
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-white mb-2">Pro</h5>
                  <p className="text-white opacity-75 small mb-4">
                    개인 사업자, 프리랜서, 1인 기업
                  </p>
                  <div className="mb-4">
                    <span className="fs-2 fw-bold text-white">49,900</span>
                    <span className="text-white opacity-75">원/월</span>
                    <p className="text-white opacity-75 small mt-1 mb-0">VAT 별도 | 1계정 고정 구독</p>
                  </div>
                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {proFeatures.map((feature) => (
                      <li key={feature} className="d-flex align-items-center gap-2 mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '24px', height: '24px', background: 'var(--tc-theme-primary)' }}
                        >
                          <i className="bi bi-check2 text-white" style={{ fontSize: '12px' }} />
                        </div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="btn btn-linear hover-up w-100">
                    <span>시작하기</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                      <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Enterprise Card */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-2">Enterprise</h5>
                  <p className="text-muted small mb-4">
                    기업, 법무팀, 인사팀을 위한 맞춤 플랜
                  </p>
                  <div className="mb-4">
                    <span className="fs-2 fw-bold text-dark">별도 문의</span>
                    <p className="text-muted small mt-1 mb-0">Per Seat (사용자 수 기반)</p>
                  </div>
                  <p className="text-muted small fw-medium mb-2">Pro 전체 기능 포함 +</p>
                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {enterpriseExtra.map((feature) => (
                      <li key={feature} className="d-flex align-items-center gap-2 mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '24px', height: '24px', background: 'var(--tc-theme-primary)' }}
                        >
                          <i className="bi bi-check2 text-white" style={{ fontSize: '12px' }} />
                        </div>
                        <span className="text-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/support" className="btn btn-outline-dark hover-up w-100">
                    <span>문의하기</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="position-relative overflow-hidden bg-white py-120">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
              <span className="small-line" />
              <span className="btn-text text-primary">FAQ</span>
              <span className="small-line" />
            </div>
            <h2 className="text-dark fw-bold mb-3">자주 묻는 질문</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
              요금제와 관련하여 자주 문의되는 내용을 정리했습니다.
            </p>
          </div>
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <div className="accordion">
              {faqItems.map((item, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={index} className="accordion-item border rounded-3 mb-3">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button fw-semibold ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        {item.question}
                      </button>
                    </h2>
                    {isOpen && (
                      <div className="accordion-body text-muted" style={{ lineHeight: '1.8' }}>
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="position-relative overflow-hidden bg-dark-1" style={{ padding: '80px 0' }}>
        <div className="container text-center">
          <h2 className="text-white fw-bold mb-3">지금 바로 시작해보세요</h2>
          <p className="text-white opacity-75 mb-4 mx-auto" style={{ maxWidth: '480px' }}>
            AI 계약 분석으로 비즈니스 리스크를 줄이고,<br />
            더 안전한 계약을 체결하세요.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/signup" className="btn btn-linear hover-up">
              <span>무료로 시작하기</span>
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
              </svg>
            </Link>
            <Link href="/support" className="btn btn-outline-light hover-up">
              <span>문의하기</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
