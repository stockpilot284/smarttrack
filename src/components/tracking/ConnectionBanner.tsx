/**
 * ConnectionBanner.tsx
 *
 * Shows GPS connection status in the same top-center slot as DeviationBanner.
 * Only renders when DeviationBanner is not already visible — deviation
 * takes priority since it's more actionable.
 *
 * States:
 *   stale        → amber warning with seconds since last update
 *   disconnected → red with pulsing indicator, auto-reconnecting
 *
 * Auto-reconnection is handled by useGPSFeed (GPSWebSocket backoff +
 * GPSPoller fallback) — this banner just communicates that it's happening.
 */

import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { ConnectionStatus } from '@/lib/gps/gps-feed.types'
import { cn } from '@/lib/utils'

interface ConnectionBannerProps {
  status: ConnectionStatus
  lastUpdateAt: Date | null
  /** When true the banner hides itself — deviation banner has priority */
  suppressedByDeviation?: boolean
}

export function ConnectionBanner({
  status,
  lastUpdateAt,
  suppressedByDeviation = false,
}: ConnectionBannerProps) {
  const [secondsAgo, setSecondsAgo] = useState(0)

  // Tick every second to keep "Xs ago" current
  useEffect(() => {
    if (status === 'connected' || !lastUpdateAt) return

    const update = () => {
      setSecondsAgo(Math.round((Date.now() - lastUpdateAt.getTime()) / 1000))
    }

    update()
    const interval = setInterval(update, 1_000)
    return () => clearInterval(interval)
  }, [status, lastUpdateAt])

  const isVisible =
    !suppressedByDeviation && (status === 'stale' || status === 'disconnected')

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'absolute top-3 left-1/2 -translate-x-1/2 z-20',
        'flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg',
        'text-sm font-medium w-max max-w-xs',
        'transition-all duration-300',
        status === 'stale' && 'bg-amber-500 text-white',
        status === 'disconnected' &&
          'bg-destructive text-destructive-foreground',
      )}
    >
      {status === 'disconnected' ? (
        <>
          <WifiOff className="h-4 w-4 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span>GPS signal lost — reconnecting</span>
            {secondsAgo > 0 && (
              <span className="text-xs opacity-75">
                Last update {secondsAgo}s ago
              </span>
            )}
          </div>
          {/* Pulsing dot to indicate auto-reconnect is in progress */}
          <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse shrink-0" />
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4 shrink-0 opacity-75" />
          <span>
            GPS signal weak
            {secondsAgo > 0 && ` — ${secondsAgo}s ago`}
          </span>
        </>
      )}
    </div>
  )
}
