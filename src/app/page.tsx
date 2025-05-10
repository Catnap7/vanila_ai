import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // 인기 AI 모델 목록 (예시 데이터)
  const popularAIModels = [
    {
      id: 1,
      name: "GPT-4o",
      category: "텍스트 생성",
      company: "OpenAI",
      image: "/placeholder-ai-1.png"
    },
    {
      id: 2,
      name: "Claude 3 Opus",
      category: "텍스트 생성",
      company: "Anthropic",
      image: "/placeholder-ai-2.png"
    },
    {
      id: 3,
      name: "Midjourney v6",
      category: "이미지 생성",
      company: "Midjourney",
      image: "/placeholder-ai-3.png"
    },
    {
      id: 4,
      name: "Gemini Pro",
      category: "텍스트 생성",
      company: "Google",
      image: "/placeholder-ai-4.png"
    },
  ];

  // 최신 AI 뉴스 (예시 데이터)
  const latestNews = [
    {
      id: 1,
      title: "OpenAI, GPT-4o 모델 출시 발표",
      date: "2024-05-13",
      excerpt: "OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다."
    },
    {
      id: 2,
      title: "Google I/O에서 Gemini 2.0 공개",
      date: "2024-05-10",
      excerpt: "Google이 연례 개발자 컨퍼런스에서 Gemini의 새로운 버전을 공개했습니다."
    },
    {
      id: 3,
      title: "Anthropic, Claude 3.5 개발 중",
      date: "2024-05-08",
      excerpt: "Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 히어로 섹션 */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        {/* 배경 요소 - 바닐라 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-secondary/50 text-primary font-medium text-sm">
            생성형 AI를 위한 최고의 커뮤니티
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            생성형 AI 모델 비교 및 커뮤니티
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            다양한 생성형 AI 모델을 비교하고, 최신 소식을 확인하며, 커뮤니티와 함께 소통하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/ai-models">AI 모델 비교하기</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
              <Link href="/community">커뮤니티 참여하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 인기 AI 모델 섹션 */}
      <section className="py-16 border-t border-border/50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="w-16 h-1 bg-primary mb-4"></div>
            <h2 className="text-3xl font-bold">인기 AI 모델</h2>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-secondary/50" asChild>
            <Link href="/ai-models">모두 보기</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularAIModels.map((model) => (
            <Card key={model.id} className="overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="h-48 bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                {/* 실제 구현 시에는 실제 이미지로 교체 */}
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <div className="text-4xl font-bold text-primary">{model.name.charAt(0)}</div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{model.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{model.company}</p>
                <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {model.category}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 최신 AI 뉴스 섹션 */}
      <section className="py-16 border-t border-border/50">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="w-16 h-1 bg-primary mb-4"></div>
            <h2 className="text-3xl font-bold">최신 AI 뉴스</h2>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-secondary/50" asChild>
            <Link href="/news">모두 보기</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <Card key={news.id} className="border border-border/50 hover:border-primary/50 transition-colors group">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{news.date}</p>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{news.title}</h3>
                <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                <Button variant="link" className="px-0 text-primary" asChild>
                  <Link href={`/news/${news.id}`}>자세히 보기</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 커뮤니티 섹션 */}
      <section className="py-16 border-t border-border/50 bg-secondary/20 rounded-lg my-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-16 h-1 bg-primary mb-4 mx-auto"></div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI 커뮤니티에 참여하세요
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            다른 사용자들과 AI 모델에 대한 경험을 공유하고, 질문하고, 토론하세요.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/community">커뮤니티 방문하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
