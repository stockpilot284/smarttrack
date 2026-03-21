// StopListItem.tsx
import { cn } from '@/lib/utils'
import { Stop, StopStatus } from '@/types/tracking.type'
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  MapPin,
  Package,
  ChevronRight,
  Loader2,
} from 'lucide-react'

interface StopListItemProps {
  stop: Stop
  index: number
  sequenceLabel: string // e.g. "P1", "D2"
  isSelected?: boolean
  onClick?: () => void
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  StopStatus,
  {
    icon: React.ReactNode
    labelColor: string
    bgColor: string
    borderColor: string
    dotColor: string
    label: string
  }
> = {
  PENDING: {
    icon: <Clock className="w-3.5 h-3.5" />,
    labelColor: 'text-muted-foreground',
    bgColor: 'bg-muted/40',
    borderColor: 'border-border/50',
    dotColor: 'bg-muted-foreground/40',
    label: 'Pending',
  },
  IN_PROGRESS: {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    labelColor: 'text-blue-500',
    bgColor: 'bg-blue-500/5',
    borderColor: 'border-blue-500/30',
    dotColor: 'bg-blue-500',
    label: 'In Progress',
  },
  COMPLETED: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    labelColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/20',
    dotColor: 'bg-emerald-500',
    label: 'Completed',
  },
  FAILED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    labelColor: 'text-red-500',
    bgColor: 'bg-red-500/5',
    borderColor: 'border-red-500/20',
    dotColor: 'bg-red-500',
    label: 'Failed',
  },
  SKIPPED: {
    icon: <MinusCircle className="w-3.5 h-3.5" />,
    labelColor: 'text-orange-400',
    bgColor: 'bg-orange-400/5',
    borderColor: 'border-orange-400/20',
    dotColor: 'bg-orange-400',
    label: 'Skipped',
  },
}

function formatTime(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StopListItem({
  stop,
  index,
  sequenceLabel,
  isSelected,
  onClick,
}: StopListItemProps) {
  const config = STATUS_CONFIG[stop.status] ?? STATUS_CONFIG.PENDING
  const isTerminal =
    stop.status === 'COMPLETED' ||
    stop.status === 'FAILED' ||
    stop.status === 'SKIPPED'

  // Timestamp to show based on state
  const timestamp = stop.completedAt
    ? `Done ${formatTime(stop.completedAt)}`
    : stop.actualArrival
      ? `Arrived ${formatTime(stop.actualArrival)}`
      : stop.estimatedArrival
        ? `ETA ${formatTime(stop.estimatedArrival)}`
        : null

  const itemCount = stop.items?.length ?? 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border px-3 py-2.5 transition-all duration-150',
        'group relative overflow-hidden',
        config.bgColor,
        config.borderColor,
        isSelected && 'ring-2 ring-offset-1 ring-offset-background',
        isSelected && stop.status === 'COMPLETED' && 'ring-emerald-500/50',
        isSelected && stop.status === 'IN_PROGRESS' && 'ring-blue-500/50',
        isSelected && stop.status === 'PENDING' && 'ring-border',
        isSelected && stop.status === 'FAILED' && 'ring-red-500/50',
        isSelected && stop.status === 'SKIPPED' && 'ring-orange-400/50',
        !isSelected && 'hover:brightness-[0.97] dark:hover:brightness-110',
        isTerminal && 'opacity-75',
      )}
    >
      {/* Selected indicator bar */}
      {isSelected && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg',
            config.dotColor,
          )}
        />
      )}

      <div className="flex items-start gap-2.5 min-w-0">
        {/* Sequence badge */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center',
            'w-6 h-6 rounded-md text-[10px] font-bold',
            'mt-0.5',
            stop.type === 'PICKUP'
              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
              : 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
          )}
        >
          {sequenceLabel}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top row — address + status icon */}
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm font-medium leading-tight truncate',
                isTerminal ? 'text-muted-foreground' : 'text-foreground',
              )}
            >
              {stop.address}
            </p>
            <span className={cn('flex-shrink-0 mt-0.5', config.labelColor)}>
              {config.icon}
            </span>
          </div>

          {/* Second row — contact + status label */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-muted-foreground truncate">
              {stop.contactName}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span
              className={cn(
                'text-[11px] font-medium flex-shrink-0',
                config.labelColor,
              )}
            >
              {config.label}
            </span>
          </div>

          {/* Failure reason */}
          {stop.status === 'FAILED' && stop.failureReason && (
            <div className="mt-1 text-[11px] text-red-500/80 bg-red-500/10 rounded px-1.5 py-0.5 inline-block">
              {stop.failureReason.message ?? stop.failureReason.code}
            </div>
          )}

          {/* Bottom row — timestamp + items count */}
          <div className="flex items-center justify-between mt-1.5 gap-2">
            {timestamp && (
              <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground/70">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{timestamp}</span>
              </div>
            )}
            {itemCount > 0 && (
              <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground/70 ml-auto">
                <Package className="w-3 h-3 flex-shrink-0" />
                <span>
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight
          className={cn(
            'flex-shrink-0 w-3.5 h-3.5 mt-1 transition-transform duration-150',
            'text-muted-foreground/30 group-hover:text-muted-foreground/60',
            isSelected && 'translate-x-0.5',
          )}
        />
      </div>
    </button>
  )
}
