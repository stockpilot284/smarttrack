import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Spinner } from '../Spinner'

/* ---------------------------------------------------------
 * Glassy Button Variants
 * --------------------------------------------------------- */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium',
    'transition-all duration-200 ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    'cursor-pointer [&_svg]:shrink-0',
    'shadow-xs', // subtle shadow for all by default
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'border border-primary/10',
          'backdrop-blur-md', // glassy only for solid
          'hover:bg-primary/90 hover:shadow-md',
        ].join(' '),

        destructive: [
          'bg-destructive text-destructive-foreground',
          'border border-destructive/10',
          'backdrop-blur-md',
          'hover:bg-destructive/90 hover:shadow-md',
        ].join(' '),

        'destructive-outline': [
          'border border-destructive text-destructive bg-transparent',
          'hover:bg-destructive/10',
        ].join(' '),

        outline: [
          'border border-border bg-transparent text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        ].join(' '),

        secondary: [
          'bg-secondary text-secondary-foreground',
          'border border-border/40',
          'backdrop-blur-md',
          'hover:bg-secondary/80 hover:shadow-md',
        ].join(' '),

        ghost: [
          'bg-transparent border-transparent text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        ].join(' '),

        link: [
          'bg-transparent border-transparent shadow-none',
          'text-primary underline-offset-4 hover:underline px-0 h-auto',
        ].join(' '),
      },

      size: {
        xs: 'h-7 px-3 text-xs rounded-md',
        sm: 'h-8 px-3.5 text-xs rounded-md',
        md: 'h-9 px-4 text-sm rounded-md',
        lg: 'h-11 px-5 text-base rounded-md',
        xl: 'h-12 px-6 text-base rounded-lg',

        // Icon-only sizes
        iconXs: 'h-7 w-7 rounded',
        iconSm: 'h-8 w-8 rounded-md',
        iconMd: 'h-10 w-10 rounded-md',
        iconLg: 'h-11 w-11 rounded-md',
        iconXl: 'h-12 w-12 rounded-lg',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

/* ---------------------------------------------------------
 * Button Props
 * --------------------------------------------------------- */
export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    loading?: boolean
    spinnerColor?: string
  }

/* ---------------------------------------------------------
 * Button Component
 * --------------------------------------------------------- */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      loading = false,
      spinnerColor = 'text-white',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <Spinner className={spinnerColor} />
        ) : (
          <>
            {leftIcon && <span className="flex items-center">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && (
              <span className="flex items-center">{rightIcon}</span>
            )}
          </>
        )}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
