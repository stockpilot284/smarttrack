import { cn } from '@/lib/utils'

interface SkeletonProps extends React.ComponentProps<'div'> {
  darker?: boolean
  shimmer?: boolean
}

function Skeleton({
  className,
  darker = false,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-md',
        darker
          ? 'bg-gray-300 dark:bg-accent/50'
          : 'bg-gray-200 dark:bg-accent/35',
        shimmer && 'animate-shimmer',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
