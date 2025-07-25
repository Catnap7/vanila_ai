# 🚀 VanillaAI 설치 및 설정 가이드

이 문서는 VanillaAI 프로젝트를 로컬 환경에서 설정하고 실행하는 방법을 안내합니다.

## 📋 사전 요구사항

시작하기 전에 다음 소프트웨어가 설치되어 있는지 확인하세요:

- **Node.js** 18.0.0 이상 ([다운로드](https://nodejs.org/))
- **npm**, **yarn**, 또는 **pnpm** (패키지 매니저)
- **MongoDB** (로컬 설치 또는 MongoDB Atlas 클라우드)
- **Git** (버전 관리)
- **Supabase 계정** (선택사항, 인증 기능 사용 시)

## 🔧 설치 과정

### 1단계: 저장소 클론

```bash
# HTTPS를 사용한 클론
git clone https://github.com/Catnap7/vanila_ai.git

# 또는 SSH를 사용한 클론 (SSH 키 설정 시)
git clone git@github.com:Catnap7/vanila_ai.git

# 프로젝트 디렉토리로 이동
cd vanila_ai
```

### 2단계: 의존성 설치

프로젝트 루트 디렉토리에서 다음 명령어 중 하나를 실행하세요:

```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install

# 또는 pnpm 사용 (권장 - 더 빠르고 효율적)
pnpm install
```

### 3단계: 환경 변수 설정

#### 프론트엔드 환경 변수

1. 프로젝트 루트에 `.env.local` 파일을 생성합니다:
```bash
cp .env.example .env.local
```

2. `.env.local` 파일을 편집하여 다음 값들을 설정하세요:

```env
# API 서버 URL (백엔드 서버 주소)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase 설정 (선택사항)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API (향후 사용)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth 설정 (향후 사용)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

#### 백엔드 환경 변수

1. `server` 디렉토리에 `.env` 파일을 생성합니다:
```bash
cd server
cp ../.env.example .env
```

2. `server/.env` 파일을 편집하여 다음 값들을 설정하세요:

```env
# 서버 포트
PORT=5000

# MongoDB 연결 문자열
MONGO_URI=mongodb://localhost:27017/vanillaai
# 또는 MongoDB Atlas 사용 시:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vanillaai

# 환경 설정
NODE_ENV=development

# JWT 시크릿 (향후 사용)
JWT_SECRET=your_jwt_secret_here
```

### 4단계: 데이터베이스 설정

#### 로컬 MongoDB 사용 시:
1. MongoDB를 설치하고 실행합니다
2. 기본 포트(27017)에서 실행되는지 확인합니다

#### MongoDB Atlas 사용 시:
1. [MongoDB Atlas](https://www.mongodb.com/atlas)에서 계정을 생성합니다
2. 새 클러스터를 생성합니다
3. 연결 문자열을 복사하여 `MONGO_URI`에 설정합니다
4. IP 주소를 화이트리스트에 추가합니다

## 🏃‍♂️ 실행 방법

### 개발 환경에서 실행

#### 1. 백엔드 서버 실행

새 터미널 창에서:
```bash
# server 디렉토리로 이동
cd server

# 개발 모드로 서버 실행 (nodemon 사용)
npm run dev

# 또는 일반 실행
npm start
```

서버가 성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
서버가 포트 5000에서 실행 중입니다.
MongoDB에 연결되었습니다.
```

#### 2. 프론트엔드 개발 서버 실행

새 터미널 창에서 프로젝트 루트 디렉토리에서:
```bash
# 개발 서버 실행
npm run dev

# 또는 yarn 사용
yarn dev

# 또는 pnpm 사용
pnpm dev
```

개발 서버가 실행되면 다음과 같은 메시지가 표시됩니다:
```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

### 3. 브라우저에서 확인

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:5000/api
- **API 상태 확인**: http://localhost:5000/api/ai-models

## 🔍 문제 해결

### 일반적인 문제들

#### 포트 충돌 오류
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**해결방법**: 다른 포트를 사용하거나 실행 중인 프로세스를 종료하세요.
```bash
# 포트 사용 프로세스 확인 (Windows)
netstat -ano | findstr :3000

# 포트 사용 프로세스 확인 (macOS/Linux)
lsof -ti:3000

# 프로세스 종료
kill -9 <PID>
```

#### MongoDB 연결 오류
```bash
MongoNetworkError: failed to connect to server
```
**해결방법**:
1. MongoDB 서비스가 실행 중인지 확인
2. 연결 문자열이 올바른지 확인
3. 방화벽 설정 확인

#### 환경 변수 인식 안됨
**해결방법**:
1. `.env.local` 파일이 올바른 위치에 있는지 확인
2. 파일 이름이 정확한지 확인 (`.env.local`, `.env`)
3. 서버를 재시작하세요

#### 의존성 설치 오류
```bash
npm ERR! peer dep missing
```
**해결방법**:
```bash
# 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 🧪 테스트 실행

```bash
# 단위 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# E2E 테스트 실행 (설정된 경우)
npm run test:e2e
```

## 🏗️ 빌드 및 프로덕션

### 프론트엔드 빌드
```bash
# 프로덕션 빌드 생성
npm run build

# 빌드된 앱 실행
npm start
```

### 백엔드 프로덕션 실행
```bash
cd server
NODE_ENV=production npm start
```

## 🔒 보안 고려사항

1. **환경 변수**: 실제 API 키나 비밀번호를 `.env.example`에 포함하지 마세요
2. **Git 커밋**: `.env`, `.env.local` 파일을 커밋하지 마세요
3. **API 키**: 프로덕션 환경에서는 강력한 API 키를 사용하세요
4. **데이터베이스**: 프로덕션 데이터베이스는 별도로 관리하세요

## 📞 지원

설치 과정에서 문제가 발생하면:

1. **GitHub Issues**: [이슈 생성](https://github.com/Catnap7/vanila_ai/issues)
2. **Discussions**: [토론 참여](https://github.com/Catnap7/vanila_ai/discussions)
3. **Wiki**: [위키 문서](https://github.com/Catnap7/vanila_ai/wiki) 확인

---

설치가 완료되면 [README.md](./README.md)로 돌아가서 프로젝트 개요와 기능을 확인하세요! 🎉
