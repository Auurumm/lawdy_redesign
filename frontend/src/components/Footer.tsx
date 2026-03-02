'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-[60px] md:mt-[100px] pb-8">
      {/* Desktop Footer */}
      <div className="hidden md:flex items-end justify-between px-[78px] max-w-[1280px] mx-auto">
        {/* Left Section */}
        <div className="flex flex-col gap-[34px]">
          <div className="flex flex-col gap-[34px]">
            {/* Footer Navigation */}
            <div className="flex items-center gap-12 whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">제품</span>
                <span className="text-gray-500">·</span>
                <Link href="/features" className="text-sm font-medium text-gray-500 hover:text-gray-900">기능</Link>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">회사</span>
                <span className="text-gray-500">·</span>
                <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-900">회사소개</Link>
                <span className="text-gray-500">·</span>
                <Link href="/careers" className="text-sm font-medium text-gray-500 hover:text-gray-900">채용</Link>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">지원</span>
                <span className="text-gray-500">·</span>
                <Link href="/support" className="text-sm font-medium text-gray-500 hover:text-gray-900">문의</Link>
                <span className="text-gray-500">·</span>
                <Link href="/faq" className="text-sm font-medium text-gray-500 hover:text-gray-900">FAQ</Link>
              </div>
            </div>

            {/* Logo - Sprite approach from Figma (smaller version) */}
            <Link href="/" className="flex items-center gap-[4.588px]">
              {/* Icon part */}
              <div className="h-[26px] relative w-[18.571px] overflow-hidden">
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
              <div className="h-[18.353px] relative w-[55.555px] overflow-hidden">
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
          </div>

          {/* Description and Copyright */}
          <div className="flex flex-col gap-[18px] text-xs font-semibold text-gray-500 leading-4">
            <p>
              AI 기반 계약 분석 플랫폼으로 법적 위험을<br />
              자동으로 식별합니다.
            </p>
            <p>© 2025 Contractlnsight. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-12 text-xs font-semibold text-gray-500">
          <Link href="#" className="hover:text-gray-900">개인정보처리방침</Link>
          <Link href="#" className="hover:text-gray-900">이용약관</Link>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden px-5 py-6 bg-[#f2f3f8]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[4.588px]">
          <div className="h-[26px] relative w-[18.571px] overflow-hidden">
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
          <div className="h-[18.353px] relative w-[55.555px] overflow-hidden">
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

        <div className="h-6" />

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full" />

        <div className="h-2" />

        {/* Category rows */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-900">제품</span>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <Link href="/features">기능</Link>
          </div>
        </div>

        <div className="h-2" />
        <div className="h-px bg-gray-200 w-full" />
        <div className="h-2" />

        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-900">회사</span>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <Link href="/about">회사소개</Link>
            <Link href="/careers">채용</Link>
          </div>
        </div>

        <div className="h-2" />
        <div className="h-px bg-gray-200 w-full" />
        <div className="h-2" />

        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-900">지원</span>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <Link href="/support">문의</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>

        <div className="h-2" />
        <div className="h-px bg-gray-200 w-full" />

        <div className="h-10" />

        {/* Description and Copyright */}
        <div className="flex flex-col gap-[18px] text-xs font-semibold text-gray-500 leading-4">
          <p>
            AI 기반 계약 분석 플랫폼으로 법적 위험을<br />
            자동으로 식별합니다.
          </p>
          <p>© 2025 Contractlnsight. All rights reserved.</p>
        </div>

        <div className="h-10" />

        {/* Policy Links */}
        <div className="flex items-center justify-end gap-4 text-xs font-semibold text-gray-500">
          <Link href="#">개인정보처리방침</Link>
          <Link href="#">이용약관</Link>
        </div>
      </div>
    </footer>
  );
}
