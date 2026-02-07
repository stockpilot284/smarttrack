import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

type TodayDateProps = {
  className?: string
  showIcon?: boolean
}

export function TodayDate({ className, showIcon = true }: TodayDateProps) {
  const today = new Date()

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-sm text-foreground border-border border px-4 py-2 rounded-md shadow-xs',
        className,
      )}
      title="Today's date"
    >
      {showIcon && <Calendar className="h-4 w-4" />}
      <span>{formattedDate}</span>
    </div>
  )
}
