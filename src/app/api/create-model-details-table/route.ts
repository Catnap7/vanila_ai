import { NextResponse } from 'next/server';
import { supabase, isAdmin, getCurrentUser } from '@/lib/supabase';

// AI 모델 상세 정보 테이블 생성 SQL
const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.ai_model_details (
  id SERIAL PRIMARY KEY,
  model_id INTEGER NOT NULL REFERENCES public.ai_models(id) ON DELETE CASCADE,
  overview TEXT NOT NULL,
  use_cases TEXT[] NOT NULL,
  strengths TEXT[] NOT NULL,
  limitations TEXT[] NOT NULL,
  pricing_details JSONB,
  api_documentation_url TEXT,
  example_prompts TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(model_id)
);

-- RLS 정책 설정
ALTER TABLE public.ai_model_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI 모델 상세 정보는 공개적으로 조회 가능" ON public.ai_model_details
  FOR SELECT USING (true);
`;

// 샘플 데이터
const sampleData = [
  {
    model_id: 1, // GPT-4o
    overview: "GPT-4o는 OpenAI의 최신 멀티모달 AI 모델로, 텍스트와 이미지, 오디오를 모두 처리할 수 있습니다. 이전 모델보다 더 빠르고 정확한 응답을 제공하며, 다양한 작업에 활용할 수 있습니다.",
    use_cases: [
      "복잡한 질문에 대한 상세한 답변 생성",
      "코드 작성 및 디버깅",
      "이미지 분석 및 설명",
      "문서 요약 및 정보 추출",
      "창의적인 콘텐츠 생성"
    ],
    strengths: [
      "다양한 입력 형식(텍스트, 이미지, 오디오) 처리 가능",
      "이전 모델보다 더 빠른 응답 속도",
      "복잡한 지시사항 이해 및 수행 능력",
      "다양한 언어 지원",
      "맥락 이해 능력 향상"
    ],
    limitations: [
      "2023년 이후 데이터에 대한 제한된 지식",
      "완벽하지 않은 사실 정확성",
      "복잡한 수학 문제 해결 능력 제한",
      "윤리적 가이드라인에 따른 응답 제한"
    ],
    pricing_details: {
      "input": "$10 / 1M 토큰",
      "output": "$30 / 1M 토큰",
      "context_window": "128K 토큰",
      "free_tier": "제한된 무료 사용량 제공"
    },
    api_documentation_url: "https://platform.openai.com/docs/models/gpt-4o",
    example_prompts: [
      "인공지능의 미래 발전 방향에 대해 설명해주세요.",
      "이 Python 코드의 버그를 찾아 수정해주세요.",
      "이 이미지에 무엇이 보이는지 설명해주세요.",
      "마케팅 이메일을 작성해주세요."
    ]
  },
  {
    model_id: 2, // Claude 3 Opus
    overview: "Claude 3 Opus는 Anthropic의 최고급 AI 모델로, 복잡한 추론과 긴 컨텍스트 처리에 강점이 있습니다. 200K 토큰의 컨텍스트 창을 지원하며, 정확하고 유용한 응답을 제공합니다.",
    use_cases: [
      "긴 문서 분석 및 요약",
      "복잡한 추론이 필요한 질문 응답",
      "학술 연구 지원",
      "상세한 콘텐츠 생성",
      "다단계 지시사항 수행"
    ],
    strengths: [
      "매우 긴 컨텍스트 창(200K 토큰)",
      "정확한 사실 기반 응답",
      "복잡한 추론 능력",
      "안전하고 유용한 응답 생성",
      "다양한 언어 지원"
    ],
    limitations: [
      "GPT-4o보다 상대적으로 느린 처리 속도",
      "이미지 생성 기능 없음",
      "2023년 이후 데이터에 대한 제한된 지식",
      "일부 전문 분야에서 제한된 지식"
    ],
    pricing_details: {
      "input": "$15 / 1M 토큰",
      "output": "$75 / 1M 토큰",
      "context_window": "200K 토큰",
      "free_tier": "없음"
    },
    api_documentation_url: "https://docs.anthropic.com/claude/reference/getting-started-with-the-api",
    example_prompts: [
      "이 100페이지 논문을 요약해주세요.",
      "양자 컴퓨팅의 기본 원리를 설명해주세요.",
      "이 복잡한 법률 문서를 분석해주세요.",
      "다음 연구 주제에 대한 문헌 검토를 작성해주세요."
    ]
  },
  {
    model_id: 3, // Midjourney v6
    overview: "Midjourney v6는 텍스트 프롬프트를 기반으로 고품질 이미지를 생성하는 AI 모델입니다. 버전 6는 이전 버전보다 더 사실적이고 정확한 이미지를 생성하며, 다양한 스타일과 세부 사항을 표현할 수 있습니다.",
    use_cases: [
      "개념 아트 및 일러스트레이션 생성",
      "제품 디자인 및 시각화",
      "마케팅 및 광고 이미지 제작",
      "게임 및 영화 아트워크",
      "인테리어 디자인 시각화"
    ],
    strengths: [
      "매우 높은 품질의 이미지 생성",
      "다양한 스타일 표현 가능",
      "세부 사항에 대한 정확한 표현",
      "직관적인 프롬프트 이해",
      "빠른 생성 속도"
    ],
    limitations: [
      "텍스트 렌더링 제한",
      "특정 브랜드나 저작권 있는 콘텐츠 생성 제한",
      "Discord를 통해서만 접근 가능",
      "완벽한 해부학적 정확성 부족"
    ],
    pricing_details: {
      "basic": "$10/월",
      "standard": "$30/월",
      "pro": "$60/월",
      "mega": "$120/월"
    },
    api_documentation_url: "https://docs.midjourney.com/",
    example_prompts: [
      "미래적인 도시 풍경, 네온 불빛, 비 내리는 밤",
      "판타지 스타일의 마법사 초상화, 상세한 의상, 마법 지팡이",
      "미니멀리스트 제품 사진, 흰색 배경, 부드러운 그림자",
      "사이버펑크 스타일의 로봇 디자인, 금속 질감, 푸른 불빛"
    ]
  }
];

export async function GET() {
  try {
    // 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 관리자 권한 확인
    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }
    // 테이블 생성
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.error('테이블 생성 중 오류 발생:', createError);
      
      // 직접 SQL 실행이 실패한 경우 (RPC 함수가 없을 수 있음)
      // 테이블이 이미 존재할 수 있으므로 계속 진행
    }
    
    // 샘플 데이터 삽입
    const { data, error } = await supabase
      .from('ai_model_details')
      .upsert(sampleData, { 
        onConflict: 'model_id', 
        ignoreDuplicates: false 
      })
      .select();
    
    if (error) {
      console.error('데이터 삽입 중 오류 발생:', error);
      return NextResponse.json({ 
        success: false, 
        message: '데이터 삽입 중 오류가 발생했습니다.', 
        error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'AI 모델 상세 정보 테이블이 생성되고 샘플 데이터가 추가되었습니다.', 
      data 
    });
  } catch (error) {
    console.error('API 라우트 실행 중 오류 발생:', error);
    return NextResponse.json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.', 
      error 
    }, { status: 500 });
  }
}
