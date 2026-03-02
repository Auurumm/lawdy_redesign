'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'inquiries' | 'support' | 'documents' | 'users' | 'jobs';

interface Admin {
  id: string;
  username: string;
  name: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  inquiry_type: 'general' | 'other';
  content: string;
  admin_memo: string | null;
  status: 'received' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
}

interface SupportRequest {
  id: string;
  user_email: string;
  support_level: 'low' | 'normal' | 'high';
  problem_summary: string;
  problem_detail: string | null;
  admin_memo: string | null;
  status: 'received' | 'processing' | 'completed';
  created_at: string;
}

interface Document {
  id: string;
  file_name: string;
  user_email: string;
  status: string;
  created_at: string;
  analyses: Array<{
    risk_level: 'low' | 'medium' | 'high';
    risk_score: number;
  }>;
}

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  suspended: boolean;
}

interface JobListing {
  id: string;
  title: string;
  description: string;
  team: string;
  location: string;
  employment_type: string;
  requirements: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const statusLabels = {
  received: '접수',
  processing: '처리중',
  completed: '완료',
};

const statusColors = {
  received: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const levelLabels = {
  low: '낮음',
  normal: '보통',
  high: '높음',
};

const levelColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-red-100 text-red-800',
};

const riskLabels = {
  low: '낮음',
  medium: '중간',
  high: '높음',
};

const riskColors = {
  low: 'text-green-600',
  medium: 'text-orange-500',
  high: 'text-red-600',
};

export default function AdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('inquiries');
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<SupportRequest | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        const data = await res.json();
        setLoginError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setLoginError('로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setAdmin(null);
    router.refresh();
  };

  const loadInquiries = useCallback(async () => {
    const res = await fetch('/api/admin/inquiries', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setInquiries(data.data);
    }
  }, []);

  const loadSupportRequests = useCallback(async () => {
    const res = await fetch('/api/admin/support-requests', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setSupportRequests(data.data);
    }
  }, []);

  const loadDocuments = useCallback(async () => {
    const res = await fetch('/api/admin/documents', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setDocuments(data.data);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.data);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    const res = await fetch('/api/admin/jobs', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setJobs(data.data);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      if (activeTab === 'inquiries') loadInquiries();
      else if (activeTab === 'support') loadSupportRequests();
      else if (activeTab === 'documents') loadDocuments();
      else if (activeTab === 'users') loadUsers();
      else if (activeTab === 'jobs') loadJobs();
    }
  }, [admin, activeTab, loadInquiries, loadSupportRequests, loadDocuments, loadUsers, loadJobs]);

