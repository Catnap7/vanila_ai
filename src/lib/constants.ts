// API 설정
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10초
  RETRY_ATTEMPTS: 3,
} as const;

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  AI_MODELS_PER_PAGE: 12,
  NEWS_PER_PAGE: 6,
  COMMUNITY_POSTS_PER_PAGE: 10,
} as const;

// AI 모델 비교 설정
export const AI_MODEL_COMPARE = {
  MIN_MODELS: 2,
  MAX_MODELS: 4,
} as const;

// 이미지 설정
export const IMAGES = {
  PLACEHOLDER_AI: '/placeholder-ai.png',
  PLACEHOLDER_NEWS: '/news/default.jpg',
  PLACEHOLDER_AVATAR: '/avatars/default.png',
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  AI_MODELS: '/ai-models',
  AI_MODELS_COMPARE: '/ai-models/compare',
  NEWS: '/news',
  COMMUNITY: '/community',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// 테마 설정
export const THEME = {
  DEFAULT: 'system',
  OPTIONS: ['light', 'dark', 'system'],
} as const;

// 폼 유효성 검사
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 100,
  MAX_EXCERPT_LENGTH: 200,
  MAX_CONTENT_LENGTH: 5000,
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  VALIDATION_ERROR: '입력 데이터가 올바르지 않습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  REGISTER_SUCCESS: '회원가입이 완료되었습니다.',
  POST_CREATED: '게시글이 작성되었습니다.',
  POST_UPDATED: '게시글이 수정되었습니다.',
  POST_DELETED: '게시글이 삭제되었습니다.',
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  THEME: 'vanillai-theme',
  USER_PREFERENCES: 'vanillai-user-preferences',
  RECENT_SEARCHES: 'vanillai-recent-searches',
} as const;
