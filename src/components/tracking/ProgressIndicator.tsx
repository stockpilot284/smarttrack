import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  completed: number
  total: number
  showFraction?: boolean
  className?: string
}

export function ProgressIndicator({
  completed,
  total,
  showFraction = true,
  className,
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      {showFraction && (
        <span className="text-muted-foreground">
          {completed}/{total}
        </span>
      )}
      <div className="h-1 flex-1 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
