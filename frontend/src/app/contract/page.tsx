import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"
import ContractForm from "@/components/contract/ContractForm"

export default function ContractPage() {
  return (
    <Layout>
      <PageHeader title="계약서 작성" current_page="계약서 작성" />
      <ContractForm />
    </Layout>
  )
}
