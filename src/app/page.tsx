'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Loading } from "@/components/ui/loading";
import { AnimatedBackground, FloatingElements, GradientOrb } from "@/components/ui/animated-background";
import { HoverCard, MagneticButton, RevealAnimation } from "@/components/ui/hover-effects";
import { aiModelsApi, newsApi } from "@/lib/api";

export default function Home() {
  const [popularAIModels, setPopularAIModels] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const aiModelsData = await aiModelsApi.getAll();
        const newsData = await newsApi.getAll();

        setPopularAIModels(aiModelsData);
        setLatestNews(newsData);
      } catch (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error);
        // 오류 발생 시 기본 데이터 설정
        setPopularAIModels([
          {
            id: 1,
            name: 'GPT-4o',
            category: '텍스트 생성',
            company: 'OpenAI',
            image: '/placeholder-ai-1.png'
          },
          {
            id: 2,
            name: 'Claude 3 Opus',
            category: '텍스트 생성',
            company: 'Anthropic',
            image: '/placeholder-ai-2.png'
          },
          {
            id: 3,
            name: 'Midjourney v6',
            category: '이미지 생성',
            company: 'Midjourney',
            image: '/placeholder-ai-3.png'
          },
          {
            id: 4,
            name: 'Gemini Pro',
            category: '텍스트 생성',
            company: 'Google',
            image: '/placeholder-ai-4.png'
          }
        ]);

        setLatestNews([
          {
            id: 1,
            title: 'OpenAI, GPT-4o 모델 출시 발표',
            date: '2024-05-13',
            excerpt: 'OpenAI가 텍스트, 이미지, 오디오를 모두 처리할 수 있는 새로운 멀티모달 모델 GPT-4o를 발표했습니다.'
          },
          {
            id: 2,
            title: 'Google I/O에서 Gemini 2.0 공개',
            date: '2024-05-10',
            excerpt: 'Google이 연례 개발자 컨퍼런스에서 Gemini의 새로운 버전을 공개했습니다.'
          },
          {
            id: 3,
            title: 'Anthropic, Claude 3.5 개발 중',
            date: '2024-05-08',
            excerpt: 'Anthropic이 Claude 3 시리즈의 후속작인 Claude 3.5를 개발 중이라고 밝혔습니다.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <AnimatedBackground variant="particles" className="absolute inset-0">
          <GradientOrb size="xl" className="top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
          <GradientOrb size="lg" color="accent" className="bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />
          <FloatingElements />
        </AnimatedBackground>

        <div className="container mx-auto px-4 relative z-10">
          <RevealAnimation direction="up" className="text-center">
            <Badge variant="gradient" size="lg" className="mb-6 animate-fade-in">
              🚀 차세대 AI 플랫폼
            </Badge>

            <h1 className="text-display mb-6 text-gradient max-w-5xl mx-auto leading-tight">
              엔터프라이즈급 생성형 AI
              <br className="hidden md:block" />
              모델 비교 플랫폼
            </h1>

            <p className="text-body-large text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              최신 AI 모델을 실시간으로 비교하고, 전문가 커뮤니티와 소통하며,
              AI 업계의 최신 동향을 한눈에 파악하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton>
                <Button size="xl" variant="gradient" className="btn-hover-lift shadow-glow" asChild>
                  <Link href="/ai-models">
                    AI 모델 탐색하기
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
              </MagneticButton>

              <MagneticButton>
                <Button size="xl" variant="outline" className="btn-hover-lift" asChild>
                  <Link href="/community">
                    커뮤니티 참여
                    <span className="ml-2">💬</span>
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </RevealAnimation>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-gradient-to-br from-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <RevealAnimation direction="up" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <StatsCard
                title="AI 모델"
                value="50+"
                change={{ value: "+12", type: "increase" }}
                description="이번 달"
                variant="primary"
                icon={<span className="text-2xl">🤖</span>}
              />
              <StatsCard
                title="활성 사용자"
                value="10K+"
                change={{ value: "+25%", type: "increase" }}
                description="월간 활성 사용자"
                variant="success"
                icon={<span className="text-2xl">👥</span>}
              />
              <StatsCard
                title="커뮤니티 게시글"
                value="2.5K+"
                change={{ value: "+18%", type: "increase" }}
                description="이번 주"
                variant="info"
                icon={<span className="text-2xl">💬</span>}
              />
              <StatsCard
                title="AI 뉴스"
                value="500+"
                change={{ value: "+8", type: "increase" }}
                description="매일 업데이트"
                variant="warning"
                icon={<span className="text-2xl">📰</span>}
              />
            </div>
          </RevealAnimation>
        </div>
      </section>

      {/* 인기 AI 모델 섹션 */}
      <section className="py-20 container mx-auto px-4">
        <RevealAnimation direction="up" delay={0.3}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <Badge variant="outline" size="sm">인기 모델</Badge>
              </div>
              <h2 className="text-heading mb-2">최고 성능의 AI 모델들</h2>
              <p className="text-muted-foreground">전문가들이 선택한 검증된 AI 모델을 만나보세요</p>
            </div>
            <MagneticButton>
              <Button variant="ghost" className="text-primary hover:text-primary-hover group" asChild>
                <Link href="/ai-models">
                  모든 모델 보기
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </RevealAnimation>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="rounded-xl border border-border/50 p-6 space-y-4 bg-card shadow-soft">
                  <div className="h-32 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full shimmer w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularAIModels.map((model, index) => (
              <RevealAnimation key={model.id} direction="up" delay={0.4 + index * 0.1}>
                <HoverCard glowColor="primary">
                  <Card className="overflow-hidden card-hover group">
                    <div className="relative h-48 bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-strong group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                          <div className="text-3xl font-bold text-white">{model.name.charAt(0)}</div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Badge variant="success" size="sm" className="text-xs">
                            HOT
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{model.company}</p>
                      <Badge variant="outline" size="sm">
                        {model.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </HoverCard>
              </RevealAnimation>
            ))}
          </div>
        )}
      </section>

      {/* 최신 뉴스 섹션 */}
      <section className="py-20 bg-gradient-to-br from-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <RevealAnimation direction="up" delay={0.5}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                  <Badge variant="outline" size="sm">최신 소식</Badge>
                </div>
                <h2 className="text-heading mb-2">AI 업계 최신 동향</h2>
                <p className="text-muted-foreground">실시간으로 업데이트되는 AI 뉴스와 트렌드</p>
              </div>
              <MagneticButton>
                <Button variant="ghost" className="text-accent hover:text-accent-hover group" asChild>
                  <Link href="/news">
                    모든 뉴스 보기
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </RevealAnimation>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="rounded-xl border border-border/50 p-6 space-y-4 bg-card shadow-soft">
                    <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-1/4"></div>
                    <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-3/4"></div>
                    <div className="h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news, index) => (
                <RevealAnimation key={news.id} direction="up" delay={0.6 + index * 0.1}>
                  <HoverCard glowColor="accent">
                    <Card className="card-hover group h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="info" size="sm" className="text-xs">
                            📰 NEWS
                          </Badge>
                          <span className="text-xs text-muted-foreground">{news.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors flex-1">
                          {news.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
                          {news.excerpt}
                        </p>
                        <MagneticButton>
                          <Button variant="link" className="px-0 text-accent hover:text-accent-hover group w-fit" asChild>
                            <Link href={`/news/${news.id}`}>
                              자세히 보기
                              <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                          </Button>
                        </MagneticButton>
                      </CardContent>
                    </Card>
                  </HoverCard>
                </RevealAnimation>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 커뮤니티 섹션 */}
      <section className="py-20 relative overflow-hidden">
        <AnimatedBackground variant="dots" className="absolute inset-0">
          <GradientOrb size="lg" color="success" className="top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2" />
          <GradientOrb size="md" color="warning" className="bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2" />
        </AnimatedBackground>

        <div className="container mx-auto px-4 relative z-10">
          <RevealAnimation direction="up" delay={0.7}>
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="gradient" size="lg" className="mb-6">
                🌟 커뮤니티
              </Badge>

              <h2 className="text-display mb-6 text-gradient">
                AI 전문가들과 함께 성장하세요
              </h2>

              <p className="text-body-large text-muted-foreground mb-12 leading-relaxed">
                전 세계 AI 전문가들과 소통하고, 최신 정보를 공유하며,
                함께 AI의 미래를 만들어가는 커뮤니티에 참여하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <MagneticButton>
                  <Button size="xl" variant="gradient" className="btn-hover-lift shadow-glow" asChild>
                    <Link href="/community">
                      커뮤니티 참여하기
                      <span className="ml-2">🚀</span>
                    </Link>
                  </Button>
                </MagneticButton>

                <MagneticButton>
                  <Button size="xl" variant="outline" className="btn-hover-lift" asChild>
                    <Link href="/register">
                      무료 회원가입
                      <span className="ml-2">✨</span>
                    </Link>
                  </Button>
                </MagneticButton>
              </div>

              {/* 커뮤니티 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">활성 멤버</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="text-3xl font-bold text-accent mb-2">2.5K+</div>
                  <div className="text-sm text-muted-foreground">월간 게시글</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="text-3xl font-bold text-success mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">전문가</div>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </section>
    </div>
  );
}
