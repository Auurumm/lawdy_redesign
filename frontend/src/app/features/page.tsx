import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"
import Section1 from "@/components/template/sections/services/Section1"
import Section2 from "@/components/template/sections/services/Section2"
import Section3 from "@/components/template/sections/services/Section3"
import Section4 from "@/components/template/sections/services/Section4"

export default function FeaturesPage() {
  return (
    <Layout>
      <PageHeader title="기능 소개" current_page="기능소개" />
      <Section1 title="AI 기반 계약 분석의 모든 기능" display="d-block" ds_btn="d-none" />
      <Section2 />
      <Section3 />
      <Section4 />
    </Layout>
  )
}
