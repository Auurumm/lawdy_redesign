import Link from "next/link";

export default function Section5() {
    return (
        <>
            {/*lawdy section 5 - CTA*/}
            <section className="ai-solutions-home-section-5 position-relative overflow-hidden py-120 bg-dark">
                <div className="container position-relative z-1">
                    <div className="text-center">
                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <span className="small-line bg-white" />
                            <span className="btn-text text-white">지금 시작하세요</span>
                            <span className="small-line bg-white" />
                        </div>
                        <h2 className="text-white my-3 text-anime-style-2">
                            계약서 작성,<br />더 이상 어렵지 않아요
                        </h2>
                        <p className="text-white opacity-75 fs-5 mt-4 mb-5">
                            5분 만에 전문가 수준의 계약서를 완성하세요.<br />
                            첫 계약서는 무료로 제공됩니다.
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                            <Link href="/mypage/contract" className="btn btn-linear btn-lg px-5 py-3 fw-bold">
                                무료로 시작하기
                            </Link>
                            <Link href="/pricing" className="btn btn-outline-light btn-lg px-5 py-3">
                                요금제 보기
                            </Link>
                        </div>
                    </div>

                    <div className="row mt-80 justify-content-center">
                        <div className="col-lg-10">
                            <div className="row g-4 text-center">
                                <div className="col-md-4">
                                    <div className="p-4">
                                        <h2 className="text-primary fw-bold mb-2" data-aos="fade-up">50,000+</h2>
                                        <p className="text-white opacity-75 mb-0">생성된 계약서</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4">
                                        <h2 className="text-primary fw-bold mb-2" data-aos="fade-up" data-aos-delay={200}>15,000+</h2>
                                        <p className="text-white opacity-75 mb-0">이용 기업</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-4">
                                        <h2 className="text-primary fw-bold mb-2" data-aos="fade-up" data-aos-delay={400}>4.9/5.0</h2>
                                        <p className="text-white opacity-75 mb-0">고객 만족도</p>
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
        </>
    );
}