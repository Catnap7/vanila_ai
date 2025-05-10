'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signIn, signInWithOAuth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

// 로그인 폼 스키마 정의
const loginSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 폼 설정
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 폼 제출 처리
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Supabase 인증 로직 호출
      const { session, error } = await signIn(data.email, data.password);

      if (error) {
        toast({
          title: '로그인 실패',
          description: error.message || '이메일 또는 비밀번호를 확인해주세요.',
          variant: 'destructive',
        });
        return;
      }

      if (session) {
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });

        // 로그인 성공 시 홈페이지로 리다이렉트
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      toast({
        title: '오류 발생',
        description: '로그인 중 문제가 발생했습니다. 다시 시도해주세요.',
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
          title: '로그인 실패',
          description: `${provider} 로그인 중 오류가 발생했습니다.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      toast({
        title: '오류 발생',
        description: `${provider} 로그인 중 문제가 발생했습니다.`,
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
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">로그인</CardTitle>
          <CardDescription className="text-center">
            계정에 로그인하여 VanillaAI 커뮤니티에 참여하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
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
                Google로 로그인
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn('github')}
              >
                GitHub로 로그인
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link href="/forgot-password" className="text-primary hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
