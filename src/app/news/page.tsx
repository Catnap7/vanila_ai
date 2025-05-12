'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { newsApi } from '@/lib/api';

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // API에서 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll();
        setNewsArticles(data);
      } catch (error) {
        console.error('뉴스를 가져오는데 실패했습니다:', error);
        // 오류 발생 시 기본 데이터 사용
        setNewsArticles([
          {
            id: 1,
            title: 'OpenAI, GPT-4o 모델 출시 발표',
            date: '2024-05-13',
            source: 'AI 뉴스',
            image: '/news/news1.jpg',
            excerpt: 'OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다.',
            tags: ['OpenAI', 'GPT-4o', '멀티모달'],
          },
          {
            id: 2,
            title: 'Google I/O에서 Gemini 2.0 공개',
            date: '2024-05-10',
            source: '테크 인사이트',
            image: '/news/news2.jpg',
            excerpt: 'Google이 연례 개발자 컨퍼런스에서 Gemini의 새로운 버전을 공개했습니다.',
            tags: ['Google', 'Gemini', 'I/O'],
          },
          {
            id: 3,
            title: 'Anthropic, Claude 3.5 개발 중',
            date: '2024-05-08',
            source: 'AI 트렌드',
            image: '/news/news3.jpg',
            excerpt: 'Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다.',
            tags: ['Anthropic', 'Claude', 'AI 모델'],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">뉴스를 불러오는 중...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
