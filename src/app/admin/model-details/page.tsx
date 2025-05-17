'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ModelDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const createModelDetailsTable = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/create-model-details-table');
      const data = await response.json();
      
      setResult({
        success: data.success,
        message: data.message
      });
    } catch (error) {
      console.error('테이블 생성 중 오류 발생:', error);
      setResult({
        success: false,
        message: '테이블 생성 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI 모델 상세 정보 관리</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>AI 모델 상세 정보 테이블 생성</CardTitle>
            <CardDescription>
              Supabase에 AI 모델 상세 정보를 저장할 테이블을 생성하고 샘플 데이터를 추가합니다.
              이 테이블은 ai_models 테이블과 외래 키로 연결됩니다.
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
              onClick={createModelDetailsTable} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  테이블 생성 중...
                </>
              ) : (
                "AI 모델 상세 정보 테이블 생성"
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">테이블 구조</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">컬럼명</th>
                  <th className="text-left p-2">타입</th>
                  <th className="text-left p-2">설명</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">id</td>
                  <td className="p-2">serial</td>
                  <td className="p-2">기본 키</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">model_id</td>
                  <td className="p-2">integer</td>
                  <td className="p-2">ai_models 테이블의 id를 참조하는 외래 키</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">overview</td>
                  <td className="p-2">text</td>
                  <td className="p-2">모델에 대한 개요</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">use_cases</td>
                  <td className="p-2">text[]</td>
                  <td className="p-2">모델의 사용 사례 목록</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">strengths</td>
                  <td className="p-2">text[]</td>
                  <td className="p-2">모델의 강점 목록</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">limitations</td>
                  <td className="p-2">text[]</td>
                  <td className="p-2">모델의 한계 목록</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">pricing_details</td>
                  <td className="p-2">jsonb</td>
                  <td className="p-2">가격 정보 (JSON 형식)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">api_documentation_url</td>
                  <td className="p-2">text</td>
                  <td className="p-2">API 문서 URL</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">example_prompts</td>
                  <td className="p-2">text[]</td>
                  <td className="p-2">예시 프롬프트 목록</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">created_at</td>
                  <td className="p-2">timestamptz</td>
                  <td className="p-2">생성 시간</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">updated_at</td>
                  <td className="p-2">timestamptz</td>
                  <td className="p-2">업데이트 시간</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <a href="/admin/seed-data">AI 모델 데이터 시드 페이지로 이동</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
