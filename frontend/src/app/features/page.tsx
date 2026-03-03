'use client'

import Link from "next/link"
import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"

export default function FeaturesPage() {
  return (
    <Layout>
      <PageHeader title="기능 소개" current_page="기능소개" />

      {/* Section 1 - 핵심 기능 요약 */}
      <section className="position-relative overflow-hidden py-120">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center gap-3 justify-content-center">
              <span className="small-line" />
              <span className="btn-text text-primary">CORE FEATURES</span>
              <span className="small-line" />
            </div>
            <h2 className="text-dark my-3 text-anime-style-3">
              AI와 대화하며 완성하는<br />
              계약서의 모든 것
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '560px' }}>
              Lawdy는 계약서 작성부터 리스크 분석까지,<br />
              AI 대화 한 번으로 해결합니다.<br />
              복잡한 법률 지식 없이도<br />
              전문가 수준의 결과를 얻으세요.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={0}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-shield-exclamation fs-4 text-white" />
                  </div>
                  <h5 className="text-white mb-2">리스크 자동 분석</h5>
                  <p className="text-white-50 mb-0">업로드된 계약서의 잠재적 위험을 즉시 식별합니다</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={200}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-chat-dots fs-4 text-white" />
                  </div>
                  <h5 className="text-white mb-2">AI 대화형 작성</h5>
                  <p className="text-white-50 mb-0">AI와 자연스럽게 대화하며 계약서를 완성합니다</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={400}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center d-flex flex-column">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-file-earmark-check fs-4 text-white" />
                  </div>
                  <h5 className="text-white mb-2">멀티스텝 위자드</h5>
                  <p className="text-white-50 mb-0">단계별 안내로 누구나 쉽게 계약서를 작성합니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - AI 리스크 분석 (좌: 텍스트, 우: 비주얼) - 다크 배경 */}
      <section className="position-relative overflow-hidden bg-dark-1 py-120">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="small-line" />
                <span className="btn-text text-primary">RISK ANALYSIS</span>
              </div>
              <h2 className="text-white fw-bold mb-3">계약서의 숨겨진 위험,<br />AI가 찾아드립니다</h2>
              <p className="text-white opacity-75 mb-4" style={{ lineHeight: '1.8' }}>
                계약서를 업로드하면<br />
                AI가 조항별 위험도를 자동으로 분석합니다.<br />
                위험 항목, 누락된 조항, 불리한 조건을 한눈에 파악하고,<br />
                AI와 대화하며 궁금한 점을 바로 질문할 수 있습니다.
              </p>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">1</span>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1">계약서 업로드</h6>
                    <p className="text-white opacity-50 small mb-0">PDF, Word 등 파일을 드래그 앤 드롭으로 간편하게 업로드</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">2</span>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1">AI 자동 분석</h6>
                    <p className="text-white opacity-50 small mb-0">Solar LLM이 조항별 위험도를 평가하고 리포트를 생성</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">3</span>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-1">AI와 대화</h6>
                    <p className="text-white opacity-50 small mb-0">분석 결과에 대해 AI에게 질문하고 조언을 받으세요</p>
                  </div>
                </div>
              </div>
              <Link href="/mypage" className="btn btn-linear hover-up">
                <span>1건 무료 분석하기</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                </svg>
              </Link>
            </div>
            {/* 비주얼: 분석 리포트 모크업 */}
            <div className="col-12 col-lg-5 offset-lg-1" data-aos="fade-left">
              <div className="rounded-4 p-4" style={{ backgroundColor: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                <div className="bg-white rounded-4 p-4 shadow-sm mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold text-dark mb-0">AI 분석 리포트</h6>
                    <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '11px' }}>주의</span>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted">전체 위험도</span>
                      <span className="fw-bold text-warning">65%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-warning" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: '#fef2f2' }}>
                      <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '12px' }} />
                      <span className="small text-danger">위약금 조항 누락</span>
                      <span className="badge bg-danger ms-auto" style={{ fontSize: '9px' }}>높음</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: '#fffbeb' }}>
                      <i className="bi bi-exclamation-circle-fill text-warning" style={{ fontSize: '12px' }} />
                      <span className="small text-warning">해지 조건 불명확</span>
                      <span className="badge bg-warning text-dark ms-auto" style={{ fontSize: '9px' }}>중간</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: '#f0fdf4' }}>
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '12px' }} />
                      <span className="small text-success">개인정보 조항 양호</span>
                      <span className="badge bg-success ms-auto" style={{ fontSize: '9px' }}>안전</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3 p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                      <i className="bi bi-chat-left-text text-white" style={{ fontSize: '10px' }} />
                    </div>
                    <span className="fw-bold small text-dark">AI에게 질문하기</span>
                  </div>
                  <div className="rounded-3 p-2 px-3" style={{ backgroundColor: '#f8f4ff' }}>
                    <p className="mb-0" style={{ fontSize: '12px', color: '#6b7280' }}>&ldquo;위약금 조항을 추가하려면 어떻게 해야 하나요?&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - AI 계약서 작성 (좌: 비주얼, 우: 텍스트) - 화이트 배경 */}
      <section className="position-relative overflow-hidden py-120">
        <div className="container">
          <div className="row align-items-center">
            {/* 비주얼: AI 대화 모크업 */}
            <div className="col-12 col-lg-5 mb-5 mb-lg-0 order-2 order-lg-1" data-aos="fade-right">
              <div className="rounded-4 p-4" style={{ backgroundColor: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>
                <div className="bg-white rounded-4 p-4 shadow-sm mb-3">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-robot text-white" style={{ fontSize: '14px' }} />
                    </div>
                    <span className="fw-bold text-dark small">Lawdy AI</span>
                    <span className="badge bg-success bg-opacity-10 text-success ms-auto" style={{ fontSize: '10px' }}>대화 중</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="rounded-3 p-2 px-3" style={{ backgroundColor: '#f8f4ff', maxWidth: '85%' }}>
                      <p className="mb-0 small text-dark">근로계약서를 작성해드릴게요. 회사명이 어떻게 되나요?</p>
                    </div>
                    <div className="rounded-3 p-2 px-3 ms-auto" style={{ backgroundColor: '#7c3aed', maxWidth: '75%' }}>
                      <p className="mb-0 small text-white">로우디입니다</p>
                    </div>
                    <div className="rounded-3 p-2 px-3" style={{ backgroundColor: '#f8f4ff', maxWidth: '85%' }}>
                      <p className="mb-0 small text-dark">감사합니다! 근로자 성함과 직무를 알려주세요.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3 p-3">
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">작성 진행률</span>
                    <span className="fw-bold text-primary">40%</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar" style={{ width: '40%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
                  </div>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: '10px' }}>갑 정보 완료</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '10px' }}>을 정보 입력 중</span>
                    <span className="badge bg-light text-muted" style={{ fontSize: '10px' }}>근로 조건</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 텍스트 */}
            <div className="col-12 col-lg-6 offset-lg-1 order-1 order-lg-2 mb-5 mb-lg-0" data-aos="fade-left">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="small-line" />
                <span className="btn-text text-primary">CONTRACT CREATION</span>
              </div>
              <h2 className="text-dark fw-bold mb-3">AI와 대화하며<br />계약서를 작성하세요</h2>
              <p className="text-secondary mb-4" style={{ lineHeight: '1.8' }}>
                복잡한 양식을 채울 필요 없이,<br />
                AI에게 상황을 설명하면 됩니다.<br />
                근로계약서, 용역계약서, NDA 등<br />
                6종의 계약서를 대화만으로 완성할 수 있습니다.
              </p>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">1</span>
                  </div>
                  <div>
                    <h6 className="text-dark fw-bold mb-1">계약서 유형 선택</h6>
                    <p className="text-secondary small mb-0">근로, 용역, NDA, 임대차, 프리랜서, 투자 중 선택</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">2</span>
                  </div>
                  <div>
                    <h6 className="text-dark fw-bold mb-1">AI 대화 또는 직접 입력</h6>
                    <p className="text-secondary small mb-0">AI가 필요한 정보를 하나씩 물어보고, 단계별로 안내합니다</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                    <span className="text-primary fw-bold small">3</span>
                  </div>
                  <div>
                    <h6 className="text-dark fw-bold mb-1">계약서 생성 & 다운로드</h6>
                    <p className="text-secondary small mb-0">완성된 계약서를 Word, PDF 등 원하는 형식으로 다운로드</p>
                  </div>
                </div>
              </div>
              <Link href="/mypage/contract" className="btn btn-linear hover-up">
                <span>무료로 계약서 작성하기</span>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - 세부 기능 그리드 */}
      <section className="position-relative overflow-hidden py-120" style={{ backgroundColor: '#fafafa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center gap-3 justify-content-center">
              <span className="small-line" />
              <span className="btn-text text-primary">MORE FEATURES</span>
              <span className="small-line" />
            </div>
            <h2 className="text-dark my-3 text-anime-style-2">
              Lawdy가 제공하는<br />
              모든 기능
            </h2>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={0}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-lightning-charge fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">5분 만에 완성</h5>
                  <p className="text-muted mb-0">
                    AI가 필요한 정보를 하나씩 물어봅니다.
                    복잡한 법률 용어를 몰라도 괜찮아요.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={100}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-shield-check fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">법률 전문가 검증</h5>
                  <p className="text-muted mb-0">
                    모든 템플릿은 변호사가 직접 검토했습니다.
                    대한민국 법률에 맞는 정확한 계약서를 제공합니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={200}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-sliders fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">AI 특약 추천</h5>
                  <p className="text-muted mb-0">
                    상황에 맞는 특약 조항을 AI가 추천해드립니다.
                    필요한 조항을 선택하여 바로 추가하세요.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={300}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-file-earmark-word fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">다양한 포맷 지원</h5>
                  <p className="text-muted mb-0">
                    PDF, Word 등 원하는 형식으로 다운로드하세요.
                    바로 인쇄하여 사용할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={400}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-lock fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">보안 & 암호화</h5>
                  <p className="text-muted mb-0">
                    모든 문서는 엔드-투-엔드 암호화로 보호됩니다.
                    업로드된 파일은 분석 후 안전하게 관리합니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={500}>
              <div className="card border-0 shadow-sm h-100 p-3 p-md-4 rounded-4 bg-white">
                <div className="card-body">
                  <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                    <i className="bi bi-collection fs-2 text-primary" />
                  </div>
                  <h5 className="mb-3">6종 계약서 지원</h5>
                  <p className="text-muted mb-0">
                    근로, 용역, NDA, 임대차, 프리랜서, 투자계약서.
                    필요한 유형을 선택하면 AI가 맞춤 작성합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - CTA */}
      <section className="position-relative overflow-hidden py-120 bg-dark">
        <div className="container position-relative z-1">
          <div className="text-center">
            <div className="d-flex align-items-center gap-3 justify-content-center">
              <span className="small-line bg-white" />
              <span className="btn-text text-white">지금 시작하세요</span>
              <span className="small-line bg-white" />
            </div>
            <h2 className="text-white my-3 text-anime-style-2">
              계약서, AI에게 맡기세요
            </h2>
            <p className="text-white opacity-75 fs-5 mt-4 mb-5">
              작성부터 분석까지, 5분이면 충분합니다.<br />
              지금 바로 무료로 체험해보세요.
            </p>
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <Link href="/mypage/contract" className="btn btn-linear btn-lg px-4 py-2 px-md-5 py-md-3 fw-bold hover-up">
                무료로 계약서 작성하기
              </Link>
              <Link href="/mypage" className="btn btn-outline-light btn-lg px-4 py-2 px-md-5 py-md-3 hover-up">
                계약서 분석하기
              </Link>
            </div>
          </div>
          <div className="row mt-80 justify-content-center">
            <div className="col-lg-10">
              <div className="row g-4 text-center">
                <div className="col-4 col-md-4" data-aos="fade-up">
                  <div className="p-4">
                    <h2 className="text-primary fw-bold mb-2">6종</h2>
                    <p className="text-white opacity-75 mb-0">지원 계약서 유형</p>
                  </div>
                </div>
                <div className="col-4 col-md-4" data-aos="fade-up" data-aos-delay={200}>
                  <div className="p-4">
                    <h2 className="text-primary fw-bold mb-2">95%+</h2>
                    <p className="text-white opacity-75 mb-0">AI 분석 정확도</p>
                  </div>
                </div>
                <div className="col-4 col-md-4" data-aos="fade-up" data-aos-delay={400}>
                  <div className="p-4">
                    <h2 className="text-primary fw-bold mb-2">5분</h2>
                    <p className="text-white opacity-75 mb-0">평균 작성 시간</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-50 translate-middle-x z-0 w-100">
          <img className="w-100" data-aos="fade-up" src="/assets/imgs/pages/ai-solutions/page-home/home-section-5/bg-bottom.png" alt="Lawdy" />
        </div>
      </section>
    </Layout>
  )
}
