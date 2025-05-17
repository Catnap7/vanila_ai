# VanillaAI - AI 모델 비교 및 커뮤니티

VanillaAI는 다양한 생성형 AI 모델을 비교하고 커뮤니티와 소통할 수 있는 웹 플랫폼입니다. 

- UI 다듬기 전 초기화면 - 
![image](https://github.com/user-attachments/assets/812b1d6a-a3bf-4f89-aa1d-f04f250f915e)
![image](https://github.com/user-attachments/assets/0d36b5f8-8799-4ccc-8d1c-1509078d95b6)
![image](https://github.com/user-attachments/assets/21ca980e-df13-4f57-8ccc-15f8de2f1965)



## 주요 기능

- 다양한 AI 모델 비교 및 정보 제공
- 커뮤니티 게시판을 통한 사용자 간 소통
- AI 관련 최신 뉴스 제공
- 사용자 인증 및 프로필 관리
- 다크 모드 지원

## 기술 스택

- **프론트엔드**: Next.js, React, Tailwind CSS
- **백엔드**: Express.js, Supabase
- **스타일링**: Tailwind CSS, shadcn/ui
- **API**: GOOGLE Gemini 

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
