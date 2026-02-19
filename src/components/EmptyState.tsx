import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  Icon: LucideIcon
  className?: string
}

export default function EmptyState({
  title,
  description,
  Icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center gap-3 py-10 text-center`,
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
        {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
      </div>

      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground"> {title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
