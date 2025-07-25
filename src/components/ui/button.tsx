import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-error text-error-foreground shadow-soft hover:bg-error/90 hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border bg-background shadow-soft hover:bg-secondary hover:border-primary/20 hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary-hover hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        accent:
          "bg-accent text-accent-foreground shadow-soft hover:bg-accent-hover hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        success:
          "bg-success text-success-foreground shadow-soft hover:bg-success/90 hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        warning:
          "bg-warning text-warning-foreground shadow-soft hover:bg-warning/90 hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground transition-colors",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        gradient:
          "gradient-primary text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
