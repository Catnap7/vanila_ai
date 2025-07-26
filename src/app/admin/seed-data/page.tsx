'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { withAdminAuth } from '@/contexts/AuthContext';

function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const seedAIModels = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch('/api/seed-ai-models');
      const data = await response.json();

      setResult({
        success: data.success,
        message: data.message
      });

      // 테이블이 없는 경우 오류 메시지만 표시
      // 이미 테이블을 생성했으므로 리디렉션 코드 제거
    } catch (error) {
      console.error('데이터 시드 중 오류 발생:', error);
      setResult({
        success: false,
        message: '데이터 시드 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">관리자 도구 - 데이터 관리</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>AI 모델 데이터 시드</CardTitle>
              <CardDescription>
                Supabase의 ai_models 테이블에 샘플 AI 모델 데이터를 추가하거나 업데이트합니다.
                기존 데이터는 유지되며, 같은 이름의 모델이 있으면 업데이트됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result && (
                <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <h5 className="font-medium">{result.success ? "성공" : "오류"}</h5>
                  </div>
                  <p className="text-sm">{result.message}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={seedAIModels}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    데이터 시드 중...
                  </>
                ) : (
                  "AI 모델 데이터 시드"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>가격 정보 업데이트</CardTitle>
              <CardDescription>
                AI 모델의 가격 정보를 더 상세하게 업데이트합니다.
                요금제 유형, 토큰 가격, 무료 티어 정보 등이 포함됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                이 기능은 AI 모델 비교 테이블에서 더 상세한 가격 정보를 표시하기 위해 사용됩니다.
                최신 가격 정보로 업데이트하려면 아래 버튼을 클릭하세요.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/update-pricing">
                  가격 정보 업데이트 페이지로 이동
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/ai-models/compare">
              AI 모델 비교 페이지로 이동
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(SeedDataPage);
