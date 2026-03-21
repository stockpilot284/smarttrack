/**
 * StationaryIndicator.tsx
 *
 * Small, non-alarming indicator shown when the truck is connected
 * and healthy but has not been moving for 30+ seconds.
 *
 * Intentionally subtle — this is informational, not an error state.
 * Placed bottom-left so it doesn't compete with the recenter button (bottom-right)
 * or the top-center connection/deviation banners.
 */

import { ParkingCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StationaryIndicatorProps {
  visible: boolean
}

export function StationaryIndicator({ visible }: StationaryIndicatorProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        'absolute bottom-4 left-4 z-10',
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full',
        'bg-background/80 border border-border/60 backdrop-blur-sm',
        'text-xs text-muted-foreground font-medium',
        'shadow-sm pointer-events-none select-none',
      )}
    >
      <ParkingCircle className="h-3.5 w-3.5" />
      <span>Truck stationary</span>
    </div>
  )
}
