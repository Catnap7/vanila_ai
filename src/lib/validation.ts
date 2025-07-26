import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// 기본 검증 스키마
export const emailSchema = z.string().email('유효한 이메일 주소를 입력해주세요.');
export const passwordSchema = z.string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.');

export const usernameSchema = z.string()
  .min(3, '사용자명은 최소 3자 이상이어야 합니다.')
  .max(20, '사용자명은 최대 20자까지 가능합니다.')
  .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.');

// AI 모델 관련 검증 스키마
export const aiModelSchema = z.object({
  name: z.string()
    .min(1, '모델명은 필수입니다.')
    .max(100, '모델명은 최대 100자까지 가능합니다.')
    .trim(),
  category: z.string()
    .min(1, '카테고리는 필수입니다.')
    .max(50, '카테고리는 최대 50자까지 가능합니다.')
    .trim(),
  company: z.string()
    .min(1, '회사명은 필수입니다.')
    .max(100, '회사명은 최대 100자까지 가능합니다.')
    .trim(),
  pricing: z.string()
    .min(1, '가격 정보는 필수입니다.')
    .max(200, '가격 정보는 최대 200자까지 가능합니다.')
    .trim(),
  features: z.array(z.string().trim().min(1))
    .min(1, '최소 하나의 기능은 필요합니다.')
    .max(20, '최대 20개의 기능까지 가능합니다.'),
  popularity: z.number()
    .int('인기도는 정수여야 합니다.')
    .min(0, '인기도는 0 이상이어야 합니다.')
    .max(100, '인기도는 100 이하여야 합니다.'),
  release_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'),
  description: z.string()
    .max(1000, '설명은 최대 1000자까지 가능합니다.')
    .optional(),
  image_url: z.string()
    .url('올바른 URL 형식이 아닙니다.')
    .optional()
    .or(z.literal(''))
});

// 커뮤니티 게시글 검증 스키마
export const postSchema = z.object({
  title: z.string()
    .min(1, '제목은 필수입니다.')
    .max(200, '제목은 최대 200자까지 가능합니다.')
    .trim(),
  content: z.string()
    .min(10, '내용은 최소 10자 이상이어야 합니다.')
    .max(10000, '내용은 최대 10,000자까지 가능합니다.')
    .trim(),
  tags: z.array(z.string().trim().min(1).max(30))
    .max(10, '최대 10개의 태그까지 가능합니다.')
    .optional()
    .default([])
});

// 댓글 검증 스키마
export const commentSchema = z.object({
  content: z.string()
    .min(1, '댓글 내용은 필수입니다.')
    .max(1000, '댓글은 최대 1000자까지 가능합니다.')
    .trim(),
  post_id: z.number()
    .int('게시글 ID는 정수여야 합니다.')
    .positive('게시글 ID는 양수여야 합니다.')
});

// 뉴스 검증 스키마
export const newsSchema = z.object({
  title: z.string()
    .min(1, '제목은 필수입니다.')
    .max(300, '제목은 최대 300자까지 가능합니다.')
    .trim(),
  content: z.string()
    .min(10, '내용은 최소 10자 이상이어야 합니다.')
    .max(50000, '내용은 최대 50,000자까지 가능합니다.')
    .trim(),
  excerpt: z.string()
    .min(10, '요약은 최소 10자 이상이어야 합니다.')
    .max(500, '요약은 최대 500자까지 가능합니다.')
    .trim(),
  source: z.string()
    .min(1, '출처는 필수입니다.')
    .max(100, '출처는 최대 100자까지 가능합니다.')
    .trim(),
  published_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)'),
  image_url: z.string()
    .url('올바른 URL 형식이 아닙니다.')
    .optional()
    .or(z.literal(''))
});

// ID 파라미터 검증
export const idParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'ID는 숫자여야 합니다.')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID는 양수여야 합니다.')
});

// 페이지네이션 검증
export const paginationSchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, '페이지 번호는 양수여야 합니다.'),
  limit: z.string()
    .optional()
    .default('10')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 100, '페이지 크기는 1-100 사이여야 합니다.')
});

// 검색 쿼리 검증
export const searchQuerySchema = z.object({
  q: z.string()
    .min(1, '검색어는 최소 1자 이상이어야 합니다.')
    .max(100, '검색어는 최대 100자까지 가능합니다.')
    .trim()
    .optional(),
  category: z.string()
    .max(50, '카테고리는 최대 50자까지 가능합니다.')
    .trim()
    .optional(),
  sort: z.enum(['popularity', 'date', 'name', 'company'])
    .optional()
    .default('popularity'),
  order: z.enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

// HTML 콘텐츠 정화 함수
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur']
  });
};

// 텍스트 콘텐츠 정화 함수
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 스크립트 태그 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+\s*=/gi, '') // 이벤트 핸들러 제거
    .trim();
};

// API 응답 검증 헬퍼
export const validateApiResponse = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: '알 수 없는 검증 오류가 발생했습니다.' };
  }
};

// 요청 본문 검증 미들웨어 헬퍼
export const validateRequestBody = <T>(
  schema: z.ZodSchema<T>
) => {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`검증 실패: ${errorMessage}`);
      }
      throw new Error('알 수 없는 검증 오류가 발생했습니다.');
    }
  };
};

// URL 파라미터 검증 헬퍼
export const validateParams = <T>(
  schema: z.ZodSchema<T>,
  params: unknown
): T => {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`파라미터 검증 실패: ${errorMessage}`);
    }
    throw new Error('알 수 없는 파라미터 검증 오류가 발생했습니다.');
  }
};

// 쿼리 파라미터 검증 헬퍼
export const validateQuery = <T>(
  schema: z.ZodSchema<T>,
  query: unknown
): T => {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`쿼리 검증 실패: ${errorMessage}`);
    }
    throw new Error('알 수 없는 쿼리 검증 오류가 발생했습니다.');
  }
};
