'use client'

import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"
import Link from "next/link"

const faqData = {
  general: {
    title: '일반 질문',
    items: [
      {
        question: 'Lawdy는 무엇인가요?',
        answer: 'Lawdy는 AI 기술을 활용하여 계약서의 법적 위험을 자동으로 분석하고 시각화하는 플랫폼입니다. 복잡한 계약 내용을 쉽게 이해할 수 있도록 도와줍니다.',
      },
      {
        question: '누가 사용할 수 있나요?',
        answer: '개인, 변호사, 법률 팀, 기업 등 모든 사용자가 이용할 수 있습니다. 무료 가입 후 바로 시작할 수 있습니다.',
      },
      {
        question: '계약 분석에 시간이 얼마나 걸리나요?',
        answer: '대부분의 계약 AI 분석은 1-5분 내에 완료됩니다. 문서의 복잡도와 크기에 따라 달라질 수 있습니다.',
      },
      {
        question: '어떤 형식의 계약서를 분석할 수 있나요?',
        answer: 'PDF, DOC, DOCX, TXT 등 다양한 형식을 지원합니다. 이미지 형식도 OCR 기술로 분석 가능합니다.',
      },
    ],
  },
  security: {
    title: '기술 및 보안',
    items: [
      {
        question: '내 계약서는 안전하게 보호되나요?',
        answer: '예, 모든 계약서는 엔드-투-엔드 암호화로 보호되며, GDPR과 국내 개인정보 보호법을 완벽하게 준수합니다.',
      },
      {
        question: '분석 과정에서 데이터를 공유하나요?',
        answer: '절대 아닙니다. 귀사의 데이터는 100% 비밀로 유지됩니다. 마케팅이나 기타 목적으로 데이터를 사용하거나 공유하지 않습니다.',
      },
      {
        question: '분석 결과는 얼마나 정확한가요?',
        answer: '우리의 AI 모델은 95% 이상의 정확도로 일반적인 법적 위험요소를 식별합니다. 복잡한 사안의 경우 변호사 검토를 권장합니다.',
      },
    ],
  },
  subscription: {
    title: '구독 및 요금',
    items: [
      {
        question: '무료 플랜이 있나요?',
        answer: '현재는 무료로 서비스를 제공하고 있습니다. 무료 가입 후 바로 사용하실 수 있습니다.',
      },
      {
        question: '팀원들과 문서를 공유할 수 있나요?',
        answer: '팀 플랜에서는 여러 팀원이 같은 문서에 접근하고 협업할 수 있습니다.',
      },
    ],
  },
}

export default function FAQPage() {
  return (
    <Layout>
      <PageHeader title="자주 묻는 질문" current_page="FAQ" />
      <section className="py-120">
        <div className="container">
          {Object.entries(faqData).map(([key, section]) => (
            <div key={key} className="mb-5">
              <h3 className="text-dark mb-4 fw-bold">{section.title}</h3>
              <div className="accordion" id={`accordion-${key}`}>
                {section.items.map((item, index) => (
                  <div className="accordion-item border rounded-3 mb-3" key={index}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${key}-${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${key}-${index}`}
                      >
                        {item.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${key}-${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent={`#accordion-${key}`}
                    >
                      <div className="accordion-body text-secondary">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="text-center mt-5 pt-5 border-top">
            <h3 className="text-dark mb-3">여전히 도움이 필요하신가요?</h3>
            <p className="text-secondary mb-4">전문 상담팀이 24시간 내에 답변드립니다</p>
            <Link href="/support" className="btn btn-linear hover-up">
              <span>1:1 무료 상담하기</span>
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
