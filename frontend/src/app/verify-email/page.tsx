'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/template/layout/Layout';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    if (!email || resendLoading) return;

    setResendLoading(true);
    setResendMessage('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendMessage('인증 메일이 재전송되었습니다. 이메일을 확인해주세요.');
      } else {
        setResendMessage(data.error || '재전송에 실패했습니다.');
      }
    } catch {
      setResendMessage('재전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Layout>
      <section className="position-relative overflow-hidden py-120 bg-light" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5 text-center">
                  {/* Mail Icon */}
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '64px', height: '64px', background: '#e3f2fd' }}>
                    <i className="bi bi-envelope-check" style={{ fontSize: '2rem', color: 'var(--tc-theme-primary)' }} />
                  </div>

                  <h4 className="fw-bold mb-2">이메일을 확인해주세요</h4>
                  <p className="text-muted mb-1">
                    아래 이메일로 인증 링크를 보냈습니다.
                  </p>
                  {email && (
                    <p className="fw-semibold mb-4" style={{ color: 'var(--tc-theme-primary)' }}>
                      {email}
                    </p>
                  )}

                  <p className="text-muted fs-7 mb-4">
                    이메일에 포함된 인증 링크를 클릭하면<br />
                    회원가입이 완료됩니다.
                  </p>

                  {/* Resend Button */}
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || !email}
                    className="btn btn-outline-dark w-100 py-3 rounded-3 mb-3"
                  >
                    {resendLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-repeat me-2" />
                        인증 메일 재전송
                      </>
                    )}
                  </button>

                  {/* Resend Message */}
                  {resendMessage && (
                    <div className={`alert ${resendMessage.includes('실패') ? 'alert-danger' : 'alert-success'} rounded-3 py-2 px-3 mb-3`}>
                      <small>{resendMessage}</small>
                    </div>
                  )}

                  {/* Login Link */}
                  <div className="mt-3">
                    <Link
                      href="/login"
                      className="text-muted fs-7 text-decoration-none"
                    >
                      <i className="bi bi-arrow-left me-1" />
                      로그인 페이지로 돌아가기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Layout>
        <section className="position-relative overflow-hidden py-120 bg-light" style={{ minHeight: '80vh' }}>
          <div className="container text-center">
            <div className="spinner-border" style={{ color: 'var(--tc-theme-primary)' }} role="status">
              <span className="visually-hidden">로딩 중...</span>
            </div>
          </div>
        </section>
      </Layout>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
