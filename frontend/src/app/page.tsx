import Layout from "@/components/template/layout/Layout"
import Section1 from "@/components/template/sections/home/Section1"
import Section2 from "@/components/template/sections/home/Section2"
import Section3 from "@/components/template/sections/home/Section3"
import Section4 from "@/components/template/sections/home/Section4"
import Section5 from "@/components/template/sections/home/Section5"
import Section7 from "@/components/template/sections/home/Section7"

export default function Home() {
  return (
    <Layout>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section7 />
    </Layout>
  )
}
