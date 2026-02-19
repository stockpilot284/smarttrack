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

    /* glass effect */
    'backdrop-blur-md',
    'shadow-xs',
  ].join(' '),
  {
    variants: {
      /* ---------- Variants ---------- */
      variant: {
        default: [
          'bg-primary text-primary-foreground',
          'border-white/10',
          'hover:bg-primary/90',
          'hover:shadow-md',
        ].join(' '),

        destructive: [
          'bg-destructive/15 text-destructive',
          'hover:bg-destructive/10',
        ].join(' '),

        outline: [
          'bg-white/10 text-foreground',
          'border-border/40',
          'hover:bg-white/20',
        ].join(' '),

        secondary: [
          'bg-gray-200/40 text-foreground',
          'border-gray-300/30',
          'hover:bg-gray-200/60',
        ].join(' '),

        ghost: ['bg-transparent border-transparent', 'hover:bg-white/20'].join(
          ' ',
        ),

        link: [
          'bg-transparent border-transparent shadow-none',
          'text-primary underline-offset-4 hover:underline px-0 h-auto',
        ].join(' '),
      },

      /* ---------- Sizes ---------- */
      size: {
        xs: 'h-7 px-3 text-xs rounded',
        sm: 'h-8 px-3.5 text-xs rounded-md',
        md: 'h-10 px-4 text-sm rounded-md',
        lg: 'h-11 px-5 text-base rounded-md',
        xl: 'h-12 px-6 text-base rounded-lg',

        /* Icon-only */
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

export { Button }
