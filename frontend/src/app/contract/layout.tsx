'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/template/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function ContractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

  return <>{children}</>;
}
