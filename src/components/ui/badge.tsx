import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        // Solid variants
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        success: 'border-transparent bg-green-600 text-white dark:bg-green-700',
        warning:
          'border-transparent bg-yellow-500 text-white dark:bg-yellow-600',
        info: 'border-transparent bg-blue-500 text-white dark:bg-blue-600',

        // Outline variants (same border color as text)
        outline: 'border-border text-foreground',
        outlineDestructive: 'border-destructive text-destructive',
        outlineSuccess:
          'border-green-600 text-green-700 dark:border-green-500 dark:text-green-400',
        outlineWarning:
          'border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400',
        outlineInfo:
          'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400',

        // Soft / light variants (low opacity background, muted text)
        soft: 'border-transparent bg-primary/10 text-primary',
        softSecondary: 'border-transparent bg-secondary/10 text-secondary',
        softDestructive:
          'border-transparent bg-destructive/10 text-destructive',
        softSuccess:
          'border-transparent bg-green-500/10 text-green-700 dark:text-green-400',
        softWarning:
          'border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        softInfo:
          'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400',

        // Ghost (no background, just text)
        ghost:
          'border-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'border-transparent text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'px-2 py-1 text-[10px] [&>svg]:size-2.5',
        md: 'px-2 py-0.5 text-xs [&>svg]:size-3',
        lg: 'px-2.5 py-1 text-sm [&>svg]:size-3.5',
      },
      rounded: {
        default: 'rounded-full',
        sm: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'default',
    },
  },
)

export interface BadgeProps
  extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, rounded }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
