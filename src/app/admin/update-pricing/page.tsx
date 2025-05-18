'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UpdatePricingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const updatePricingDetails = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/update-pricing-details');
      const data = await response.json();
      
      setResult({
        success: data.success,
        message: data.message,
        details: data.results
      });
    } catch (error) {
      console.error('가격 정보 업데이트 중 오류 발생:', error);
      setResult({
        success: false,
        message: '가격 정보 업데이트 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/seed-data">
            <ArrowLeft className="mr-2 h-4 w-4" />
            관리자 페이지로 돌아가기
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">AI 모델 가격 정보 업데이트</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>가격 정보 업데이트</CardTitle>
            <CardDescription>
              AI 모델의 가격 정보를 최신 데이터로 업데이트합니다.
              이 작업은 기존 ai_model_details 테이블의 pricing_details 필드를 더 상세한 구조로 업데이트합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">업데이트되는 정보</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>요금제 유형 (구독형, 사용량 기반 등)</li>
                  <li>구독 티어 구조 및 가격</li>
                  <li>토큰당 비용 (입력/출력 토큰 구분)</li>
                  <li>컨텍스트 윈도우 크기</li>
                  <li>무료 티어 제공 여부 및 상세 정보</li>
                  <li>기업용 요금제 옵션</li>
                </ul>
              </div>
              
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
                  
                  {result.details && (
                    <div className="mt-4">
                      <h6 className="text-sm font-medium mb-2">업데이트 상세 결과:</h6>
                      <div className="text-xs space-y-1">
                        {result.details.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            {item.success ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                            <span>모델 ID {item.model_id}: {item.success ? '성공' : '실패'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={updatePricingDetails} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  가격 정보 업데이트 중...
                </>
              ) : (
                "AI 모델 가격 정보 업데이트"
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">가격 정보 구조</h2>
          <div className="bg-muted p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs">
{`// 사용량 기반 모델 (GPT-4o, Claude 3 등)
{
  "pricing_type": "usage_based",
  "pricing_summary": "API 사용량 기반 과금, 토큰당 비용 차등 적용",
  "token_prices": {
    "input": { "price": 10.0, "unit": "USD per 1M tokens", "formatted": "$10 / 1M 토큰" },
    "output": { "price": 30.0, "unit": "USD per 1M tokens", "formatted": "$30 / 1M 토큰" }
  },
  "context_window": { "size": 128000, "unit": "tokens", "formatted": "128K 토큰" },
  "free_tier": {
    "available": true,
    "description": "제한된 무료 사용량 제공",
    "limits": "일일 메시지 제한 있음"
  }
}

// 구독형 모델 (Midjourney 등)
{
  "pricing_type": "subscription",
  "pricing_summary": "월간 구독제, 티어별 이미지 생성 수량 차등 적용",
  "tiers": [
    {
      "name": "Basic",
      "price": 10,
      "unit": "USD per month",
      "formatted": "$10/월",
      "features": "월 200분의 GPU 시간, 기본 기능 접근"
    },
    // 추가 티어...
  ]
}`}
            </pre>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/ai-models/compare">
              AI 모델 비교 페이지로 이동
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
