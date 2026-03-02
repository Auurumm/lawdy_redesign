import type { DocumentWithAnalysis, StatisticsResponse, PaginatedResponse, ChatMessage } from '@/types/database';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      // 원래 요청 재시도
      response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } else {
      // 리프레시 실패 시 로그인 페이지로
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new APIError(401, '세션이 만료되었습니다.');
    }
  }

  return response;
}

export const api = {
  // Documents
  async getDocuments(page = 1, limit = 10): Promise<PaginatedResponse<DocumentWithAnalysis>> {
    const res = await fetchWithAuth(`/api/documents?page=${page}&limit=${limit}`);
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async uploadDocument(file: File): Promise<{ document: DocumentWithAnalysis }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async getDocument(id: string): Promise<{ document: DocumentWithAnalysis }> {
    const res = await fetchWithAuth(`/api/documents/${id}`);
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    const res = await fetchWithAuth(`/api/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async analyzeDocument(id: string): Promise<{ analysis: unknown }> {
    const res = await fetchWithAuth(`/api/documents/${id}/analyze`, { method: 'POST' });
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async getChatMessages(documentId: string): Promise<{ messages: ChatMessage[] }> {
    const res = await fetchWithAuth(`/api/documents/${documentId}/chat`);
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  async sendChatMessage(documentId: string, message: string): Promise<{ message: ChatMessage }> {
    const res = await fetchWithAuth(`/api/documents/${documentId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },

  // Statistics
  async getStatistics(): Promise<StatisticsResponse> {
    const res = await fetchWithAuth('/api/statistics');
    if (!res.ok) {
      const data = await res.json();
      throw new APIError(res.status, data.error);
    }
    return res.json();
  },
};
