// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

import { supabase } from './supabase';

// AI 모델 API (Supabase 사용)
export const aiModelsApi = {
  // 모든 AI 모델 가져오기
  getAll: async () => {
    try {
      // Supabase에서 데이터 가져오기 시도
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('ai_models')
        .select('*')
        .order('popularity', { ascending: false });

      if (!supabaseError && supabaseData && supabaseData.length > 0) {
        // Supabase 데이터 형식을 프론트엔드 형식으로 변환
        return supabaseData.map(model => ({
          id: model.id,
          name: model.name,
          category: model.category,
          company: model.company,
          pricing: model.pricing,
          features: model.features,
          popularity: model.popularity,
          releaseDate: model.release_date,
          image: model.image_url || '/placeholder-ai.png',
          description: model.description
        }));
      }

      // Supabase에서 데이터를 가져오지 못한 경우 백업으로 Express 서버에서 가져오기
      console.log('Supabase에서 데이터를 가져오지 못했습니다. Express 서버에서 가져옵니다.');
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
      // Supabase에서 데이터 가져오기 시도
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('ai_models')
        .select('*')
        .eq('id', id)
        .single();

      if (!supabaseError && supabaseData) {
        // Supabase 데이터 형식을 프론트엔드 형식으로 변환
        return {
          id: supabaseData.id,
          name: supabaseData.name,
          category: supabaseData.category,
          company: supabaseData.company,
          pricing: supabaseData.pricing,
          features: supabaseData.features,
          popularity: supabaseData.popularity,
          releaseDate: supabaseData.release_date,
          image: supabaseData.image_url || '/placeholder-ai.png',
          description: supabaseData.description
        };
      }

      // Supabase에서 데이터를 가져오지 못한 경우 백업으로 Express 서버에서 가져오기
      console.log('Supabase에서 데이터를 가져오지 못했습니다. Express 서버에서 가져옵니다.');
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
