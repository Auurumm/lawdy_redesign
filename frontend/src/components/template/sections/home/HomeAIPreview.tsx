'use client'

import Link from 'next/link'

export default function HomeAIPreview() {
    return (
        <section className="position-relative overflow-hidden bg-dark-1 py-120">
            <div className="container">
                <div className="row align-items-center">
                    {/* Text Side */}
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span className="small-line" />
                            <span className="btn-text text-primary">AI ANALYSIS</span>
                        </div>
                        <h2 className="text-white fw-bold mb-3">법률 AI 분석</h2>
                        <p className="text-white opacity-75 mb-4" style={{ lineHeight: '1.8' }}>
                            계약서를 업로드하면 AI가 자동으로<br />
                            핵심 조항을 분석하고,<br />
                            잠재적 위험 요소를 식별합니다.<br />
                            복잡한 법률 문서도 수 분 내에<br />
                            명확한 리포트로 변환됩니다.
                        </p>
                        <div className="d-flex flex-column gap-3 mb-4">
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                                    <span className="text-primary fw-bold small">1</span>
                                </div>
                                <div>
                                    <h6 className="text-white fw-bold mb-1">PDF 업로드</h6>
                                    <p className="text-white opacity-50 small mb-0">분석할 계약서 파일을 드래그 앤 드롭으로 간편하게 업로드</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                                    <span className="text-primary fw-bold small">2</span>
                                </div>
                                <div>
                                    <h6 className="text-white fw-bold mb-1">AI 자동 분석</h6>
                                    <p className="text-white opacity-50 small mb-0">Solar LLM이 계약서의 조항별 위험도를 자동으로 평가</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-start gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '36px', height: '36px', border: '2px solid #7c3aed' }}>
                                    <span className="text-primary fw-bold small">3</span>
                                </div>
                                <div>
                                    <h6 className="text-white fw-bold mb-1">리포트 확인</h6>
                                    <p className="text-white opacity-50 small mb-0">위험 항목, 권장사항을 포함한 상세 분석 리포트 제공</p>
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
                    {/* Visual Side */}
                    <div className="col-lg-5 offset-lg-1">
                        <div className="rounded-4 p-4 p-lg-5" style={{ backgroundColor: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                            {/* Mock Analysis Card */}
                            <div className="bg-white rounded-4 p-4 shadow-sm mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="fw-bold text-dark mb-0">분석 리포트</h6>
                                    <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '11px' }}>주의</span>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">위험도</span>
                                        <span className="fw-bold text-warning">65%</span>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div className="progress-bar bg-warning" style={{ width: '65%' }} />
                                    </div>
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    <span className="badge bg-danger bg-opacity-10 text-danger" style={{ fontSize: '11px' }}>위약금 조항 누락</span>
                                    <span className="badge bg-warning bg-opacity-10 text-warning" style={{ fontSize: '11px' }}>해지 조건 불명확</span>
                                    <span className="badge bg-success bg-opacity-10 text-success" style={{ fontSize: '11px' }}>개인정보 조항 양호</span>
                                </div>
                            </div>
                            {/* Stats Row */}
                            <div className="row g-2 text-center">
                                <div className="col-4">
                                    <div className="bg-white rounded-3 p-3">
                                        <h5 className="fw-bold text-primary mb-0">3</h5>
                                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>위험 항목</p>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="bg-white rounded-3 p-3">
                                        <h5 className="fw-bold text-primary mb-0">5</h5>
                                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>권장사항</p>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="bg-white rounded-3 p-3">
                                        <h5 className="fw-bold text-primary mb-0">12s</h5>
                                        <p className="text-muted mb-0" style={{ fontSize: '11px' }}>분석 시간</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
