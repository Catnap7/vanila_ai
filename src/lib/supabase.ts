import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 API 키를 가져옵니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 설정이 유효한지 확인하는 함수
function isValidSupabaseConfig(url: string, key: string): boolean {
  return (
    url &&
    key &&
    url !== 'your_supabase_url_here' &&
    key !== 'your_supabase_anon_key_here' &&
    url.startsWith('https://') &&
    url.includes('.supabase.co')
  );
}

// Supabase 클라이언트를 조건부로 생성합니다
let supabase: SupabaseClient | null = null;

if (isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase 클라이언트가 성공적으로 초기화되었습니다.');
  } catch (error) {
    console.error('❌ Supabase 클라이언트 초기화 실패:', error);
    supabase = null;
  }
} else {
  console.warn('⚠️ Supabase 설정이 유효하지 않습니다. Express 백엔드를 사용합니다.');
  console.warn('Supabase를 사용하려면 .env.local 파일에서 다음 값들을 설정하세요:');
  console.warn('- NEXT_PUBLIC_SUPABASE_URL: https://your-project.supabase.co');
  console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY: your-anon-key');
}

// Supabase 클라이언트 export (null일 수 있음)
export { supabase };

// Supabase 사용 가능 여부를 확인하는 유틸리티 함수
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// 타입 정의
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_models: {
        Row: {
          id: number;
          name: string;
          category: string;
          company: string;
          pricing: string;
          features: string[];
          popularity: number;
          release_date: string;
          image_url: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category: string;
          company: string;
          pricing: string;
          features: string[];
          popularity: number;
          release_date: string;
          image_url?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string;
          company?: string;
          pricing?: string;
          features?: string[];
          popularity?: number;
          release_date?: string;
          image_url?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          user_id: string;
          tags: string[];
          views: number;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          user_id: string;
          tags?: string[];
          views?: number;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          user_id?: string;
          tags?: string[];
          views?: number;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: number;
          content: string;
          post_id: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          content: string;
          post_id: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          content?: string;
          post_id?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      news: {
        Row: {
          id: number;
          title: string;
          content: string;
          excerpt: string;
          source: string;
          image_url: string | null;
          published_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          excerpt: string;
          source: string;
          image_url?: string | null;
          published_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          excerpt?: string;
          source?: string;
          image_url?: string | null;
          published_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
