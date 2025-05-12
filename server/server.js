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

// 메모리 내 API 라우트 설정
app.get('/api/ai-models', (req, res) => {
  res.json(inMemoryDB.aiModels);
});

app.get('/api/ai-models/:id', (req, res) => {
  const model = inMemoryDB.aiModels.find(m => m.id === parseInt(req.params.id));
  if (!model) return res.status(404).json({ message: 'AI 모델을 찾을 수 없습니다' });
  res.json(model);
});

app.get('/api/news', (req, res) => {
  res.json(inMemoryDB.news);
});

app.get('/api/news/:id', (req, res) => {
  const news = inMemoryDB.news.find(n => n.id === parseInt(req.params.id));
  if (!news) return res.status(404).json({ message: '뉴스를 찾을 수 없습니다' });
  res.json(news);
});

app.get('/api/community', (req, res) => {
  res.json(inMemoryDB.community);
});

app.get('/api/community/:id', (req, res) => {
  const post = inMemoryDB.community.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
  res.json(post);
});

app.post('/api/community/:id/like', (req, res) => {
  const post = inMemoryDB.community.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });

  post.likes += 1;
  res.json({ likes: post.likes });
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('VanillaAI API 서버가 실행 중입니다.');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
