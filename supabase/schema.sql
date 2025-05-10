-- VanillaAI 데이터베이스 스키마

-- 사용자 테이블 (Supabase Auth와 연동)
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 사용자 생성 시 자동으로 프로필 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, avatar_url)
  VALUES (new.id, new.email, null);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- AI 모델 테이블
CREATE TABLE ai_models (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  company TEXT NOT NULL,
  pricing TEXT NOT NULL,
  features JSONB NOT NULL,
  popularity INTEGER NOT NULL,
  release_date DATE NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 커뮤니티 게시글 테이블
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 댓글 테이블
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 뉴스 테이블
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  source TEXT NOT NULL,
  image_url TEXT,
  published_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 예시 데이터 삽입
-- AI 모델 예시 데이터
INSERT INTO ai_models (name, category, company, pricing, features, popularity, release_date, description)
VALUES 
  ('GPT-4o', '텍스트 생성', 'OpenAI', '유료 (API 사용량 기반)', '["텍스트 생성", "코드 생성", "멀티모달 입력 지원"]'::jsonb, 98, '2024-05-13', 'OpenAI의 최신 멀티모달 AI 모델로, 텍스트와 이미지를 모두 처리할 수 있습니다.'),
  ('Claude 3 Opus', '텍스트 생성', 'Anthropic', '유료 (API 사용량 기반)', '["텍스트 생성", "긴 컨텍스트 지원", "멀티모달 입력 지원"]'::jsonb, 92, '2024-03-04', 'Anthropic의 최고급 AI 모델로, 복잡한 추론과 긴 컨텍스트 처리에 강점이 있습니다.'),
  ('Midjourney v6', '이미지 생성', 'Midjourney', '구독제', '["이미지 생성", "스타일 조정", "고해상도 출력"]'::jsonb, 95, '2023-12-14', '텍스트 프롬프트를 기반으로 고품질 이미지를 생성하는 AI 모델입니다.'),
  ('Gemini Pro', '텍스트 생성', 'Google', '유료 (API 사용량 기반)', '["텍스트 생성", "코드 생성", "멀티모달 입력 지원"]'::jsonb, 90, '2023-12-06', 'Google의 멀티모달 AI 모델로, 다양한 입력 형식을 처리할 수 있습니다.'),
  ('DALL-E 3', '이미지 생성', 'OpenAI', '유료 (API 사용량 기반)', '["이미지 생성", "텍스트 프롬프트 기반", "고해상도 출력"]'::jsonb, 88, '2023-10-19', 'OpenAI의 이미지 생성 모델로, 텍스트 설명을 기반으로 이미지를 생성합니다.'),
  ('Whisper', '음성 인식', 'OpenAI', '유료 (API 사용량 기반)', '["음성 인식", "다국어 지원", "텍스트 변환"]'::jsonb, 85, '2022-09-21', '다양한 언어의 음성을 텍스트로 변환하는 AI 모델입니다.'),
  ('Stable Diffusion XL', '이미지 생성', 'Stability AI', '오픈소스', '["이미지 생성", "로컬 실행 가능", "커스터마이징 가능"]'::jsonb, 87, '2023-07-26', '오픈소스 이미지 생성 모델로, 로컬 환경에서도 실행 가능합니다.'),
  ('Suno', '음악 생성', 'Suno AI', '구독제', '["음악 생성", "가사 생성", "다양한 장르 지원"]'::jsonb, 85, '2023-12-12', '텍스트 프롬프트를 기반으로 다양한 장르의 음악을 생성하는 AI 모델입니다.');

-- RLS(Row Level Security) 정책 설정
-- 사용자 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 자신의 프로필만 수정 가능" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "모든 사용자 프로필은 공개적으로 조회 가능" ON users
  FOR SELECT USING (true);

-- 게시글 테이블 RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "게시글은 공개적으로 조회 가능" ON posts
  FOR SELECT USING (true);
CREATE POLICY "사용자는 자신의 게시글만 수정/삭제 가능" ON posts
  FOR ALL USING (auth.uid() = user_id);

-- 댓글 테이블 RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "댓글은 공개적으로 조회 가능" ON comments
  FOR SELECT USING (true);
CREATE POLICY "사용자는 자신의 댓글만 수정/삭제 가능" ON comments
  FOR ALL USING (auth.uid() = user_id);

-- AI 모델 및 뉴스 테이블은 관리자만 수정 가능하도록 설정
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI 모델은 공개적으로 조회 가능" ON ai_models
  FOR SELECT USING (true);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "뉴스는 공개적으로 조회 가능" ON news
  FOR SELECT USING (true);
