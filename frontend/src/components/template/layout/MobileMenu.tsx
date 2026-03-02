"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface MobileMenuProps {
    isMobileMenu: boolean
    handleMobileMenu: () => void
}

export default function MobileMenu({ isMobileMenu, handleMobileMenu }: MobileMenuProps) {
    const [isAccordion, setIsAccordion] = useState<number | null>(null)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const handleAccordion = (key: number) => {
        setIsAccordion((prevState) => (prevState === key ? null : key))
    }

    useEffect(() => {
        if (isMobileMenu) {
            handleMobileMenu()
        }
    }, [pathname])

    return (
        <>
            {isMobileMenu && <div className="mobile-menu-overlay" onClick={handleMobileMenu} />}
            <div className={`mobile-header-active mobile-header-wrapper-style ${isMobileMenu ? "sidebar-visible" : ""}`}>
                <div className="mobile-header-wrapper-inner">
                    <div className="mobile-header-logo">
                        <Link className="d-flex align-items-center gap-2" href="/">
                            <Image src="/images/logo-full.png" alt="Lawdy" width={24} height={24} style={{ objectFit: 'contain' }} />
                            <h5 className="mb-0">Lawdy</h5>
                        </Link>
                        <div className={`burger-icon burger-icon-white border rounded-circle ${isMobileMenu ? "burger-close" : ""}`} onClick={handleMobileMenu}>
                            <span className="burger-icon-top" />
                            <span className="burger-icon-mid" />
                            <span className="burger-icon-bottom" />
                        </div>
                    </div>
                    <div className="mobile-header-content-area">
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav>
                                    <ul className="mobile-menu ps-0">
                                        <li><Link href="/">홈</Link></li>
                                        <li><Link href="/about">소개</Link></li>
                                        <li><Link href="/features">서비스</Link></li>
                                        <li className="has-children">
                                            <span className="menu-expand" onClick={() => handleAccordion(1)}>
                                                <i className="arrow-small-down" />
                                            </span>
                                            <Link href="#">법률 AI 분석</Link>
                                            <ul className="sub-menu" style={{ display: `${isAccordion == 1 ? "block" : "none"}` }}>
                                                <li><Link href="/mypage">계약서 분석</Link></li>
                                                <li><Link href="/mypage/contract">계약서 작성</Link></li>
                                            </ul>
                                        </li>
                                        <li className="has-children">
                                            <Link href="#">고객지원</Link>
                                            <span className="menu-expand" onClick={() => handleAccordion(2)}>
                                                <i className="arrow-small-down" />
                                            </span>
                                            <ul className="sub-menu" style={{ display: `${isAccordion == 2 ? "block" : "none"}` }}>
                                                <li><Link href="/support">문의하기</Link></li>
                                                <li><Link href="/faq">자주 묻는 질문</Link></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="tgmobile__menu-bottom mt-auto">
                        <div className="contact-info">
                            {user ? (
                                <div className="d-flex flex-column gap-2 mb-3">
                                    <span className="fw-medium">{user.name}님 환영합니다</span>
                                    <Link href="/mypage" className="btn btn-linear btn-sm">마이페이지</Link>
                                    <button onClick={logout} className="btn btn-outline-light btn-sm">로그아웃</button>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2 mb-3">
                                    <Link href="/login" className="btn btn-linear btn-sm">로그인</Link>
                                    <Link href="/signup" className="btn btn-outline-light btn-sm">무료 가입하기</Link>
                                </div>
                            )}
                        </div>
                        <div className="contact-info">
                            <ul className="list-wrap">
                                <li>
                                    <span className="opacity-50">이메일:</span> <Link href="mailto:official.haedeun@gmail.com">official.haedeun@gmail.com</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
