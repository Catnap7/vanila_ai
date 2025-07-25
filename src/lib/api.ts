// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

import { supabase, isSupabaseAvailable } from './supabase';

// 타입 정의
export interface AIModel {
  id: number;
  name: string;
  category: string;
  company: string;
  pricing: string;
  features: string[];
  popularity: number;
  releaseDate: string;
  image?: string;
  description?: string;
}

export interface News {
  id: number;
  title: string;
  date: string;
  source: string;
  image?: string;
  excerpt: string;
  content?: string;
  tags: string[];
}

export interface CommunityPost {
  id: number;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  content: string;
  excerpt: string;
  comments: number;
  likes: number;
  views: number;
  tags: string[];
}

// 공통 유틸리티 함수
const transformSupabaseAIModel = (model: any): AIModel => ({
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
});

const handleApiError = (error: any, context: string): void => {
  console.error(`${context} 오류:`, error);
};

const fetchWithFallback = async <T>(
  supabaseQuery: () => Promise<{ data: any; error: any }>,
  fallbackUrl: string,
  transform?: (data: any) => T[]
): Promise<T[]> => {
  try {
    // Supabase가 사용 가능한지 먼저 확인
    if (isSupabaseAvailable() && supabase) {
      const { data, error } = await supabaseQuery();

      if (!error && data && data.length > 0) {
        return transform ? transform(data) : data;
      }

      console.log('Supabase에서 데이터를 가져오지 못했습니다. Express 서버에서 가져옵니다.');
    } else {
      console.log('Supabase가 설정되지 않았습니다. Express 서버에서 데이터를 가져옵니다.');
    }

    // Express 서버에서 데이터 가져오기
    const response = await fetch(fallbackUrl);
    if (!response.ok) throw new Error(`${fallbackUrl}에서 데이터를 가져오는데 실패했습니다`);
    return await response.json();
  } catch (error) {
    handleApiError(error, 'API 호출');
    return [];
  }
};

// AI 모델 API (Supabase 사용)
export const aiModelsApi = {
  // 모든 AI 모델 가져오기
  getAll: async (): Promise<AIModel[]> => {
    return fetchWithFallback(
      () => supabase
        .from('ai_models')
        .select('*')
        .order('popularity', { ascending: false }),
      `${API_URL}/ai-models`,
      (data) => data.map(transformSupabaseAIModel)
    );
  },

  // 특정 AI 모델 가져오기
  getById: async (id: string) => {
    try {
      // Supabase가 사용 가능한지 확인
      if (isSupabaseAvailable() && supabase) {
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

        console.log('Supabase에서 데이터를 가져오지 못했습니다. Express 서버에서 가져옵니다.');
      } else {
        console.log('Supabase가 설정되지 않았습니다. Express 서버에서 데이터를 가져옵니다.');
      }

      // Express 서버에서 데이터 가져오기
      const response = await fetch(`${API_URL}/ai-models/${id}`);
      if (!response.ok) throw new Error('AI 모델을 가져오는데 실패했습니다');
      return await response.json();
    } catch (error) {
      console.error('AI 모델 API 오류:', error);
      return null;
    }
  },

  // AI 모델 상세 정보 가져오기
  getModelDetails: async (modelId: number) => {
    try {
      // Supabase가 사용 가능한지 확인
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase
          .from('ai_model_details')
          .select('*')
          .eq('model_id', modelId)
          .single();

        if (!error && data) {
          return data;
        }

        console.log('Supabase에서 모델 상세 정보를 가져오지 못했습니다.');
      } else {
        console.log('Supabase가 설정되지 않았습니다. 모델 상세 정보를 사용할 수 없습니다.');
      }

      // 현재 Express 서버에는 모델 상세 정보 엔드포인트가 없으므로 null 반환
      return null;
    } catch (error) {
      console.error('AI 모델 상세 정보 API 오류:', error);
      return null;
    }
  },

  // 모든 AI 모델과 상세 정보 함께 가져오기
  getAllWithDetails: async () => {
    try {
      // 모든 AI 모델 가져오기
      const models = await aiModelsApi.getAll();

      // 각 모델의 상세 정보 가져오기
      const modelsWithDetails = await Promise.all(
        models.map(async (model) => {
          const details = await aiModelsApi.getModelDetails(model.id);
          return {
            ...model,
            details: details || null
          };
        })
      );

      return modelsWithDetails;
    } catch (error) {
      console.error('AI 모델 및 상세 정보 API 오류:', error);
      return [];
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
