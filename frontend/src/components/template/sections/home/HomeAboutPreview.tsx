'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomeAboutPreview() {
    return (
        <section className="position-relative overflow-hidden bg-white py-120">
            <div className="container">
                <div className="row align-items-center">
                    {/* Image Side */}
                    <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                        <div className="position-relative">
                            <div className="rounded-4 overflow-hidden" style={{ height: 'auto', minHeight: '240px', maxHeight: '360px' }}>
                                <Image
                                    src="/images/about-hero.png"
                                    alt="Lawdy Office"
                                    fill
                                    className="object-fit-cover"
                                    style={{ opacity: 0.85 }}
                                />
                                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: '#7c3aed', mixBlendMode: 'soft-light' }} />
                            </div>
                            <div className="position-relative position-lg-absolute bg-white rounded-4 p-3 shadow-lg mt-3 mt-lg-0" style={{ bottom: '-24px', left: '20px' }}>
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
                    {/* Text Side */}
                    <div className="col-12 col-lg-5 offset-lg-1">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span className="small-line" />
                            <span className="btn-text text-primary">ABOUT US</span>
                        </div>
                        <h2 className="text-dark fw-bold mb-3">Lawdy를 소개합니다</h2>
                        <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                            <span className="text-primary fw-semibold">Lawdy</span>는 지혜로운 눈으로{' '}<br />
                            계약을 바라봅니다.<br />
                            복잡한 법률 문서 속에서 핵심을 정확히 짚어내고,<br />
                            고객이 보다 안전하고 유리한 계약을{' '}<br />
                            체결할 수 있도록 돕는 것이 우리의 미션입니다.
                        </p>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-shield-check fs-5 text-primary" />
                                    <span className="fw-medium text-dark small">신뢰와 안전</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-lightning-charge fs-5 text-primary" />
                                    <span className="fw-medium text-dark small">빠른 분석</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-people fs-5 text-primary" />
                                    <span className="fw-medium text-dark small">전문가 협업</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-graph-up-arrow fs-5 text-primary" />
                                    <span className="fw-medium text-dark small">지속적 개선</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/about" className="btn btn-linear hover-up">
                            <span>더 알아보기</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