  const updateInquiryStatus = async (id: string, status: string, memo?: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_memo: memo }),
      credentials: 'include',
    });
    loadInquiries();
    setSelectedInquiry(null);
  };

  const updateSupportStatus = async (id: string, status: string, memo?: string) => {
    await fetch(`/api/admin/support-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_memo: memo }),
      credentials: 'include',
    });
    loadSupportRequests();
    setSelectedSupport(null);
  };

  const toggleUserSuspend = async (id: string, suspended: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspended }),
      credentials: 'include',
    });
    loadUsers();
    setSelectedUser(null);
  };

  const saveJob = async (job: Partial<JobListing>) => {
    if (selectedJob) {
      await fetch(`/api/admin/jobs/${selectedJob.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
        credentials: 'include',
      });
    } else {
      await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
        credentials: 'include',
      });
    }
    loadJobs();
    setSelectedJob(null);
    setShowJobForm(false);
  };

  const deleteJob = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    loadJobs();
    setSelectedJob(null);
    setShowJobForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">관리자 로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Lawdy 관리자</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{admin.name || admin.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'inquiries' as const, label: '문의' },
            { id: 'support' as const, label: '지원 요청' },
            { id: 'documents' as const, label: '문서/분석' },
            { id: 'users' as const, label: '회원' },
            { id: 'jobs' as const, label: '채용' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'inquiries' && (
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">문의 목록</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">이름</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">이메일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">유형</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">내용</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">접수일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-3 text-sm">{inquiry.name}</td>
                      <td className="py-3 px-3 text-sm">{inquiry.email}</td>
                      <td className="py-3 px-3 text-sm">
                        {inquiry.inquiry_type === 'general' ? '일반 문의' : '기타 요청'}
                      </td>
                      <td className="py-3 px-3 text-sm max-w-[200px] truncate">{inquiry.content}</td>
                      <td className="py-3 px-3 text-sm">
                        {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[inquiry.status]}`}>
                          {statusLabels[inquiry.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        문의가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">지원 요청 목록</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">이메일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">지원 수준</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">문제 요약</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">접수일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {supportRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedSupport(req)}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        req.support_level === 'high' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-sm">{req.user_email}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded ${levelColors[req.support_level]}`}>
                          {req.support_level === 'high' && '🔥 '}
                          {levelLabels[req.support_level]}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm max-w-[250px] truncate">{req.problem_summary}</td>
                      <td className="py-3 px-3 text-sm">
                        {new Date(req.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded ${statusColors[req.status]}`}>
                          {statusLabels[req.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {supportRequests.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        지원 요청이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">문서/분석 목록</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">문서명</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">사용자</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">업로드일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">상태</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">위험도</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-3 text-sm max-w-[200px] truncate">{doc.file_name}</td>
                      <td className="py-3 px-3 text-sm">{doc.user_email}</td>
                      <td className="py-3 px-3 text-sm">
                        {new Date(doc.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {doc.status === 'completed' ? '완료' : doc.status === 'failed' ? '실패' : '진행중'}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {doc.analyses?.[0]?.risk_level && (
                          <span className={riskColors[doc.analyses[0].risk_level]}>
                            {riskLabels[doc.analyses[0].risk_level]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        문서가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">회원 목록</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">이메일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">이름</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">가입일</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-3 text-sm">{user.email}</td>
                      <td className="py-3 px-3 text-sm">{user.name}</td>
                      <td className="py-3 px-3 text-sm">
                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.suspended ? '정지' : '정상'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        회원이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">채용 공고 관리</h2>
                <button
                  onClick={() => { setSelectedJob(null); setShowJobForm(true); }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                >
                  + 새 공고 등록
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">순서</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">직무</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">팀</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">위치</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">고용형태</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-600">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      onClick={() => { setSelectedJob(job); setShowJobForm(true); }}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-3 text-sm">{job.sort_order}</td>
                      <td className="py-3 px-3 text-sm font-medium">{job.title}</td>
                      <td className="py-3 px-3 text-sm">{job.team}</td>
                      <td className="py-3 px-3 text-sm">{job.location}</td>
                      <td className="py-3 px-3 text-sm">{job.employment_type}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.is_active ? '공개' : '비공개'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        등록된 채용 공고가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedInquiry && (
        <InquiryModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={updateInquiryStatus}
        />
      )}

      {selectedSupport && (
        <SupportModal
          request={selectedSupport}
          onClose={() => setSelectedSupport(null)}
          onUpdate={updateSupportStatus}
        />
      )}

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggleSuspend={toggleUserSuspend}
        />
      )}

      {showJobForm && (
        <JobModal
          job={selectedJob}
          onClose={() => { setSelectedJob(null); setShowJobForm(false); }}
          onSave={saveJob}
          onDelete={selectedJob ? () => deleteJob(selectedJob.id) : undefined}
        />
      )}
    </div>
  );
}

function InquiryModal({
  inquiry,
  onClose,
  onUpdate,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdate: (id: string, status: string, memo?: string) => void;
}) {
  const [memo, setMemo] = useState(inquiry.admin_memo || '');
  const [status, setStatus] = useState(inquiry.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">문의 상세</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">이름</label>
                <p className="font-medium">{inquiry.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">이메일</label>
                <p className="font-medium">{inquiry.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">유형</label>
                <p className="font-medium">
                  {inquiry.inquiry_type === 'general' ? '일반 문의' : '기타 요청'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">접수일</label>
                <p className="font-medium">{new Date(inquiry.created_at).toLocaleString('ko-KR')}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">문의 내용</label>
              <p className="font-medium whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                {inquiry.content}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">관리자 메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                rows={3}
                placeholder="관리자 메모를 입력하세요"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              >
                <option value="received">접수</option>
                <option value="processing">처리중</option>
                <option value="completed">완료</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => onUpdate(inquiry.id, status, memo)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportModal({
  request,
  onClose,
  onUpdate,
}: {
  request: SupportRequest;
  onClose: () => void;
  onUpdate: (id: string, status: string, memo?: string) => void;
}) {
  const [memo, setMemo] = useState(request.admin_memo || '');
  const [status, setStatus] = useState(request.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className={`p-6 ${request.support_level === 'high' ? 'border-l-4 border-red-500' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              지원 요청 상세
              {request.support_level === 'high' && (
                <span className="text-red-500">🔥 긴급</span>
              )}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">사용자 이메일</label>
                <p className="font-medium">{request.user_email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">지원 수준</label>
                <p>
                  <span className={`text-sm px-2 py-1 rounded ${levelColors[request.support_level]}`}>
                    {levelLabels[request.support_level]}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">접수일</label>
                <p className="font-medium">{new Date(request.created_at).toLocaleString('ko-KR')}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">문제 요약</label>
              <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{request.problem_summary}</p>
            </div>

            {request.problem_detail && (
              <div>
                <label className="text-sm text-gray-500">문제 상세</label>
                <p className="font-medium whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                  {request.problem_detail}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-500">관리자 메모</label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                rows={3}
                placeholder="관리자 메모를 입력하세요"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              >
                <option value="received">접수</option>
                <option value="processing">처리중</option>
                <option value="completed">완료</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={() => onUpdate(request.id, status, memo)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentModal({
  document,
  onClose,
}: {
  document: Document;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<{
    document: {
      download_url?: string;
      user_name?: string;
      user_email?: string;
      analyses?: Array<{
        summary?: string;
        risk_items?: Array<{
          title: string;
          description: string;
          severity: string;
        }>;
      }>;
      chat_messages?: Array<{
        id: string;
        role: 'user' | 'assistant';
        content: string;
        created_at: string;
      }>;
    };
  } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/documents/${document.id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      }
    }
    load();
  }, [document.id]);

  const analysis = detail?.document?.analyses?.[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">문서 상세</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">문서명</label>
                <p className="font-medium">{document.file_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">사용자</label>
                <p className="font-medium">
                  {detail?.document?.user_name || document.user_email}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">업로드일</label>
                <p className="font-medium">{new Date(document.created_at).toLocaleString('ko-KR')}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">상태</label>
                <p className="font-medium">
                  {document.status === 'completed' ? '완료' : document.status === 'failed' ? '실패' : '진행중'}
                </p>
              </div>
            </div>

            {detail?.document?.download_url && (
              <div>
                <a
                  href={detail.document.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  📥 원본 문서 다운로드
                </a>
              </div>
            )}

            {analysis && (
              <>
                <div>
                  <label className="text-sm text-gray-500">분석 요약</label>
                  <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">{analysis.summary}</p>
                </div>

                {analysis.risk_items && analysis.risk_items.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500">위험 항목</label>
                    <div className="space-y-2 mt-1">
                      {analysis.risk_items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            심각도: {item.severity === 'high' ? '높음' : item.severity === 'medium' ? '중간' : '낮음'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {detail?.document?.chat_messages && detail.document.chat_messages.length > 0 && (
              <div>
                <label className="text-sm text-gray-500">대화 내용 ({detail.document.chat_messages.length}개)</label>
                <div className="mt-2 border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                  {detail.document.chat_messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 border-b border-gray-100 last:border-b-0 ${
                        msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${
                          msg.role === 'user' ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {msg.role === 'user' ? '사용자' : 'AI'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserModal({
  user,
  onClose,
  onToggleSuspend,
}: {
  user: User;
  onClose: () => void;
  onToggleSuspend: (id: string, suspended: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">회원 상세</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">이메일</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">이름</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">가입일</label>
              <p className="font-medium">{new Date(user.created_at).toLocaleString('ko-KR')}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">계정 상태</label>
              <p>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.suspended ? '정지' : '정상'}
                </span>
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={() => onToggleSuspend(user.id, !user.suspended)}
                className={`px-4 py-2 rounded-lg text-white ${
                  user.suspended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {user.suspended ? '계정 해제' : '계정 정지'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobModal({
  job,
  onClose,
  onSave,
  onDelete,
}: {
  job: JobListing | null;
  onClose: () => void;
  onSave: (job: Partial<JobListing>) => void;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(job?.title || '');
  const [description, setDescription] = useState(job?.description || '');
  const [team, setTeam] = useState(job?.team || '');
  const [location, setLocation] = useState(job?.location || '서울');
  const [employmentType, setEmploymentType] = useState(job?.employment_type || '정규직');
  const [requirements, setRequirements] = useState(job?.requirements?.join('\n') || '');
  const [isActive, setIsActive] = useState(job?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(job?.sort_order ?? 0);

  const handleSave = () => {
    if (!title || !description || !team) {
      alert('직무명, 설명, 팀은 필수입니다.');
      return;
    }
    onSave({
      title,
      description,
      team,
      location,
      employment_type: employmentType,
      requirements: requirements.split('\n').filter(r => r.trim()),
      is_active: isActive,
      sort_order: sortOrder,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{job ? '채용 공고 수정' : '새 채용 공고'}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">직무명 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                placeholder="예: Senior AI/ML Engineer (경력)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">설명 *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                rows={2}
                placeholder="직무에 대한 간단한 설명"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">팀 *</label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  placeholder="예: 기술팀"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">위치</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  placeholder="예: 서울"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">고용형태</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                >
                  <option value="정규직">정규직</option>
                  <option value="계약직">계약직</option>
                  <option value="인턴">인턴</option>
                  <option value="파트타임">파트타임</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">정렬 순서</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">필수 요건 (줄바꿈으로 구분)</label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                rows={3}
                placeholder="5년 이상 경력&#10;NLP 전문 지식&#10;Python/PyTorch 경험"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">공개</label>
            </div>

            <div className="flex gap-2 justify-between pt-4">
              <div>
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
