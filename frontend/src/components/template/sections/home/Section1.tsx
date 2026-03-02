import Link from "next/link";

export default function Section1() {
    return (
        <>
            {/*lawdy home section 1 - 히어로*/}
            <section className="ai-solutions-home-section-1 position-relative overflow-hidden pt-200 pb-250">
                <div className="position-absolute top-50 start-50 translate-middle">
                    <img className="ribbonRotate" src="/assets/imgs/pages/ai-solutions/page-home/home-section-1/wave-circle-img.png" alt="Lawdy" />
                </div>
                <div className="container position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-10 mx-auto">
                            <h1 className="text-white fs-120 mb-0 text-anime-style-2">계약서, 자동으로</h1>
                            <h1 className="text-white fs-120 mb-0 text-lg-end text-anime-style-1">완성하세요.</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8 mx-auto mt-4">
                            <p className="text-white text-center fs-5 opacity-75">
                                AI가 법률 전문가 수준의 계약서를 몇 분 만에 작성해드립니다
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 mx-auto mt-5">
                            <form className="input-group mb-3 mt-4 position-relative" data-aos="zoom-in" data-aos-delay={100}>
                                <input type="text" className="py-3 form-control generate rounded-start-4 border-end-0 border-primary" name="name" placeholder="어떤 계약서가 필요하신가요? (예: 근로계약서)" />
                                <div className="border border-start-0 border-primary rounded-end-4 bg-white">
                                    <button className="btn btn-linear m-2 fs-7 fw-bold" type="submit" aria-label="generate" data-aos="fade-zoom-in" data-aos-delay={100}>
                                        시작하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8 mx-auto mt-3">
                            <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                                <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                    <i className="bi bi-check-circle me-2"></i>근로계약서
                                </span>
                                <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                    <i className="bi bi-check-circle me-2"></i>용역계약서
                                </span>
                                <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                    <i className="bi bi-check-circle me-2"></i>비밀유지계약서
                                </span>
                                <span className="badge bg-white bg-opacity-10 text-white px-3 py-2 rounded-pill">
                                    <i className="bi bi-check-circle me-2"></i>임대차계약서
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="info-group position-absolute top-50 start-0 translate-middle-y d-none d-md-block">
                    <div className="d-flex align-items-center justify-content-center gap-4 rotate-90">
                        <Link href="#" className="fs-7 text-white">
                            contact@lawdy.co.kr
                        </Link>
                        <Link href="telto:02-1234-5678" className="fs-7 text-white">
                            02-1234-5678
                        </Link>
                    </div>
                </div>
                <div className="socials-group position-absolute top-50 end-0 translate-middle-y d-none d-md-block z-2">
                    <div className="socials rotate-90 px-3 py-2 rounded-pill d-inline-flex d-flex align-items-center justify-content-center">
                        <p className="text-white mb-0">법률사무소 운영</p>
                    </div>
                </div>
            </section>
        </>
    );
}