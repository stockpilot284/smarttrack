import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ETABadgeProps {
  eta?: string
  className?: string
}

export function ETABadge({ eta, className }: ETABadgeProps) {
  if (!eta) return null
  const etaDate = new Date(eta)
  const now = new Date()
  const diffMs = etaDate.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / 60000)

  let text = ''
  if (diffMins < 1)
    return <span className="text-xs text-muted-foreground">Now</span>
  if (diffMins < 60) text = `in ${diffMins} min`
  else if (diffMins < 1440) text = `in ${Math.round(diffMins / 60)}h`
  else text = etaDate.toLocaleDateString()

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs text-muted-foreground',
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {text}
    </span>
  )
}
