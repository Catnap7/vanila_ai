'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // 예시 뉴스 데이터
  const newsArticles = [
    {
      id: 1,
      title: 'OpenAI, GPT-4o 모델 출시 발표',
      date: '2024-05-13',
      source: 'AI 뉴스',
      image: '/news/news1.jpg',
      excerpt: 'OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다. 이 모델은 기존 GPT-4 Turbo보다 더 빠르고 정확하며, 다양한 입력 형식을 처리할 수 있습니다.',
      tags: ['OpenAI', 'GPT-4o', '멀티모달'],
    },
    {
      id: 2,
      title: 'Google I/O에서 Gemini 2.0 공개',
      date: '2024-05-10',
      source: '테크 인사이트',
      image: '/news/news2.jpg',
      excerpt: 'Google이 연례 개발자 컨퍼런스에서 Gemini의 새로운 버전을 공개했습니다. Gemini 2.0은 더 긴 컨텍스트 윈도우와 향상된 추론 능력을 갖추고 있으며, 다양한 Google 제품에 통합될 예정입니다.',
      tags: ['Google', 'Gemini', 'I/O'],
    },
    {
      id: 3,
      title: 'Anthropic, Claude 3.5 개발 중',
      date: '2024-05-08',
      source: 'AI 트렌드',
      image: '/news/news3.jpg',
      excerpt: 'Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다. 새 모델은 더 빠른 응답 속도와 향상된 추론 능력을 갖출 것으로 예상됩니다.',
      tags: ['Anthropic', 'Claude', 'LLM'],
    },
    {
      id: 4,
      title: 'Midjourney v7 개발 소식',
      date: '2024-05-05',
      source: '크리에이티브 AI',
      image: '/news/news4.jpg',
      excerpt: 'Midjourney의 CEO가 트위터를 통해 Midjourney v7이 개발 중이라고 밝혔습니다. 새 버전은 더 사실적인 이미지 생성과 향상된 텍스트 렌더링 기능을 포함할 것으로 예상됩니다.',
      tags: ['Midjourney', '이미지 생성', 'v7'],
    },
    {
      id: 5,
      title: 'Meta, 새로운 오픈소스 LLM 발표 예정',
      date: '2024-05-03',
      source: '소셜 테크',
      image: '/news/news5.jpg',
      excerpt: 'Meta가 곧 새로운 오픈소스 대규모 언어 모델을 발표할 예정이라고 합니다. 이 모델은 Llama 3의 후속작으로, 더 큰 파라미터 크기와 향상된 성능을 제공할 것으로 예상됩니다.',
      tags: ['Meta', 'Llama', '오픈소스'],
    },
    {
      id: 6,
      title: 'Stability AI, 새로운 이미지 생성 모델 출시',
      date: '2024-05-01',
      source: '이미지 AI',
      image: '/news/news6.jpg',
      excerpt: 'Stability AI가 Stable Diffusion XL의 후속작인 새로운 이미지 생성 모델을 출시했습니다. 이 모델은 더 높은 해상도와 향상된 이미지 품질을 제공합니다.',
      tags: ['Stability AI', 'Stable Diffusion', '이미지 생성'],
    },
    {
      id: 7,
      title: 'AI 규제에 관한 국제 협약 논의 시작',
      date: '2024-04-28',
      source: '글로벌 정책',
      image: '/news/news7.jpg',
      excerpt: '주요 국가들이 AI 규제에 관한 국제 협약을 논의하기 시작했습니다. 이 협약은 AI의 윤리적 사용과 안전성을 보장하기 위한 국제적 표준을 마련하는 것을 목표로 합니다.',
      tags: ['AI 규제', '국제 협약', '정책'],
    },
    {
      id: 8,
      title: 'AI 스타트업 투자 동향 보고서 발표',
      date: '2024-04-25',
      source: '벤처 인사이트',
      image: '/news/news8.jpg',
      excerpt: '최근 발표된 보고서에 따르면, AI 스타트업에 대한 투자가 지난 분기 대비 30% 증가했습니다. 특히 생성형 AI와 특화된 산업용 AI 솔루션에 대한 투자가 크게 증가했습니다.',
      tags: ['투자', '스타트업', '시장 동향'],
    },
  ];

  // 검색 필터링된 뉴스
  const filteredNews = newsArticles.filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI 뉴스</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          생성형 AI 분야의 최신 소식과 트렌드를 확인하세요.
        </p>
      </div>

      {/* 검색 */}
      <div className="flex justify-center mb-8">
        <Input
          placeholder="뉴스 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* 뉴스 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <Card key={news.id} className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              {/* 실제 구현 시에는 실제 이미지로 교체 */}
              <div className="text-4xl font-bold text-muted-foreground">뉴스</div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <span>{news.date}</span>
                <span className="mx-2">•</span>
                <span>{news.source}</span>
              </div>
              <Link href={`/news/${news.id}`} className="hover:underline">
                <h2 className="text-xl font-bold mb-3">{news.title}</h2>
              </Link>
              <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {news.tags.map((tag, index) => (
                  <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Button variant="link" className="px-0" asChild>
                <Link href={`/news/${news.id}`}>자세히 보기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="sm" className="mx-1">이전</Button>
        <Button variant="default" size="sm" className="mx-1">1</Button>
        <Button variant="outline" size="sm" className="mx-1">2</Button>
        <Button variant="outline" size="sm" className="mx-1">3</Button>
        <Button variant="outline" size="sm" className="mx-1">다음</Button>
      </div>
    </div>
  );
}
