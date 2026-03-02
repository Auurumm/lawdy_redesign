import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"
import Section1 from "@/components/template/sections/about/Section1"
import Section2 from "@/components/template/sections/about/Section2"
import Section3 from "@/components/template/sections/about/Section3"
import Section4 from "@/components/template/sections/about/Section4"

export default function AboutPage() {
  return (
    <Layout>
      <PageHeader title="회사 소개" current_page="회사소개" />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </Layout>
  )
}
