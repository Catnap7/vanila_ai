'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowLeft, Star } from 'lucide-react';
import { aiModelsApi } from '@/lib/api';

export default function AIModelDetailPage() {
  const params = useParams();
  const modelId = params.id as string;
  
  const [model, setModel] = useState<any>(null);
  const [modelDetails, setModelDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 기본 모델 정보 가져오기
        const modelData = await aiModelsApi.getById(modelId);
        if (!modelData) {
          setError('AI 모델을 찾을 수 없습니다.');
          return;
        }
        
        setModel(modelData);
        
        // 상세 정보 가져오기
        const detailsData = await aiModelsApi.getModelDetails(parseInt(modelId));
        setModelDetails(detailsData);
      } catch (err) {
        console.error('모델 데이터를 가져오는 중 오류 발생:', err);
        setError('모델 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModelData();
  }, [modelId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">AI 모델 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{error || 'AI 모델을 찾을 수 없습니다.'}</h1>
          <Button asChild>
            <a href="/ai-models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              AI 모델 목록으로 돌아가기
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 헤더 */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <a href="/ai-models">
            <ArrowLeft className="mr-2 h-4 w-4" />
            모든 AI 모델
          </a>
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">{model.name}</h1>
            <p className="text-xl text-muted-foreground">{model.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              {model.category}
            </Badge>
            <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1">
              <Star className="h-4 w-4 mr-1 fill-primary" />
              <span className="font-medium">{model.popularity}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 기본 정보 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>개요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {modelDetails?.overview || model.description || `${model.name}는 ${model.company}에서 개발한 ${model.category} AI 모델입니다.`}
            </p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">주요 기능</h3>
                <ul className="list-disc list-inside space-y-1">
                  {model.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">기본 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">개발사:</span>
                    <span className="font-medium">{model.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">카테고리:</span>
                    <span className="font-medium">{model.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">출시일:</span>
                    <span className="font-medium">{model.releaseDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">인기도:</span>
                    <span className="font-medium">{model.popularity}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>요금제</CardTitle>
          </CardHeader>
          <CardContent>
            {modelDetails?.pricing_details ? (
              <div className="space-y-4">
                {Object.entries(modelDetails.pricing_details).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>{model.pricing}</p>
            )}
            
            {modelDetails?.api_documentation_url && (
              <Button variant="outline" className="w-full mt-6" asChild>
                <a href={modelDetails.api_documentation_url} target="_blank" rel="noopener noreferrer">
                  API 문서 보기
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 탭 */}
      {modelDetails && (
        <Tabs defaultValue="use-cases" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="use-cases">활용 사례</TabsTrigger>
            <TabsTrigger value="strengths">강점</TabsTrigger>
            <TabsTrigger value="limitations">한계</TabsTrigger>
          </TabsList>
          
          <TabsContent value="use-cases">
            <Card>
              <CardHeader>
                <CardTitle>활용 사례</CardTitle>
                <CardDescription>
                  {model.name}의 주요 활용 사례와 사용 예시입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {modelDetails.use_cases.map((useCase: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-6 w-6 mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
                
                {modelDetails.example_prompts && modelDetails.example_prompts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">예시 프롬프트</h3>
                    <div className="space-y-2">
                      {modelDetails.example_prompts.map((prompt: string, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          "{prompt}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle>강점</CardTitle>
                <CardDescription>
                  {model.name}의 주요 강점과 장점입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {modelDetails.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 h-6 w-6 mr-3 mt-0.5">
                        ✓
                      </span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="limitations">
            <Card>
              <CardHeader>
                <CardTitle>한계</CardTitle>
                <CardDescription>
                  {model.name}의 알려진 한계와 제한 사항입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {modelDetails.limitations.map((limitation: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 h-6 w-6 mr-3 mt-0.5">
                        !
                      </span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
