# VanillaAI 백엔드 서버

이 디렉토리는 VanillaAI 프로젝트의 백엔드 서버 코드를 포함하고 있습니다. Express.js와 MongoDB를 사용하여 구현되었습니다.

## 설치 및 실행 방법

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. MongoDB 설치 및 실행

MongoDB가 설치되어 있지 않다면 [MongoDB 공식 사이트](https://www.mongodb.com/try/download/community)에서 다운로드하여 설치하세요.

또는 Docker를 사용하여 MongoDB를 실행할 수 있습니다:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. 환경 변수 설정

`.env` 파일에 다음 환경 변수가 설정되어 있는지 확인하세요:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vanillaai
NODE_ENV=development
```

### 4. 초기 데이터 추가

```bash
npm run seed
```

### 5. 서버 실행

개발 모드로 실행:

```bash
npm run dev
```

프로덕션 모드로 실행:

```bash
npm start
```

## API 엔드포인트

### AI 모델

- `GET /api/ai-models`: 모든 AI 모델 가져오기
- `GET /api/ai-models/:id`: 특정 AI 모델 가져오기
- `POST /api/ai-models`: 새 AI 모델 추가
- `PATCH /api/ai-models/:id`: AI 모델 업데이트
- `DELETE /api/ai-models/:id`: AI 모델 삭제

### 뉴스

- `GET /api/news`: 모든 뉴스 가져오기
- `GET /api/news/:id`: 특정 뉴스 가져오기
- `POST /api/news`: 새 뉴스 추가
- `PATCH /api/news/:id`: 뉴스 업데이트
- `DELETE /api/news/:id`: 뉴스 삭제

### 커뮤니티

- `GET /api/community`: 모든 게시글 가져오기
- `GET /api/community/:id`: 특정 게시글 가져오기
- `POST /api/community`: 새 게시글 추가
- `PATCH /api/community/:id`: 게시글 업데이트
- `DELETE /api/community/:id`: 게시글 삭제
- `POST /api/community/:id/like`: 게시글 좋아요 증가
