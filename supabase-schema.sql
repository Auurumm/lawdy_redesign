-- ContractInsight Supabase Schema (계약서 생성 기능 추가)
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE document_status AS ENUM ('uploading', 'parsing', 'analyzing', 'completed', 'failed');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE contract_type AS ENUM ('employment', 'service', 'nda', 'lease', 'freelance', 'investment');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  agreed_terms BOOLEAN DEFAULT FALSE,
  agreed_privacy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table (기존 - 계약서 분석용)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT,
  storage_path TEXT,
  status document_status DEFAULT 'uploading',
  parsed_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table (기존 - 계약서 분석 결과)
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  risk_level risk_level,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  summary TEXT,
  risk_items JSONB DEFAULT '[]'::jsonb,
  key_clauses JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table (기존 - AI 채팅)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 새로 추가: 계약서 생성 관련 테이블
-- ============================================

-- Generated contracts table (생성된 계약서)
CREATE TABLE IF NOT EXISTS generated_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_type contract_type NOT NULL,
  title VARCHAR(255),
  
  -- 갑 정보
  party_a_name VARCHAR(255) NOT NULL,
  party_a_representative VARCHAR(100),
  party_a_business_number VARCHAR(50),
  party_a_address TEXT,
  
  -- 을 정보
  party_b_name VARCHAR(255) NOT NULL,
  party_b_birth_date DATE,
  party_b_address TEXT,
  party_b_contact VARCHAR(50),
  
  -- 계약 조건
  terms JSONB DEFAULT '{}'::jsonb,
  additional_clauses JSONB DEFAULT '[]'::jsonb,
  
  -- 생성된 계약서 내용
  content TEXT NOT NULL,
  
  -- 메타 정보
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_document_id ON analyses(document_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_document_id ON chat_messages(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- 새로 추가: generated_contracts 인덱스
CREATE INDEX IF NOT EXISTS idx_generated_contracts_user_id ON generated_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_contracts_type ON generated_contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_generated_contracts_created_at ON generated_contracts(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to generated_contracts table
DROP TRIGGER IF EXISTS update_generated_contracts_updated_at ON generated_contracts;
CREATE TRIGGER update_generated_contracts_updated_at
  BEFORE UPDATE ON generated_contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (RLS)
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (service role only for now)
DROP POLICY IF EXISTS "Service role can do everything on users" ON users;
CREATE POLICY "Service role can do everything on users"
ON users FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for documents
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
CREATE POLICY "Users can view their own documents"
ON documents FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
CREATE POLICY "Users can insert their own documents"
ON documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
CREATE POLICY "Users can update their own documents"
ON documents FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
CREATE POLICY "Users can delete their own documents"
ON documents FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for analyses
DROP POLICY IF EXISTS "Users can view their own analyses" ON analyses;
CREATE POLICY "Users can view their own analyses"
ON analyses FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own analyses" ON analyses;
CREATE POLICY "Users can insert their own analyses"
ON analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_messages
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
CREATE POLICY "Users can view their own chat messages"
ON chat_messages FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
CREATE POLICY "Users can insert their own chat messages"
ON chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for generated_contracts (새로 추가)
DROP POLICY IF EXISTS "Users can view their own generated contracts" ON generated_contracts;
CREATE POLICY "Users can view their own generated contracts"
ON generated_contracts FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own generated contracts" ON generated_contracts;
CREATE POLICY "Users can insert their own generated contracts"
ON generated_contracts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own generated contracts" ON generated_contracts;
CREATE POLICY "Users can update their own generated contracts"
ON generated_contracts FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own generated contracts" ON generated_contracts;
CREATE POLICY "Users can delete their own generated contracts"
ON generated_contracts FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for refresh_tokens
DROP POLICY IF EXISTS "Users can manage their own tokens" ON refresh_tokens;
CREATE POLICY "Users can manage their own tokens"
ON refresh_tokens FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- generated_contracts 테이블 생성
CREATE TABLE IF NOT EXISTS generated_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contract_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  party_a_name VARCHAR(255) NOT NULL,
  party_a_representative VARCHAR(255),
  party_a_business_number VARCHAR(50),
  party_a_address TEXT,
  party_b_name VARCHAR(255) NOT NULL,
  party_b_birth_date DATE,
  party_b_address TEXT,
  party_b_contact VARCHAR(50),
  terms JSONB DEFAULT '{}',
  additional_clauses TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_generated_contracts_user_id ON generated_contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_contracts_type ON generated_contracts(contract_type);
CREATE INDEX IF NOT EXISTS idx_generated_contracts_created_at ON generated_contracts(created_at DESC);

-- RLS 정책 설정
ALTER TABLE generated_contracts ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 계약서만 조회 가능
CREATE POLICY "Users can view own contracts" ON generated_contracts
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 계약서만 생성 가능
CREATE POLICY "Users can insert own contracts" ON generated_contracts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 계약서만 삭제 가능
CREATE POLICY "Users can delete own contracts" ON generated_contracts
  FOR DELETE USING (auth.uid() = user_id);