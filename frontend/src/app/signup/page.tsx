"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/components/template/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/mypage");
    }
  }, [user, authLoading, router]);

  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const showPasswordError = password.length > 0 && !isPasswordValid;
  const showConfirmError = confirmPassword.length > 0 && !passwordsMatch;

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    isPasswordValid &&
    passwordsMatch &&
    agreeTerms &&
    agreePrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      await signup({ name, email, password, agreeTerms, agreePrivacy });
      router.push("/mypage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section
        className="position-relative overflow-hidden py-120 bg-light"
        style={{ minHeight: "80vh" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              {/* Header */}
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-2">회원가입</h2>
                <p className="text-muted fs-6 mb-0">무료로 시작하세요</p>
              </div>

              {/* Card */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    {/* Error */}
                    {error && (
                      <div
                        className="alert alert-danger rounded-3 py-2 px-3 mb-4"
                        role="alert"
                      >
                        <small>{error}</small>
                      </div>
                    )}

                    {/* Name */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-7">
                        이름
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-3 py-3"
                        placeholder="이름을 입력해주세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold fs-7">
                        이메일
                      </label>
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
                      <label className="form-label fw-semibold fs-7">
                        비밀번호
                      </label>
                      <input
                        type="password"
                        className={`form-control rounded-3 py-3 ${showPasswordError ? "is-invalid" : ""}`}
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div
                        className={`form-text ${showPasswordError ? "text-danger" : ""}`}
                      >
                        최소 8자 이상, 대문자, 숫자를 포함해주세요.
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold fs-7">
                        비밀번호 확인
                      </label>
                      <input
                        type="password"
                        className={`form-control rounded-3 py-3 ${showConfirmError ? "is-invalid" : ""}`}
                        placeholder="비밀번호를 한번 더 입력해주세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      {showConfirmError && (
                        <div className="invalid-feedback">
                          비밀번호가 일치하지 않습니다.
                        </div>
                      )}
                    </div>

                    {/* Agreements */}
                    <div className="border rounded-3 p-3 mb-4">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <label
                          className="form-check-label fs-7"
                          htmlFor="agreeTerms"
                        >
                          <Link
                            href="/terms"
                            className="fw-semibold text-decoration-none"
                            style={{ color: "var(--tc-theme-primary)" }}
                          >
                            이용약관
                          </Link>
                          에 동의합니다.
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreePrivacy"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                        />
                        <label
                          className="form-check-label fs-7"
                          htmlFor="agreePrivacy"
                        >
                          <Link
                            href="/privacy"
                            className="fw-semibold text-decoration-none"
                            style={{ color: "var(--tc-theme-primary)" }}
                          >
                            개인정보처리방침
                          </Link>
                          에 동의합니다.
                        </label>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!isFormValid || isLoading}
                      className="btn btn-dark w-100 py-3 rounded-3 fw-bold"
                      style={
                        isFormValid && !isLoading
                          ? {
                              background: "var(--tc-theme-primary)",
                              borderColor: "var(--tc-theme-primary)",
                            }
                          : {}
                      }
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />
                          계정 생성 중...
                        </>
                      ) : (
                        "계정 생성"
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted fs-7 mb-2">
                      이미 계정이 있으신가요?
                    </p>
                    <Link
                      href="/login"
                      className="fw-bold text-decoration-none fs-7"
                      style={{ color: "var(--tc-theme-primary)" }}
                    >
                      로그인 <i className="bi bi-arrow-right" />
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
