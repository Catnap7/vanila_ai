# VanillaAI - AI 모델 비교 및 커뮤니티

VanillaAI는 다양한 생성형 AI 모델을 비교하고 커뮤니티와 소통할 수 있는 웹 플랫폼입니다. 이 프로젝트는 [Next.js](https://nextjs.org)와 [Express.js](https://expressjs.com)를 기반으로 구축되었습니다.

## 주요 기능

- 다양한 AI 모델 비교 및 정보 제공
- 커뮤니티 게시판을 통한 사용자 간 소통
- AI 관련 최신 뉴스 제공
- 사용자 인증 및 프로필 관리
- 다크 모드 지원

## 기술 스택

- **프론트엔드**: Next.js, React, Tailwind CSS
- **백엔드**: Express.js, MongoDB
- **스타일링**: Tailwind CSS, shadcn/ui

## 시작하기

### 1. 환경 설정

먼저, 프로젝트를 클론하고 의존성을 설치합니다:

```bash
git clone https://github.com/yourusername/vanillai-ai-community.git
cd vanillai-ai-community
npm install
```

### 2. 백엔드 서버 설정

1. `server` 디렉토리로 이동합니다:

```bash
cd server
```

2. 의존성을 설치합니다:

```bash
npm install
```

3. MongoDB가 설치되어 있는지 확인하고, 실행 중인지 확인합니다.

4. 초기 데이터를 추가합니다:

```bash
npm run seed
```

5. 백엔드 서버를 실행합니다:

```bash
npm run dev
```

6. 프로젝트 루트 디렉토리로 돌아갑니다:

```bash
cd ..
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인합니다.

## 프로젝트 구조

```
vanillai-ai-community/
├── public/             # 정적 파일
├── server/             # 백엔드 서버
│   ├── config/         # 설정 파일
│   ├── data/           # 초기 데이터
│   ├── models/         # 데이터 모델
│   └── routes/         # API 라우트
├── src/
│   ├── app/            # Next.js 앱 라우터
│   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── layout/     # 레이아웃 관련 컴포넌트
│   │   ├── theme/      # 테마 관련 컴포넌트
│   │   └── ui/         # UI 컴포넌트
│   └── lib/            # 유틸리티 함수 및 라이브러리
│       ├── api.ts      # API 호출 함수
│       └── utils.ts    # 유틸리티 함수
```

## 데이터 모델

- **AIModel**: AI 모델 정보
- **News**: AI 관련 뉴스
- **CommunityPost**: 커뮤니티 게시글

## 배포

### 프론트엔드 배포

프론트엔드는 [Vercel](https://vercel.com)을 통해 쉽게 배포할 수 있습니다:

1. Vercel에 가입하고 GitHub 저장소를 연결합니다.
2. 환경 변수를 설정합니다 (API URL 등).
3. 배포 버튼을 클릭합니다.

### 백엔드 배포

백엔드는 [Render](https://render.com) 또는 [Heroku](https://heroku.com)와 같은 서비스를 통해 배포할 수 있습니다:

1. 서비스에 가입하고 GitHub 저장소를 연결합니다.
2. 환경 변수를 설정합니다 (MongoDB URI 등).
3. 배포 버튼을 클릭합니다.

## 기여하기

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
