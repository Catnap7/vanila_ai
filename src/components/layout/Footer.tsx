'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-12 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VanillaAI
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">VanillaAI</h3>
            <p className="text-sm text-muted-foreground">
              생성형 AI 모델을 비교하고 커뮤니티와 소통하는 공간입니다.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ai-models" className="hover:underline">
                  AI 모델 비교
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:underline">
                  AI 뉴스
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:underline">
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">정보</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">문의</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@vanillai.com" className="hover:underline">
                  이메일
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} <span className="text-primary font-medium">VanillaAI</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
