'use client'

import Link from 'next/link'

export default function HomeSupportPreview() {
    return (
        <section className="position-relative overflow-hidden bg-white py-120">
            <div className="container">
                <div className="text-center mb-5">
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                        <span className="small-line" />
                        <span className="btn-text text-primary">SUPPORT</span>
                        <span className="small-line" />
                    </div>
                    <h2 className="text-dark fw-bold mb-3">고객지원</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '480px' }}>
                        Lawdy 이용 중 궁금한 점이 있으시면<br />
                        언제든 연락해주세요.<br />
                        전문 상담팀이 신속하게 도와드리겠습니다.
                    </p>
                </div>
                <div className="row g-4 justify-content-center">
                    {/* 문의하기 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                            <div className="card-body d-flex flex-column">
                                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                                    <i className="bi bi-envelope fs-4 text-primary" />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">이메일 문의</h5>
                                <p className="text-muted small mb-3">서비스 이용, 기능 문의 등 궁금한 점을 편하게 보내주세요.</p>
                                <p className="text-primary fw-medium small mb-4">official.haedeun@gmail.com</p>
                                <Link href="/support" className="btn btn-outline-primary rounded-3 mt-auto">
                                    무료 상담하기
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* FAQ */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                            <div className="card-body d-flex flex-column">
                                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                                    <i className="bi bi-question-circle fs-4 text-primary" />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">자주 묻는 질문</h5>
                                <p className="text-muted small mb-3">많은 분들이 궁금해하시는 질문과 답변을 모아두었습니다.</p>
                                <p className="text-primary fw-medium small mb-4">일반, 기술, 요금 안내</p>
                                <Link href="/faq" className="btn btn-outline-primary rounded-3 mt-auto">
                                    궁금한 점 확인하기
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* 채용 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 h-100 text-center p-4">
                            <div className="card-body d-flex flex-column">
                                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
                                    <i className="bi bi-briefcase fs-4 text-primary" />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">함께할 사람</h5>
                                <p className="text-muted small mb-3">법률과 기술의 미래를<br />함께 만들어갈 인재를 찾고 있습니다.</p>
                                <p className="text-primary fw-medium small mb-4">법률, 개발, 기획 분야</p>
                                <Link href="/careers" className="btn btn-outline-primary rounded-3 mt-auto">
                                    함께할 기회 보기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
