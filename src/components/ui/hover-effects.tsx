'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
}

export function HoverCard({ children, className, glowColor = 'primary' }: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const glowColors = {
    primary: 'rgba(59, 130, 246, 0.15)',
    accent: 'rgba(139, 92, 246, 0.15)',
    success: 'rgba(16, 185, 129, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    error: 'rgba(239, 68, 68, 0.15)',
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300 group',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight effect */}
      {isHovered && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColors[glowColor]}, transparent 40%)`,
          }}
        />
      )}
      
      {/* Border glow */}
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-r from-transparent via-primary/20 to-transparent',
        'animate-pulse'
      )} />
      
      {children}
    </div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.3 }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={buttonRef}
      className={cn('inline-block transition-transform duration-300 ease-out', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function ParallaxElement({ 
  children, 
  className, 
  speed = 0.5,
  direction = 'up'
}: ParallaxElementProps) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      let transform = '';
      switch (direction) {
        case 'up':
          transform = `translateY(${rate}px)`;
          break;
        case 'down':
          transform = `translateY(${-rate}px)`;
          break;
        case 'left':
          transform = `translateX(${rate}px)`;
          break;
        case 'right':
          transform = `translateX(${-rate}px)`;
          break;
      }

      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return (
    <div
      ref={elementRef}
      className={cn('transition-transform duration-75 ease-out', className)}
      style={{
        transform: direction === 'up' || direction === 'down' 
          ? `translateY(${direction === 'up' ? offset : -offset}px)`
          : `translateX(${direction === 'left' ? offset : -offset}px)`
      }}
    >
      {children}
    </div>
  );
}

interface RevealAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
}

export function RevealAnimation({ 
  children, 
  className, 
  direction = 'up',
  delay = 0,
  duration = 0.6
}: RevealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)';
      case 'down':
        return 'translateY(-30px)';
      case 'left':
        return 'translateX(30px)';
      case 'right':
        return 'translateX(-30px)';
      case 'scale':
        return 'scale(0.9)';
      default:
        return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn('transition-all ease-out', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : getInitialTransform(),
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}

// Ripple effect component
export function RippleEffect({ className }: { className?: string }) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div className={cn('relative overflow-hidden', className)} onClick={addRipple}>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}
