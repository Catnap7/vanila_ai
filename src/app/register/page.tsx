'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { signUp, signInWithOAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

// 회원가입 폼 스키마 정의
const registerSchema = z.object({
  username: z.string().min(3, { message: '사용자 이름은 최소 3자 이상이어야 합니다.' }),
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  password: z.string().min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: '이용약관에 동의해주세요.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 폼 설정
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // 폼 제출 처리
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      // Supabase 회원가입 로직 호출
      const { user, error } = await signUp(data.email, data.password, data.username);

      if (error) {
        toast({
          title: '회원가입 실패',
          description: error.message || '회원가입 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        return;
      }

      if (user) {
        toast({
          title: '회원가입 성공',
          description: '이메일 인증을 완료한 후 로그인해주세요.',
        });

        // 회원가입 성공 시 로그인 페이지로 리다이렉트
        router.push('/login');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast({
        title: '오류 발생',
        description: '회원가입 중 문제가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 처리
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth(provider);

      if (error) {
        toast({
          title: '회원가입 실패',
          description: `${provider} 회원가입 중 오류가 발생했습니다.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(`${provider} 회원가입 오류:`, error);
      toast({
        title: '오류 발생',
        description: `${provider} 회원가입 중 문제가 발생했습니다.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      <Card className="w-full max-w-md border-border/50 shadow-lg relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">회원가입</CardTitle>
          <CardDescription className="text-center">
            VanillaAI 커뮤니티에 가입하여 다양한 AI 모델에 대해 알아보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용자 이름</FormLabel>
                    <FormControl>
                      <Input placeholder="사용자 이름" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        <span>
                          <Link href="/terms" className="text-primary hover:underline">
                            이용약관
                          </Link>
                          과{' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            개인정보처리방침
                          </Link>
                          에 동의합니다.
                        </span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          </Form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn('google')}
              >
                Google로 가입
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn('github')}
              >
                GitHub로 가입
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
