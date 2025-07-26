import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 보호된 경로 정의
const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register'];

// 관리자 전용 경로
const ADMIN_ROUTES = ['/admin'];

// 관리자 이메일 목록 (환경 변수에서 가져오기)
const getAdminEmails = (): string[] => {
  return process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
};

// 사용자가 관리자인지 확인
const isUserAdmin = (userEmail: string | undefined): boolean => {
  if (!userEmail) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(userEmail);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 정적 파일과 API 라우트는 미들웨어에서 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Supabase 클라이언트 생성
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // 현재 세션 확인
    const { data: { session }, error } = await supabase.auth.getSession();

    // 인증이 필요한 경로 확인
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

    // 인증되지 않은 사용자가 보호된 경로에 접근하려는 경우
    if (isProtectedRoute && (!session || error)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 관리자 권한이 필요한 경로 확인
    if (isAdminRoute && session) {
      const userEmail = session.user?.email;
      const userRole = session.user?.user_metadata?.role;
      
      // 관리자 권한 확인
      if (!isUserAdmin(userEmail) && userRole !== 'admin') {
        // 권한이 없는 경우 홈페이지로 리다이렉트
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(homeUrl);
      }
    }

    // 이미 인증된 사용자가 로그인/회원가입 페이지에 접근하려는 경우
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  } catch (error) {
    console.error('미들웨어 오류:', error);
    
    // 오류 발생 시 보호된 경로는 로그인 페이지로 리다이렉트
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 대해 미들웨어 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 파일 확장자가 있는 경로
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
