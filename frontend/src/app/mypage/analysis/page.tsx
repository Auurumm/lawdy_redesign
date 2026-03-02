'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import type { DocumentWithAnalysis, ChatMessage } from '@/types/database';

const riskLabels: Record<string, string> = { high: '높음', medium: '중간', low: '낮음' };
const riskBadgeClass: Record<string, string> = { high: 'bg-danger', medium: 'bg-warning text-dark', low: 'bg-success' };
const riskColorMap: Record<string, string> = { low: '#198754', medium: '#ffc107', high: '#dc3545' };

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
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'recent'>('ai');
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

  const { user } = useAuth();

  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
    setActiveSubTab('ai');
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
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fs-7">로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">법률계약서 AI분석</h2>
        <p className="text-muted fs-6 mb-0">계약서를 업로드하여 AI 분석을 즉시 시작하세요.</p>
      </div>

      {/* Sub-tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          onClick={() => setActiveSubTab('ai')}
          className={`btn btn-sm rounded-pill fw-semibold ${
            activeSubTab === 'ai' ? 'btn-dark' : 'btn-outline-dark'
          }`}
        >
          AI리스크 분석
        </button>
        <button
          onClick={() => setActiveSubTab('recent')}
          className={`btn btn-sm rounded-pill fw-semibold ${
            activeSubTab === 'recent' ? 'btn-dark' : 'btn-outline-dark'
          }`}
        >
          최근 문서
        </button>
      </div>

      {activeSubTab === 'ai' ? (
        <div className="row g-4">
          {/* Main Area */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4" style={{ minHeight: 400 }}>
              <div className="card-body p-4">
                {/* Idle */}
                {uploadStatus === 'idle' && (
                  <p className="fs-6 mb-0">
                    안녕하세요! 법률계약서 분석 AI입니다. 아래에서 문서를 업로드하면<br />
                    AI가 법적 위험 요소를 자동으로 분석해드립니다.
                  </p>
                )}

                {/* Uploading / Analyzing */}
                {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="fw-semibold fs-6">{uploadProgress}</p>
                    <p className="text-muted fs-7">잠시만 기다려주세요...</p>
                  </div>
                )}

                {/* Error */}
                {uploadStatus === 'error' && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    <div>
                      <p className="mb-1 fw-medium">{errorMessage}</p>
                      <button onClick={resetUpload} className="btn btn-sm btn-outline-danger">다시 시도</button>
                    </div>
                  </div>
                )}

                {/* Completed - Results + Chat */}
                {uploadStatus === 'completed' && (
                  <div className="d-flex flex-column" style={{ height: 550 }}>
                    {currentDocumentName && (
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                        <span className="fw-semibold fs-7">{currentDocumentName}</span>
                        <button onClick={resetUpload} className="btn btn-sm btn-outline-primary rounded-pill">
                          새 문서 분석
                        </button>
                      </div>
                    )}

                    <div ref={chatContainerRef} className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 420 }}>
                      {/* Analysis Result */}
                      {analysisResult && (
                        <div className="mb-4">
                          <div className="bg-light rounded-3 p-3 mb-3">
                            <p className="fw-bold fs-7 mb-1">분석 요약</p>
                            <p className="fs-7 text-muted mb-0">{analysisResult.summary}</p>
                          </div>

                          {analysisResult.riskItems.length > 0 && (
                            <div className="mb-3">
                              <p className="fw-bold fs-7 mb-3">발견된 위험 요소 ({analysisResult.riskItems.length}개)</p>
                              <div className="d-flex flex-column gap-3">
                                {analysisResult.riskItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className="ps-3"
                                    style={{ borderLeft: `4px solid ${riskColorMap[item.severity]}` }}
                                  >
                                    <p className="fw-semibold fs-7 mb-1">{index + 1}. {item.title}</p>
                                    <p className="fs-7 text-muted mb-1">{item.description}</p>
                                    <p className="fs-7 text-muted mb-0" style={{ opacity: 0.7 }}>권장: {item.recommendation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {chatMessages.length === 0 && (
                            <div className="text-center py-3 border-top">
                              <p className="fs-7 fw-semibold mb-0" style={{ color: 'var(--tc-theme-primary)' }}>
                                궁금한 점이 있으시면 아래에서 질문해주세요!
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chat Messages */}
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div
                            className={`rounded-3 px-3 py-2 fs-7 ${
                              msg.role === 'user' ? 'text-white' : 'bg-light'
                            }`}
                            style={{
                              maxWidth: '80%',
                              whiteSpace: 'pre-wrap',
                              ...(msg.role === 'user' ? { background: 'var(--tc-theme-primary)' } : {}),
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}

                      {isSending && (
                        <div className="d-flex justify-content-start mb-3">
                          <div className="bg-light rounded-3 px-3 py-2">
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
                    <div className="d-flex gap-2 pt-3 border-top">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="계약서에 대해 질문해보세요..."
                        className="form-control form-control-sm rounded-3"
                        disabled={isSending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isSending || !chatInput.trim()}
                        className="btn btn-sm btn-primary rounded-3 px-3"
                        style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}
                      >
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
              className={`card rounded-4 p-5 text-center mt-3 ${
                uploadStatus !== 'idle' ? 'opacity-50 pe-none' : ''
              }`}
              style={{
                border: `2px dashed ${isDragging ? 'var(--tc-theme-primary)' : '#dee2e6'}`,
                cursor: uploadStatus === 'idle' ? 'pointer' : 'default',
                background: isDragging ? 'rgba(0,70,255,0.03)' : 'transparent',
              }}
            >
              <i className="bi bi-cloud-arrow-up fs-2 text-muted d-block mb-2" />
              <p className="text-muted fs-7 mb-1">
                파일을 드래그하거나 <span className="fw-semibold" style={{ color: 'var(--tc-theme-primary)' }}>클릭</span>하여 업로드
              </p>
              <p className="text-muted mb-0" style={{ fontSize: 12 }}>PDF, DOCX, DOC, TXT (최대 50MB)</p>
            </div>
          </div>

          {/* Right Sidebar - Analysis Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">분석 요약</h6>

                {analysisResult ? (
                  <>
                    <span
                      className={`badge ${riskBadgeClass[analysisResult.riskLevel]} rounded-pill mb-3`}
                    >
                      위험 요소: {analysisResult.riskItems.length}개
                    </span>

                    <p className="fw-bold fs-7 mb-2">위험도 점수</p>
                    <div className="progress mb-2 rounded-pill" style={{ height: 8 }}>
                      <div
                        className="progress-bar rounded-pill"
                        role="progressbar"
                        style={{
                          width: riskScoreWidth,
                          backgroundColor: riskColorMap[analysisResult.riskLevel],
                        }}
                      />
                    </div>
                    <span
                      className="badge rounded-pill text-white"
                      style={{ backgroundColor: riskColorMap[analysisResult.riskLevel] }}
                    >
                      {riskLabels[analysisResult.riskLevel]} ({analysisResult.riskScore}점)
                    </span>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-shield-check fs-1 text-muted d-block mb-2" />
                    <p className="text-muted fs-7 mb-0">문서를 업로드하면<br />분석 결과가 여기에 표시됩니다.</p>
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
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-text fs-1 text-muted d-block mb-3" />
              <p className="text-muted mb-2">아직 분석한 문서가 없습니다.</p>
              <button onClick={() => setActiveSubTab('ai')} className="btn btn-sm btn-primary rounded-pill" style={{ background: 'var(--tc-theme-primary)', borderColor: 'var(--tc-theme-primary)' }}>
                첫 문서 분석하기
              </button>
            </div>
          ) : (
            documentList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => doc.status === 'completed' && loadDocumentChat(doc.id, doc.name, doc.analysis)}
                className={`card border-0 shadow-sm rounded-4 ${
                  doc.status === 'completed' ? 'hover-up' : ''
                }`}
                style={{ cursor: doc.status === 'completed' ? 'pointer' : 'default' }}
              >
                <div className="card-body p-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: 'rgba(0,70,255,0.08)' }}
                    >
                      <i className="bi bi-file-earmark-text" style={{ color: 'var(--tc-theme-primary)' }} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold fs-7">{doc.name}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                        {doc.date} &middot; {doc.time} &middot; {doc.size}
                        {doc.status === 'completed' && (
                          <span className={`badge ${riskBadgeClass[doc.risk]} rounded-pill ms-2`} style={{ fontSize: 10 }}>
                            위험도: {riskLabels[doc.risk]}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className={`fs-7 fw-medium ${doc.status === 'completed' ? '' : 'text-muted'}`} style={doc.status === 'completed' ? { color: 'var(--tc-theme-primary)' } : {}}>
                    {doc.status === 'uploading' && '↻ 업로드중'}
                    {doc.status === 'parsing' && '↻ 파싱중'}
                    {doc.status === 'analyzing' && '↻ 분석중'}
                    {doc.status === 'completed' && '✓ 완료'}
                    {doc.status === 'failed' && '✕ 실패'}
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
