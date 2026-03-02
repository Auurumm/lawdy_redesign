import Link from "next/link";

export default function Section3() {
    return (
        <>
            {/*lawdy section 3 - 계약서 유형 선택*/}
            <section className="ai-solutions-home-section-3 position-relative overflow-hidden pb-120 pt-120 bg-dark">
                <div className="position-absolute top-0 end-0 z-0 m-8" data-aos="zoom-in">
                    <img className="flickering" src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/decor-bg.png" alt="Lawdy" />
                </div>
                <div className="container position-relative z-1">
                    <div className="text-center">
                        <div className="d-flex align-items-center gap-3 justify-content-center">
                            <span className="small-line" />
                            <span className="btn-text text-primary">계약서 템플릿</span>
                            <span className="small-line" />
                        </div>
                        <h2 className="text-white my-3 text-anime-style-3">
                            필요한 계약서를 선택하세요 <br />
                            AI가 맞춤형으로 작성해드립니다
                        </h2>
                    </div>
                    <div className="row g-md-5 g-3 mt-80">
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/employment" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={0}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-1.svg" alt="근로계약서" />
                                    <h6 className="mt-5 mb-3 text-white">근로계약서</h6>
                                    <p className="text-white">정규직, 계약직, 수습 등<br />다양한 고용 형태에 맞는<br />표준 근로계약서</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/service" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={200}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-2.svg" alt="용역계약서" />
                                    <h6 className="mt-5 mb-3 text-white">용역계약서</h6>
                                    <p className="text-white">프로젝트 기반 외주 용역,<br />IT 개발, 컨설팅 등 서비스 계약</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/nda" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={400}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-3.svg" alt="비밀유지계약서" />
                                    <h6 className="mt-5 mb-3 text-white">비밀유지계약서 (NDA)</h6>
                                    <p className="text-white">영업비밀, 기술정보 보호를 위한<br />기밀유지 계약</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/lease" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={600}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-4.svg" alt="임대차계약서" />
                                    <h6 className="mt-5 mb-3 text-white">임대차계약서</h6>
                                    <p className="text-white">주택, 상가, 오피스 등<br />부동산 임대차 계약</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/freelance" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={0}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-5.svg" alt="프리랜서계약서" />
                                    <h6 className="mt-5 mb-3 text-white">프리랜서 계약서</h6>
                                    <p className="text-white">개인 사업자, 프리랜서와의<br />업무 위탁 계약</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/sales" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={200}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-6.svg" alt="매매계약서" />
                                    <h6 className="mt-5 mb-3 text-white">매매계약서</h6>
                                    <p className="text-white">동산, 부동산, 지식재산권 등<br />자산 매매 계약</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/investment" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={400}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-7.svg" alt="투자계약서" />
                                    <h6 className="mt-5 mb-3 text-white">투자계약서</h6>
                                    <p className="text-white">스타트업 투자, 주주간 계약,<br />SAFE 계약 등</p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-3 col-6">
                            <Link href="/contract/partnership" className="text-decoration-none">
                                <div className="icon-flip" data-aos="fade-up" data-aos-delay={600}>
                                    <img src="/assets/imgs/pages/ai-solutions/page-home/home-section-3/icon-8.svg" alt="동업계약서" />
                                    <h6 className="mt-5 mb-3 text-white">동업계약서</h6>
                                    <p className="text-white">공동사업, 조합 설립,<br />이익 분배 등 동업 관련 계약</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}