import Link from "next/link"

export default function Footer() {
    return (
        <footer>
            <div className="section-footer-4 position-relative overflow-hidden bg-dark">
                <img className="position-absolute bottom-0 end-0" data-aos="fade-left" data-aos-delay={400} src="/assets/imgs/pages/ai-solutions/page-home/home-section-7/bg-bottom.png" alt="Lawdy" />
                <div className="container-fluid">
                    <div className="container position-relative z-2">
                        <div className="py-120 d-flex flex-wrap gap-4 justify-content-between">
                            <div>
                                <h3 className="text-primary btn-text pb-3">서비스</h3>
                                <div className="d-flex flex-column align-items-start">
                                    <Link href="/mypage/contract"><p>계약서 작성</p></Link>
                                    <Link href="/features"><p>기능소개</p></Link>
                                    <Link href="/mypage"><p>법률 AI 분석</p></Link>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-primary btn-text pb-3">회사</h3>
                                <div className="d-flex flex-column align-items-start">
                                    <Link href="/about"><p>회사소개</p></Link>
                                    <Link href="/careers"><p>채용</p></Link>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-primary btn-text pb-3">지원</h3>
                                <div className="d-flex flex-column align-items-start">
                                    <Link href="/support"><p>고객 문의</p></Link>
                                    <Link href="/faq"><p>자주 묻는 질문</p></Link>
                                    <Link href="/terms"><p>이용약관</p></Link>
                                    <Link href="/privacy"><p>개인정보처리방침</p></Link>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-primary btn-text pb-3">연락처</h3>
                                <div className="d-flex flex-column align-items-start">
                                    <p>official.haedeun@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-lg-row gap-3 align-items-center py-4 border-top justify-content-between">
                            <p className="m-0 text-center">
                                Copyright &copy; <span className="text-white fw-medium">Lawdy</span> {new Date().getFullYear()}, All Rights Reserved
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
