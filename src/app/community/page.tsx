'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discussions');

  // 예시 게시글 데이터
  const discussions = [
    {
      id: 1,
      title: 'GPT-4o와 Claude 3 Opus 중 어떤 모델이 더 나을까요?',
      author: {
        name: '김AI',
        avatar: '/avatars/user1.png',
      },
      date: '2024-05-15',
      comments: 24,
      likes: 18,
      views: 342,
      excerpt: '최근에 출시된 GPT-4o와 Claude 3 Opus를 비교해보았는데, 각각의 장단점이 있어서 고민입니다. 여러분의 경험을 공유해주세요.',
      tags: ['GPT-4o', 'Claude 3', '모델 비교'],
    },
    {
      id: 2,
      title: 'Midjourney로 만든 작품 공유합니다',
      author: {
        name: '이미지러버',
        avatar: '/avatars/user2.png',
      },
      date: '2024-05-14',
      comments: 31,
      likes: 45,
      views: 520,
      excerpt: 'Midjourney v6로 만든 작품들을 공유합니다. 프롬프트 엔지니어링 팁도 함께 알려드릴게요.',
      tags: ['Midjourney', '이미지 생성', '프롬프트'],
    },
    {
      id: 3,
      title: 'AI 모델 API 비용 절감 방법',
      author: {
        name: '개발자K',
        avatar: '/avatars/user3.png',
      },
      date: '2024-05-12',
      comments: 19,
      likes: 32,
      views: 410,
      excerpt: '프로젝트에서 AI 모델 API를 사용할 때 비용을 절감하는 방법을 공유합니다. 캐싱, 배치 처리 등의 기법을 소개합니다.',
      tags: ['API', '비용 절감', '개발 팁'],
    },
    {
      id: 4,
      title: 'Suno로 만든 AI 음악 공유',
      author: {
        name: '음악천재',
        avatar: '/avatars/user4.png',
      },
      date: '2024-05-10',
      comments: 15,
      likes: 28,
      views: 320,
      excerpt: 'Suno AI로 만든 음악을 공유합니다. 어떤 프롬프트를 사용했는지도 함께 설명드릴게요.',
      tags: ['Suno', '음악 생성', 'AI 음악'],
    },
    {
      id: 5,
      title: '오픈소스 AI 모델 추천해주세요',
      author: {
        name: '오픈소스팬',
        avatar: '/avatars/user5.png',
      },
      date: '2024-05-08',
      comments: 27,
      likes: 21,
      views: 380,
      excerpt: '상업적으로 사용 가능한 오픈소스 AI 모델을 찾고 있습니다. 추천해주실 만한 모델이 있을까요?',
      tags: ['오픈소스', '상업적 사용', '모델 추천'],
    },
  ];

  // 검색 필터링된 게시글
  const filteredDiscussions = discussions.filter((discussion) =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">AI 커뮤니티</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI 모델에 대한 경험을 공유하고, 질문하고, 토론하는 공간입니다.
        </p>
      </div>

      {/* 검색 및 탭 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        <Input
          placeholder="게시글 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />
        <Button asChild>
          <Link href="/community/new">새 게시글 작성</Link>
        </Button>
      </div>

      <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="discussions">토론</TabsTrigger>
          <TabsTrigger value="questions">질문</TabsTrigger>
          <TabsTrigger value="showcase">작품 공유</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                  <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link href={`/community/${discussion.id}`} className="hover:underline">
                    <h2 className="text-xl font-bold mb-2">{discussion.title}</h2>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <span>{discussion.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{discussion.date}</span>
                    <span className="mx-2">•</span>
                    <span>조회 {discussion.views}</span>
                  </div>
                  <p className="mb-4">{discussion.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <span key={index} className="bg-muted text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {discussion.comments}
                    </span>
                    <span className="mx-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {discussion.likes}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="sm" className="mx-1">이전</Button>
        <Button variant="outline" size="sm" className="mx-1">1</Button>
        <Button variant="default" size="sm" className="mx-1">2</Button>
        <Button variant="outline" size="sm" className="mx-1">3</Button>
        <Button variant="outline" size="sm" className="mx-1">다음</Button>
      </div>
    </div>
  );
}
