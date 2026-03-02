import Link from "next/link";

export default function Section7() {
    return (
        <>
            {/*lawdy section 7 - FAQ*/}
            <section className="ai-solutions-home-section-7 position-relative overflow-hidden py-120 bg-dark">
                <img className="position-absolute top-0 start-0" data-aos="fade-right" data-aos-delay={400} src="/assets/imgs/pages/ai-solutions/page-home/home-section-7/bg-top.png" alt="Lawdy" />
                <img className="position-absolute bottom-0 end-0" data-aos="fade-left" data-aos-delay={400} src="/assets/imgs/pages/ai-solutions/page-home/home-section-7/bg-bottom.png" alt="Lawdy" />
                <div className="container position-relative z-1">
                    <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                            <span className="small-line" />
                            <span className="btn-text text-primary">자주 묻는 질문</span>
                            <span className="small-line" />
                        </div>
                        <h2 className="text-white mt-3 mb-8 text-anime-style-2">궁금한 점을 확인하세요</h2>
                    </div>
                    <div className="row flex-wrap align-items-end wow img-custom-anim-left">
                        <div className="col-lg-12 col-md-12">
                            <div className="accordion-2">
                                <div className="px-0 card border-bottom-0 rounded-bottom-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-3 bg-transparent">
                                        <Link className="collapsed p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse1">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">AI가 만든 계약서, 법적 효력이 있나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse1" className="collapse" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            네, 법적 효력이 있습니다. 로우디의 계약서 템플릿은 모두 법률 전문가가 검토한 표준 양식을 기반으로 합니다.
                                            다만, 중요한 계약의 경우 전문가 검토를 권장드립니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-0 card border-bottom-0 rounded-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-3 bg-transparent">
                                        <Link className="p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse2">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">계약서 작성에 얼마나 걸리나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse2" className="collapse show" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            기본 정보만 입력하면 약 5분 내에 계약서가 완성됩니다.
                                            특약 조항 추가나 세부 수정을 하더라도 10분 이내면 충분합니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-0 card border-bottom-0 rounded-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-3 bg-transparent">
                                        <Link className="collapsed p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse3">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">작성한 계약서를 수정할 수 있나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse3" className="collapse" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            물론입니다. 생성된 계약서는 온라인 에디터에서 자유롭게 수정할 수 있습니다.
                                            또한 Word 파일로 다운로드하여 직접 편집하는 것도 가능합니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-0 card border-bottom-0 rounded-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-3 bg-transparent">
                                        <Link className="collapsed p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse4">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">개인정보는 안전하게 보호되나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse4" className="collapse" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            로우디는 금융권 수준의 보안 시스템을 갖추고 있습니다.
                                            모든 데이터는 암호화되어 저장되며, 사용자 동의 없이 제3자에게 제공되지 않습니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-0 card border-bottom-0 rounded-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-3 bg-transparent">
                                        <Link className="collapsed p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse5">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">무료로 이용할 수 있나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse5" className="collapse" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            기본 계약서 미리보기는 무료입니다.
                                            전체 계약서 다운로드 및 고급 기능 이용은 요금제에 따라 제공됩니다.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-0 card rounded-top-0 collapse-custom bg-transparent">
                                    <div className="p-0 card-header border-0 rounded-bottom-3 bg-transparent">
                                        <Link className="collapsed p-4 fw-bold d-flex align-items-center" data-bs-toggle="collapse" href="#collapse6">
                                            <h6 className="text-primary mb-0">
                                                <span className="text-white">기업용 서비스도 있나요?</span>
                                            </h6>
                                            <span className="ms-auto arrow" />
                                        </Link>
                                    </div>
                                    <div id="collapse6" className="collapse rounded-bottom-3" data-bs-parent=".accordion-2">
                                        <p className="px-3 fs-6 fw-regular text-white opacity-75">
                                            네, 기업 맞춤형 플랜을 제공합니다.
                                            대량 계약서 생성, 사내 템플릿 관리, 팀 협업 기능 등을 이용하실 수 있습니다.
                                        </p>
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