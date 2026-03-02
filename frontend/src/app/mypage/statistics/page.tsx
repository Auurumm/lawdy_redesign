'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted" style={{ fontSize: 14 }}>통계를 불러오는 중...</p>
      </div>
    );
  }

  const totalAnalyses = statistics?.totalAnalyses ?? 0;
  const monthlyAnalyses = statistics?.monthlyAnalyses ?? 0;
  const avgRiskLevel = statistics?.avgRiskLevel ?? 'medium';
  const avgProcessingTime = statistics?.avgAnalysisTime ?? 0;

  const riskLabelMap: Record<string, string> = { low: '낮음', medium: '중간', high: '높음' };
  const riskColorMap: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  const statCards = [
    { label: '총 분석 건수', value: String(totalAnalyses), icon: 'bi-graph-up', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: '이번 달 분석', value: String(monthlyAnalyses), icon: 'bi-calendar-check', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    {
      label: '평균 위험도',
      value: riskLabelMap[avgRiskLevel] || '중간',
      icon: 'bi-shield-exclamation',
      gradient: avgRiskLevel === 'high' ? 'linear-gradient(135deg, #ef4444, #f87171)' : avgRiskLevel === 'low' ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      valueColor: riskColorMap[avgRiskLevel],
    },
    {
      label: '평균 분석 시간',
      value: avgProcessingTime > 0 ? `${avgProcessingTime.toFixed(1)}초` : '-',
      icon: 'bi-clock-history',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    },
  ];

  const riskDistribution = [
    { label: '높음', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)', pct: 20 },
    { label: '중간', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)', pct: 50 },
    { label: '낮음', color: '#10b981', bgColor: 'rgba(16,185,129,0.1)', pct: 30 },
  ];

  const activityData = [
    { label: '오늘', value: '0건', icon: 'bi-sun' },
    { label: '이번 주', value: '0건', icon: 'bi-calendar-week' },
    { label: '이번 달', value: `${monthlyAnalyses}건`, icon: 'bi-calendar-month' },
    { label: '전체', value: `${totalAnalyses}건`, icon: 'bi-archive' },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">분석 통계</h4>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>분석 활동 및 추이를 한눈에 확인하세요.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((stat, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="rounded-4 p-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted mb-2" style={{ fontSize: 12 }}>{stat.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: (stat as { valueColor?: string }).valueColor || 'var(--tc-theme-primary)' }}>
                    {stat.value}
                  </h4>
                </div>
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 44, height: 44, background: stat.gradient }}
                >
                  <i className={`bi ${stat.icon} text-white`} style={{ fontSize: 18 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Sections */}
      {totalAnalyses === 0 ? (
        <div className="rounded-4 text-center py-5" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72, background: '#f1f5f9' }}
          >
            <i className="bi bi-bar-chart-line fs-1" style={{ color: '#94a3b8' }} />
          </div>
          <p className="text-muted mb-2" style={{ fontSize: 14 }}>아직 분석한 문서가 없습니다.</p>
          <p className="text-muted mb-3" style={{ fontSize: 13 }}>문서를 분석하면 통계가 여기에 표시됩니다.</p>
          <Link
            href="/mypage/analysis"
            className="btn btn-sm rounded-pill px-4 text-white text-decoration-none"
            style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)', border: 'none' }}
          >
            첫 문서 분석하기
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Risk Distribution */}
          <div className="col-md-6">
            <div className="rounded-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div
                    className="rounded-2 d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.1)' }}
                  >
                    <i className="bi bi-pie-chart" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                  </div>
                  <h6 className="fw-bold mb-0">위험도 분포</h6>
                </div>

                <div className="d-flex flex-column gap-4">
                  {riskDistribution.map((item) => (
                    <div key={item.label}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle" style={{ width: 8, height: 8, background: item.color }} />
                          <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
                        </div>
                        <span className="fw-bold" style={{ fontSize: 13, color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="progress rounded-pill" style={{ height: 8, background: '#f1f5f9' }}>
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{
                            width: `${item.pct}%`,
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                            transition: 'width 0.8s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="d-flex justify-content-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                  {riskDistribution.map((item) => (
                    <div key={item.label} className="d-flex align-items-center gap-1">
                      <div className="rounded-circle" style={{ width: 6, height: 6, background: item.color }} />
                      <span className="text-muted" style={{ fontSize: 11 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-md-6">
            <div className="rounded-4 h-100" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div
                    className="rounded-2 d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.1)' }}
                  >
                    <i className="bi bi-activity" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                  </div>
                  <h6 className="fw-bold mb-0">분석 활동</h6>
                </div>

                <div className="d-flex flex-column gap-3">
                  {activityData.map((row) => (
                    <div
                      key={row.label}
                      className="d-flex align-items-center justify-content-between p-3 rounded-3"
                      style={{ background: '#f8f9fc' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-2 d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32, background: 'rgba(0,70,255,0.08)' }}
                        >
                          <i className={`bi ${row.icon}`} style={{ color: 'var(--tc-theme-primary)', fontSize: 14 }} />
                        </div>
                        <span style={{ fontSize: 13, color: '#475569' }}>{row.label}</span>
                      </div>
                      <span className="fw-bold" style={{ fontSize: 14, color: 'var(--tc-theme-primary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
