'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Layout from "@/components/template/layout/Layout"
import PageHeader from "@/components/template/sections/PageHeader"

interface Job {
  id: string
  title: string
  description: string
  team: string
  location: string
  employment_type: string
  requirements: string[]
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/jobs?page=1&limit=20')
      if (res.ok) {
        const data = await res.json()
        setJobs(data.data)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  return (
    <Layout>
      <PageHeader title="채용 안내" current_page="채용" />
      <section className="py-120">
        <div className="container">
          {/* Why Work Section */}
          <div className="text-center mb-5">
            <h3 className="text-dark mb-3 fw-bold">Lawdy에서 일하는 이유</h3>
          </div>
          <div className="row g-4 mb-5">
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={100}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-cpu fs-4 text-white" />
                  </div>
                  <h5 className="text-white">혁신적인 기술</h5>
                  <p className="text-white-50">최신 AI/ML 기술로 법률 서비스의 미래를 만듭니다</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-people fs-4 text-white" />
                  </div>
                  <h5 className="text-white">함께 성장</h5>
                  <p className="text-white-50">팀과 함께 기술과 경험을 나눕니다</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={300}>
              <div className="card border-0 bg-dark text-white rounded-4 p-4 h-100 hover-up">
                <div className="card-body text-center">
                  <div className="icon-shape icon-lg bg-linear-1 rounded-3 mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className="bi bi-clock fs-4 text-white" />
                  </div>
                  <h5 className="text-white">유연한 근무</h5>
                  <p className="text-white-50">원격근무와 유연한 근무시간을 지원합니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="mt-5 pt-5 border-top">
            <h3 className="text-dark mb-4 fw-bold">현재 모집 중인 직무</h3>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="row g-3">
                {jobs.map((job) => (
                  <div key={job.id} className="col-12" data-aos="fade-up">
                    <div className="card border rounded-4 p-4 hover-up">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                          <h5 className="mb-2">{job.title}</h5>
                          <p className="text-secondary mb-2">{job.description}</p>
                          <div className="d-flex flex-wrap gap-2 mb-2">
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2">
                              <i className="bi bi-briefcase me-1" />{job.team}
                            </span>
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2">
                              <i className="bi bi-geo-alt me-1" />{job.location}
                            </span>
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2">
                              <i className="bi bi-clock me-1" />{job.employment_type}
                            </span>
                          </div>
                          {job.requirements.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 align-items-center">
                              <span className="text-primary fw-bold small">필수 요건:</span>
                              <span className="text-secondary small">{job.requirements.join(' · ')}</span>
                            </div>
                          )}
                        </div>
                        <a
                          href={`mailto:official.haedeun@gmail.com?subject=${encodeURIComponent(`[Lawdy 채용 지원] ${job.title}`)}&body=${encodeURIComponent(`안녕하세요,\n\n${job.title} 포지션에 지원합니다.\n\n[이름]:\n[연락처]:\n[경력 요약]:\n\n감사합니다.`)}`}
                          className="btn btn-linear hover-up flex-shrink-0"
                        >
                          <span>지원하기</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-secondary">
                현재 모집 중인 직무가 없습니다.
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-5 pt-5 border-top">
            <h3 className="text-dark mb-3">적합한 직무가 없으신가요?</h3>
            <p className="text-secondary mb-4">자유로운 형식의 지원서를 보내주세요. 새로운 기회를 함께 만들 수 있습니다.</p>
            <a
              href={`mailto:official.haedeun@gmail.com?subject=${encodeURIComponent('[Lawdy 자유 지원] 지원서')}&body=${encodeURIComponent('안녕하세요,\n\nLawdy에 자유 형식으로 지원합니다.\n\n[이름]:\n[연락처]:\n[관심 분야]:\n[경력 요약]:\n\n감사합니다.')}`}
              className="btn btn-linear hover-up"
            >
              <span>지원서 보내기</span>
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M15.8167 7.55759C15.8165 7.5574 15.8163 7.55719 15.8161 7.557L12.5504 4.307C12.3057 4.06353 11.91 4.06444 11.6665 4.30912C11.423 4.55378 11.4239 4.9495 11.6686 5.193L13.8612 7.375H0.625C0.279813 7.375 0 7.65481 0 8C0 8.34519 0.279813 8.625 0.625 8.625H13.8612L11.6686 10.807C11.4239 11.0505 11.423 11.4462 11.6665 11.6909C11.91 11.9356 12.3058 11.9364 12.5504 11.693L15.8162 8.443C15.8163 8.44281 15.8165 8.44259 15.8167 8.4424C16.0615 8.19809 16.0607 7.80109 15.8167 7.55759Z" fill="white" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
