import { cn } from '@/lib/utils'
import { Stop } from '@/types/tracking.type'
import { CheckCircle, Package, MapPin } from 'lucide-react'

interface StopListItemProps {
  stop: Stop
  index: number
  isSelected?: boolean
  onClick?: () => void
}

export function StopListItem({
  stop,
  index,
  isSelected,
  onClick,
}: StopListItemProps) {
  const isCompleted = stop.status === 'COMPLETED'
  const isActive = stop.status === 'IN_PROGRESS'

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
        isActive && 'border-primary bg-primary/5',
        isCompleted && 'opacity-60',
        'hover:bg-muted/50',
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
            isCompleted
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
          )}
        >
          {isCompleted ? <CheckCircle className="h-4 w-4" /> : index}
        </div>
        {index < 5 && <div className="h-4 w-0.5 bg-border" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {stop.type === 'PICKUP' ? (
            <Package className="h-4 w-4 text-muted-foreground" />
          ) : (
            <MapPin className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium truncate">
            {stop.contactName}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {stop.address}
        </p>
        {stop.estimatedArrival && (
          <p className="text-xs text-primary mt-1">
            ETA {new Date(stop.estimatedArrival).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}
