'use client'

import Image from 'next/image'
import Link from 'next/link'
import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"

export default function AboutPage() {
  return (
    <Layout>
      <PageHeader title="회사 소개" current_page="회사소개" />

      {/* Mission Section */}
      <section className="position-relative overflow-hidden bg-white py-120">
        <div className="container">
          <div className="row align-items-center">
            {/* Text Content */}
            <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="small-line" />
                <span className="btn-text text-primary">ABOUT US</span>
              </div>
              <h2 className="text-dark fw-bold mb-3">우리의 미션</h2>
              <p className="fs-5 fw-bold mb-4">
                <span style={{ color: 'var(--tc-theme-primary)' }}>Lawdy</span>
                <span className="text-muted">는 지혜로운 눈으로 계약을 바라봅니다.</span>
              </p>
              <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                복잡한 법률 문서 속에서 핵심을 정확히 짚어내고, 고객이 보다 안전하고 유리한 계약을 체결할 수 있도록 돕는 것이 Lawdy의 미션입니다.
                AI 기술과 법률 전문성의 결합으로, 누구나 쉽게 계약의 위험을 파악하고 대비할 수 있는 세상을 만들어갑니다.
              </p>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center gap-2 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--tc-theme-primary)' }}>
                    <i className="bi bi-check2 text-white" style={{ fontSize: '14px' }} />
                  </div>
                  <span className="text-dark fw-medium">AI 기반 자동 계약서 분석</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--tc-theme-primary)' }}>
                    <i className="bi bi-check2 text-white" style={{ fontSize: '14px' }} />
                  </div>
                  <span className="text-dark fw-medium">법률 전문가 검증 시스템</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--tc-theme-primary)' }}>
                    <i className="bi bi-check2 text-white" style={{ fontSize: '14px' }} />
                  </div>
                  <span className="text-dark fw-medium">실시간 위험도 시각화 리포트</span>
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="col-lg-6 col-md-12">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden" style={{ height: '380px' }}>
                  <Image
                    src="/images/about-hero.png"
                    alt="Lawdy Office"
                    fill
                    className="object-fit-cover"
                    style={{ opacity: 0.85 }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: '#7c3aed', mixBlendMode: 'soft-light' }} />
                </div>
                {/* Floating Card */}
                <div className="position-absolute bg-white rounded-4 p-3 shadow-lg" style={{ bottom: '-30px', left: '20px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <Image src="/images/about-icon-law-tech.svg" alt="" width={48} height={48} />
                    <div>
                      <p className="mb-0 fw-semibold text-dark">법률과 기술이 만나</p>
                      <p className="mb-0 fw-semibold text-dark">더 나은 미래를 만드는 회사</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="position-relative overflow-hidden bg-dark-1" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-lg-3">
              <h2 className="text-white fw-bold mb-1">6<span className="text-primary">+</span></h2>
              <p className="text-white opacity-75 mb-0 small">법률 전문가</p>
            </div>
            <div className="col-6 col-lg-3">
              <h2 className="text-white fw-bold mb-1">AI</h2>
              <p className="text-white opacity-75 mb-0 small">Solar LLM 기반 분석</p>
            </div>
            <div className="col-6 col-lg-3">
              <h2 className="text-white fw-bold mb-1">24<span className="text-primary">/7</span></h2>
              <p className="text-white opacity-75 mb-0 small">실시간 서비스</p>
            </div>
            <div className="col-6 col-lg-3">
              <h2 className="text-white fw-bold mb-1">99<span className="text-primary">%</span></h2>
              <p className="text-white opacity-75 mb-0 small">분석 정확도</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Areas Section */}
      <section className="position-relative overflow-hidden py-120">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
              <span className="small-line" />
              <span className="btn-text text-primary">OUR SERVICES</span>
              <span className="small-line" />
            </div>
            <h2 className="text-dark fw-bold mb-3">전문 분야</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '560px' }}>
              Lawdy는 AI와 법률 전문성을 결합하여 계약의 모든 단계에서 고객을 지원합니다.
            </p>
          </div>
          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="position-relative" style={{ width: '80px', height: '80px' }}>
                      <Image src="/images/about-specialty-ai-bg.svg" alt="" fill style={{ objectFit: 'contain' }} />
                      <div className="position-absolute" style={{ left: '18px', top: '22px', width: '42px', height: '35px' }}>
                        <Image src="/images/about-specialty-ai-inner.svg" alt="" fill style={{ objectFit: 'contain' }} />
                      </div>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">AI 기반 계약서 분석</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                    Lawdy는 AI 기술을 활용하여 계약서의 핵심 조항을 자동으로 분석합니다. 복잡한 법률 문서를 빠르고 정확하게 검토하여, 놓치기 쉬운 조항까지 꼼꼼히 확인합니다.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="position-relative" style={{ width: '80px', height: '80px' }}>
                      <Image src="/images/about-specialty-risk.svg" alt="" fill style={{ objectFit: 'contain' }} />
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">위험도 분석</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                    계약서의 잠재적 위험 요소를 체계적으로 식별하고, 각 항목의 위험 수준을 직관적으로 시각화합니다. 리스크를 사전에 파악하여 보다 안전한 의사결정을 지원합니다.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col-lg-4 col-md-6 mx-auto">
              <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="position-relative" style={{ width: '80px', height: '80px' }}>
                      <Image src="/images/about-specialty-guide-bg.svg" alt="" fill style={{ objectFit: 'contain' }} />
                      <div className="position-absolute" style={{ top: '22.5%', right: '31.25%', bottom: '21.25%', left: '31.25%' }}>
                        <Image src="/images/about-specialty-guide-inner.svg" alt="" fill style={{ objectFit: 'contain' }} />
                      </div>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">계약 검토 및 개선 가이드</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                    Lawdy는 계약 리스크를 줄이기 위한 실질적인 개선 방향을 제시합니다. 수정이 필요한 조항과 주의해야 할 포인트를 안내하여, 보다 안전하고 균형 잡힌 계약 체결을 지원합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section className="position-relative overflow-hidden bg-white py-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="small-line" />
                <span className="btn-text text-primary">COMPANY</span>
              </div>
              <h2 className="text-dark fw-bold mb-3">회사 소개</h2>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                저희는 단순한 법률 자문을 넘어, 고객의 상황과 입장을 깊이 이해하는 것을 가장 중요하게 생각합니다. 사안별 특성과 고객의 니즈를 면밀히 분석하여,{' '}
                <span className="fw-semibold" style={{ color: 'var(--tc-theme-primary)' }}>현실적이고 맞춤화된 법률 솔루션을 제공</span>함으로써 더 나은 결과를 만들어가고자 합니다.
              </p>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <div className="row g-3">
                <div className="col-6">
                  <div className="bg-dark-1 rounded-4 p-4">
                    <div className="mb-3">
                      <i className="bi bi-shield-check fs-3 text-primary" />
                    </div>
                    <h6 className="text-white fw-bold mb-2">신뢰와 안전</h6>
                    <p className="text-white opacity-75 small mb-0">고객의 계약 데이터를 안전하게 보호하며, 신뢰할 수 있는 분석 결과를 제공합니다.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark-1 rounded-4 p-4">
                    <div className="mb-3">
                      <i className="bi bi-lightning-charge fs-3 text-primary" />
                    </div>
                    <h6 className="text-white fw-bold mb-2">빠른 분석</h6>
                    <p className="text-white opacity-75 small mb-0">AI 기술로 수 분 내에 계약서의 핵심 리스크를 파악하고 리포트를 생성합니다.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark-1 rounded-4 p-4">
                    <div className="mb-3">
                      <i className="bi bi-people fs-3 text-primary" />
                    </div>
                    <h6 className="text-white fw-bold mb-2">전문가 협업</h6>
                    <p className="text-white opacity-75 small mb-0">AI 분석과 법률 전문가의 검증을 결합하여 최적의 결과물을 제공합니다.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-dark-1 rounded-4 p-4">
                    <div className="mb-3">
                      <i className="bi bi-graph-up-arrow fs-3 text-primary" />
                    </div>
                    <h6 className="text-white fw-bold mb-2">지속적 개선</h6>
                    <p className="text-white opacity-75 small mb-0">사용자 피드백과 최신 법률 동향을 반영하여 분석 품질을 계속 높여갑니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="position-relative overflow-hidden bg-dark-1" style={{ padding: '80px 0' }}>
        <div className="container text-center">
          <h2 className="text-white fw-bold mb-3">지금 바로 계약서를 분석해보세요</h2>
          <p className="text-white opacity-75 mb-4 mx-auto" style={{ maxWidth: '480px' }}>
            AI가 계약서의 위험 요소를 자동으로 찾아드립니다. 빠르고 정확한 분석을 경험하세요.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/login" className="btn btn-linear hover-up">
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
