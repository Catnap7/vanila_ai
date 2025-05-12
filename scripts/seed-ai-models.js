// Supabase에 AI 모델 데이터를 저장하는 스크립트
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 또는 API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AI 모델 데이터
const aiModelsData = [
  {
    name: 'GPT-4o',
    category: '텍스트 생성',
    company: 'OpenAI',
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
    popularity: 98,
    release_date: '2024-05-13',
    image_url: '/images/ai-models/gpt-4o.png',
    description: 'OpenAI의 최신 멀티모달 AI 모델로, 텍스트와 이미지를 모두 처리할 수 있습니다. 이전 모델보다 더 빠르고 정확한 응답을 제공합니다.'
  },
  {
    name: 'Claude 3 Opus',
    category: '텍스트 생성',
    company: 'Anthropic',
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '긴 컨텍스트 지원', '멀티모달 입력 지원'],
    popularity: 92,
    release_date: '2024-03-04',
    image_url: '/images/ai-models/claude-3-opus.png',
    description: 'Anthropic의 최고급 AI 모델로, 복잡한 추론과 긴 컨텍스트 처리에 강점이 있습니다. 200K 토큰의 컨텍스트 창을 지원합니다.'
  },
  {
    name: 'Midjourney v6',
    category: '이미지 생성',
    company: 'Midjourney',
    pricing: '구독제',
    features: ['이미지 생성', '스타일 조정', '고해상도 출력'],
    popularity: 95,
    release_date: '2023-12-14',
    image_url: '/images/ai-models/midjourney-v6.png',
    description: '텍스트 프롬프트를 기반으로 고품질 이미지를 생성하는 AI 모델입니다. 버전 6는 이전 버전보다 더 사실적이고 정확한 이미지를 생성합니다.'
  },
  {
    name: 'Gemini Pro',
    category: '텍스트 생성',
    company: 'Google',
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
    popularity: 90,
    release_date: '2023-12-06',
    image_url: '/images/ai-models/gemini-pro.png',
    description: 'Google의 멀티모달 AI 모델로, 다양한 입력 형식을 처리할 수 있습니다. 코드 생성과 분석에 특히 강점이 있습니다.'
  },
  {
    name: 'DALL-E 3',
    category: '이미지 생성',
    company: 'OpenAI',
    pricing: '유료 (API 사용량 기반)',
    features: ['이미지 생성', '텍스트 프롬프트 기반', '고해상도 출력'],
    popularity: 88,
    release_date: '2023-10-19',
    image_url: '/images/ai-models/dall-e-3.png',
    description: 'OpenAI의 이미지 생성 모델로, 텍스트 설명을 기반으로 이미지를 생성합니다. 복잡한 프롬프트 이해 능력이 크게 향상되었습니다.'
  },
  {
    name: 'Whisper',
    category: '음성 인식',
    company: 'OpenAI',
    pricing: '유료 (API 사용량 기반)',
    features: ['음성 인식', '다국어 지원', '텍스트 변환'],
    popularity: 85,
    release_date: '2022-09-21',
    image_url: '/images/ai-models/whisper.png',
    description: '다양한 언어의 음성을 텍스트로 변환하는 AI 모델입니다. 99개 이상의 언어를 지원하며 배경 소음에 강합니다.'
  },
  {
    name: 'Stable Diffusion XL',
    category: '이미지 생성',
    company: 'Stability AI',
    pricing: '오픈소스',
    features: ['이미지 생성', '로컬 실행 가능', '커스터마이징 가능'],
    popularity: 87,
    release_date: '2023-07-26',
    image_url: '/images/ai-models/stable-diffusion-xl.png',
    description: '오픈소스 이미지 생성 모델로, 로컬 환경에서도 실행 가능합니다. 다양한 커뮤니티 모델과 확장 기능을 지원합니다.'
  },
  {
    name: 'Suno',
    category: '음악 생성',
    company: 'Suno AI',
    pricing: '구독제',
    features: ['음악 생성', '가사 생성', '다양한 장르 지원'],
    popularity: 85,
    release_date: '2023-12-12',
    image_url: '/images/ai-models/suno.png',
    description: '텍스트 프롬프트를 기반으로 다양한 장르의 음악을 생성하는 AI 모델입니다. 가사와 멜로디를 모두 생성할 수 있습니다.'
  },
  {
    name: 'Llama 3',
    category: '텍스트 생성',
    company: 'Meta',
    pricing: '오픈소스',
    features: ['텍스트 생성', '오픈소스', '다양한 크기 모델'],
    popularity: 86,
    release_date: '2024-04-18',
    image_url: '/images/ai-models/llama-3.png',
    description: 'Meta의 오픈소스 대규모 언어 모델로, 다양한 크기(8B, 70B)의 모델을 제공합니다. 로컬 환경에서도 실행 가능합니다.'
  },
  {
    name: 'Perplexity AI',
    category: '검색 및 응답',
    company: 'Perplexity',
    pricing: '무료/구독제',
    features: ['실시간 검색', '소스 인용', 'AI 응답 생성'],
    popularity: 84,
    release_date: '2022-08-30',
    image_url: '/images/ai-models/perplexity.png',
    description: '실시간 웹 검색과 AI 응답을 결합한 서비스로, 질문에 대한 답변과 함께 소스를 제공합니다.'
  }
];

// Supabase에 데이터 저장
async function seedAIModels() {
  try {
    // 기존 데이터 삭제 (선택 사항)
    const { error: deleteError } = await supabase
      .from('ai_models')
      .delete()
      .not('id', 'is', null);
    
    if (deleteError) {
      console.error('기존 데이터 삭제 중 오류 발생:', deleteError);
      return;
    }
    
    console.log('기존 AI 모델 데이터가 삭제되었습니다.');

    // 새 데이터 삽입
    const { data, error } = await supabase
      .from('ai_models')
      .insert(aiModelsData)
      .select();
    
    if (error) {
      console.error('데이터 삽입 중 오류 발생:', error);
      return;
    }
    
    console.log(`${data.length}개의 AI 모델 데이터가 성공적으로 추가되었습니다.`);
    console.log(data);
  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
  }
}

// 스크립트 실행
seedAIModels();
