'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/template/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
  { href: '/mypage', label: '대시보드', icon: 'bi-grid-1x2', exact: true },
  { href: '/mypage/analysis', label: '문서 분석', icon: 'bi-file-earmark-text' },
  { href: '/mypage/contract', label: '계약서 작성', icon: 'bi-pencil-square' },
  { href: '/mypage/statistics', label: '분석 통계', icon: 'bi-bar-chart-line' },
];

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const isActive = (item: typeof sidebarItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  if (authLoading) {
    return (
      <Layout>
        <section className="py-120 bg-light" style={{ minHeight: '80vh' }}>
          <div className="container text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted fs-6">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="position-relative overflow-hidden" style={{ minHeight: '80vh', paddingTop: '120px', paddingBottom: '80px', background: 'linear-gradient(180deg, #f8f9fc 0%, #eef1f6 100%)' }}>
        <div className="container">
          {/* Mobile Navigation Pills */}
          <div className="d-lg-none mb-4">
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn btn-sm rounded-pill fw-semibold text-nowrap text-decoration-none ${
                    isActive(item) ? '' : 'btn-outline-secondary'
                  }`}
                  style={isActive(item) ? {
                    background: 'linear-gradient(135deg, #312e81, #4338ca)',
                    color: '#ffffff',
                    border: 'none',
                  } : {}}
                >
                  <i className={`bi ${item.icon} me-1`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {/* Desktop Sidebar */}
            <div className="col-lg-3 col-xl-2 d-none d-lg-block">
              <div className="position-sticky" style={{ top: '100px' }}>
                <div className="rounded-4 overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  {/* User Info Header */}
                  <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                      style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.15)' }}
                    >
                      <i className="bi bi-person-fill fs-4" style={{ color: '#ffffff' }} />
                    </div>
                    <p className="mb-0 fw-bold" style={{ fontSize: 14, color: '#ffffff' }}>{user.name}</p>
                    <p className="mb-0 text-truncate" style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{user.email}</p>
                  </div>

                  {/* Nav Links */}
                  <nav className="p-3">
                    <div className="d-flex flex-column gap-1">
                      {sidebarItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none transition-all"
                          style={
                            isActive(item)
                              ? {
                                  background: 'rgba(0,70,255,0.08)',
                                  color: 'var(--tc-theme-primary)',
                                  fontWeight: 600,
                                }
                              : {
                                  color: '#64748b',
                                }
                          }
                        >
                          {isActive(item) && (
                            <span
                              className="position-absolute rounded-pill"
                              style={{
                                width: 3,
                                height: 20,
                                background: 'var(--tc-theme-primary)',
                                left: 12,
                              }}
                            />
                          )}
                          <i className={`bi ${item.icon}`} style={{ fontSize: 16 }} />
                          <span style={{ fontSize: 13 }}>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-xl-10">
              {children}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
