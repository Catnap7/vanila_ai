import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

// Dots loading animation
function DotsLoader({ size }: { size: keyof typeof sizeClasses }) {
  const dotSize = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
  }[size];

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-primary rounded-full animate-pulse",
            dotSize
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}

// Pulse loading animation
function PulseLoader({ size }: { size: keyof typeof sizeClasses }) {
  return (
    <div className={cn(
      "rounded-full bg-primary/20 animate-pulse",
      sizeClasses[size]
    )}>
      <div className={cn(
        "rounded-full bg-primary animate-ping",
        sizeClasses[size]
      )} />
    </div>
  );
}

// Bars loading animation
function BarsLoader({ size }: { size: keyof typeof sizeClasses }) {
  const barHeight = {
    xs: 'h-3',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
  }[size];

  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary animate-pulse",
            barHeight
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  text,
  className,
  fullScreen = false
}: LoadingProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      case 'bars':
        return <BarsLoader size={size} />;
      case 'spinner':
      default:
        return (
          <Loader2 className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )} />
        );
    }
  };

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3",
      fullScreen && "min-h-screen",
      className
    )}>
      {renderLoader()}
      {text && (
        <p className="text-sm text-muted-foreground animate-fade-in">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
}

// Enhanced skeleton loading components with shimmer effect
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-fade-in", className)}>
      <div className="rounded-xl border border-border/50 p-6 space-y-4 bg-card shadow-soft">
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded shimmer w-1/2"></div>
        <div className="h-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg shimmer"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full shimmer w-16"></div>
          <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-full shimmer w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ 
  count = 3, 
  className 
}: { 
  count?: number; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="h-12 w-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className 
}: { 
  rows?: number; 
  columns?: number;
  className?: string; 
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b bg-muted/50 p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b last:border-b-0 p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
