import Link from "next/link";

export default function Section1() {
    return (
        <>
            <section className="position-relative overflow-hidden py-120">
                <div className="container">
                    <div className="text-center mb-5">
                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <span className="small-line" />
                            <span className="btn-text text-primary">SUPPORT</span>
                            <span className="small-line" />
                        </div>
                        <h2 className="my-3 text-anime-style-2">무엇을 도와드릴까요?</h2>
                        <p className="text-secondary mx-auto" style={{ maxWidth: '480px' }}>
                            궁금한 점이 있으시면 언제든 문의해주세요. 전문 상담팀이 24시간 내에 답변드립니다.
                        </p>
                    </div>
                    <div className="row g-4 justify-content-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up" data-aos="fade-up" data-aos-delay={0}>
                                <div className="card-body text-center d-flex flex-column">
                                    <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                                        <i className="bi bi-envelope fs-4 text-white" />
                                    </div>
                                    <h5 className="text-white mb-2">이메일 문의</h5>
                                    <p className="text-white-50 mb-3">서비스, 기능, 요금 등 궁금한 점을 편하게 보내주세요.</p>
                                    <p className="text-primary fw-semibold mb-3">official.haedeun@gmail.com</p>
                                    <Link href="mailto:official.haedeun@gmail.com" className="btn btn-outline-light btn-sm rounded-3 mt-auto">
                                        무료 상담하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up" data-aos="fade-up" data-aos-delay={200}>
                                <div className="card-body text-center d-flex flex-column">
                                    <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                                        <i className="bi bi-question-circle fs-4 text-white" />
                                    </div>
                                    <h5 className="text-white mb-2">자주 묻는 질문</h5>
                                    <p className="text-white-50 mb-3">많은 분들이 궁금해하시는 질문과 답변을 모았습니다.</p>
                                    <p className="text-primary fw-semibold mb-3">일반, 기술, 요금 안내</p>
                                    <Link href="/faq" className="btn btn-outline-light btn-sm rounded-3 mt-auto">
                                        궁금한 점 확인하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up" data-aos="fade-up" data-aos-delay={400}>
                                <div className="card-body text-center d-flex flex-column">
                                    <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                                        <i className="bi bi-clock-history fs-4 text-white" />
                                    </div>
                                    <h5 className="text-white mb-2">빠른 응답</h5>
                                    <p className="text-white-50 mb-3">일반적으로 24시간 이내에 회신드립니다.</p>
                                    <p className="text-primary fw-semibold mb-3">평일 09:00 ~ 18:00</p>
                                    <span className="btn btn-outline-light btn-sm rounded-3 mt-auto opacity-75">
                                        응답 대기 중
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
