'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f2f3f8]">
      <Header />
      
      <div className="h-[60px] md:h-[100px]" />
      
      <div className="max-w-[800px] mx-auto px-5 md:px-0">
        <h1 className="text-2xl md:text-[32px] font-bold text-gray-900 leading-8 md:leading-[42px] text-center mb-8">
          개인정보처리방침
        </h1>
        
        <div className="bg-white rounded-[16px] p-6 md:p-10 space-y-8">
          {/* 제1조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p className="text-sm text-[#454855] leading-6">
              로우디(이하 &quot;회사&quot;라 합니다)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 개인정보 보호 관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (개인정보의 처리 목적)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 회원 가입 및 관리</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리 목적으로 개인정보를 처리합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. AI 계약서 분석 서비스 제공</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>계약서 AI 분석 서비스 제공: 이용자가 업로드한 계약서를 AI로 분석하여 불리한 조항과 잠재적 법적 리스크를 식별하는 서비스 제공</li>
              <li>계약 리스크 진단 서비스 제공: 계약 과정에서 발생할 수 있는 분쟁요소와 위험도를 사전에 진단하는 서비스 제공</li>
              <li>계약 검토 및 개선 가이드 제공: 계약 리스크를 줄이기 위한 실질적인 개선 방향을 제시하는 서비스 제공</li>
              <li>맞춤형 서비스 제공 및 서비스 품질 개선</li>
              <li>요금결제 및 정산</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 서비스 개선 및 AI 모델 학습</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              AI 분석 정확도 향상 및 서비스 품질 개선을 위한 AI 모델 학습(개인정보 및 민감정보는 익명화 처리 후 활용)
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">라. 마케팅 및 광고 활용</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 서비스의 유효성 확인, 접속빈도 파악, 회원의 서비스 이용에 대한 통계 분석
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">마. 고충처리</h3>
            <p className="text-sm text-[#454855] leading-6">
              민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보
            </p>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (처리하는 개인정보의 항목)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 회원 가입 및 관리</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>필수항목: 성명, 이메일 주소, 비밀번호, 휴대전화번호</li>
              <li>선택항목: 소속(회사명 또는 법무법인명), 직책, 사업자등록번호</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 서비스 제공</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>필수항목: 이메일 주소, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기정보(OS, 화면사이즈, 디바이스 아이디), 브라우저 정보</li>
              <li>선택항목: 결제정보(신용카드 정보, 계좌정보 등)</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 계약서 분석 서비스 이용</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>필수항목: 업로드된 계약서 파일 및 그 내용</li>
              <li>선택항목: 계약 당사자 정보(계약서에 포함된 경우)</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">라. 자동으로 생성·수집되는 정보</h3>
            <p className="text-sm text-[#454855] leading-6">
              서비스 이용과정에서 다음의 정보가 자동으로 생성되어 수집될 수 있습니다: IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 접속 로그, 불량 이용기록 등
            </p>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (개인정보의 처리 및 보유기간)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 원칙</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 각 개인정보 처리 및 보유 기간</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-disc list-inside">
              <li><strong>회원 가입 및 관리:</strong> 회원 탈퇴 시까지. 다만, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우 해당 수사·조사 종료 시까지, 서비스 이용에 따른 채권·채무관계 잔존 시 해당 채권·채무관계 정산 시까지</li>
              <li><strong>서비스 제공:</strong> 서비스 제공 완료 시까지. 「전자상거래 등에서의 소비자보호에 관한 법률」에 따른 표시·광고, 계약내용 및 이행 등 거래에 관한 기록: 5년, 소비자의 불만 또는 분쟁처리에 관한 기록: 3년, 「전자금융거래법」에 따른 전자금융거래에 관한 기록: 5년, 「통신비밀보호법」에 따른 로그인 기록: 3개월</li>
              <li><strong>계약서 데이터:</strong> 이용자가 삭제 요청 시 또는 회원 탈퇴 후 즉시 삭제. 다만, AI 모델 학습을 위해 익명화 처리된 데이터는 학습 목적 달성 시까지 보유하며, 익명화 처리된 데이터에는 개인을 식별할 수 있는 정보가 포함되지 않습니다.</li>
              <li><strong>부정이용 방지:</strong> 부정이용 기록은 부정 가입 및 이용 방지를 위하여 회원 탈퇴 후 1년간 보관</li>
            </ul>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (개인정보의 제3자 제공)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 원칙</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 제3자 제공 현황</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제3자 제공이 필요한 경우 제공받는 자, 제공 목적, 제공 항목, 보유 및 이용기간 등을 사전에 고지하고 정보주체의 동의를 받겠습니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 법령에 의한 제공</h3>
            <p className="text-sm text-[#454855] leading-6 mb-2">다만, 다음의 경우에는 예외로 합니다.</p>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside">
              <li>정보주체로부터 별도의 동의를 받은 경우</li>
              <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
              <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
              <li>통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 개인정보를 제공하는 경우</li>
              <li>범죄의 수사와 공소의 제기 및 유지를 위하여 필요한 경우</li>
              <li>법원의 재판업무 수행을 위하여 필요한 경우</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (개인정보처리의 위탁)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 위탁 원칙</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 현재 위탁 현황</h3>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm text-[#454855] border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">수탁업체</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">위탁업무 내용</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">클라우드 서비스 제공업체</td>
                    <td className="border border-gray-200 px-3 py-2">서버 호스팅 및 데이터 보관</td>
                    <td className="border border-gray-200 px-3 py-2">위탁계약 종료 시 또는 회원탈퇴 시까지</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">결제대행업체</td>
                    <td className="border border-gray-200 px-3 py-2">결제 처리 및 정산</td>
                    <td className="border border-gray-200 px-3 py-2">위탁계약 종료 시 또는 관련 법령에 따른 보존기간까지</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">문자발송업체</td>
                    <td className="border border-gray-200 px-3 py-2">문자메시지(SMS/LMS) 발송</td>
                    <td className="border border-gray-200 px-3 py-2">발송 즉시 삭제</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">이메일발송업체</td>
                    <td className="border border-gray-200 px-3 py-2">이메일 발송</td>
                    <td className="border border-gray-200 px-3 py-2">발송 즉시 삭제</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 위탁 관리</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">라. 변경 시 공개</h3>
            <p className="text-sm text-[#454855] leading-6">
              위탁업무의 내용이나 수탁자가 변경될 경우에는 지체 없이 본 개인정보처리방침을 통하여 공개하도록 하겠습니다.
            </p>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (정보주체의 권리·의무 및 행사방법)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 정보주체의 권리</h3>
            <p className="text-sm text-[#454855] leading-6 mb-2">정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 권리 행사 방법</h3>
            <p className="text-sm text-[#454855] leading-6 mb-2">제1항에 따른 권리 행사는 회사에 대해 다음의 방법을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>서면, 전화, 전자우편, 모사전송(FAX) 등을 통한 요구</li>
              <li>회사 웹사이트 내 개인정보 관리 메뉴를 통한 직접 처리</li>
              <li>개인정보 보호책임자 또는 담당부서에 연락</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 정정·삭제 요구 시 처리</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">라. 대리인을 통한 권리 행사</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">마. 정보주체의 의무</h3>
            <p className="text-sm text-[#454855] leading-6">
              정보주체는 개인정보 보호법 등 관계법령을 위반하여 회사가 처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을 침해하여서는 아니 됩니다.
            </p>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (개인정보의 파기)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 파기 원칙</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 법령에 따른 보존</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 파기 절차 및 방법</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-disc list-inside">
              <li><strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
              <li><strong>전자적 파일 형태:</strong> 기록을 재생할 수 없도록 로우레벨포맷(Low Level Format) 등의 기술적 방법을 이용하여 완전하게 삭제합니다.</li>
              <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
            </ul>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (개인정보의 안전성 확보조치)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 관리적 조치</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>내부관리계획의 수립 및 시행</li>
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>정기적인 자체 감사 실시</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 기술적 조치</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside mb-3">
              <li>개인정보처리시스템 등의 접근권한 관리</li>
              <li>접근통제시스템 설치 및 운영</li>
              <li>개인정보의 암호화</li>
              <li>보안프로그램 설치 및 주기적 갱신·점검</li>
              <li>접속기록의 보관 및 위변조 방지</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 물리적 조치</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside">
              <li>전산실, 자료보관실 등의 접근통제</li>
              <li>개인정보가 포함된 서류, 보조저장매체 등의 잠금장치 설치</li>
            </ul>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 쿠키의 사용 목적</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;를 사용합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 쿠키란</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다. 쿠키는 이용자가 방문한 각 서비스와 웹사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 쿠키 설정 거부 방법</h3>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside">
              <li><strong>Internet Explorer:</strong> 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 &gt; 설정</li>
              <li><strong>Chrome:</strong> 웹 브라우저 우측 상단의 설정 &gt; 고급 설정 표시 &gt; 개인정보의 콘텐츠 설정 버튼 &gt; 쿠키</li>
              <li><strong>Safari:</strong> 환경설정 &gt; 개인정보 &gt; 쿠키 및 웹사이트 데이터</li>
              <li>쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
            </ul>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제11조 (개인정보 보호책임자)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 개인정보 보호책임자 지정</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            
            <div className="bg-[#f2f3f8] rounded-lg p-4 mb-3">
              <p className="text-sm text-[#454855] leading-6">
                <strong>▶ 개인정보 보호책임자</strong><br />
                성명: 임성호<br />
                직책: 대표 변호사<br />
                연락처: 070-8648-0998<br />
                ※ 개인정보 보호 담당부서로 연결됩니다.
              </p>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 권익침해 구제방법</h3>
            <p className="text-sm text-[#454855] leading-6">
              정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
            </p>
          </section>

          {/* 제12조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제12조 (권익침해 구제방법)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
            </p>
            <ul className="text-sm text-[#454855] leading-6 space-y-2 list-disc list-inside">
              <li><strong>개인정보분쟁조정위원회:</strong> 전화 (국번없이) 1833-6972, 홈페이지 www.kopico.go.kr</li>
              <li><strong>개인정보침해신고센터(한국인터넷진흥원 운영):</strong> 전화 (국번없이) 118, 홈페이지 privacy.kisa.or.kr</li>
              <li><strong>대검찰청 사이버범죄수사단:</strong> 전화 (국번없이) 1301, 홈페이지 www.spo.go.kr</li>
              <li><strong>경찰청 사이버안전국:</strong> 전화 (국번없이) 182, 홈페이지 cyberbureau.police.go.kr</li>
            </ul>
          </section>

          {/* 제13조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제13조 (영상정보처리기기 운영·관리)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 현재 영상정보처리기기(CCTV)를 설치·운영하고 있지 않습니다. 향후 영상정보처리기기를 설치·운영하는 경우 개인정보 보호법 제25조에 따라 다음 사항을 공개하겠습니다.
            </p>
            <ul className="text-sm text-[#454855] leading-6 space-y-1 list-disc list-inside">
              <li>영상정보처리기기 설치 근거 및 설치 목적</li>
              <li>설치 대수, 설치 위치 및 촬영 범위</li>
              <li>관리책임자 및 접근권한자</li>
              <li>영상정보의 촬영시간, 보관기간, 보관장소 및 처리방법</li>
              <li>영상정보 확인 방법 및 장소</li>
              <li>정보주체의 영상정보 열람 등 요구에 대한 조치</li>
              <li>영상정보 보호를 위한 기술적·관리적·물리적 조치</li>
            </ul>
          </section>

          {/* 제14조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제14조 (개인정보 처리방침의 변경)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 변경 시 공개</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다. 다만, 개인정보의 수집 및 활용, 제3자 제공 등과 같이 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 변경 이력</h3>
            <p className="text-sm text-[#454855] leading-6">
              공고일자: 2025년 12월 26일<br />
              시행일자: 2025년 12월 26일
            </p>
          </section>

          {/* 제15조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제15조 (개인정보의 열람청구)</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
            </p>
            <div className="bg-[#f2f3f8] rounded-lg p-4">
              <p className="text-sm text-[#454855] leading-6">
                <strong>▶ 개인정보 열람청구 접수·처리 부서</strong><br />
                성명: 임성호<br />
                직책: 대표 변호사<br />
                연락처: 070-8648-0998
              </p>
            </div>
          </section>

          {/* 제16조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제16조 (계약서 데이터의 처리)</h2>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2">가. 계약서 데이터의 특성</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              이용자가 서비스 이용을 위해 업로드하는 계약서에는 계약 당사자의 개인정보가 포함될 수 있습니다. 회사는 이러한 개인정보를 서비스 제공 목적으로만 처리합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">나. 계약서 데이터의 보안</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              회사는 업로드된 계약서 데이터를 암호화하여 저장하며, 접근권한을 엄격히 제한합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">다. 계약서 데이터의 삭제</h3>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              이용자는 언제든지 업로드한 계약서 데이터의 삭제를 요청할 수 있으며, 회사는 요청 즉시 해당 데이터를 삭제합니다.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">라. AI 학습을 위한 익명화 처리</h3>
            <p className="text-sm text-[#454855] leading-6">
              회사는 서비스 품질 향상을 위해 계약서 데이터를 익명화 처리하여 AI 모델 학습에 활용할 수 있습니다. 익명화 처리 시 개인을 식별할 수 있는 모든 정보(성명, 주민등록번호, 연락처, 주소 등)를 삭제하거나 대체하여 특정 개인을 알아볼 수 없도록 합니다.
            </p>
          </section>

          {/* 제17조 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제17조 (아동의 개인정보 보호)</h2>
            <p className="text-sm text-[#454855] leading-6">
              회사는 만 14세 미만 아동의 개인정보를 수집하지 않습니다. 만 14세 미만 아동의 개인정보 처리가 필요한 경우 법정대리인의 동의를 받아 처리합니다.
            </p>
          </section>

          {/* 부칙 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">부칙</h2>
            <p className="text-sm text-[#454855] leading-6 mb-3">
              <strong>제1조 (시행일)</strong><br />
              본 개인정보처리방침은 2025년 12월 26일부터 시행합니다.
            </p>
            <p className="text-sm text-[#454855] leading-6">
              ※ 본 개인정보처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 변경사항의 시행일의 최소 7일 전부터 회사 홈페이지의 &apos;공지사항&apos;을 통해 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
      
      <div className="h-[120px] md:h-[180px]" />
      
      <Footer />
    </main>
  );
}
