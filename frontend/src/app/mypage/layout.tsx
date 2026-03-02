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
            <p className="mt-3 text-muted fs-6">로딩 중...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <section className="position-relative overflow-hidden py-120 bg-light" style={{ minHeight: '80vh' }}>
        <div className="container">
          {/* Mobile Navigation Pills */}
          <div className="d-lg-none mb-4">
            <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`btn btn-sm rounded-pill fw-semibold text-nowrap text-decoration-none ${
                    isActive(item) ? 'btn-dark' : 'btn-outline-dark'
                  }`}
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
              <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '100px' }}>
                <div className="card-body p-3">
                  {/* User Info */}
                  <div className="d-flex align-items-center gap-2 px-3 py-3 mb-2 border-bottom">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 36, height: 36, background: 'rgba(0,70,255,0.1)' }}
                    >
                      <i className="bi bi-person-fill" style={{ color: 'var(--tc-theme-primary)' }} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="mb-0 fw-bold fs-7 text-truncate">{user.name}</p>
                      <p className="mb-0 text-muted text-truncate" style={{ fontSize: 12 }}>{user.email}</p>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <nav className="nav flex-column gap-1">
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-link rounded-3 d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${
                          isActive(item) ? 'fw-bold' : 'text-dark'
                        }`}
                        style={
                          isActive(item)
                            ? { background: 'rgba(0,70,255,0.08)', color: 'var(--tc-theme-primary)' }
                            : {}
                        }
                      >
                        <i className={`bi ${item.icon} fs-6`} />
                        <span className="fs-7">{item.label}</span>
                      </Link>
                    ))}
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
