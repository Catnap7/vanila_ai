const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 환경 변수 설정
dotenv.config();

// 메모리 내 데이터 저장소 (MongoDB 연결 실패 시 사용)
const inMemoryDB = {
  aiModels: [],
  news: [],
  community: []
};

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 초기 데이터 로드
const aiModelsData = require('./data/seedData').aiModelsData;
const newsData = require('./data/seedData').newsData;
const communityData = require('./data/seedData').communityData;

// 메모리 내 데이터 초기화
inMemoryDB.aiModels = [...aiModelsData];
inMemoryDB.news = [...newsData];
inMemoryDB.community = [...communityData];

// 메모리 기반 라우터 생성 함수들
const createMemoryAIModelsRouter = () => {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      res.json(inMemoryDB.aiModels);
    } catch (error) {
      console.error('AI 모델 목록 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      if (isNaN(modelId)) {
        return res.status(400).json({ message: '유효하지 않은 모델 ID입니다.' });
      }

      const model = inMemoryDB.aiModels.find(m => m.id === modelId);
      if (!model) {
        return res.status(404).json({ message: 'AI 모델을 찾을 수 없습니다.' });
      }

      res.json(model);
    } catch (error) {
      console.error('AI 모델 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  return router;
};

const createMemoryNewsRouter = () => {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      res.json(inMemoryDB.news);
    } catch (error) {
      console.error('뉴스 목록 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const newsId = parseInt(req.params.id);
      if (isNaN(newsId)) {
        return res.status(400).json({ message: '유효하지 않은 뉴스 ID입니다.' });
      }

      const news = inMemoryDB.news.find(n => n.id === newsId);
      if (!news) {
        return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
      }

      res.json(news);
    } catch (error) {
      console.error('뉴스 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  return router;
};

const createMemoryCommunityRouter = () => {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      res.json(inMemoryDB.community);
    } catch (error) {
      console.error('커뮤니티 목록 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      }

      const post = inMemoryDB.community.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      res.json(post);
    } catch (error) {
      console.error('게시글 조회 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  router.post('/:id/like', (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: '유효하지 않은 게시글 ID입니다.' });
      }

      const post = inMemoryDB.community.find(p => p.id === postId);
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      post.likes += 1;
      res.json({ likes: post.likes });
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });

  return router;
};

// 라우터 등록
app.use('/api/ai-models', createMemoryAIModelsRouter());
app.use('/api/news', createMemoryNewsRouter());
app.use('/api/community', createMemoryCommunityRouter());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('VanillaAI API 서버가 실행 중입니다.');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
