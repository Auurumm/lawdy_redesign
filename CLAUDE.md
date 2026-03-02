# ContractInsight (Lawdy) - Project Context

## Project Overview
AI 기반 계약서 분석 플랫폼. 문서 업로드 → Upstage Document Parse로 파싱 → Solar LLM으로 위험 분석 → 결과 저장/표시

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Express 백엔드 미사용)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Upstage Document Parse API + Solar LLM
- **Deployment**: Vercel (https://lawdy.vercel.app)

## Supabase Info
- **Project ID**: `auxiobfcqaqwljujxowp`
- **MCP 설정 완료**: `.mcp.json`에 Supabase MCP 서버 추가됨

## Current Status (2025-12-26)

### Completed
- [x] 환경 변수 설정 (`frontend/.env.local`)
- [x] Supabase 스키마 작성 (`supabase-schema.sql`)
- [x] Upstage 서비스 모듈 (`frontend/src/lib/upstage.ts`)
- [x] 문서 업로드 API (`frontend/src/app/api/documents/route.ts`)
- [x] 분석 API (`frontend/src/app/api/documents/[id]/analyze/route.ts`)
- [x] 통계 API (`frontend/src/app/api/statistics/route.ts`)
- [x] Vercel 배포 완료
- [x] Supabase MCP 설정 (`.mcp.json`)
- [x] **Supabase 테이블 생성**: MCP로 마이그레이션 적용 완료
  - users, documents, analyses, refresh_tokens 테이블
  - enum types (document_status, risk_level)
  - 인덱스, 트리거, RLS 정책 설정
- [x] **Storage 버킷 생성**: `documents` 버킷 + RLS 정책

### TODO (Next Steps)
- [ ] **PDF 업로드 및 분석 테스트** (유저 테스트 필요)
  - https://lawdy.vercel.app/login 에서 로그인
  - /mypage → 문서 분석 탭에서 PDF 업로드
  - Upstage Document Parse + Solar LLM 분석 확인

### Recently Completed (2025-12-26)
- [x] **이용약관/개인정보처리방침 전체 업데이트**
  - DOCX 파일에서 전체 내용 추출 (`[로우디] 이용약관.docx`, `[로우디] 개인정보처리방침.docx`)
  - `/terms` 페이지: 제1조~제17조 + 부칙 (전체 반영)
  - `/privacy` 페이지: 제1조~제17조 + 부칙 (전체 반영, 위탁현황 테이블 포함)
- [x] Vercel CLI 배포 완료

### Previously Completed (2025-12-25)
- [x] 마이페이지 기능 구현 완료
  - 새 문서 분석 → 탭 전환 (문서 분석 탭)
  - 분석 기록 보기 → 탭 전환 (분석 통계 탭)
  - 드래그&드롭 파일 업로드 + Upstage API 연동
  - 분석 결과 실시간 표시 (위험도, 위험 항목, 권장사항)
  - 대시보드/통계 실제 API 연결
- [x] 문의하기 이메일 연동 (official.haedeun@gmail.com)
- [x] 채용 지원하기 이메일 연동
- [x] 메인페이지 버튼 라우팅 (로그인 상태별 분기)
- [x] 마이페이지 평균 분석 시간 표시 수정 (초 단위)
- [x] 메인페이지 실제 통계 데이터 연동 (/api/statistics/public)
- [x] 마이페이지 "더 보기" → 최근 문서 탭 이동
- [x] 상단 메뉴 "마이페이지" → "법률 AI 분석"
- [x] /terms, /privacy 페이지 생성
- [x] 관리자 페이지 /admin 전체 구현 (문의/지원요청/문서분석/회원 관리)

## Key Files
```
ContractInsight/
├── CLAUDE.md                    ← 이 파일
├── supabase-schema.sql          ← DB 스키마
├── .mcp.json                    ← MCP 설정 (Supabase 포함)
├── [로우디] 이용약관.docx        ← 이용약관 원본
├── [로우디] 개인정보처리방침.docx ← 개인정보처리방침 원본
├── frontend/
│   ├── .env.local               ← 환경 변수
│   ├── src/lib/
│   │   ├── upstage.ts           ← Upstage API 서비스
│   │   ├── supabase.ts          ← Supabase 클라이언트
│   │   ├── auth.ts              ← 사용자 JWT 인증 (15분 access + 7일 refresh)
│   │   └── adminAuth.ts         ← 관리자 JWT 인증 (8시간)
│   ├── src/contexts/
│   │   └── AuthContext.tsx      ← 클라이언트 인증 상태
│   ├── src/app/
│   │   ├── mypage/page.tsx      ← 메인 기능 (대시보드/분석/통계)
│   │   ├── admin/page.tsx       ← 관리자 페이지
│   │   ├── terms/page.tsx       ← 이용약관 (제1조~제17조 + 부칙)
│   │   └── privacy/page.tsx     ← 개인정보처리방침 (제1조~제17조 + 부칙)
│   └── src/app/api/
│       ├── documents/route.ts   ← 업로드 API
│       ├── documents/[id]/analyze/route.ts ← 분석 API
│       ├── statistics/route.ts  ← 통계 API (인증 필요)
│       ├── statistics/public/route.ts ← 공개 통계 API
│       └── admin/               ← 관리자 API (login, logout, me, inquiries, support-requests, documents, users)
```

## DB Tables (Supabase)
- `users` (id, email, password_hash, name, suspended, agreed_terms, agreed_privacy)
- `documents` (id, user_id, file_name, storage_path, status, parsed_content)
- `analyses` (id, document_id, risk_level, risk_score, summary, risk_items, processing_time_ms)
- `chat_messages` (id, document_id, user_id, role, content)
- `refresh_tokens` (id, user_id, token_hash, expires_at, revoked)
- `admin_users` (id, username, password_hash, name)
- `inquiries` (id, name, email, inquiry_type, content, admin_memo, status)
- `support_requests` (id, user_email, support_level, problem_summary, admin_memo, status)

## Admin Access
- **URL**: https://lawdy.vercel.app/admin
- **ID**: admin
- **PW**: o2H2OCo2

## API Keys (in .env.local)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `UPSTAGE_API_KEY`: `up_NbwHq6x1lLRNh8W54wPkAWbrM3X9H`

## Constraints (MUST NOT)
- **Grok 모델 사용 금지** - 결제 안함
- **Antigravity를 통한 Claude 사용 금지** - Anthropic 직접 결제 중
- **Supabase CLI 설치 시도 금지** - Homebrew 이슈, Dashboard/MCP 사용

## Commands
```bash
# Frontend 개발 서버
cd frontend && npm run dev

# 빌드
cd frontend && npm run build

# Vercel 배포 (GitHub 연동 없이 CLI로 직접 배포)
cd frontend && vercel --prod
```

## Deployment Notes
- **GitHub 연동 안됨**: 이 프로젝트는 별도의 git repo가 없음 (상위 Projects 폴더에 다른 repo 연결됨)
- **Vercel CLI 사용**: `vercel --prod` 명령어로 직접 배포
- **Production URL**: https://lawdy.vercel.app
