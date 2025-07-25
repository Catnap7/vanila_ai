'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  variant?: 'dots' | 'grid' | 'waves' | 'particles';
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedBackground({ 
  variant = 'dots', 
  className, 
  children 
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant !== 'particles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = 50;
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variant]);

  const renderBackground = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--primary))_1px,transparent_0)] [background-size:20px_20px] animate-pulse" />
          </div>
        );
      case 'grid':
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
        );
      case 'waves':
        return (
          <div className="absolute inset-0 opacity-30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse" />
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                  fill="hsl(var(--primary))"
                  fillOpacity="0.1"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        );
      case 'particles':
        return (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {renderBackground()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Floating elements component
export function FloatingElements({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-success/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-warning/25 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      
      {/* Floating rings */}
      <div className="absolute top-1/5 right-1/5 w-8 h-8 border border-primary/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-1/3 left-1/5 w-6 h-6 border border-accent/15 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
    </div>
  );
}

// Gradient orb component
export function GradientOrb({ 
  className, 
  size = 'md',
  color = 'primary' 
}: { 
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'success' | 'warning';
}) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  const colorClasses = {
    primary: 'from-primary/20 to-accent/20',
    accent: 'from-accent/20 to-primary/20',
    success: 'from-success/20 to-info/20',
    warning: 'from-warning/20 to-error/20',
  };

  return (
    <div className={cn(
      'absolute rounded-full blur-3xl animate-pulse',
      sizeClasses[size],
      `bg-gradient-to-br ${colorClasses[color]}`,
      className
    )} />
  );
}
