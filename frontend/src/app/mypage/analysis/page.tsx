'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { DocumentWithAnalysis, ChatMessage } from '@/types/database';

const riskLabels: Record<string, string> = { high: '높음', medium: '중간', low: '낮음' };
const riskBadgeStyle: Record<string, React.CSSProperties> = {
  high: { background: 'rgba(220,53,69,0.1)', color: '#dc3545' },
  medium: { background: 'rgba(255,193,7,0.1)', color: '#cc9a00' },
  low: { background: 'rgba(25,135,84,0.1)', color: '#198754' },
};
const riskColorMap: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const riskGradientMap: Record<string, string> = {
  low: 'linear-gradient(135deg, #10b981, #34d399)',
  medium: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  high: 'linear-gradient(135deg, #ef4444, #f87171)',
};

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  summary: string;
  riskItems: Array<{
    title: string;
    description: string;
    recommendation: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted" style={{ fontSize: 14 }}>데이터를 불러오는 중...</p>
      </div>
    }>
      <AnalysisPageContent />
    </Suspense>
  );
}

function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeSubTab = (searchParams.get('tab') === 'recent' ? 'recent' : 'ai') as 'ai' | 'recent';
  const docParam = searchParams.get('doc');

  const setActiveSubTab = useCallback((tab: 'ai' | 'recent') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    if (tab === 'recent') params.delete('doc');
    router.replace(`/mypage/analysis?${params.toString()}`);
  }, [searchParams, router]);

  const [documents, setDocuments] = useState<DocumentWithAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'completed' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [currentDocumentName, setCurrentDocumentName] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const docParamHandled = useRef<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-load document from URL ?doc= parameter
  useEffect(() => {
    if (docParam && docParam !== docParamHandled.current && documents.length > 0) {
      docParamHandled.current = docParam;
      const doc = documents.find(d => d.id === docParam);
      if (doc && doc.status === 'completed') {
        const analysis = doc.analyses?.[0] ? {
          riskLevel: doc.analyses[0].risk_level as 'low' | 'medium' | 'high',
          riskScore: doc.analyses[0].risk_score || 0,
          summary: doc.analyses[0].summary || '',
          riskItems: (doc.analyses[0].risk_items || []) as AnalysisResult['riskItems'],
          recommendations: [],
        } : undefined;
        loadDocumentChat(doc.id, doc.file_name, analysis);
      }
    }
  }, [docParam, documents]);

  async function loadDocuments() {
    try {
      const res = await api.getDocuments(1, 20);
      setDocuments(res.data || []);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files[0]);
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('지원하지 않는 파일 형식입니다. PDF, DOC, DOCX, TXT 파일만 업로드 가능합니다.');
      setUploadStatus('error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('파일 크기가 50MB를 초과합니다.');
      setUploadStatus('error');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadProgress('문서 업로드 중...');
      setErrorMessage('');
      setChatMessages([]);

      const uploadRes = await api.uploadDocument(file);
      const docId = uploadRes.document.id;

      setUploadStatus('analyzing');
      setUploadProgress('AI가 문서를 분석 중...');

      const analyzeRes = await api.analyzeDocument(docId);
      setAnalysisResult(analyzeRes.analysis as AnalysisResult);
      setCurrentDocumentId(docId);
      setCurrentDocumentName(file.name);
      setUploadStatus('completed');
      setUploadProgress('분석 완료!');
      loadDocuments();
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      setErrorMessage(error instanceof Error ? error.message : '문서 처리 중 오류가 발생했습니다.');
      setUploadStatus('error');
    }
  };

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadProgress('');
    setAnalysisResult(null);
    setErrorMessage('');
    setCurrentDocumentId(null);
    setCurrentDocumentName('');
    setChatMessages([]);
    setChatInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadDocumentChat = async (docId: string, docName: string, analysis?: AnalysisResult) => {
    setCurrentDocumentId(docId);
    setCurrentDocumentName(docName);
    setAnalysisResult(analysis || null);
    setUploadStatus('completed');
    router.replace(`/mypage/analysis?tab=ai&doc=${docId}`);
    try {
      const res = await api.getChatMessages(docId);
      const formattedMessages = res.messages.map((m: ChatMessage & { created_at?: string }) => ({
        ...m,
        createdAt: m.createdAt ?? m.created_at ?? new Date().toISOString(),
      }));
      setChatMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat:', error);
      setChatMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !currentDocumentId || isSending) return;
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);
    try {
      const res = await api.sendChatMessage(currentDocumentId, userMessage.content);
      setChatMessages(prev => [...prev, res.message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '메시지 전송에 실패했습니다. 다시 시도해주세요.',
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const documentList = documents.map(doc => ({
    id: doc.id,
    name: doc.file_name,
    date: new Date(doc.created_at).toLocaleDateString('ko-KR'),
    time: new Date(doc.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    size: `${(doc.file_size / (1024 * 1024)).toFixed(1)}MB`,
    items: doc.analyses?.[0]?.risk_items?.length ?? 0,
    risk: (doc.analyses?.[0]?.risk_level || 'low') as 'low' | 'medium' | 'high',
    status: doc.status as 'uploading' | 'parsing' | 'analyzing' | 'completed' | 'failed',
    analysis: doc.analyses?.[0] ? {
      riskLevel: doc.analyses[0].risk_level as 'low' | 'medium' | 'high',
      riskScore: doc.analyses[0].risk_score || 0,
      summary: doc.analyses[0].summary || '',
      riskItems: (doc.analyses[0].risk_items || []) as AnalysisResult['riskItems'],
      recommendations: [],
    } : undefined,
  }));

  const riskScoreWidth = analysisResult ? `${analysisResult.riskScore}%` : '0%';

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

  return (
    <>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">AI 계약서 분석</h4>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>계약서를 업로드하여 AI 위험 분석을 즉시 시작하세요.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="d-flex gap-2 mb-4">
        {[
          { key: 'ai' as const, label: 'AI 리스크 분석', icon: 'bi-shield-check' },
          { key: 'recent' as const, label: '최근 문서', icon: 'bi-clock-history' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className="btn btn-sm rounded-pill fw-semibold d-flex align-items-center gap-1"
            style={activeSubTab === tab.key ? {
              background: 'linear-gradient(135deg, #312e81, #4338ca)',
              color: '#fff',
              border: 'none',
            } : {
              background: '#fff',
              color: '#64748b',
              border: '1px solid #e2e8f0',
            }}
          >
            <i className={`bi ${tab.icon}`} style={{ fontSize: 13 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'ai' ? (
        <div className="row g-4">
          {/* Main Area */}
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden" style={{ minHeight: 400, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="p-4">
                {/* Idle */}
                {uploadStatus === 'idle' && (
                  <div className="text-center py-4">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 72, height: 72, background: 'rgba(0,70,255,0.06)' }}
                    >
                      <i className="bi bi-robot fs-1" style={{ color: 'var(--tc-theme-primary)', opacity: 0.6 }} />
                    </div>
                    <h6 className="fw-bold mb-2">AI 리스크 분석</h6>
                    <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                      아래에서 계약서 문서를 업로드하면<br />
                      AI가 법적 위험 요소를 자동으로 분석해드립니다.
                    </p>
                  </div>
                )}

                {/* Uploading / Analyzing */}
                {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
                    <div className="position-relative mb-4">
                      <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <h6 className="fw-bold mb-1">{uploadProgress}</h6>
                    <p className="text-muted" style={{ fontSize: 13 }}>잠시만 기다려주세요...</p>
                  </div>
                )}

                {/* Error */}
                {uploadStatus === 'error' && (
                  <div className="rounded-3 p-4 d-flex align-items-start gap-3" style={{ background: 'rgba(220,53,69,0.06)' }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: 'rgba(220,53,69,0.1)' }}
                    >
                      <i className="bi bi-exclamation-triangle" style={{ color: '#dc3545' }} />
                    </div>
                    <div>
                      <p className="mb-2 fw-semibold" style={{ color: '#dc3545', fontSize: 14 }}>{errorMessage}</p>
                      <button
                        onClick={resetUpload}
                        className="btn btn-sm rounded-pill px-3"
                        style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', border: 'none', fontSize: 13 }}
                      >
                        다시 시도
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed - Results + Chat */}
                {uploadStatus === 'completed' && (
                  <div className="d-flex flex-column" style={{ height: 550 }}>
                    {currentDocumentName && (
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-2 d-flex align-items-center justify-content-center"
                            style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.08)' }}
                          >
                            <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                          </div>
                          <span className="fw-semibold" style={{ fontSize: 14 }}>{currentDocumentName}</span>
                        </div>
                        <button
                          onClick={resetUpload}
                          className="btn btn-sm rounded-pill px-3"
                          style={{ background: 'rgba(0,70,255,0.08)', color: 'var(--tc-theme-primary)', border: 'none', fontSize: 12, fontWeight: 600 }}
                        >
                          새 문서 분석
                        </button>
                      </div>
                    )}

                    <div ref={chatContainerRef} className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 420 }}>
                      {/* Analysis Result */}
                      {analysisResult && (
                        <div className="mb-4">
                          <div className="rounded-3 p-3 mb-3" style={{ background: '#f8f9fc' }}>
                            <p className="fw-bold mb-1" style={{ fontSize: 13, color: 'var(--tc-theme-primary)' }}>
                              <i className="bi bi-lightbulb me-1" />
                              분석 요약
                            </p>
                            <p className="text-muted mb-0" style={{ fontSize: 13 }}>{analysisResult.summary}</p>
                          </div>

                          {analysisResult.riskItems.length > 0 && (
                            <div className="mb-3">
                              <p className="fw-bold mb-3" style={{ fontSize: 13 }}>
                                발견된 위험 요소 ({analysisResult.riskItems.length}개)
                              </p>
                              <div className="d-flex flex-column gap-3">
                                {analysisResult.riskItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="rounded-3 p-3"
                                    style={{
                                      background: '#fff',
                                      borderLeft: `3px solid ${riskColorMap[item.severity]}`,
                                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                    }}
                                  >
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                      <span className="badge rounded-pill" style={{ ...riskBadgeStyle[item.severity], fontSize: 10, fontWeight: 600 }}>
                                        {riskLabels[item.severity]}
                                      </span>
                                      <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{item.title}</p>
                                    </div>
                                    <p className="text-muted mb-1" style={{ fontSize: 12 }}>{item.description}</p>
                                    <p className="mb-0" style={{ fontSize: 12, color: 'var(--tc-theme-primary)', opacity: 0.8 }}>
                                      <i className="bi bi-check2 me-1" />
                                      {item.recommendation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {chatMessages.length === 0 && (
                            <div className="text-center py-3 rounded-3" style={{ background: '#f8f9fc' }}>
                              <p className="mb-0 fw-semibold" style={{ color: 'var(--tc-theme-primary)', fontSize: 13 }}>
                                <i className="bi bi-chat-dots me-1" />
                                궁금한 점이 있으시면 아래에서 질문해주세요
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chat Messages */}
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                          {msg.role === 'assistant' && (
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"
                              style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.08)', marginTop: 2 }}
                            >
                              <i className="bi bi-robot" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                            </div>
                          )}
                          <div
                            className="rounded-3 px-3 py-2"
                            style={{
                              maxWidth: '80%',
                              whiteSpace: 'pre-wrap',
                              fontSize: 13,
                              ...(msg.role === 'user'
                                ? { background: 'linear-gradient(135deg, #312e81, #4338ca)', color: '#fff' }
                                : { background: '#f8f9fc', color: '#334155' }),
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}

                      {isSending && (
                        <div className="d-flex justify-content-start mb-3">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-2"
                            style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.08)', marginTop: 2 }}
                          >
                            <i className="bi bi-robot" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                          </div>
                          <div className="rounded-3 px-3 py-2" style={{ background: '#f8f9fc' }}>
                            <div className="d-flex gap-1">
                              <div className="spinner-grow spinner-grow-sm text-muted" role="status" />
                              <div className="spinner-grow spinner-grow-sm text-muted" role="status" style={{ animationDelay: '0.15s' }} />
                              <div className="spinner-grow spinner-grow-sm text-muted" role="status" style={{ animationDelay: '0.3s' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="d-flex gap-2 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="계약서에 대해 질문해보세요..."
                        className="form-control rounded-pill"
                        style={{ fontSize: 13, border: '1px solid #e2e8f0', padding: '8px 16px' }}
                        disabled={isSending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isSending || !chatInput.trim()}
                        className="btn rounded-pill px-4 d-flex align-items-center gap-1 flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #312e81, #4338ca)',
                          color: '#fff',
                          border: 'none',
                          fontSize: 13,
                          opacity: (isSending || !chatInput.trim()) ? 0.5 : 1,
                        }}
                      >
                        <i className="bi bi-send" style={{ fontSize: 12 }} />
                        전송
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="d-none"
            />
            <div
              onClick={() => uploadStatus === 'idle' && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-4 p-5 text-center mt-3 ${
                uploadStatus !== 'idle' ? 'opacity-50 pe-none' : ''
              }`}
              style={{
                border: `2px dashed ${isDragging ? 'var(--tc-theme-primary)' : '#d1d5db'}`,
                cursor: uploadStatus === 'idle' ? 'pointer' : 'default',
                background: isDragging ? 'rgba(0,70,255,0.03)' : '#fff',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 56, height: 56, background: isDragging ? 'rgba(0,70,255,0.1)' : '#f1f5f9' }}
              >
                <i className="bi bi-cloud-arrow-up fs-3" style={{ color: isDragging ? 'var(--tc-theme-primary)' : '#94a3b8' }} />
              </div>
              <p className="mb-1" style={{ fontSize: 14, color: '#475569' }}>
                파일을 드래그하거나 <span className="fw-semibold" style={{ color: 'var(--tc-theme-primary)' }}>클릭</span>하여 업로드
              </p>
              <p className="text-muted mb-0" style={{ fontSize: 12 }}>PDF, DOCX, DOC, TXT (최대 50MB)</p>
            </div>
          </div>

          {/* Right Sidebar - Analysis Summary */}
          <div className="col-lg-4">
            <div className="rounded-4 overflow-hidden" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div className="p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="rounded-2 d-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, background: 'rgba(0,70,255,0.1)' }}
                  >
                    <i className="bi bi-bar-chart" style={{ color: 'var(--tc-theme-primary)', fontSize: 12 }} />
                  </div>
                  <h6 className="fw-bold mb-0">분석 요약</h6>
                </div>

                {analysisResult ? (
                  <div>
                    {/* Risk Level Badge */}
                    <div className="text-center mb-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                        style={{ width: 72, height: 72, background: riskGradientMap[analysisResult.riskLevel] }}
                      >
                        <span className="text-white fw-bold fs-5">{analysisResult.riskScore}</span>
                      </div>
                      <span className="badge rounded-pill px-3" style={{ ...riskBadgeStyle[analysisResult.riskLevel], fontWeight: 600 }}>
                        위험도: {riskLabels[analysisResult.riskLevel]}
                      </span>
                    </div>

                    {/* Risk Score Bar */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted" style={{ fontSize: 12 }}>위험도 점수</span>
                        <span className="fw-semibold" style={{ fontSize: 12 }}>{analysisResult.riskScore}/100</span>
                      </div>
                      <div className="progress rounded-pill" style={{ height: 6, background: '#e2e8f0' }}>
                        <div
                          className="progress-bar rounded-pill"
                          role="progressbar"
                          style={{ width: riskScoreWidth, background: riskGradientMap[analysisResult.riskLevel] }}
                        />
                      </div>
                    </div>

                    {/* Risk Items Count */}
                    <div className="rounded-3 p-3" style={{ background: '#f8f9fc' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted" style={{ fontSize: 13 }}>발견된 위험 요소</span>
                        <span className="fw-bold" style={{ color: riskColorMap[analysisResult.riskLevel] }}>
                          {analysisResult.riskItems.length}개
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: 64, height: 64, background: '#f1f5f9' }}
                    >
                      <i className="bi bi-shield-check fs-2" style={{ color: '#94a3b8' }} />
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: 13 }}>문서를 업로드하면<br />분석 결과가 표시됩니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Recent Documents Tab */
        <div className="d-flex flex-column gap-3">
          {documentList.length === 0 ? (
            <div className="text-center py-5 rounded-4" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 64, height: 64, background: '#f1f5f9' }}
              >
                <i className="bi bi-file-earmark-text fs-2" style={{ color: '#94a3b8' }} />
              </div>
              <p className="text-muted mb-2" style={{ fontSize: 14 }}>아직 분석한 문서가 없습니다.</p>
              <button
                onClick={() => setActiveSubTab('ai')}
                className="btn btn-sm rounded-pill px-4"
                style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)', color: '#fff', border: 'none' }}
              >
                첫 문서 분석하기
              </button>
            </div>
          ) : (
            documentList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => doc.status === 'completed' && loadDocumentChat(doc.id, doc.name, doc.analysis)}
                className={`rounded-4 ${doc.status === 'completed' ? 'hover-up' : ''}`}
                style={{
                  cursor: doc.status === 'completed' ? 'pointer' : 'default',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: 'rgba(0,70,255,0.06)' }}
                    >
                      <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)', fontSize: 16 }} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold" style={{ fontSize: 14 }}>{doc.name}</p>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                          {doc.date} &middot; {doc.time} &middot; {doc.size}
                        </p>
                        {doc.status === 'completed' && (
                          <span className="badge rounded-pill" style={{ ...riskBadgeStyle[doc.risk], fontSize: 10, fontWeight: 600 }}>
                            {riskLabels[doc.risk]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="fw-semibold" style={{ fontSize: 13, color: doc.status === 'completed' ? 'var(--tc-theme-primary)' : '#94a3b8' }}>
                    {doc.status === 'uploading' && '업로드중'}
                    {doc.status === 'parsing' && '파싱중'}
                    {doc.status === 'analyzing' && '분석중'}
                    {doc.status === 'completed' && (
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-check-circle-fill" style={{ fontSize: 14 }} /> 완료
                      </span>
                    )}
                    {doc.status === 'failed' && '실패'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
