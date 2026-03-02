"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContractForm() {
    const [step, setStep] = useState(1);

    return (
        <>
            {/* 계약서 작성 섹션 */}
            <section className="position-relative overflow-hidden py-120">
                <div className="container">
                    {/* 진행 상태 표시 */}
                    <div className="row mb-5">
                        <div className="col-lg-8 mx-auto">
                            <div className="d-flex align-items-center justify-content-between mb-4" data-aos="fade-up">
                                <div className={`d-flex align-items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`icon-shape icon-40 rounded-circle ${step >= 1 ? 'bg-linear-1 text-white' : 'bg-secondary bg-opacity-25'} d-flex align-items-center justify-content-center fw-bold`}>
                                        1
                                    </div>
                                    <span className="fw-semibold d-none d-md-inline">유형 선택</span>
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <div className="progress" style={{height: '4px'}}>
                                        <div className="progress-bar bg-primary" style={{width: step >= 2 ? '100%' : '0%'}}></div>
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`icon-shape icon-40 rounded-circle ${step >= 2 ? 'bg-linear-1 text-white' : 'bg-secondary bg-opacity-25'} d-flex align-items-center justify-content-center fw-bold`}>
                                        2
                                    </div>
                                    <span className="fw-semibold d-none d-md-inline">정보 입력</span>
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <div className="progress" style={{height: '4px'}}>
                                        <div className="progress-bar bg-primary" style={{width: step >= 3 ? '100%' : '0%'}}></div>
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                                    <div className={`icon-shape icon-40 rounded-circle ${step >= 3 ? 'bg-linear-1 text-white' : 'bg-secondary bg-opacity-25'} d-flex align-items-center justify-content-center fw-bold`}>
                                        3
                                    </div>
                                    <span className="fw-semibold d-none d-md-inline">완료</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: 계약서 유형 선택 */}
                    {step === 1 && (
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" data-aos="fade-up">
                                    <div className="text-center mb-5">
                                        <div className="d-flex align-items-center gap-3 justify-content-center">
                                            <span className="small-line" />
                                            <span className="btn-text text-primary">STEP 1</span>
                                            <span className="small-line" />
                                        </div>
                                        <h3 className="mt-3 mb-2">어떤 계약서가 필요하신가요?</h3>
                                        <p className="text-muted">작성하실 계약서 유형을 선택해주세요.</p>
                                    </div>

                                    <div className="row g-4">
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={0}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-person-badge fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">근로계약서</h6>
                                                <p className="text-muted small mb-0">정규직, 계약직, 수습, 파트타임 등 고용 계약</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={100}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-briefcase fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">용역계약서</h6>
                                                <p className="text-muted small mb-0">프로젝트, 외주, IT 개발, 컨설팅 용역</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={200}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-shield-lock fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">비밀유지계약서 (NDA)</h6>
                                                <p className="text-muted small mb-0">영업비밀, 기술정보 보호 기밀유지</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={300}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-building fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">임대차계약서</h6>
                                                <p className="text-muted small mb-0">주택, 상가, 오피스 부동산 임대</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={400}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-laptop fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">프리랜서 계약서</h6>
                                                <p className="text-muted small mb-0">개인 사업자, 프리랜서 업무 위탁</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-lg-4">
                                            <div className="card border rounded-4 p-4 h-100 hover-up cursor-pointer" onClick={() => setStep(2)} data-aos="fade-up" data-aos-delay={500}>
                                                <div className="icon-shape icon-60 rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-cash-stack fs-3 text-primary"></i>
                                                </div>
                                                <h6 className="mb-2">투자계약서</h6>
                                                <p className="text-muted small mb-0">스타트업 투자, 주주간 계약, SAFE</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: 정보 입력 */}
                    {step === 2 && (
                        <div className="row">
                            <div className="col-lg-10 mx-auto">
                                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" data-aos="fade-up">
                                    <div className="text-center mb-5">
                                        <div className="d-flex align-items-center gap-3 justify-content-center">
                                            <span className="small-line" />
                                            <span className="btn-text text-primary">STEP 2</span>
                                            <span className="small-line" />
                                        </div>
                                        <h3 className="mt-3 mb-2">계약 정보를 입력해주세요</h3>
                                        <p className="text-muted">정확한 정보를 입력하시면 AI가 맞춤형 계약서를 생성합니다.</p>
                                    </div>

                                    <form>
                                        {/* 사용자(갑) 정보 */}
                                        <div className="mb-5" data-aos="fade-up">
                                            <h5 className="mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                                                <span className="icon-shape icon-30 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fs-7">갑</span>
                                                사용자(갑) 정보
                                            </h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">회사명 <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="주식회사 로우디" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">대표자명 <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="홍길동" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">사업자등록번호</label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="000-00-00000" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">회사 주소</label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="서울시 강남구..." />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 근로자(을) 정보 */}
                                        <div className="mb-5" data-aos="fade-up" data-aos-delay={100}>
                                            <h5 className="mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                                                <span className="icon-shape icon-30 rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fs-7">을</span>
                                                근로자(을) 정보
                                            </h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">성명 <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="김철수" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">생년월일</label>
                                                    <input type="date" className="form-control form-control-lg" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">주소</label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="서울시 서초구..." />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">연락처</label>
                                                    <input type="tel" className="form-control form-control-lg" placeholder="010-0000-0000" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 근로 조건 */}
                                        <div className="mb-5" data-aos="fade-up" data-aos-delay={200}>
                                            <h5 className="mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                                                <i className="bi bi-briefcase text-primary"></i>
                                                근로 조건
                                            </h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">근무 시작일 <span className="text-danger">*</span></label>
                                                    <input type="date" className="form-control form-control-lg" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">담당 업무</label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="소프트웨어 개발" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">근무 장소</label>
                                                    <input type="text" className="form-control form-control-lg" placeholder="본사" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">근무 시간</label>
                                                    <select className="form-select form-select-lg">
                                                        <option>09:00 ~ 18:00 (주 40시간)</option>
                                                        <option>10:00 ~ 19:00 (주 40시간)</option>
                                                        <option>자율 출퇴근제</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 급여 조건 */}
                                        <div className="mb-5" data-aos="fade-up" data-aos-delay={300}>
                                            <h5 className="mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                                                <i className="bi bi-cash-stack text-primary"></i>
                                                급여 조건
                                            </h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">급여 형태 <span className="text-danger">*</span></label>
                                                    <select className="form-select form-select-lg">
                                                        <option>연봉제</option>
                                                        <option>월급제</option>
                                                        <option>시급제</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">급여액 <span className="text-danger">*</span></label>
                                                    <div className="input-group input-group-lg">
                                                        <input type="text" className="form-control" placeholder="50,000,000" />
                                                        <span className="input-group-text">원</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">지급일</label>
                                                    <select className="form-select form-select-lg">
                                                        <option>매월 25일</option>
                                                        <option>매월 말일</option>
                                                        <option>매월 10일</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={() => setStep(1)}>
                                                <i className="bi bi-arrow-left me-2"></i>이전
                                            </button>
                                            <button type="button" className="btn btn-linear btn-lg px-5" onClick={() => setStep(3)}>
                                                계약서 생성하기<i className="bi bi-arrow-right ms-2"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: 완료 / 미리보기 */}
                    {step === 3 && (
                        <div className="row">
                            <div className="col-lg-12 mx-auto">
                                <div className="row g-4">
                                    {/* 계약서 미리보기 */}
                                    <div className="col-lg-7">
                                        <div className="card border-0 shadow-sm rounded-4 p-4" data-aos="fade-up">
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h5 className="mb-0 d-flex align-items-center gap-2">
                                                    <i className="bi bi-file-earmark-text text-primary"></i>
                                                    계약서 미리보기
                                                </h5>
                                                <span className="badge bg-success px-3 py-2">생성 완료</span>
                                            </div>

                                            {/* 미리보기 영역 */}
                                            <div className="bg-light border rounded-3 p-4" style={{maxHeight: '500px', overflowY: 'auto'}}>
                                                <div className="text-center mb-4">
                                                    <h4 className="fw-bold">근 로 계 약 서</h4>
                                                </div>

                                                <p className="mb-3">
                                                    <strong>주식회사 로우디</strong>(이하 "사용자"라 한다)와 <strong>김철수</strong>(이하 "근로자"라 한다)는
                                                    다음과 같이 근로계약을 체결한다.
                                                </p>

                                                <hr className="my-4" />

                                                <p className="mb-2"><strong>제1조 (근로계약기간)</strong></p>
                                                <p className="mb-4 ps-3">근로계약기간은 2025년 2월 1일부터 기간의 정함이 없는 것으로 한다.</p>

                                                <p className="mb-2"><strong>제2조 (근무장소)</strong></p>
                                                <p className="mb-4 ps-3">근로자의 근무장소는 본사로 정하며, 업무상 필요한 경우 사용자는 근무장소를 변경할 수 있다.</p>

                                                <p className="mb-2"><strong>제3조 (업무내용)</strong></p>
                                                <p className="mb-4 ps-3">근로자가 수행할 업무의 내용은 소프트웨어 개발로 한다.</p>

                                                <p className="mb-2"><strong>제4조 (근로시간)</strong></p>
                                                <p className="mb-4 ps-3">
                                                    ① 근로시간은 09:00부터 18:00까지로 하고, 휴게시간은 12:00부터 13:00까지로 한다.<br />
                                                    ② 주 소정근로시간은 40시간으로 한다.
                                                </p>

                                                <p className="mb-2"><strong>제5조 (임금)</strong></p>
                                                <p className="mb-4 ps-3">
                                                    ① 연봉은 금 오천만원(₩50,000,000)으로 정한다.<br />
                                                    ② 임금은 매월 25일에 근로자에게 직접 지급하거나, 근로자 명의의 예금계좌에 입금하여 지급한다.
                                                </p>

                                                <p className="text-muted small">... (이하 생략)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 액션 패널 */}
                                    <div className="col-lg-5">
                                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" data-aos="fade-up" data-aos-delay={100}>
                                            <h5 className="mb-4 d-flex align-items-center gap-2">
                                                <i className="bi bi-download text-primary"></i>
                                                다운로드
                                            </h5>
                                            <div className="d-grid gap-3">
                                                <button className="btn btn-linear btn-lg d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-file-earmark-pdf me-2"></i>
                                                    PDF 다운로드
                                                </button>
                                                <button className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-file-earmark-word me-2"></i>
                                                    Word 다운로드
                                                </button>
                                                <button className="btn btn-outline-secondary btn-lg d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-file-earmark me-2"></i>
                                                    HWP 다운로드
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" data-aos="fade-up" data-aos-delay={200}>
                                            <h5 className="mb-4 d-flex align-items-center gap-2">
                                                <i className="bi bi-magic text-primary"></i>
                                                AI 추천 특약 조항
                                            </h5>
                                            <div className="d-flex flex-column gap-3">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="clause1" />
                                                    <label className="form-check-label" htmlFor="clause1">
                                                        비밀유지 의무 조항
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="clause2" />
                                                    <label className="form-check-label" htmlFor="clause2">
                                                        경업금지 조항
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="clause3" />
                                                    <label className="form-check-label" htmlFor="clause3">
                                                        재택근무 관련 조항
                                                    </label>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-primary mt-4">
                                                선택한 조항 추가하기
                                            </button>
                                        </div>

                                        <div className="card border-0 bg-linear-1 rounded-4 p-4" data-aos="fade-up" data-aos-delay={300}>
                                            <div className="d-flex align-items-start gap-3">
                                                <i className="bi bi-lightbulb text-white fs-4"></i>
                                                <div>
                                                    <h6 className="mb-2 text-white">전문가 검토가 필요하신가요?</h6>
                                                    <p className="text-white opacity-75 small mb-3">
                                                        복잡한 계약 조건이나 특수한 상황이라면 법률 전문가의 검토를 받아보세요.
                                                    </p>
                                                    <Link href="/contact" className="btn btn-sm btn-light">
                                                        상담 신청하기
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-5" data-aos="fade-up">
                                    <button className="btn btn-outline-secondary btn-lg me-3" onClick={() => setStep(1)}>
                                        새 계약서 작성하기
                                    </button>
                                    <Link href="/" className="btn btn-linear btn-lg">
                                        홈으로 돌아가기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}