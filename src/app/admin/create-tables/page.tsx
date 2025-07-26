'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { withAdminAuth } from '@/contexts/AuthContext';

function CreateTablesPage() {
  const [copied, setCopied] = useState(false);

  const aiModelsTableSQL = `
CREATE TABLE public.ai_models (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  company TEXT NOT NULL,
  pricing TEXT NOT NULL,
  features TEXT[] NOT NULL,
  popularity INTEGER NOT NULL,
  release_date TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS 정책 설정
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI 모델은 공개적으로 조회 가능" ON ai_models
  FOR SELECT USING (true);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiModelsTableSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase 테이블 생성 가이드</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>테이블이 존재하지 않는 문제</CardTitle>
            <CardDescription>
              Supabase에 필요한 테이블이 생성되어 있지 않아 데이터를 저장할 수 없습니다.
              아래 안내에 따라 Supabase 대시보드에서 테이블을 생성해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">테이블 생성 방법</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Supabase 대시보드 <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                  에 로그인합니다.
                </li>
                <li>프로젝트를 선택합니다.</li>
                <li>왼쪽 메뉴에서 "Table Editor"를 클릭합니다.</li>
                <li>"New Table" 버튼을 클릭합니다.</li>
                <li>테이블 이름을 "ai_models"로 입력합니다.</li>
                <li>아래 SQL 에디터 탭을 사용하여 SQL 쿼리를 실행할 수도 있습니다.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="sql">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sql">SQL 쿼리</TabsTrigger>
            <TabsTrigger value="ui">UI로 생성</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sql" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>SQL로 테이블 생성</CardTitle>
                <CardDescription>
                  Supabase의 SQL 에디터에서 아래 쿼리를 실행하여 테이블을 생성할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {aiModelsTableSQL}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={copyToClipboard}
                  className="w-full"
                >
                  {copied ? "복사됨!" : "SQL 쿼리 복사"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="ui" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>UI로 테이블 생성</CardTitle>
                <CardDescription>
                  Supabase의 Table Editor를 사용하여 UI로 테이블을 생성할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">필요한 컬럼</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">컬럼명</th>
                          <th className="text-left p-2">타입</th>
                          <th className="text-left p-2">기본값</th>
                          <th className="text-left p-2">필수</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">id</td>
                          <td className="p-2">serial</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓ (Primary Key)</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">name</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">category</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">company</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">pricing</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">features</td>
                          <td className="p-2">text[]</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">popularity</td>
                          <td className="p-2">integer</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">release_date</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">image_url</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">description</td>
                          <td className="p-2">text</td>
                          <td className="p-2">-</td>
                          <td className="p-2">-</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">created_at</td>
                          <td className="p-2">timestamptz</td>
                          <td className="p-2">now()</td>
                          <td className="p-2">✓</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">updated_at</td>
                          <td className="p-2">timestamptz</td>
                          <td className="p-2">now()</td>
                          <td className="p-2">✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <Button asChild>
            <a href="/admin/seed-data">데이터 시드 페이지로 돌아가기</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(CreateTablesPage);
