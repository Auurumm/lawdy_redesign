'use client';

import { useState } from 'react';

export default function Section2() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [inquiryType, setInquiryType] = useState('일반 문의');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'contact', name, email, inquiryType, message }),
            });

            if (res.ok) {
                setSubmitStatus('success');
                setName('');
                setEmail('');
                setMessage('');
                setInquiryType('일반 문의');
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="position-relative pb-120">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            <span className="btn-text fs-7 text-primary">무료 상담</span>
                            <h2 className="mt-3 fw-semibold text-anime-style-2">1:1 문의하기</h2>
                            <p className="mb-4 text-secondary">궁금한 점이나 도움이 필요하시면 아래 양식을 작성해주세요. 24시간 내에 답변드립니다.</p>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label htmlFor="contact-name" className="fs-7 fw-semibold mb-2">이름</label>
                                        <input
                                            type="text"
                                            className="py-3 form-control rounded-3"
                                            placeholder="이름을 입력해주세요"
                                            id="contact-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="contact-email" className="fs-7 fw-semibold mb-2">이메일</label>
                                        <input
                                            type="email"
                                            className="py-3 form-control rounded-3"
                                            placeholder="이메일을 입력해주세요"
                                            id="contact-email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="contact-type" className="fs-7 fw-semibold mb-2">문의 유형</label>
                                        <select
                                            className="py-3 form-select rounded-3"
                                            id="contact-type"
                                            value={inquiryType}
                                            onChange={(e) => setInquiryType(e.target.value)}
                                        >
                                            <option>일반 문의</option>
                                            <option>기술 문제</option>
                                            <option>결제 관련</option>
                                            <option>기타</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="contact-message" className="fs-7 fw-semibold mb-2">메시지</label>
                                        <textarea
                                            id="contact-message"
                                            rows={6}
                                            className="py-3 form-control rounded-3"
                                            placeholder="궁금한 점을 자유롭게 작성해주세요"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button
                                            className="btn btn-linear"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            <span>{isSubmitting ? '전송 중...' : '무료 상담 신청하기'}</span>
                                            {!isSubmitting && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                                                    <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="alert alert-success mt-4 rounded-3">
                                        문의가 접수되었습니다. 24시간 내에 회신드리겠습니다.
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="alert alert-danger mt-4 rounded-3">
                                        전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
