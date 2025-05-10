import { supabase } from './supabase';
import { type AuthError, type Session, type User } from '@supabase/supabase-js';

/**
 * 이메일과 비밀번호로 회원가입
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @param username 사용자 이름
 */
export async function signUp(email: string, password: string, username: string): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    // 1. 이메일과 비밀번호로 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError };
    }

    if (!authData.user) {
      return { 
        user: null, 
        error: { 
          name: 'UserCreationError', 
          message: '사용자 계정을 생성할 수 없습니다.' 
        } as AuthError 
      };
    }

    // 2. 사용자 프로필 정보 저장
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        username,
        avatar_url: null,
      });

    if (profileError) {
      // 프로필 생성 실패 시 사용자 계정 삭제 (실제 구현 시 필요)
      return { 
        user: null, 
        error: { 
          name: 'ProfileCreationError', 
          message: '사용자 프로필을 생성할 수 없습니다: ' + profileError.message 
        } as AuthError 
      };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { 
      user: null, 
      error: { 
        name: 'SignUpError', 
        message: '회원가입 중 오류가 발생했습니다.' 
      } as AuthError 
    };
  }
}

/**
 * 이메일과 비밀번호로 로그인
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 */
export async function signIn(email: string, password: string): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { session: data.session, error };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { 
      session: null, 
      error: { 
        name: 'SignInError', 
        message: '로그인 중 오류가 발생했습니다.' 
      } as AuthError 
    };
  }
}

/**
 * 소셜 로그인 (OAuth)
 * @param provider 소셜 로그인 제공자 (google, github 등)
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error(`${provider} 로그인 오류:`, error);
    return { 
      data: null, 
      error: { 
        name: 'OAuthError', 
        message: `${provider} 로그인 중 오류가 발생했습니다.` 
      } as AuthError 
    };
  }
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { 
      error: { 
        name: 'SignOutError', 
        message: '로그아웃 중 오류가 발생했습니다.' 
      } as AuthError 
    };
  }
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return { 
      user: null, 
      error: { 
        name: 'GetUserError', 
        message: '사용자 정보를 가져오는 중 오류가 발생했습니다.' 
      } as AuthError 
    };
  }
}

/**
 * 비밀번호 재설정 이메일 전송
 * @param email 사용자 이메일
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    return { 
      error: { 
        name: 'ResetPasswordError', 
        message: '비밀번호 재설정 이메일을 보내는 중 오류가 발생했습니다.' 
      } as AuthError 
    };
  }
}
