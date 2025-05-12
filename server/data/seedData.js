const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

// 모델 가져오기 (MongoDB 사용 시)
let AIModel, News, CommunityPost;
try {
  AIModel = require('../models/AIModel');
  News = require('../models/News');
  CommunityPost = require('../models/Community');
} catch (error) {
  console.log('모델 로드 오류:', error.message);
}

// AI 모델 데이터
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
    pricing: '유료 (API 사용량 기반)',
    features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
    popularity: 90,
    releaseDate: '2023-12-06',
    image: '/placeholder-ai-4.png'
  }
];

// 뉴스 데이터
const newsData = [
  {
    title: 'OpenAI, GPT-4o 모델 출시 발표',
    date: '2024-05-13',
    source: 'AI 뉴스',
    image: '/news/news1.jpg',
    excerpt: 'OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다. 이 모델은 기존 GPT-4 Turbo보다 더 빠르고 정확하며, 다양한 입력 형식을 처리할 수 있습니다.',
    content: 'OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다. 이 모델은 기존 GPT-4 Turbo보다 더 빠르고 정확하며, 다양한 입력 형식을 처리할 수 있습니다. GPT-4o는 실시간 음성 대화가 가능하며, 이미지를 분석하고 이에 대한 설명을 제공할 수 있습니다. 또한, 코드 생성 및 분석 능력도 향상되었습니다. OpenAI는 이 모델이 ChatGPT Plus 구독자들에게 제공될 예정이며, API를 통해서도 사용할 수 있다고 밝혔습니다.',
    tags: ['OpenAI', 'GPT-4o', '멀티모달']
  },
  {
    title: 'Google I/O에서 Gemini 2.0 공개',
    date: '2024-05-10',
    source: '테크 인사이트',
    image: '/news/news2.jpg',
    excerpt: 'Google이 연례 개발자 컨퍼런스에서 Gemini의 새로운 버전을 공개했습니다. Gemini 2.0은 더 긴 컨텍스트 윈도우와 향상된 추론 능력을 갖추고 있으며, 다양한 Google 제품에 통합될 예정입니다.',
    content: 'Google이 연례 개발자 컨퍼런스인 Google I/O에서 Gemini의 새로운 버전인 Gemini 2.0을 공개했습니다. 이 새로운 모델은 이전 버전보다 더 긴 컨텍스트 윈도우를 지원하며, 복잡한 문제에 대한 추론 능력이 크게 향상되었습니다. Google은 Gemini 2.0이 Gmail, Google Docs, Google 검색 등 다양한 Google 제품에 통합될 예정이라고 밝혔습니다. 또한, 개발자들을 위한 새로운 API와 도구도 함께 발표되었습니다.',
    tags: ['Google', 'Gemini', 'I/O']
  },
  {
    title: 'Anthropic, Claude 3.5 개발 중',
    date: '2024-05-08',
    source: 'AI 트렌드',
    image: '/news/news3.jpg',
    excerpt: 'Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다.',
    content: 'Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다. 이 새로운 모델은 Claude 3 Opus보다 더 뛰어난 추론 능력과 더 긴 컨텍스트 윈도우를 지원할 예정입니다. Anthropic의 CEO인 Dario Amodei는 "Claude 3.5는 더 복잡한 작업을 수행할 수 있으며, 특히 코딩과 수학적 추론 능력이 크게 향상되었다"고 말했습니다. 이 모델은 올해 하반기에 출시될 예정입니다.',
    tags: ['Anthropic', 'Claude', 'AI 모델']
  }
];

// 커뮤니티 게시글 데이터
const communityData = [
  {
    title: 'GPT-4o와 Claude 3 Opus 중 어떤 모델이 더 나을까요?',
    author: {
      name: '김AI',
      avatar: '/avatars/user1.png'
    },
    date: '2024-05-15',
    content: '최근에 출시된 GPT-4o와 Claude 3 Opus를 비교해보았는데, 각각의 장단점이 있어서 고민입니다. GPT-4o는 멀티모달 기능이 뛰어나고 응답 속도가 빠른 반면, Claude 3 Opus는 긴 컨텍스트 처리와 복잡한 지시사항 이해에 더 뛰어난 것 같습니다. 여러분은 어떤 모델을 선호하시나요? 각자의 경험을 공유해주세요.',
    excerpt: '최근에 출시된 GPT-4o와 Claude 3 Opus를 비교해보았는데, 각각의 장단점이 있어서 고민입니다. 여러분의 경험을 공유해주세요.',
    comments: 24,
    likes: 18,
    views: 342,
    tags: ['GPT-4o', 'Claude 3', '모델 비교']
  },
  {
    title: 'Midjourney로 만든 작품 공유합니다',
    author: {
      name: '이미지러버',
      avatar: '/avatars/user2.png'
    },
    date: '2024-05-14',
    content: 'Midjourney v6로 만든 작품들을 공유합니다. 최근에 업데이트된 v6는 이전 버전보다 훨씬 더 사실적인 이미지를 생성할 수 있고, 텍스트 렌더링 능력도 크게 향상되었습니다. 특히 인물 표현이 자연스러워졌고, 손가락 같은 디테일도 잘 표현됩니다. 제가 사용한 프롬프트는 다음과 같습니다: "A professional photographer in a studio, setting up lighting equipment, detailed, realistic, 8k --ar 16:9". 여러분도 좋은 프롬프트가 있다면 공유해주세요!',
    excerpt: 'Midjourney v6로 만든 작품들을 공유합니다. 프롬프트 엔지니어링 팁도 함께 알려드릴게요.',
    comments: 31,
    likes: 45,
    views: 520,
    tags: ['Midjourney', '이미지 생성', '프롬프트']
  }
];

// 데이터베이스에 데이터 추가
const importData = async () => {
  try {
    const connectDB = require('../config/db');

    // MongoDB 연결 시도
    const isConnected = await connectDB();

    if (isConnected) {
      // 기존 데이터 삭제
      await AIModel.deleteMany();
      await News.deleteMany();
      await CommunityPost.deleteMany();

      // 새 데이터 추가
      await AIModel.insertMany(aiModelsData);
      await News.insertMany(newsData);
      await CommunityPost.insertMany(communityData);

      console.log('데이터가 성공적으로 추가되었습니다!');
    } else {
      console.log('메모리 내 데이터베이스를 사용합니다.');
    }

    if (process.argv[2] === '--exit') {
      process.exit(0);
    }
  } catch (error) {
    console.error(`오류: ${error.message}`);
    if (process.argv[2] === '--exit') {
      process.exit(1);
    }
  }
};

// 모듈로 내보내기
module.exports = {
  aiModelsData,
  newsData,
  communityData,
  importData
};

// 직접 실행 시 데이터 가져오기
if (require.main === module) {
  importData();
}
