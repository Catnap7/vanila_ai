# 🍦 VanillaAI - AI 모델 비교 및 커뮤니티

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-green?style=flat-square&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)

> **VanillaAI**는 다양한 생성형 AI 모델을 비교하고 커뮤니티와 소통할 수 있는 현대적인 풀스택 웹 플랫폼입니다.

## 📸 스크린샷

- UI 다듬기 전 초기화면 -
![image](https://github.com/user-attachments/assets/812b1d6a-a3bf-4f89-aa1d-f04f250f915e)
![image](https://github.com/user-attachments/assets/0d36b5f8-8799-4ccc-8d1c-1509078d95b6)
![image](https://github.com/user-attachments/assets/21ca980e-df13-4f57-8ccc-15f8de2f1965)

## ✨ 주요 기능

- 🔍 **AI 모델 비교**: 다양한 생성형 AI 모델의 상세 정보 및 성능 비교
- 💬 **커뮤니티 게시판**: 사용자 간 AI 관련 정보 공유 및 토론
- 📰 **AI 뉴스**: 최신 AI 기술 동향 및 업데이트 정보
- 🔐 **사용자 인증**: Supabase 기반 안전한 사용자 관리
- 🌙 **다크 모드**: 사용자 선호에 따른 테마 전환
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Library**: React 19.0.0
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+, shadcn/ui
- **State Management**: React Hooks, Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Supabase Auth
- **API**: RESTful API with fallback mechanisms

### Development & Tools
- **Package Manager**: npm/yarn/pnpm
- **Code Quality**: ESLint, Prettier
- **Type Safety**: Strict TypeScript configuration
- **Error Handling**: Global error boundaries
- **Performance**: React.memo, useCallback optimizations

## 🚀 최근 개선사항 (2024.07.25)

우리는 VanillaAI의 코드 품질, 성능, 유지보수성을 대폭 개선했습니다:

### 🔧 코드 품질 개선
- ✅ **TypeScript 강화**: 엄격한 타입 체크 옵션 적용 (`noUnusedLocals`, `exactOptionalPropertyTypes` 등)
- ✅ **중복 코드 제거**: Next.js 설정 파일 통합 및 API 로직 리팩토링
- ✅ **타입 안전성**: 공통 TypeScript 인터페이스 및 타입 정의 추가
- ✅ **에러 처리**: 전역 ErrorBoundary 컴포넌트 및 개선된 에러 핸들링

### ⚡ 성능 최적화
- ✅ **React 최적화**: React.memo, useCallback을 활용한 불필요한 리렌더링 방지
- ✅ **로딩 상태**: 재사용 가능한 스켈레톤 로더 및 로딩 컴포넌트
- ✅ **Next.js 설정**: 이미지 최적화, 압축, 보안 헤더 적용
- ✅ **번들 최적화**: 패키지 임포트 최적화 설정

### 🏗️ 아키텍처 개선
- ✅ **모듈화**: 백엔드 라우터 구조 개선 및 메모리 기반 라우터 분리
- ✅ **설정 관리**: 중앙화된 상수 파일 및 환경 변수 템플릿
- ✅ **코드 구조**: 컴포넌트 계층 구조 및 재사용성 개선

## 📁 프로젝트 구조

```
vanillai-ai/
├── 📁 public/                    # 정적 파일 (이미지, 아이콘 등)
├── 📁 server/                    # Express.js 백엔드 서버
│   ├── 📁 config/               # 데이터베이스 및 서버 설정
│   ├── 📁 data/                 # 초기 데이터 및 시드 파일
│   ├── 📁 models/               # MongoDB 스키마 정의
│   ├── 📁 routes/               # API 라우트 핸들러
│   └── 📄 server.js             # 메인 서버 파일
├── 📁 src/
│   ├── 📁 app/                  # Next.js App Router 페이지
│   │   ├── 📁 ai-models/        # AI 모델 관련 페이지
│   │   ├── 📁 community/        # 커뮤니티 페이지
│   │   ├── 📁 news/             # 뉴스 페이지
│   │   ├── 📄 layout.tsx        # 루트 레이아웃
│   │   └── 📄 page.tsx          # 홈페이지
│   ├── 📁 components/           # 재사용 가능한 컴포넌트
│   │   ├── 📁 layout/           # 레이아웃 컴포넌트
│   │   ├── 📁 theme/            # 테마 관련 컴포넌트
│   │   ├── 📁 ui/               # shadcn/ui 기반 UI 컴포넌트
│   │   ├── 📄 ErrorBoundary.tsx # 전역 에러 처리
│   │   └── 📄 *.tsx             # 기능별 컴포넌트
│   └── 📁 lib/                  # 유틸리티 및 설정
│       ├── 📄 api.ts            # API 호출 함수 (타입 안전)
│       ├── 📄 auth.ts           # Supabase 인증
│       ├── 📄 constants.ts      # 앱 전역 상수
│       ├── 📄 supabase.ts       # Supabase 클라이언트
│       └── 📄 utils.ts          # 공통 유틸리티
├── 📄 .env.example              # 환경 변수 템플릿
├── 📄 next.config.ts            # Next.js 설정 (최적화 적용)
├── 📄 tsconfig.json             # TypeScript 설정 (엄격 모드)
└── 📄 tailwind.config.ts        # Tailwind CSS 설정
```

## 📊 데이터 모델

### AIModel Interface
```typescript
interface AIModel {
  id: number;
  name: string;
  category: string;
  company: string;
  pricing: string;
  features: string[];
  popularity: number;
  releaseDate: string;
  image?: string;
  description?: string;
}
```

### News Interface
```typescript
interface News {
  id: number;
  title: string;
  date: string;
  source: string;
  image?: string;
  excerpt: string;
  content?: string;
  tags: string[];
}
```

### CommunityPost Interface
```typescript
interface CommunityPost {
  id: number;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  content: string;
  excerpt: string;
  comments: number;
  likes: number;
  views: number;
  tags: string[];
}
```

## 🚀 빠른 시작

VanillaAI를 로컬 환경에서 실행하려면 **[SETUP.md](./SETUP.md)** 파일을 참조하세요.

📋 **설치 가이드에 포함된 내용:**
- 사전 요구사항 및 시스템 설정
- 단계별 설치 및 환경 변수 구성
- 개발 서버 실행 방법
- 문제 해결 및 디버깅 가이드
- 프로덕션 빌드 및 배포 준비

> 💡 **빠른 실행**: `git clone` → `npm install` → 환경 변수 설정 → `npm run dev`

## 🔧 개발 가이드라인

### TypeScript 사용
- **엄격 모드**: 모든 TypeScript 엄격 옵션이 활성화되어 있습니다
- **타입 정의**: `src/lib/api.ts`에서 공통 인터페이스를 사용하세요
- **타입 안전성**: `any` 타입 사용을 피하고 명시적 타입을 정의하세요

### 컴포넌트 개발
- **React.memo**: 성능 최적화가 필요한 컴포넌트에 사용
- **useCallback**: 자식 컴포넌트에 전달되는 함수에 사용
- **Error Boundary**: 에러 처리가 필요한 컴포넌트를 `ErrorBoundary`로 감싸세요

### 코드 스타일
- **ESLint**: 코드 품질 검사 도구 사용
- **Prettier**: 코드 포맷팅 자동화
- **Tailwind CSS**: 스타일링에 Tailwind 유틸리티 클래스 사용

### 상태 관리
- **로컬 상태**: `useState`, `useReducer` 사용
- **전역 상태**: Context API 또는 상태 관리 라이브러리 고려
- **서버 상태**: API 호출 결과는 적절한 로딩/에러 상태와 함께 관리

## 📡 API 문서

### 기본 구조
- **Base URL**: `http://localhost:5000/api`
- **인증**: Supabase Auth 토큰 기반
- **응답 형식**: JSON
- **에러 처리**: 표준 HTTP 상태 코드 사용

### 주요 엔드포인트

#### AI 모델 API
```
GET    /api/ai-models          # 모든 AI 모델 조회
GET    /api/ai-models/:id      # 특정 AI 모델 조회
POST   /api/ai-models          # 새 AI 모델 추가
PATCH  /api/ai-models/:id      # AI 모델 수정
DELETE /api/ai-models/:id      # AI 모델 삭제
```

#### 뉴스 API
```
GET    /api/news               # 모든 뉴스 조회
GET    /api/news/:id           # 특정 뉴스 조회
POST   /api/news               # 새 뉴스 추가
```

#### 커뮤니티 API
```
GET    /api/community          # 모든 게시글 조회
GET    /api/community/:id      # 특정 게시글 조회
POST   /api/community/:id/like # 게시글 좋아요
```

### Fallback 메커니즘
API는 Supabase → Express 서버 순으로 fallback을 지원합니다:
1. 먼저 Supabase에서 데이터 조회 시도
2. 실패 시 Express 서버의 메모리 기반 데이터 사용
3. 모든 API 호출에 에러 처리 및 재시도 로직 포함

## ⚡ 성능 기능

### 프론트엔드 최적화
- **React.memo**: 컴포넌트 메모이제이션으로 불필요한 리렌더링 방지
- **useCallback**: 함수 메모이제이션으로 자식 컴포넌트 최적화
- **코드 분할**: Next.js 자동 코드 분할 및 지연 로딩
- **이미지 최적화**: Next.js Image 컴포넌트로 WebP/AVIF 형식 지원

### 로딩 상태 관리
- **스켈레톤 로더**: 콘텐츠 로딩 중 시각적 피드백 제공
- **로딩 컴포넌트**: 재사용 가능한 로딩 UI 컴포넌트
- **에러 바운더리**: 예상치 못한 오류에 대한 우아한 처리

### 서버 최적화
- **압축**: Gzip 압축으로 응답 크기 최소화
- **캐싱**: 적절한 HTTP 캐시 헤더 설정
- **보안 헤더**: XSS, CSRF 등 보안 위협 방지

## 🚀 배포

### 프론트엔드 배포 (Vercel 권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 백엔드 배포 (Render/Railway 권장)
1. GitHub 저장소를 배포 서비스에 연결
2. 환경 변수 설정 (MongoDB URI, PORT 등)
3. 자동 배포 설정

### 환경별 설정
- **개발**: `npm run dev` (Hot reload 지원)
- **프로덕션**: `npm run build && npm start`
- **테스트**: `npm test` (Jest 기반 테스트)

## 🤝 기여하기

### 기여 절차
1. **Fork**: 이 저장소를 포크합니다
2. **Branch**: 새 기능 브랜치를 생성합니다
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit**: 변경사항을 커밋합니다
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push**: 브랜치에 푸시합니다
   ```bash
   git push origin feature/amazing-feature
   ```
5. **PR**: Pull Request를 생성합니다

### 커밋 메시지 규칙
- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드 프로세스 또는 보조 도구 변경

### 코드 리뷰 가이드라인
- TypeScript 타입 안전성 확인
- 성능 최적화 고려사항 검토
- 접근성 및 사용자 경험 개선
- 테스트 코드 포함 여부 확인

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - 강력한 React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 아름다운 UI 컴포넌트
- [Supabase](https://supabase.com/) - 오픈소스 Firebase 대안
- [Vercel](https://vercel.com/) - 최고의 프론트엔드 배포 플랫폼

---

<div align="center">
  <p>Made with ❤️ by VanillaAI Team</p>
  <p>
    <a href="https://github.com/Catnap7/vanila_ai/issues">🐛 버그 리포트</a> •
    <a href="https://github.com/Catnap7/vanila_ai/discussions">💬 토론</a> •
    <a href="https://github.com/Catnap7/vanila_ai/wiki">📖 위키</a>
  </p>
</div>
