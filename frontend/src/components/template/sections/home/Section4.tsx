export default function Section4() {
    return (
        <>
            {/*lawdy section 4 - 이용 방법*/}
            <section className="ai-solutions-home-section-4 position-relative overflow-hidden pt-120 pb-120">
                <div className="container position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 pe-lg-8">
                            <div className="d-flex align-items-center gap-3">
                                <span className="small-line" />
                                <span className="btn-text text-primary">이용 방법</span>
                            </div>
                            <h2 className="text-dark mt-3 mb-5 text-anime-style-2">
                                3단계로 완성되는<br />계약서 작성
                            </h2>

                            <div className="d-flex gap-4 mb-4" data-aos="fade-up" data-aos-delay={0}>
                                <div className="flex-shrink-0">
                                    <div className="icon-shape icon-60 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4">
                                        1
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-2">계약서 유형 선택</h5>
                                    <p className="text-muted mb-0">
                                        근로계약서, 용역계약서, NDA 등 필요한 계약서 종류를 선택합니다.
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex gap-4 mb-4" data-aos="fade-up" data-aos-delay={200}>
                                <div className="flex-shrink-0">
                                    <div className="icon-shape icon-60 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4">
                                        2
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-2">정보 입력</h5>
                                    <p className="text-muted mb-0">
                                        계약 당사자, 기간, 금액 등 기본 정보를 입력하면 AI가 조항을 자동 생성합니다.
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex gap-4 mb-4" data-aos="fade-up" data-aos-delay={400}>
                                <div className="flex-shrink-0">
                                    <div className="icon-shape icon-60 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-4">
                                        3
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mb-2">검토 및 다운로드</h5>
                                    <p className="text-muted mb-0">
                                        생성된 계약서를 검토하고 수정한 뒤, 원하는 형식으로 다운로드하세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 order-3 mt-lg-0 mt-8 wow img-custom-anim-left">
                            <div className="position-relative d-inline-block">
                                <img className="rounded-4" src="/assets/imgs/pages/ai-solutions/page-home/home-section-4/img-1.png" alt="Lawdy 계약서 작성 화면" />
                                <div className="position-absolute top-0 start-0 m-4 bg-white rounded-3 p-3 shadow" data-aos="fade-right">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                                        <span className="fw-semibold">계약서 생성 완료!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}