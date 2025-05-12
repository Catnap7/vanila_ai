// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// AI 모델 API
export const aiModelsApi = {
  // 모든 AI 모델 가져오기
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/ai-models`);
      if (!response.ok) throw new Error('AI 모델을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('AI 모델 API 오류:', error);
      return [];
    }
  },

  // 특정 AI 모델 가져오기
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/ai-models/${id}`);
      if (!response.ok) throw new Error('AI 모델을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('AI 모델 API 오류:', error);
      return null;
    }
  }
};

// 뉴스 API
export const newsApi = {
  // 모든 뉴스 가져오기
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/news`);
      if (!response.ok) throw new Error('뉴스를 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('뉴스 API 오류:', error);
      return [];
    }
  },

  // 특정 뉴스 가져오기
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/news/${id}`);
      if (!response.ok) throw new Error('뉴스를 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('뉴스 API 오류:', error);
      return null;
    }
  }
};

// 커뮤니티 API
export const communityApi = {
  // 모든 게시글 가져오기
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/community`);
      if (!response.ok) throw new Error('게시글을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('커뮤니티 API 오류:', error);
      return [];
    }
  },

  // 특정 게시글 가져오기
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/community/${id}`);
      if (!response.ok) throw new Error('게시글을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('커뮤니티 API 오류:', error);
      return null;
    }
  },

  // 게시글 좋아요 증가
  likePost: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/community/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('좋아요 처리에 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('커뮤니티 API 오류:', error);
      return null;
    }
  }
};
