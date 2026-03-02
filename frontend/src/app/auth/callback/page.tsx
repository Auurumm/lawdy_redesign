'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/template/layout/Layout';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function verifyEmail() {
      try {
        // URL hash fragment에서 access_token 파싱
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          setStatus('error');
          setErrorMessage('인증 토큰을 찾을 수 없습니다.');
          return;
        }

        // verify-email API 호출
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken }),
        });

        if (res.ok) {
          setStatus('success');
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 2000);
        } else {
          const data = await res.json();
          setStatus('error');
          setErrorMessage(data.error || '이메일 인증에 실패했습니다.');
        }
      } catch {
        setStatus('error');
        setErrorMessage('이메일 인증 처리 중 오류가 발생했습니다.');
      }
    }

    verifyEmail();
  }, [router]);

  return (
    <Layout>
      <section className="position-relative overflow-hidden py-120 bg-light" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5 text-center">
                  {status === 'loading' && (
                    <>
                      <div className="spinner-border mb-4" style={{ color: 'var(--tc-theme-primary)', width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">인증 중...</span>
                      </div>
                      <h4 className="fw-bold mb-2">이메일 인증 중</h4>
                      <p className="text-muted mb-0">잠시만 기다려주세요...</p>
                    </>
                  )}

                  {status === 'success' && (
                    <>
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                        style={{ width: '64px', height: '64px', background: '#e8f5e9' }}>
                        <i className="bi bi-check-lg" style={{ fontSize: '2rem', color: '#4caf50' }} />
                      </div>
                      <h4 className="fw-bold mb-2">인증 완료!</h4>
                      <p className="text-muted mb-3">이메일 인증이 완료되었습니다.<br />로그인 페이지로 이동합니다.</p>
                      <div className="spinner-border spinner-border-sm" style={{ color: 'var(--tc-theme-primary)' }} role="status">
                        <span className="visually-hidden">이동 중...</span>
                      </div>
                    </>
                  )}

                  {status === 'error' && (
                    <>
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                        style={{ width: '64px', height: '64px', background: '#fce4ec' }}>
                        <i className="bi bi-x-lg" style={{ fontSize: '2rem', color: '#f44336' }} />
                      </div>
                      <h4 className="fw-bold mb-2">인증 실패</h4>
                      <p className="text-muted mb-4">{errorMessage}</p>
                      <a href="/login" className="btn btn-dark rounded-3 px-4 py-2" style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}>
                        로그인 페이지로 이동
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
