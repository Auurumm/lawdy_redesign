# ContractInsight - Lawdy

AI 기반 계약 분석 플랫폼

## 프로젝트 구조

```
ContractInsight/
├── frontend/          # Next.js 14 프론트엔드
│   ├── src/
│   │   ├── app/       # App Router 페이지
│   │   └── components/ # React 컴포넌트
│   └── public/
│       └── images/    # SVG 아이콘 및 이미지
└── backend/           # Node.js Express 백엔드
    └── src/
        └── index.js   # API 서버
```

## 시작하기

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 백엔드 실행

```bash
cd backend
cp .env.example .env  # 환경변수 설정
npm install
npm run dev
```

API 서버가 http://localhost:4000 에서 실행됩니다.

## 기술 스택

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Pretendard 폰트

### Backend
- Node.js
- Express.js
- CORS

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/health | 서버 상태 확인 |
| GET | /api/statistics | 분석 통계 조회 |
| POST | /api/analyze | 계약서 분석 요청 |
| GET | /api/analysis/:id | 분석 결과 조회 |

## 주요 기능

- **위험 자동 식별**: 계약의 법적 위험을 AI가 자동으로 식별
- **한눈에 확인**: 복잡한 계약서를 시각화하여 이해하기 쉽게 제공
- **시각적 리포트**: 차트와 그래프로 분석 결과 제공
- **주요 조항 추출**: 중요한 계약 조항을 자동으로 찾아 강조
- **채팅형 Q&A**: AI에게 계약에 대해 질문하고 답변 받기
- **다양한 형식 지원**: TXT, PDF, MD 등 다양한 형식으로 결과 다운로드
