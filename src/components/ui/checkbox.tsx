import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type CheckboxSize = 'sm' | 'md' | 'lg'

const checkboxSizeStyles: Record<
  CheckboxSize,
  {
    root: string
    icon: string
  }
> = {
  sm: {
    root: 'size-3.5 rounded-[3px]',
    icon: 'size-2.5',
  },
  md: {
    root: 'size-4 rounded-[4px]',
    icon: 'size-3',
  },
  lg: {
    root: 'size-[18px] rounded-[5px]',
    icon: 'size-3.5',
  },
}

export interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  size?: CheckboxSize
}

function Checkbox({ className, size = 'md', ...props }: CheckboxProps) {
  const styles = checkboxSizeStyles[size]

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer shrink-0 border border-border bg-background shadow-xs transition-colors outline-none',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        styles.root,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-items-center text-current"
      >
        <CheckIcon className={styles.icon} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

Checkbox.displayName = 'Checkbox'

export { Checkbox }
