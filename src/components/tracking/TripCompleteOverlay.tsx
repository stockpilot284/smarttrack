/**
 * TripCompleteOverlay.tsx
 *
 * Centered card overlay that appears when the trip is complete.
 * Shows a full summary of the trip with smooth entrance animation.
 * Sits above everything else on the map (z-30).
 */

import {
  CheckCircle2,
  MapPin,
  Clock,
  Route,
  Gauge,
  AlertTriangle,
  Calendar,
} from 'lucide-react'
import { TripSummary } from '@/hooks/use-trip-completion'
import { cn } from '@/lib/utils'

interface TripCompleteOverlayProps {
  summary: TripSummary
  driverName?: string
}

interface SummaryRowProps {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}

function SummaryRow({ icon, label, value, accent }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <span className="text-muted-foreground/60">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          accent && 'text-emerald-600 dark:text-emerald-400',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function TripCompleteOverlay({
  summary,
  driverName,
}: TripCompleteOverlayProps) {
  const completedAtFormatted = summary.completedAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const completedDateFormatted = summary.completedAt.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    // Full-map backdrop with blur
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm p-6">
      <div
        className={cn(
          'w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl',
          'bg-background border border-border',
          // Entrance animation
          'animate-in fade-in zoom-in-95 duration-300',
        )}
      >
        {/* Header */}
        <div className="bg-emerald-500 px-6 py-5 flex flex-col items-center gap-2 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Trip Complete
          </h2>
          {driverName && (
            <p className="text-sm text-white/80">Great work, {driverName}</p>
          )}
        </div>

        {/* Summary rows */}
        <div className="px-5 pt-1 pb-2">
          <SummaryRow
            icon={<MapPin className="h-4 w-4" />}
            label="Stops delivered"
            value={`${summary.stopsDelivered} / ${summary.totalStops}`}
            accent
          />
          <SummaryRow
            icon={<Clock className="h-4 w-4" />}
            label="Trip duration"
            value={summary.tripDuration}
          />
          <SummaryRow
            icon={<Route className="h-4 w-4" />}
            label="Distance covered"
            value={summary.totalDistanceKm}
          />
          <SummaryRow
            icon={<Gauge className="h-4 w-4" />}
            label="Average speed"
            value={summary.averageSpeedKmh}
          />
          <SummaryRow
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Route deviations"
            value={
              summary.deviationCount === 0
                ? 'None'
                : `${summary.deviationCount}`
            }
          />
          <SummaryRow
            icon={<Calendar className="h-4 w-4" />}
            label="Completed at"
            value={`${completedDateFormatted}, ${completedAtFormatted}`}
          />
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-center">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              All {summary.stopsDelivered} stops successfully delivered
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
