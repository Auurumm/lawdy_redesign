export default function Section2() {
    return (
        <>
            {/*lawdy section 2 - 서비스 특징*/}
            <section className="ai-solutions-home-section-2 position-relative overflow-hidden py-120">
                <div className="container position-relative z-1">
                    <div className="text-center">
                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <span className="small-line" />
                            <span className="btn-text text-primary">왜 로우디인가요?</span>
                            <span className="small-line" />
                        </div>
                        <h2 className="text-dark my-3 text-anime-style-3">
                            법률 전문가의 노하우를 담은 <br />
                            AI 계약서 자동 생성
                        </h2>
                    </div>
                    <div className="row g-4 mt-80">
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={0}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-lightning-charge fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">5분 만에 완성</h5>
                                    <p className="text-muted mb-0">
                                        몇 가지 질문에 답하면<br />
                                        AI가 자동으로 계약서를 작성합니다.<br />
                                        복잡한 법률 용어를 몰라도 괜찮아요.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={200}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-shield-check fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">법률 전문가 검증</h5>
                                    <p className="text-muted mb-0">
                                        모든 템플릿은 변호사가 직접 검토했습니다.<br />
                                        대한민국 법률에 맞는<br />
                                        정확한 계약서를 제공합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={400}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-sliders fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">맞춤형 조항 생성</h5>
                                    <p className="text-muted mb-0">
                                        상황에 맞는 특약 조항을<br />
                                        AI가 추천해드립니다.<br />
                                        필요한 조항을 선택하여 추가할 수 있어요.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={0}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-file-earmark-word fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">다양한 포맷 지원</h5>
                                    <p className="text-muted mb-0">
                                        PDF, Word, HWP 등<br />
                                        원하는 형식으로 다운로드하세요.<br />
                                        바로 인쇄하여 사용할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={200}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-clock-history fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">계약서 관리</h5>
                                    <p className="text-muted mb-0">
                                        작성한 계약서를<br />
                                        안전하게 보관하고 관리하세요.<br />
                                        계약 만료일 알림도 받아볼 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card border-0 shadow-sm h-100 p-4 rounded-4" data-aos="fade-up" data-aos-delay={400}>
                                <div className="card-body">
                                    <div className="icon-shape icon-80 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4">
                                        <i className="bi bi-headset fs-2 text-primary"></i>
                                    </div>
                                    <h5 className="mb-3">전문가 상담 연결</h5>
                                    <p className="text-muted mb-0">
                                        복잡한 계약이 필요하시면<br />
                                        법률 전문가와 바로 상담을 진행할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}