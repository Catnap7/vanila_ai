import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-soft",
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent-hover shadow-soft",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/90 shadow-soft",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft",
        error:
          "border-transparent bg-error text-error-foreground hover:bg-error/90 shadow-soft",
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info/90 shadow-soft",
        outline:
          "text-foreground border-border hover:bg-secondary hover:text-secondary-foreground",
        ghost:
          "border-transparent hover:bg-secondary hover:text-secondary-foreground",
        gradient:
          "border-transparent gradient-primary text-white shadow-soft hover:shadow-glow",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
