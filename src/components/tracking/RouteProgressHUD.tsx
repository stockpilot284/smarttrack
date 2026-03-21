/**
 * RouteProgressHUD.tsx
 *
 * Compact HUD overlay for the top-right corner of the map.
 * Shows: distance remaining, stops progress, ETA to next stop,
 * and current speed.
 *
 * Designed to be unobtrusive — semi-transparent dark glass panel
 * that works on both light and dark map themes.
 */

import { MapPin, Gauge, Clock, Navigation } from 'lucide-react'
import { RouteProgressMetrics } from '@/hooks/use-route-progress'
import { Stop } from '@/types/tracking.type'
import { cn } from '@/lib/utils'

interface RouteProgressHUDProps {
  metrics: RouteProgressMetrics
  nextStop: Stop | null
  className?: string
}

export function RouteProgressHUD({
  metrics,
  nextStop,
  className,
}: RouteProgressHUDProps) {
  const {
    progressPercent,
    remainingDistance,
    etaToNextStop,
    currentSpeedKmh,
    stopsCompleted,
    stopsTotal,
    isCalculating,
  } = metrics

  if (isCalculating) return null

  return (
    <div
      className={cn(
        'absolute top-3 right-3 z-10',
        'w-44 rounded-xl overflow-hidden',
        'bg-black/60 backdrop-blur-md',
        'border border-white/10',
        'text-white shadow-xl',
        className,
      )}
    >
      {/* Progress bar — full width strip at the top */}
      <div className="h-1 w-full bg-white/10">
        <div
          className="h-full bg-emerald-400 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="px-3 py-2.5 flex flex-col gap-2.5">
        {/* Distance remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/50">
            <Navigation className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-medium">
              Remaining
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {remainingDistance}
          </span>
        </div>

        {/* Stops progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/50">
            <MapPin className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-medium">
              Stops
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold tabular-nums">
              {stopsCompleted}
            </span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/50 text-xs tabular-nums">
              {stopsTotal}
            </span>
          </div>
        </div>

        {/* ETA to next stop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/50">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-medium">
              Next stop
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums">
            {etaToNextStop ?? '—'}
          </span>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/50">
            <Gauge className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider font-medium">
              Speed
            </span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-semibold tabular-nums">
              {currentSpeedKmh}
            </span>
            <span className="text-[10px] text-white/40">km/h</span>
          </div>
        </div>

        {/* Next stop name — shown if available */}
        {nextStop && (
          <div className="pt-0.5 border-t border-white/10">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
              Heading to
            </p>
            <p className="text-[11px] text-white/80 leading-tight line-clamp-1">
              {nextStop.address}
            </p>
          </div>
        )}

        {/* Progress percentage — small, bottom right */}
        <div className="flex justify-end">
          <span className="text-[10px] text-white/30 tabular-nums">
            {progressPercent}% complete
          </span>
        </div>
      </div>
    </div>
  )
}
