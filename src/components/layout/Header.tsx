'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">V</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VanillaAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/ai-models" className="hover:text-primary">
            AI 모델 비교
          </Link>
          <Link href="/news" className="hover:text-primary">
            AI 뉴스
          </Link>
          <Link href="/community" className="hover:text-primary">
            커뮤니티
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/login">로그인</Link>
          </Button>
          <Button asChild>
            <Link href="/register">회원가입</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 pb-4 border-t">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/ai-models"
              className="hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI 모델 비교
            </Link>
            <Link
              href="/news"
              className="hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI 뉴스
            </Link>
            <Link
              href="/community"
              className="hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              커뮤니티
            </Link>
            <div className="flex items-center space-x-2 pt-2">
              <ThemeToggle />
              <Button variant="outline" asChild size="sm">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">회원가입</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
