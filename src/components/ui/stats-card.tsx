import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statsCardVariants = cva(
  "relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-medium hover:border-border hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-card",
        primary: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
        success: "bg-gradient-to-br from-success/5 to-success/10 border-success/20",
        warning: "bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20",
        error: "bg-gradient-to-br from-error/5 to-error/10 border-error/20",
        info: "bg-gradient-to-br from-info/5 to-info/10 border-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statsCardVariants> {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
  description?: string
}

function StatsCard({ 
  className, 
  variant, 
  title, 
  value, 
  change, 
  icon, 
  description,
  ...props 
}: StatsCardProps) {
  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-success'
      case 'decrease':
        return 'text-error'
      case 'neutral':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return '↗'
      case 'decrease':
        return '↘'
      case 'neutral':
        return '→'
      default:
        return ''
    }
  }

  return (
    <div className={cn(statsCardVariants({ variant }), className)} {...props}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full transform translate-x-16 -translate-y-16" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {change && (
            <div className={cn("flex items-center text-sm font-medium", getChangeColor(change.type))}>
              <span className="mr-1">{getChangeIcon(change.type)}</span>
              <span>{change.value}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { StatsCard, statsCardVariants }
export type { StatsCardProps }
