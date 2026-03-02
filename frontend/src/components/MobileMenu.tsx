'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const navLinks = [
    { href: '/features', label: '기능소개' },
    { href: '/about', label: '회사소개' },
    { href: '/mypage', label: '법률 AI 분석' },
    { href: '/support', label: '고객지원' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <Link href="/" onClick={onClose} className="flex items-center gap-1.5">
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
          </Link>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="메뉴 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info (로그인 상태일 때) */}
        {user && (
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-medium text-gray-900">{user.name}님</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-5">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href || (link.href === '/mypage' && pathname.startsWith('/mypage'))
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
              >
                가입하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}