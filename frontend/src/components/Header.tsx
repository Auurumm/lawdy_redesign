'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/features', label: '기능소개' },
    { href: '/about', label: '회사소개' },
    { href: '/mypage', label: '법률 AI 분석' },
    { href: '/support', label: '고객지원' },
  ];

  return (
    <>
      <header className="w-full px-5 md:px-[78px] py-4 md:py-6 bg-[#f2f3f8]">
        <div className="flex items-center justify-between max-w-[1124px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            {/* Icon part */}
            <div className="h-[34px] relative w-[24.286px] overflow-hidden">
              <Image
                src="/images/logo-icon.png"
                alt="Lawdy Logo"
                width={1080}
                height={1080}
                className="absolute max-w-none"
                style={{
                  height: '188.1%',
                  width: '263.33%',
                  left: '-80%',
                  top: '-25%'
                }}
              />
            </div>
            {/* Text part */}
            <div className="h-[24px] relative w-[72.649px] overflow-hidden">
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={1080}
                height={1080}
                className="absolute max-w-none"
                style={{
                  height: '427.03%',
                  width: '141.07%',
                  left: '-19.64%',
                  top: '-283.78%'
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-2.5 text-sm font-semibold transition-colors ${
                  pathname === link.href || (link.href === '/mypage' && pathname.startsWith('/mypage'))
                    ? 'text-primary'
                    : 'text-gray-900 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Auth Buttons - 로그인 상태에 따라 다르게 표시 */}
            {loading ? (
              <div className="w-16 h-6 bg-[#e1e3ea] rounded-full animate-pulse" />
            ) : user ? (
              <>
                <span className="hidden md:inline text-sm font-medium text-gray-900">
                  {user.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="px-1.5 md:px-2 py-1 text-xs md:text-sm font-medium text-gray-900 bg-white border-2 border-[#e1e3ea] rounded-full hover:bg-gray-50 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-1.5 md:px-2 py-1 text-xs md:text-sm font-medium text-gray-900 bg-white border-2 border-[#e1e3ea] rounded-full hover:bg-gray-50 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-1.5 md:px-2 py-1 text-xs md:text-sm font-medium text-white bg-primary rounded-full hover:bg-blue-700 transition-colors"
                >
                  가입하기
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-6 h-6 flex items-center justify-center ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="메뉴 열기"
            >
              <Image
                src="/images/icon-menu.svg"
                alt="메뉴"
                width={16}
                height={8}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}