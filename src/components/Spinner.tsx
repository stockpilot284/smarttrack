import * as React from 'react'
import { Loader2, LoaderIcon } from 'lucide-react' // default icon
import { cn } from '@/lib/utils'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  color?: string // hex or CSS color
  className?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> // allow dynamic icon
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-primary',
  className,
  icon: Icon = Loader2, // default icon is LoaderIcon
}) => {
  return (
    <Icon
      role="status"
      aria-label="loading"
      className={cn(`${sizeMap[size]} animate-spin`, className, color)}
    />
  )
}
