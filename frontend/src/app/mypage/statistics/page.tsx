'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { StatisticsResponse } from '@/types/database';

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadStatistics();
  }, [user]);

  async function loadStatistics() {
    try {
      const stats = await api.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
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

  const totalAnalyses = statistics?.totalAnalyses ?? 0;
  const monthlyAnalyses = statistics?.monthlyAnalyses ?? 0;
  const avgRiskLevel = statistics?.avgRiskLevel ?? 'medium';
  const avgProcessingTime = statistics?.avgAnalysisTime ?? 0;

  const riskLabelMap: Record<string, string> = { low: '낮음', medium: '중간', high: '높음' };
  const riskColorMap: Record<string, string> = { low: '#198754', medium: '#ffc107', high: '#dc3545' };

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">분석 통계</h2>
        <p className="text-muted fs-6 mb-0">분석 활동 및 추이를 확인하세요.</p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {[
          { label: '총 분석 건수', value: String(totalAnalyses), icon: 'bi-graph-up' },
          { label: '이번 달 분석', value: String(monthlyAnalyses), icon: 'bi-calendar-check' },
          {
            label: '평균 위험도',
            value: riskLabelMap[avgRiskLevel] || '중간',
            icon: 'bi-shield-exclamation',
            color: riskColorMap[avgRiskLevel],
          },
          {
            label: '평균 분석 시간',
            value: avgProcessingTime > 0 ? `${avgProcessingTime.toFixed(1)}초` : '-',
            icon: 'bi-clock-history',
          },
        ].map((stat, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted fs-7 mb-1">{stat.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: stat.color || 'var(--tc-theme-primary)' }}>
                    {stat.value}
                  </h4>
                </div>
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 44, height: 44, background: 'rgba(0,70,255,0.1)' }}
                >
                  <i className={`bi ${stat.icon} fs-5`} style={{ color: 'var(--tc-theme-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">상세 통계</h5>

          {totalAnalyses === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-bar-chart-line fs-1 text-muted d-block mb-3" />
              <p className="text-muted mb-0">
                아직 분석한 문서가 없습니다.<br />문서를 분석하면 통계가 여기에 표시됩니다.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Risk Distribution */}
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">위험도 분포</h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    { label: '높음', color: '#dc3545', pct: 20 },
                    { label: '중간', color: '#ffc107', pct: 50 },
                    { label: '낮음', color: '#198754', pct: 30 },
                  ].map((item) => (
                    <div key={item.label} className="d-flex align-items-center gap-3">
                      <span className="text-muted" style={{ width: 40, fontSize: 13 }}>{item.label}</span>
                      <div className="flex-grow-1">
                        <div className="progress rounded-pill" style={{ height: 10 }}>
                          <div
                            className="progress-bar rounded-pill"
                            role="progressbar"
                            style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <span className="fw-medium" style={{ width: 36, fontSize: 13, textAlign: 'right' }}>
                        {item.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">최근 활동</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: '오늘', value: '0건' },
                    { label: '이번 주', value: '0건' },
                    { label: '이번 달', value: `${monthlyAnalyses}건` },
                    { label: '전체', value: `${totalAnalyses}건` },
                  ].map((row) => (
                    <div key={row.label} className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted fs-7">{row.label}</span>
                      <span className="fw-medium fs-7">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
