import Layout from "@/components/template/layout/Layout"
import Section1 from "@/components/template/sections/home/Section1"
import Section2 from "@/components/template/sections/home/Section2"
import Section3 from "@/components/template/sections/home/Section3"
import Section4 from "@/components/template/sections/home/Section4"
import Section5 from "@/components/template/sections/home/Section5"
import Section7 from "@/components/template/sections/home/Section7"
import HomeAboutPreview from "@/components/template/sections/home/HomeAboutPreview"
import HomeAIPreview from "@/components/template/sections/home/HomeAIPreview"
import HomeSupportPreview from "@/components/template/sections/home/HomeSupportPreview"

export default function Home() {
  return (
    <Layout>
      {/* 홈 - 히어로 */}
      <Section1 />
      {/* 서비스 - 왜 로우디인가요? */}
      <Section2 />
      {/* 서비스 - 계약서 선택 */}
      <Section3 />
      {/* 서비스 - 이용 방법 */}
      <Section4 />
      {/* 소개 프리뷰 */}
      <HomeAboutPreview />
      {/* 법률 AI 분석 프리뷰 */}
      <HomeAIPreview />
      {/* CTA */}
      <Section5 />
      {/* 고객지원 - FAQ */}
      <Section7 />
      {/* 고객지원 프리뷰 */}
      <HomeSupportPreview />
    </Layout>
  )
}
