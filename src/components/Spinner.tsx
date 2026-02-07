import * as React from 'react'
import { cn } from '@/lib/utils'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  color?: string // Tailwind text color class, e.g. "text-blue-500"
  className?: string
}

const sizeMap = {
  sm: 'w-2 h-2 border-2',
  md: 'w-4 h-4 border-2',
  lg: 'w-6 h-6 border-2',
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  color = 'text-white',
}) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeMap[size],
        color,
        className,
      )}
      role="status"
      aria-label="loading"
    />
  )
}
