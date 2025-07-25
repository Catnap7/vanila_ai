'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 py-16 bg-gradient-to-br from-secondary/10 via-background to-accent/5">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_1px,transparent_1px)] [background-size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge variant="gradient" size="sm" className="text-xs px-1.5 py-0.5">
                  AI
                </Badge>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gradient">
                VanillaAI
              </span>
              <span className="text-sm text-muted-foreground -mt-1">
                Enterprise AI Platform
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-6 text-gradient">VanillaAI Platform</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              차세대 생성형 AI 모델을 비교하고, 최신 AI 뉴스를 확인하며,
              전문가 커뮤니티와 소통할 수 있는 엔터프라이즈급 플랫폼입니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" size="sm">AI 모델 비교</Badge>
              <Badge variant="outline" size="sm">실시간 뉴스</Badge>
              <Badge variant="outline" size="sm">전문가 커뮤니티</Badge>
              <Badge variant="outline" size="sm">엔터프라이즈</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">플랫폼</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/ai-models" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI 모델 비교
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  AI 뉴스
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-foreground">지원</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  문의하기
                </Link>
              </li>
              <li>
                <a href="mailto:contact@vanillai.com" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  이메일 지원
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} <span className="text-gradient font-semibold">VanillaAI</span>. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                이용약관
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-muted-foreground text-xs">서비스 정상 운영중</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
