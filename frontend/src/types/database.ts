// Supabase Database Types

export type DocumentStatus = 'uploading' | 'parsing' | 'indexing' | 'analyzing' | 'completed' | 'failed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
  agreed_terms: boolean;
  agreed_privacy: boolean;
}

export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string | null;
  status: DocumentStatus;
  created_at: string;
}

export interface Analysis {
  id: string;
  document_id: string;
  user_id: string;
  risk_level: RiskLevel | null;
  risk_score: number | null;
  summary: string | null;
  risk_items: RiskItem[] | null;
  created_at: string;
}

export interface RiskItem {
  title: string;
  description: string;
  recommendation: string;
  severity: RiskLevel;
  clause?: string;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// Supabase Database Schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id'>>;
        Relationships: [];
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, 'id' | 'created_at'>;
        Update: Partial<Omit<Document, 'id'>>;
        Relationships: [
          {
            foreignKeyName: 'documents_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      analyses: {
        Row: Analysis;
        Insert: Omit<Analysis, 'id' | 'created_at'>;
        Update: Partial<Omit<Analysis, 'id'>>;
        Relationships: [
          {
            foreignKeyName: 'analyses_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'analyses_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      refresh_tokens: {
        Row: RefreshToken;
        Insert: Omit<RefreshToken, 'id'>;
        Update: Partial<Omit<RefreshToken, 'id'>>;
        Relationships: [
          {
            foreignKeyName: 'refresh_tokens_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      document_status: DocumentStatus;
      risk_level: RiskLevel;
    };
    CompositeTypes: Record<string, never>;
  };
}

// API Response Types
export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

export interface DocumentWithAnalysis extends Document {
  analyses?: Analysis[];
}

export interface StatisticsResponse {
  totalAnalyses: number;
  monthlyAnalyses: number;
  completionRate: number;
  avgRiskLevel: RiskLevel | null;
  avgAnalysisTime: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
