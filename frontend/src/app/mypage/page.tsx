'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { DocumentWithAnalysis, StatisticsResponse } from '@/types/database';

const riskBadgeClass: Record<string, string> = {
  high: 'bg-danger',
  medium: 'bg-warning text-dark',
  low: 'bg-success',
};

const riskLabels: Record<string, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentWithAnalysis[]>([]);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function loadData() {
    try {
      const [docsRes, statsRes] = await Promise.all([
        api.getDocuments(1, 10),
        api.getStatistics(),
      ]);
      setDocuments(docsRes.data || []);
      setStatistics(statsRes);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fs-7">로딩 중...</p>
      </div>
    );
  }

  const recentDocuments = documents.slice(0, 5).map(doc => ({
    id: doc.id,
    name: doc.file_name,
    date: new Date(doc.created_at).toLocaleDateString('ko-KR'),
    risk: (doc.analyses?.[0]?.risk_level || 'low') as 'low' | 'medium' | 'high',
    status: doc.status === 'completed' ? '분석완료' : doc.status === 'analyzing' ? '분석중' : '대기중',
    isCompleted: doc.status === 'completed',
  }));

  const totalAnalyses = statistics?.totalAnalyses ?? 0;
  const monthlyAnalyses = statistics?.monthlyAnalyses ?? 0;
  const completionRate = statistics?.completionRate ?? 100;

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">대시보드</h2>
        <p className="text-muted fs-6 mb-0">최근 분석 활동을 확인하세요.</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted fs-7 mb-1">총 분석 건수</p>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--tc-theme-primary)' }}>{totalAnalyses}</h3>
              </div>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, background: 'rgba(0,70,255,0.1)' }}
              >
                <i className="bi bi-graph-up fs-4" style={{ color: 'var(--tc-theme-primary)' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted fs-7 mb-1">이번 달 분석</p>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--tc-theme-primary)' }}>{monthlyAnalyses}</h3>
              </div>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, background: 'rgba(0,70,255,0.1)' }}
              >
                <i className="bi bi-calendar-check fs-4" style={{ color: 'var(--tc-theme-primary)' }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="text-muted fs-7 mb-1">완료율</p>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--tc-theme-primary)' }}>{completionRate}%</h3>
              </div>
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, background: 'rgba(0,70,255,0.1)' }}
              >
                <i className="bi bi-check-circle fs-4" style={{ color: 'var(--tc-theme-primary)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="fw-bold mb-0">최근 문서</h5>
            <Link href="/mypage/analysis" className="btn btn-sm btn-outline-dark rounded-pill text-decoration-none">
              더 보기 <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-text fs-1 text-muted d-block mb-3" />
              <p className="text-muted mb-2">분석한 문서가 없습니다.</p>
              <Link href="/mypage/analysis" className="fw-semibold text-decoration-none" style={{ color: 'var(--tc-theme-primary)' }}>
                첫 문서 분석하기 <i className="bi bi-arrow-right" />
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile List */}
              <div className="d-md-none d-flex flex-column gap-3">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 40, height: 40, background: 'rgba(0,70,255,0.08)' }}
                      >
                        <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)' }} />
                      </div>
                      <div>
                        <p className="mb-0 fw-semibold fs-7 text-truncate" style={{ maxWidth: 180 }}>{doc.name}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{doc.date}</p>
                      </div>
                    </div>
                    <span className={`badge ${riskBadgeClass[doc.risk]} rounded-pill`}>
                      {riskLabels[doc.risk]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="d-none d-md-block table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="text-muted">
                      <th className="fw-semibold fs-7 border-0 pb-3">문서명</th>
                      <th className="fw-semibold fs-7 border-0 pb-3 text-center">업로드일</th>
                      <th className="fw-semibold fs-7 border-0 pb-3 text-center">위험도</th>
                      <th className="fw-semibold fs-7 border-0 pb-3 text-center">상태</th>
                      <th className="fw-semibold fs-7 border-0 pb-3 text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td className="fs-7 fw-medium">{doc.name}</td>
                        <td className="fs-7 text-center">{doc.date}</td>
                        <td className="text-center">
                          <span className={`badge ${riskBadgeClass[doc.risk]} rounded-pill`}>
                            {riskLabels[doc.risk]}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark rounded-pill">{doc.status}</span>
                        </td>
                        <td className="text-center">
                          <Link
                            href={`/mypage/analysis?doc=${doc.id}`}
                            className={`btn btn-sm btn-outline-dark rounded-pill ${
                              !doc.isCompleted ? 'disabled opacity-50' : ''
                            }`}
                          >
                            보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <h5 className="fw-bold mb-3">빠른 작업</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <Link
            href="/mypage/analysis"
            className="card border-0 rounded-4 p-4 text-white text-decoration-none hover-up"
            style={{ background: 'var(--tc-linear-1)' }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-file-earmark-plus fs-3" />
                <span className="fw-bold fs-6">새 문서 분석</span>
              </div>
              <i className="bi bi-arrow-right fs-5" />
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link
            href="/mypage/contract"
            className="card border-0 shadow-sm rounded-4 p-4 text-dark text-decoration-none hover-up"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-pencil-square fs-3" style={{ color: 'var(--tc-theme-primary)' }} />
                <span className="fw-bold fs-6">계약서 작성</span>
              </div>
              <i className="bi bi-arrow-right fs-5" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
