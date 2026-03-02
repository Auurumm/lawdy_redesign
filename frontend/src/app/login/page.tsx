'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '@/components/template/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/mypage');
    }
  }, [user, authLoading, router]);

  const isFormFilled = email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormFilled || isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/mypage');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="position-relative overflow-hidden py-120 bg-light" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 col-lg-4">
              {/* Header */}
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">로그인</h2>
                <p className="text-muted fs-6 mb-0">계정에 로그인하여 시작하세요</p>
              </div>

              {/* Card */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    {/* Error */}
                    {error && (
                      <div className="alert alert-danger rounded-3 py-2 px-3 mb-4" role="alert">
                        <small>{error}</small>
                      </div>
                    )}

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-7">이메일</label>
                      <input
                        type="email"
                        className="form-control rounded-3 py-3"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-7">비밀번호</label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control rounded-3 py-3 pe-5"
                          placeholder="비밀번호를 입력해주세요"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        {password && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3"
                            style={{ textDecoration: 'none' }}
                          >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-6`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="d-flex justify-content-end mb-4">
                      <Link href="/forgot-password" className="text-muted fs-7 text-decoration-none">
                        비밀번호 찾기 <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
                      </Link>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!isFormFilled || isLoading}
                      className="btn btn-dark w-100 py-3 rounded-3 fw-bold"
                      style={
                        isFormFilled && !isLoading
                          ? { background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }
                          : {}
                      }
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          로그인 중...
                        </>
                      ) : (
                        '로그인'
                      )}
                    </button>
                  </form>

                  {/* Signup Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted fs-7 mb-2">아직 계정이 없으신가요?</p>
                    <Link
                      href="/signup"
                      className="fw-bold text-decoration-none fs-7"
                      style={{ color: 'var(--tc-theme-primary)' }}
                    >
                      무료로 가입하기 <i className="bi bi-arrow-right" />
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
