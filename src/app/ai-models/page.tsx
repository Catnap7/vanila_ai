'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { aiModelsApi } from '@/lib/api';

export default function AIModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiModels, setAiModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // API에서 AI 모델 데이터 가져오기
  useEffect(() => {
    const fetchAIModels = async () => {
      try {
        const data = await aiModelsApi.getAll();
        setAiModels(data);
      } catch (error) {
        console.error('AI 모델을 가져오는데 실패했습니다:', error);
        // 오류 발생 시 기본 데이터 사용
        setAiModels([
          {
            id: 1,
            name: 'GPT-4o',
            category: '텍스트 생성',
            company: 'OpenAI',
            pricing: '유료 (API 사용량 기반)',
            features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
            popularity: 98,
            releaseDate: '2024-05-13',
          },
          {
            id: 2,
            name: 'Claude 3 Opus',
            category: '텍스트 생성',
            company: 'Anthropic',
            pricing: '유료 (API 사용량 기반)',
            features: ['텍스트 생성', '긴 컨텍스트 지원', '멀티모달 입력 지원'],
            popularity: 92,
            releaseDate: '2024-03-04',
          },
          {
            id: 3,
            name: 'Midjourney v6',
            category: '이미지 생성',
            company: 'Midjourney',
            pricing: '구독제',
            features: ['이미지 생성', '스타일 조정', '고해상도 출력'],
            popularity: 95,
            releaseDate: '2023-12-14',
          },
          {
            id: 4,
            name: 'Gemini Pro',
            category: '텍스트 생성',
            company: 'Google',
            pricing: '무료/유료',
            features: ['텍스트 생성', '코드 생성', '멀티모달 입력 지원'],
            popularity: 90,
            releaseDate: '2023-12-06',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAIModels();
  }, []);

  // 카테고리 필터링
  const categories = ['all', '텍스트 생성', '이미지 생성', '음성 인식', '음악 생성'];

  // 검색 및 필터링된 모델
  const filteredModels = aiModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI 모델 비교</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          다양한 생성형 AI 모델을 비교하고 용도에 맞는 최적의 모델을 찾아보세요.
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="AI 모델 또는 회사 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category === 'all' ? '전체' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">AI 모델을 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* AI 모델 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{model.name}</h2>
                      <p className="text-muted-foreground">{model.company}</p>
                    </div>
                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {model.category}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">요금제</p>
                      <p>{model.pricing}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">주요 기능</p>
                      <ul className="list-disc list-inside text-sm">
                        {model.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">인기도</p>
                        <p className="text-lg font-semibold">{model.popularity}/100</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">출시일</p>
                        <p>{model.releaseDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6" asChild>
                    <a href={`/ai-models/${model.id}`}>자세히 보기</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
