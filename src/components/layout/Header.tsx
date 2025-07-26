'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, isAdminUser, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-soft'
        : 'bg-background border-b border-border/30'
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div className="absolute -top-1 -right-1">
              <Badge variant="gradient" size="sm" className="text-xs px-1.5 py-0.5">
                AI
              </Badge>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient">
              VanillaAI
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              Enterprise AI Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/ai-models"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200 relative group"
          >
            AI 모델 비교
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
          </Link>
          <Link
            href="/news"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200 relative group"
          >
            AI 뉴스
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
          </Link>
          <Link
            href="/community"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200 relative group"
          >
            커뮤니티
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              {isAdminUser && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">관리자</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || '사용자'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">프로필</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">설정</Link>
                  </DropdownMenuItem>
                  {isAdminUser && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">관리자 패널</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button variant="gradient" size="sm" className="btn-hover-lift" asChild>
                <Link href="/register">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
            }`} />
            <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`} />
            <span className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
              isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
            }`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/ai-models"
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              AI 모델 비교
            </Link>
            <Link
              href="/news"
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              AI 뉴스
            </Link>
            <Link
              href="/community"
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              커뮤니티
            </Link>
            <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/register">회원가입</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
