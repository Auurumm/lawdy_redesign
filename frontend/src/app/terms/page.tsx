'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f2f3f8]">
      <Header />
      
      <div className="h-[60px] md:h-[100px]" />
      
      <div className="max-w-[800px] mx-auto px-5 md:px-0">
        <h1 className="text-2xl md:text-[32px] font-bold text-gray-900 leading-8 md:leading-[42px] text-center mb-8">
          이용약관
        </h1>
        
        <div className="bg-white rounded-[16px] p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p className="text-sm text-[#454855] leading-6">
              본 약관은 로우디(이하 &quot;회사&quot;라 합니다)가 제공하는 AI 기반 계약서 분석 서비스(이하 &quot;서비스&quot;라 합니다)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (용어의 정의)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>&quot;서비스&quot;라 함은 회사가 제공하는 AI 기반 계약서 분석, 계약 리스크 진단, 계약 검토 및 개선 가이드 등 일체의 서비스를 의미합니다.</li>
              <li>&quot;이용자&quot;라 함은 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>&quot;회원&quot;이라 함은 회사와 서비스 이용계약을 체결하고 회원 아이디(ID)를 부여받은 자를 말합니다.</li>
              <li>&quot;비회원&quot;이라 함은 회원가입 없이 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
              <li>&quot;계약서 데이터&quot;라 함은 이용자가 서비스 이용을 위해 업로드하는 계약서 및 관련 문서를 의미합니다.</li>
              <li>&quot;분석 결과&quot;라 함은 회사의 AI 시스템이 계약서 데이터를 분석하여 생성한 리스크 진단, 개선 가이드 등의 결과물을 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 명시, 효력 및 변경)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
              <li>회사는 약관의 규제에 관한 법률, 전자상거래 등에서의 소비자보호에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
              <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리한 약관의 개정인 경우에는 최소 30일 전에 공지하며, 전자우편 등의 방법으로 개별 통지합니다.</li>
              <li>이용자가 개정약관의 적용에 동의하지 않는 경우 회사 또는 이용자는 서비스 이용계약을 해지할 수 있습니다. 이용자가 약관 변경 적용일까지 거부 의사를 표시하지 아니하는 경우 약관의 변경에 동의한 것으로 간주합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (약관 외 준칙)</h2>
            <p className="text-sm text-[#454855] leading-6">
              본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 약관의 규제에 관한 법률, 전자상거래 등에서의 소비자보호에 관한 법률, 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령 또는 상관례에 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (이용계약의 성립)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>이용계약은 이용자가 본 약관의 내용에 동의하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 성립합니다.</li>
              <li>회원가입 신청 시 이용자는 실명 및 실제 정보를 기재하여야 하며, 허위 정보를 기재한 경우 법적 보호를 받을 수 없습니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 이용신청을 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>타인의 명의를 도용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>관련 법령을 위반하거나 사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
                  <li>기타 회사가 정한 이용신청 요건이 미비한 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (서비스의 내용)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사가 제공하는 서비스의 내용은 다음과 같습니다.
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>계약서 AI 분석: 각종 계약서를 AI로 분석하여 불리한 조항과 잠재적 법적 리스크를 식별하는 서비스</li>
                  <li>계약 리스크 진단: 계약 과정에서 발생할 수 있는 분쟁요소와 위험도를 사전에 진단하는 서비스</li>
                  <li>계약 검토 및 개선 가이드: 계약 리스크를 줄이기 위한 실질적인 개선 방향을 제시하는 서비스</li>
                  <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                </ul>
              </li>
              <li>회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경할 수 있으며, 변경 시 사전에 공지합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (서비스의 제공 및 중단)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 연중무휴, 1일 24시간 서비스 제공을 원칙으로 합니다. 다만, 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에는 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 사전에 공지합니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 서비스 제공을 중단할 수 있습니다.
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>설비의 보수 등 공사로 인한 부득이한 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지한 경우</li>
                  <li>국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 제공이 불가능한 경우</li>
                  <li>기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
                </ul>
              </li>
              <li>제2항에 의한 서비스 중단의 경우 회사는 사전에 공지합니다. 다만, 회사가 통제할 수 없는 사유로 인한 서비스 중단의 경우 사후에 통지할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (서비스 이용료)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사가 제공하는 서비스는 기본적으로 무료입니다. 다만, 유료 서비스의 경우 해당 서비스에 명시된 요금을 지불하여야 이용할 수 있습니다.</li>
              <li>유료 서비스의 요금, 결제방법, 환불정책 등은 각 서비스별 안내 페이지에 별도로 명시합니다.</li>
              <li>회사는 유료 서비스 요금을 변경할 수 있으며, 변경 시 최소 30일 전에 공지합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (이용자의 의무)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>회원가입 신청 또는 변경 시 허위내용 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 무단 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  <li>관련 법령에 위배되는 행위</li>
                </ul>
              </li>
              <li>이용자는 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
              <li>이용자는 자신의 계정 정보를 제3자에게 이용하게 해서는 안 되며, 계정 정보의 관리 소홀로 인한 손해는 이용자가 부담합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (계약서 데이터의 업로드 및 관리)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>이용자는 서비스 이용을 위해 계약서 데이터를 업로드할 수 있습니다.</li>
              <li>이용자가 업로드한 계약서 데이터에 대한 저작권 및 기타 권리는 이용자에게 있으며, 회사는 서비스 제공 목적으로만 이를 이용합니다.</li>
              <li>회사는 이용자가 업로드한 계약서 데이터를 다음의 목적으로 처리합니다.
                <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                  <li>AI 분석 서비스 제공</li>
                  <li>서비스 품질 개선 및 AI 모델 학습(개인정보 및 민감정보는 익명화 처리 후 활용)</li>
                  <li>법령상 의무 이행</li>
                </ul>
              </li>
              <li>이용자는 언제든지 자신이 업로드한 계약서 데이터의 삭제를 요청할 수 있으며, 회사는 관련 법령에 따른 보관 의무가 있는 경우를 제외하고 지체 없이 삭제합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제11조 (분석 결과의 제공 및 한계)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 AI 기술을 활용하여 계약서 분석 결과를 제공하나, 이는 참고자료로서의 성격을 가지며 법률자문이나 법률서비스를 대체하는 것이 아닙니다.</li>
              <li>분석 결과는 AI 알고리즘에 기반한 것으로, 실제 법률관계나 분쟁 결과와 다를 수 있으며, 이용자는 중요한 법률적 판단이 필요한 경우 반드시 변호사 등 법률전문가의 자문을 받아야 합니다.</li>
              <li>회사는 분석 결과의 정확성, 완전성, 적시성을 보장하지 않으며, 이용자가 분석 결과에 의존하여 발생한 손해에 대해 책임을 부담하지 않습니다. 다만, 회사의 고의 또는 중과실로 인한 경우는 제외합니다.</li>
              <li>이용자는 분석 결과를 제3자에게 제공하거나 상업적으로 이용할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제12조 (회사의 의무)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 관련 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다합니다.</li>
              <li>회사는 이용자의 개인정보 보호를 위해 보안시스템을 구축하며 개인정보처리방침을 공시하고 준수합니다.</li>
              <li>회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정할 경우 이를 처리하여야 합니다. 이용자가 제기한 의견이나 불만사항에 대해서는 게시판을 활용하거나 전자우편 등을 통하여 이용자에게 처리과정 및 결과를 전달합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제13조 (저작권의 귀속 및 이용제한)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
              <li>이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
              <li>이용자가 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제14조 (손해배상)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 무료로 제공되는 서비스와 관련하여 이용자에게 어떠한 손해가 발생하더라도 회사의 고의 또는 중과실에 의한 경우를 제외하고는 이에 대하여 책임을 부담하지 않습니다.</li>
              <li>유료 서비스의 경우, 회사의 귀책사유로 인하여 이용자에게 손해가 발생한 경우 회사는 이용자가 지급한 서비스 이용료를 한도로 손해를 배상합니다. 다만, 회사의 고의 또는 중과실이 있는 경우에는 그러하지 아니합니다.</li>
              <li>이용자가 본 약관을 위반하여 회사에 손해가 발생한 경우, 이용자는 회사에 발생한 모든 손해를 배상하여야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제15조 (면책조항)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 통해 얻은 자료로 인한 손해에 대하여 책임을 지지 않습니다. 또한 회사는 이용자가 서비스를 이용하며 타 이용자로 인해 입게 되는 정신적 피해에 대하여 보상할 책임을 지지 않습니다.</li>
              <li>회사는 이용자 상호간 또는 이용자와 제3자 상호간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임도 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제16조 (분쟁의 해결)</h2>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-decimal list-inside">
              <li>회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</li>
              <li>제1항의 노력에도 불구하고 분쟁이 해결되지 않을 경우, 양 당사자는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.</li>
              <li>회사와 이용자 간 제기된 소송에는 대한민국 법을 적용합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제17조 (개인정보보호)</h2>
            <p className="text-sm text-[#454855] leading-6">
              회사는 이용자의 개인정보를 보호하기 위하여 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라 별도의 개인정보처리방침을 정하여 공지하고 이를 준수합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">부칙</h2>
            <p className="text-sm text-[#454855] leading-6">
              본 약관은 2025년 12월 26일부터 시행합니다.
            </p>
          </section>
        </div>
      </div>
      
      <div className="h-[120px] md:h-[180px]" />
      
      <Footer />
    </main>
  );
}
