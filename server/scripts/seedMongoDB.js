const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const AIModel = require('../models/AIModel');
const News = require('../models/News');
const CommunityPost = require('../models/Community');

// 환경 변수 설정
dotenv.config();

// 샘플 AI 모델 데이터
const aiModelsData = [
  {
    name: 'GPT-4o',
    category: '텍스트 생성',
    company: 'OpenAI',
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
    popularity: 98,
    releaseDate: '2024-05-13',
    image: '/placeholder-ai-1.png'
  },
  {
    name: 'Claude 3 Opus',
    category: '텍스트 생성',
    company: 'Anthropic',
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '긴 컨텍스트 지원', '멀티모달 입력 지원'],
    popularity: 92,
    releaseDate: '2024-03-04',
    image: '/placeholder-ai-2.png'
  },
  {
    name: 'Midjourney v6',
    category: '이미지 생성',
    company: 'Midjourney',
    pricing: '구독제',
    features: ['이미지 생성', '스타일 조정', '고해상도 출력'],
    popularity: 95,
    releaseDate: '2023-12-14',
    image: '/placeholder-ai-3.png'
  },
  {
    name: 'Gemini Pro',
    category: '텍스트 생성',
    company: 'Google',
    pricing: '무료/유료',
    features: ['텍스트 생성', '멀티모달 입력', '실시간 정보 접근'],
    popularity: 88,
    releaseDate: '2023-12-06',
    image: '/placeholder-ai-4.png'
  },
  {
    name: 'DALL-E 3',
    category: '이미지 생성',
    company: 'OpenAI',
    pricing: '유료 (API 사용량 기반)',
    features: ['이미지 생성', '텍스트 프롬프트 이해', '고품질 출력'],
    popularity: 90,
    releaseDate: '2023-10-01',
    image: '/placeholder-ai-5.png'
  }
];

// 샘플 뉴스 데이터
const newsData = [
  {
    title: 'OpenAI, GPT-4o 모델 공개',
    excerpt: 'OpenAI가 새로운 멀티모달 AI 모델 GPT-4o를 공개했습니다.',
    content: 'OpenAI가 최신 AI 모델인 GPT-4o를 공개했습니다. 이 모델은 텍스트, 이미지, 오디오를 동시에 처리할 수 있는 멀티모달 기능을 제공합니다.',
    author: 'VanillaAI 편집팀',
    publishedAt: '2024-05-13',
    category: 'AI 모델',
    image: '/news/gpt4o.jpg',
    tags: ['OpenAI', 'GPT-4o', '멀티모달']
  },
  {
    title: 'Anthropic Claude 3 성능 향상',
    excerpt: 'Anthropic이 Claude 3 모델의 성능을 대폭 개선했다고 발표했습니다.',
    content: 'Anthropic이 Claude 3 모델의 최신 업데이트를 통해 더 긴 컨텍스트 처리와 향상된 추론 능력을 제공한다고 발표했습니다.',
    author: 'VanillaAI 편집팀',
    publishedAt: '2024-03-04',
    category: 'AI 모델',
    image: '/news/claude3.jpg',
    tags: ['Anthropic', 'Claude 3', '성능 향상']
  }
];

// 샘플 커뮤니티 데이터
const communityData = [
  {
    title: 'GPT-4o 사용 후기',
    content: 'GPT-4o를 사용해본 결과 정말 인상적이었습니다. 특히 이미지 분석 기능이 뛰어났어요.',
    author: 'AI_Enthusiast',
    category: '사용 후기',
    tags: ['GPT-4o', '후기'],
    likes: 15,
    comments: 8,
    createdAt: new Date('2024-05-15')
  },
  {
    title: 'AI 모델 비교 분석',
    content: '최근 출시된 AI 모델들을 비교 분석해보았습니다. 각각의 장단점을 정리해보겠습니다.',
    author: 'TechAnalyst',
    category: '분석',
    tags: ['비교', '분석', 'AI 모델'],
    likes: 23,
    comments: 12,
    createdAt: new Date('2024-05-10')
  }
];

// 데이터베이스 시딩 함수
const seedDatabase = async () => {
  try {
    console.log('🌱 MongoDB Atlas 데이터베이스 시딩을 시작합니다...');
    
    // MongoDB 연결
    const isConnected = await connectDB();
    if (!isConnected) {
      throw new Error('MongoDB Atlas 연결에 실패했습니다.');
    }

    // 기존 데이터 삭제 (선택사항)
    console.log('🗑️ 기존 데이터를 정리합니다...');
    await AIModel.deleteMany({});
    await News.deleteMany({});
    await CommunityPost.deleteMany({});

    // AI 모델 데이터 삽입
    console.log('🤖 AI 모델 데이터를 삽입합니다...');
    const aiModels = await AIModel.insertMany(aiModelsData);
    console.log(`✅ ${aiModels.length}개의 AI 모델이 추가되었습니다.`);

    // 뉴스 데이터 삽입
    console.log('📰 뉴스 데이터를 삽입합니다...');
    const news = await News.insertMany(newsData);
    console.log(`✅ ${news.length}개의 뉴스가 추가되었습니다.`);

    // 커뮤니티 데이터 삽입
    console.log('👥 커뮤니티 데이터를 삽입합니다...');
    const community = await CommunityPost.insertMany(communityData);
    console.log(`✅ ${community.length}개의 커뮤니티 게시글이 추가되었습니다.`);

    console.log('🎉 데이터베이스 시딩이 완료되었습니다!');
    
    // 연결 종료
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 시딩 중 오류 발생:', error);
    process.exit(1);
  }
};

// 스크립트 실행
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
