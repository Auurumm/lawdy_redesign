import type { Metadata } from "next";
import { Libre_Franklin, Rubik } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const libreFranklin = Libre_Franklin({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--tc-heading-font-family",
  display: "swap",
});

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--tc-body-font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lawdy - AI 계약 분석 플랫폼",
  description: "AI로 분석하는 스마트한 계약 파트너, Lawdy. 계약의 법적 위험을 자동으로 식별하고 시각화합니다.",
  keywords: ["계약 분석", "AI", "법적 위험", "계약서 검토", "Lawdy"],
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  metadataBase: new URL("https://lawdy.cloud"),
  openGraph: {
    title: "Lawdy - AI 계약 분석 플랫폼",
    description: "AI로 분석하는 스마트한 계약 파트너, Lawdy. 계약의 법적 위험을 자동으로 식별하고 시각화합니다.",
    images: [{ url: "/images/about-hero.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Vendor CSS */}
        <link rel="stylesheet" href="/assets/css/vendors/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/vendors/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/vendors/aos.css" />
        <link rel="stylesheet" href="/assets/css/vendors/carouselTicker.css" />
        <link rel="stylesheet" href="/assets/css/vendors/odometer.css" />
        <link rel="stylesheet" href="/assets/css/vendors/magnific-popup.css" />
        {/* Icon Fonts */}
        <link rel="stylesheet" href="/assets/fonts/bootstrap-icons/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/boxicons/boxicons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/remixicon/remixicon.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/solid.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/regular.min.css" />
        {/* Template CSS */}
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className={`font-pretendard antialiased ${libreFranklin.variable} ${rubik.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
