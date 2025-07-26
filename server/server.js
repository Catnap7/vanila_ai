const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// 환경 변수 설정
dotenv.config();

// MongoDB Atlas 연결 시도
let isMongoConnected = false;
(async () => {
  isMongoConnected = await connectDB();
  if (isMongoConnected) {
    console.log('🎉 MongoDB Atlas 연결 완료 - 데이터베이스 모드로 실행');
  } else {
    console.log('⚠️ MongoDB Atlas 연결 실패 - 메모리 모드로 실행');
  }
})();

// 메모리 내 데이터 저장소 (MongoDB 연결 실패 시 사용)
const inMemoryDB = {
  aiModels: [],
  news: [],
  community: []
};

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 5000;

// 보안 미들웨어 설정
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Helmet으로 기본 보안 헤더 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
    },
  },
  crossOriginEmbedderPolicy: false, // Next.js와의 호환성을 위해 비활성화
}));

// 레이트 리미팅 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: {
    error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS 설정 - 특정 도메인만 허용
const corsOptions = {
  origin: function (origin, callback) {
    // 허용된 도메인 목록
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://vanillai.vercel.app',
      'https://vanillai.com',
      'https://www.vanillai.com'
    ];

    // 개발 환경에서는 origin이 없을 수 있음 (Postman, 모바일 앱 등)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS 정책에 의해 차단되었습니다.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true, // 쿠키 및 인증 정보 허용
  optionsSuccessStatus: 200, // IE11 지원
  maxAge: 86400, // 24시간 동안 preflight 캐시
};

app.use(cors(corsOptions));

// JSON 파싱 미들웨어 (크기 제한 포함)
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // JSON 파싱 전 원본 데이터 저장 (서명 검증 등에 사용)
    req.rawBody = buf;
  }
}));

// URL 인코딩 미들웨어
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// 입력 검증 및 정화 미들웨어
const validator = require('validator');
const xss = require('xss');

// XSS 방지 미들웨어
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }

  if (req.query) {
    sanitizeObject(req.query);
  }

  if (req.params) {
    sanitizeObject(req.params);
  }

  next();
};

app.use(sanitizeInput);

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

// MongoDB 라우터 import
const aiModelsRouter = require('./routes/aiModels');
const newsRouter = require('./routes/news');
const communityRouter = require('./routes/community');

// 라우터 등록 (MongoDB 연결 상태에 따라 동적 선택)
const setupRoutes = () => {
  if (isMongoConnected) {
    // MongoDB Atlas 연결 시 데이터베이스 라우터 사용
    console.log('📊 MongoDB Atlas 라우터를 사용합니다.');
    app.use('/api/ai-models', aiModelsRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/community', communityRouter);
  } else {
    // MongoDB 연결 실패 시 메모리 라우터 사용
    console.log('💾 메모리 기반 라우터를 사용합니다.');
    app.use('/api/ai-models', createMemoryAIModelsRouter());
    app.use('/api/news', createMemoryNewsRouter());
    app.use('/api/community', createMemoryCommunityRouter());
  }
};

// 라우터 설정 (비동기 연결 완료 후)
setTimeout(setupRoutes, 1000); // MongoDB 연결 시도 후 라우터 설정

// 기본 라우트
app.get('/', (req, res) => {
  res.send('VanillaAI API 서버가 실행 중입니다.');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 VanillaAI API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 데이터베이스 모드: ${isMongoConnected ? 'MongoDB Atlas' : '메모리 내 저장소'}`);
  console.log(`🌐 서버 URL: http://localhost:${PORT}`);
  console.log(`📝 API 문서: http://localhost:${PORT}/api`);
});
