import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"
import Section1 from "@/components/template/sections/contact/Section1"
import Section2 from "@/components/template/sections/contact/Section2"

export default function SupportPage() {
  return (
    <Layout>
      <PageHeader title="고객 지원" current_page="고객지원" />
      <Section1 />
      <Section2 />
    </Layout>
  )
}
