'use client'
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import MobileMenu from "./MobileMenu"
import MainMenu from "./MainMenu"

export default function Header({ scroll, isMobileMenu, handleMobileMenu }: any) {
    const { user, logout } = useAuth()

    return (
        <>
            <header>
                <nav className={`navbar navbar-expand-lg navbar-dark z-5 ${scroll ? "navbar-stick top-0 position-fixed" : ""}`}>
                    <div className="container mt-3 mb-3">
                        <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
                            <Image src="/images/logo-full.png" alt="Lawdy" width={24} height={24} style={{ objectFit: 'contain' }} priority />
                            <h5 className="mb-0 text-white">Lawdy</h5>
                        </Link>
                        <div className="d-none d-lg-flex">
                            <MainMenu />
                        </div>
                        <div className="d-flex align-items-center gap-4">
                            {user ? (
                                <div className="d-none d-md-flex align-items-center gap-3">
                                    <Link href="/mypage" className="btn btn-linear hover-up">
                                        <span>마이페이지</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                            <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                                        </svg>
                                    </Link>
                                    <button onClick={logout} className="btn btn-outline-light btn-sm rounded-3">
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="btn btn-linear hover-up d-none d-md-flex">
                                    <span>로그인</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                        <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                                    </svg>
                                </Link>
                            )}
                            <div className="burger-icon burger-icon-white border rounded-3 top-0 end-0" onClick={handleMobileMenu}>
                                <span className="burger-icon-top" />
                                <span className="burger-icon-mid" />
                                <span className="burger-icon-bottom" />
                            </div>
                        </div>
                    </div>
                </nav>
                {/* offCanvas-menu */}
                <div className="offCanvas__info">
                    <div className="offCanvas__close-icon menu-close">
                        <button className="btn-close" aria-label="Close">
                            <i className="ri-close-line" />
                        </button>
                    </div>
                    <div className="offCanvas__logo mb-30">
                        <Link className="d-flex align-items-center gap-2" href="/">
                            <Image src="/images/logo-full.png" alt="Lawdy" width={24} height={24} style={{ objectFit: 'contain' }} />
                            <h5 className="mb-0 text-dark">Lawdy</h5>
                        </Link>
                    </div>
                    <div className="offCanvas__side-info mb-30">
                        <div className="contact-list mb-30">
                            <h4>이메일</h4>
                            <p>official.haedeun@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="offCanvas__overly" />
                <MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />
            </header>
        </>
    )
}
