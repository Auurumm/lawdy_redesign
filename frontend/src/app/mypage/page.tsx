'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { api, type AnalysisContract } from '@/lib/api';
import { downloadContractAsPDF, downloadContractAsWord, downloadContractAsText } from '@/lib/contractDownload';
import type { DocumentWithAnalysis, StatisticsResponse } from '@/types/database';

const riskBadgeStyle: Record<string, React.CSSProperties> = {
  high: { background: 'rgba(220,53,69,0.1)', color: '#dc3545' },
  medium: { background: 'rgba(255,193,7,0.1)', color: '#cc9a00' },
  low: { background: 'rgba(25,135,84,0.1)', color: '#198754' },
};

const riskLabels: Record<string, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

const statusConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  completed: { label: '분석완료', style: { background: 'rgba(25,135,84,0.1)', color: '#198754' } },
  analyzing: { label: '분석중', style: { background: 'rgba(0,70,255,0.1)', color: 'var(--tc-theme-primary)' } },
  uploading: { label: '업로드중', style: { background: 'rgba(108,117,125,0.1)', color: '#6c757d' } },
  parsing: { label: '파싱중', style: { background: 'rgba(108,117,125,0.1)', color: '#6c757d' } },
  failed: { label: '실패', style: { background: 'rgba(220,53,69,0.1)', color: '#dc3545' } },
};

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentWithAnalysis[]>([]);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [contracts, setContracts] = useState<AnalysisContract[]>([]);
  const [viewing, setViewing] = useState<AnalysisContract | null>(null);
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
      // 계약서 목록은 실패해도 대시보드 나머지는 보이도록 따로 처리
      try {
        const contractsRes = await api.getAnalysisContracts(20);
        setContracts(contractsRes.contracts || []);
      } catch (e) {
        console.warn('Failed to load generated contracts:', e);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted" style={{ fontSize: 14 }}>데이터를 불러오는 중...</p>
      </div>
    );
  }

  const recentDocuments = documents.slice(0, 5).map(doc => ({
    id: doc.id,
    name: doc.file_name,
    date: new Date(doc.created_at).toLocaleDateString('ko-KR'),
    risk: (doc.analyses?.[0]?.risk_level || 'low') as 'low' | 'medium' | 'high',
    status: doc.status === 'completed' ? 'completed' : doc.status === 'analyzing' ? 'analyzing' : doc.status === 'failed' ? 'failed' : 'uploading',
    isCompleted: doc.status === 'completed',
  }));

  const totalAnalyses = statistics?.totalAnalyses ?? 0;
  const monthlyAnalyses = statistics?.monthlyAnalyses ?? 0;
  const completionRate = statistics?.completionRate ?? 100;

  const statCards = [
    { label: '총 분석 건수', value: String(totalAnalyses), icon: 'bi-graph-up', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: '이번 달 분석', value: String(monthlyAnalyses), icon: 'bi-calendar-check', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { label: '완료율', value: `${completionRate}%`, icon: 'bi-check-circle', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  ];

  return (
    <>
      {/* Welcome Header */}
      <div className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
        <div className="position-relative z-1">
          <p className="mb-1" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>안녕하세요, {user?.name}님</p>
          <h4 className="fw-bold mb-2" style={{ color: '#ffffff' }}>오늘도 스마트한 계약 관리를 시작하세요</h4>
          <p className="mb-0" style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>AI가 계약서의 위험 요소를 분석하고, 안전한 계약을 도와드립니다.</p>
        </div>
        <div className="position-absolute end-0 top-50 translate-middle-y d-none d-md-block" style={{ fontSize: 140, lineHeight: 1, color: 'rgba(255,255,255,0.08)' }}>
          <i className="bi bi-shield-check" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((stat, i) => (
          <div key={i} className="col-6 col-md-4">
            <div className="rounded-4 p-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: 13 }}>{stat.label}</p>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--tc-theme-primary)' }}>{stat.value}</h3>
                </div>
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 48, height: 48, background: stat.gradient }}
                >
                  <i className={`bi ${stat.icon} fs-5 text-white`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
      {/* Recent Documents */}
      <div className="col-xl-6">
      <div className="rounded-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, background: 'rgba(0,70,255,0.1)' }}
              >
                <i className="bi bi-clock-history" style={{ color: 'var(--tc-theme-primary)', fontSize: 14 }} />
              </div>
              <h6 className="fw-bold mb-0">최근 분석한 계약서</h6>
            </div>
            <Link href="/mypage/analysis?tab=recent" className="d-flex align-items-center gap-1 text-decoration-none fw-semibold" style={{ color: 'var(--tc-theme-primary)', fontSize: 13 }}>
              전체보기 <i className="bi bi-chevron-right" style={{ fontSize: 12 }} />
            </Link>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 64, height: 64, background: 'rgba(0,70,255,0.06)' }}
              >
                <i className="bi bi-file-earmark-text fs-2" style={{ color: 'var(--tc-theme-primary)', opacity: 0.5 }} />
              </div>
              <p className="text-muted mb-2" style={{ fontSize: 14 }}>아직 분석한 문서가 없습니다.</p>
              <Link
                href="/mypage/analysis"
                className="btn btn-sm rounded-pill px-4 text-white text-decoration-none"
                style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)', border: 'none' }}
              >
                첫 문서 분석하기
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile List */}
              <div className="d-md-none d-flex flex-column gap-2">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: '#f8f9fc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, background: 'rgba(0,70,255,0.08)' }}
                      >
                        <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)', fontSize: 14 }} />
                      </div>
                      <div>
                        <p className="mb-0 fw-semibold text-truncate" style={{ maxWidth: 160, fontSize: 13 }}>{doc.name}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{doc.date}</p>
                      </div>
                    </div>
                    <span className="badge rounded-pill" style={{ ...riskBadgeStyle[doc.risk], fontSize: 11, fontWeight: 600 }}>
                      {riskLabels[doc.risk]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="d-none d-md-block">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th className="fw-semibold text-muted border-0 pb-3" style={{ fontSize: 12 }}>문서명</th>
                      <th className="fw-semibold text-muted border-0 pb-3 text-center" style={{ fontSize: 12 }}>업로드일</th>
                      <th className="fw-semibold text-muted border-0 pb-3 text-center" style={{ fontSize: 12 }}>위험도</th>
                      <th className="fw-semibold text-muted border-0 pb-3 text-center" style={{ fontSize: 12 }}>상태</th>
                      <th className="fw-semibold text-muted border-0 pb-3 text-center" style={{ fontSize: 12 }}>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td className="fw-medium">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ width: 32, height: 32, background: 'rgba(0,70,255,0.06)' }}
                            >
                              <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)', fontSize: 13 }} />
                            </div>
                            {doc.name}
                          </div>
                        </td>
                        <td className="text-center text-muted text-nowrap">{doc.date}</td>
                        <td className="text-center">
                          <span className="badge rounded-pill px-3" style={{ ...riskBadgeStyle[doc.risk], fontSize: 11, fontWeight: 600 }}>
                            {riskLabels[doc.risk]}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge rounded-pill px-3" style={{ ...(statusConfig[doc.status]?.style || {}), fontSize: 11, fontWeight: 600 }}>
                            {statusConfig[doc.status]?.label || '대기중'}
                          </span>
                        </td>
                        <td className="text-center">
                          <Link
                            href={`/mypage/analysis?tab=ai&doc=${doc.id}`}
                            className={`btn btn-sm rounded-pill px-3 ${
                              !doc.isCompleted ? 'disabled opacity-50' : ''
                            }`}
                            style={{
                              fontSize: 12,
                              background: doc.isCompleted ? 'rgba(0,70,255,0.08)' : undefined,
                              color: doc.isCompleted ? 'var(--tc-theme-primary)' : undefined,
                              border: 'none',
                              fontWeight: 600,
                            }}
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

      </div>

      {/* Generated Contracts */}
      <div className="col-xl-6">
      <div className="rounded-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, background: 'rgba(5,150,105,0.1)' }}
              >
                <i className="bi bi-file-earmark-check" style={{ color: '#059669', fontSize: 14 }} />
              </div>
              <h6 className="fw-bold mb-0">최근 생성한 계약서</h6>
            </div>
            <Link href="/mypage/contract?tab=list" className="d-flex align-items-center gap-1 text-decoration-none fw-semibold" style={{ color: 'var(--tc-theme-primary)', fontSize: 13 }}>
              전체보기 <i className="bi bi-chevron-right" style={{ fontSize: 12 }} />
            </Link>
          </div>

          {contracts.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0" style={{ fontSize: 14 }}>
              아직 생성한 계약서가 없습니다.
            </p>
          ) : (
            <div className="d-flex flex-column gap-2 pe-1" style={{ maxHeight: 3 * 76 + 2 * 8, overflowY: 'auto' }}>
              {contracts.map((c) => (
                <div key={c.id} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: '#f8f9fc' }}>
                  <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                    <div
                      className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 36, height: 36, background: 'rgba(5,150,105,0.1)' }}
                    >
                      <i className="bi bi-file-earmark-text" style={{ color: '#059669', fontSize: 14 }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="mb-0 fw-semibold text-truncate" style={{ fontSize: 13 }}>{c.title}</p>
                      <p className="mb-0 text-muted text-truncate" style={{ fontSize: 11 }}>
                        {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                        {c.sourceFileName
                          ? ` · 원본: ${c.sourceFileName}`
                          : c.partyA && c.partyB
                            ? ` · ${c.partyA} ↔ ${c.partyB}`
                            : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewing(c)}
                    className="btn btn-sm rounded-pill px-3 flex-shrink-0"
                    style={{ fontSize: 12, background: 'rgba(0,70,255,0.08)', color: 'var(--tc-theme-primary)', border: 'none', fontWeight: 600 }}
                  >
                    보기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
      </div>

      {/* Contract Viewer */}
      {viewing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.55)', zIndex: 2000 }}
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-4 d-flex flex-column"
            style={{ width: '100%', maxWidth: 820, maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-4 py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: 360 }}>{viewing.title}</h6>
              <div className="d-flex align-items-center gap-1">
                {([
                  ['PDF', downloadContractAsPDF],
                  ['Word', downloadContractAsWord],
                  ['TXT', downloadContractAsText],
                ] as const).map(([label, fn]) => (
                  <button
                    key={label}
                    onClick={() => fn(viewing.content, viewing.title)}
                    className="btn btn-sm rounded-pill px-3"
                    style={{ background: '#fff', border: '1px solid #d1d5db', fontSize: 12, color: '#374151' }}
                  >
                    {label}
                  </button>
                ))}
                <button onClick={() => setViewing(null)} className="btn btn-sm ms-1" aria-label="닫기">
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </div>
            <div className="p-4 markdown-body overflow-auto" style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>
              <ReactMarkdown>{viewing.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div
          className="rounded-2 d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, background: 'rgba(0,70,255,0.1)' }}
        >
          <i className="bi bi-lightning-charge" style={{ color: 'var(--tc-theme-primary)', fontSize: 14 }} />
        </div>
        <h6 className="fw-bold mb-0">빠른 작업</h6>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <Link
            href="/mypage/analysis"
            className="d-block rounded-4 p-4 text-white text-decoration-none position-relative overflow-hidden hover-up"
            style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)' }}
          >
            <div className="d-flex align-items-center justify-content-between position-relative z-1">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)' }}
                >
                  <i className="bi bi-file-earmark-plus fs-5" />
                </div>
                <div>
                  <p className="fw-bold mb-0 text-white" style={{ fontSize: 15 }}>새 문서 분석</p>
                  <p className="mb-0 text-white opacity-75" style={{ fontSize: 12 }}>AI 리스크 분석 시작하기</p>
                </div>
              </div>
              <i className="bi bi-arrow-right fs-5 opacity-75" />
            </div>
          </Link>
        </div>
        <div className="col-md-6">
          <Link
            href="/mypage/contract"
            className="d-block rounded-4 p-4 text-decoration-none position-relative overflow-hidden hover-up"
            style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  <i className="bi bi-pencil-square fs-5 text-white" />
                </div>
                <div>
                  <p className="fw-bold mb-0 text-dark" style={{ fontSize: 15 }}>계약서 작성</p>
                  <p className="mb-0 text-muted" style={{ fontSize: 12 }}>AI 대화로 계약서 생성하기</p>
                </div>
              </div>
              <i className="bi bi-arrow-right fs-5" style={{ color: 'var(--tc-theme-primary)' }} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
