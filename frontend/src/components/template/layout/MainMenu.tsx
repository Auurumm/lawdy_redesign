"use client"
import Link from "next/link"

export default function MainMenu() {
    return (
        <ul className="navbar-nav mx-auto gap-4 align-items-lg-center">
            <li className="nav-item">
                <Link className="nav-link text-uppercase" href="/">
                    <span>홈</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link text-uppercase" href="/about">
                    <span>소개</span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link text-uppercase" href="/features">
                    <span>서비스</span>
                </Link>
            </li>
            <li className="nav-item dropdown menu-item-has-children">
                <Link className="nav-link text-uppercase" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>법률 AI 분석</span>
                </Link>
                <ul className="dropdown-menu">
                    <li>
                        <Link className="dropdown-item text-capitalize" href="/mypage">
                            <span>계약서 분석</span>
                        </Link>
                    </li>
                    <li>
                        <Link className="dropdown-item text-capitalize" href="/mypage/contract">
                            <span>계약서 작성</span>
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="nav-item dropdown menu-item-has-children">
                <Link className="nav-link text-uppercase" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>고객지원</span>
                </Link>
                <ul className="dropdown-menu">
                    <li>
                        <Link className="dropdown-item text-capitalize" href="/support">
                            <span>문의하기</span>
                        </Link>
                    </li>
                    <li>
                        <Link className="dropdown-item text-capitalize" href="/faq">
                            <span>자주 묻는 질문</span>
                        </Link>
                    </li>
                </ul>
            </li>
        </ul>
    )
}
