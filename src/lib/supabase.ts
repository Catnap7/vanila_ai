import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 API 키를 가져옵니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 환경 변수가 설정되지 않은 경우 경고 메시지를 출력합니다
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL 또는 API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
}

// Supabase 클라이언트를 생성합니다
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
