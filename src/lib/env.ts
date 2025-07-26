import { z } from 'zod';

// Client-side safe environment variables schema (NEXT_PUBLIC_ prefixed only)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Supabase URL이 올바르지 않습니다.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key가 필요합니다.'),
  NEXT_PUBLIC_ADMIN_EMAILS: z.string()
    .min(1, '관리자 이메일이 설정되지 않았습니다.')
    .transform(val => val.split(',').map(email => email.trim()))
    .refine(emails => emails.every(email => z.string().email().safeParse(email).success),
      '관리자 이메일 형식이 올바르지 않습니다.'),
});

// Immediately parsed and exported client environment variables
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS,
});

// Server-side environment variables schema (includes all variables)
const envSchema = z.object({
  // Next.js 기본 환경 변수
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase 환경 변수
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Supabase URL이 올바르지 않습니다.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key가 필요합니다.'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase Service Role Key가 필요합니다.').optional(),

  // 관리자 설정
  NEXT_PUBLIC_ADMIN_EMAILS: z.string()
    .min(1, '관리자 이메일이 설정되지 않았습니다.')
    .transform(val => val.split(',').map(email => email.trim()))
    .refine(emails => emails.every(email => z.string().email().safeParse(email).success),
      '관리자 이메일 형식이 올바르지 않습니다.'),

  // 보안 설정
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth Secret은 최소 32자 이상이어야 합니다.').optional(),
  NEXTAUTH_URL: z.string().url('NextAuth URL이 올바르지 않습니다.').optional(),

  // 외부 API 키 (선택사항)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  // 데이터베이스 설정 (선택사항)
  DATABASE_URL: z.string().url().optional(),

  // 로깅 및 모니터링
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),

  // 레이트 리미팅
  RATE_LIMIT_MAX: z.string().transform(val => parseInt(val, 10)).default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(val => parseInt(val, 10)).default('900'), // 15분

  // 파일 업로드 설정
  MAX_FILE_SIZE: z.string().transform(val => parseInt(val, 10)).default('5242880'), // 5MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/gif'),
});

// 환경 변수 타입 정의
export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

// Server-side environment variables (only parse on server-side)
export const env = typeof window === 'undefined' ? (() => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');

      console.error('환경 변수 검증 실패:');
      console.error(errorMessages);

      // 개발 환경에서는 경고만 출력하고 계속 진행
      if (process.env.NODE_ENV === 'development') {
        console.warn('개발 환경에서 일부 환경 변수가 누락되었습니다. 기본값을 사용합니다.');
        return {
          NODE_ENV: 'development',
          ...clientEnv,
          LOG_LEVEL: 'info',
          ENABLE_ANALYTICS: false,
          RATE_LIMIT_MAX: 100,
          RATE_LIMIT_WINDOW: 900,
          MAX_FILE_SIZE: 5242880,
          ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/webp,image/gif',
        } as Env;
      } else {
        // 프로덕션 환경에서는 앱 시작을 중단
        throw new Error(`환경 변수 검증 실패:\n${errorMessages}`);
      }
    } else {
      throw error;
    }
  }
})() : {
  // Client-side fallback with only public variables
  NODE_ENV: 'development' as const,
  ...clientEnv,
  LOG_LEVEL: 'info' as const,
  ENABLE_ANALYTICS: false,
  RATE_LIMIT_MAX: 100,
  RATE_LIMIT_WINDOW: 900,
  MAX_FILE_SIZE: 5242880,
  ALLOWED_FILE_TYPES: 'image/jpeg,image/png,image/webp,image/gif',
} as Env;

// 환경별 설정 헬퍼 함수들
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';

// 관리자 이메일 확인 함수 (client-safe)
export const isAdminEmail = (email: string): boolean => {
  return clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.includes(email.toLowerCase());
};

// Supabase 설정 검증 (client-safe)
export const validateSupabaseConfig = (): boolean => {
  return !!(clientEnv.NEXT_PUBLIC_SUPABASE_URL && clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// 보안 설정 검증
export const validateSecurityConfig = (): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Server-side only checks
  if (typeof window === 'undefined') {
    // NextAuth 설정 확인
    if (isProduction() && !env.NEXTAUTH_SECRET) {
      errors.push('프로덕션 환경에서 NEXTAUTH_SECRET이 설정되지 않았습니다.');
    }

    if (isProduction() && !env.NEXTAUTH_URL) {
      warnings.push('프로덕션 환경에서 NEXTAUTH_URL 설정을 권장합니다.');
    }
  }

  // 관리자 이메일 설정 확인 (client-safe)
  if (clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.length === 0) {
    warnings.push('관리자 이메일이 설정되지 않았습니다.');
  }

  // Supabase 설정 확인 (client-safe)
  if (!validateSupabaseConfig()) {
    errors.push('Supabase 설정이 올바르지 않습니다.');
  }

  // 개발 환경에서의 보안 경고
  if (isDevelopment()) {
    warnings.push('개발 환경에서 실행 중입니다. 프로덕션 배포 전 모든 환경 변수를 확인하세요.');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// 환경 변수 로깅 (민감한 정보 제외)
export const logEnvironmentInfo = (): void => {
  const safeEnvInfo = {
    NODE_ENV: env.NODE_ENV,
    SUPABASE_URL_SET: !!clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY_SET: !!clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ADMIN_EMAILS_COUNT: clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.length,
    LOG_LEVEL: env.LOG_LEVEL,
    ANALYTICS_ENABLED: env.ENABLE_ANALYTICS,
    RATE_LIMIT_MAX: env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW: env.RATE_LIMIT_WINDOW,
  };

  console.log('환경 설정 정보:', safeEnvInfo);

  const securityCheck = validateSecurityConfig();

  if (securityCheck.warnings.length > 0) {
    console.warn('보안 경고:', securityCheck.warnings);
  }

  if (securityCheck.errors.length > 0) {
    console.error('보안 오류:', securityCheck.errors);
  }
};

// 런타임에서 환경 변수 업데이트는 보안상 제거됨
// 환경 변수는 앱 시작 시에만 설정되어야 함

// 앱 시작 시 환경 변수 검증 실행
if (typeof window === 'undefined') {
  // 서버 사이드에서만 실행
  logEnvironmentInfo();
}
