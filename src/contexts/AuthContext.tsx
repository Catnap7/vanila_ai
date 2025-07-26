'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable, isAdmin } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  const refreshSession = async () => {
    if (!isSupabaseAvailable() || !supabase) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('세션 새로고침 오류:', error);
        setSession(null);
        setUser(null);
        setIsAdminUser(false);
        return;
      }

      setSession(session);
      setUser(session?.user || null);

      // 관리자 권한 확인
      if (session?.user) {
        const adminStatus = await isAdmin(session.user.id);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
    } catch (error) {
      console.error('세션 새로고침 중 오류:', error);
      setSession(null);
      setUser(null);
      setIsAdminUser(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseAvailable() || !supabase) return;

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 오류:', error);
      }
      
      setSession(null);
      setUser(null);
      setIsAdminUser(false);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  useEffect(() => {
    if (!isSupabaseAvailable() || !supabase) {
      setIsLoading(false);
      return;
    }

    // 초기 세션 확인
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('초기 세션 확인 오류:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);

          // 관리자 권한 확인
          if (session?.user) {
            const adminStatus = await isAdmin(session.user.id);
            setIsAdminUser(adminStatus);
          }
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // 인증 상태 변경 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('인증 상태 변경:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);

        // 관리자 권한 확인
        if (session?.user) {
          const adminStatus = await isAdmin(session.user.id);
          setIsAdminUser(adminStatus);
        } else {
          setIsAdminUser(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// HOC for protecting components that require authentication
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="text-muted-foreground mb-4">
              이 페이지에 접근하려면 로그인이 필요합니다.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              로그인하기
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// HOC for protecting components that require admin access
export const withAdminAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AdminAuthenticatedComponent(props: P) {
    const { isAuthenticated, isAdminUser, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="text-muted-foreground mb-4">
              이 페이지에 접근하려면 로그인이 필요합니다.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              로그인하기
            </a>
          </div>
        </div>
      );
    }

    if (!isAdminUser) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              관리자 권한이 필요한 페이지입니다.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
