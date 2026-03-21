/**
 * ConnectionBanner.tsx
 *
 * Shows a banner when GPS transport is not healthy.
 * Three states:
 *   connecting    → amber + spinner — shown on initial load and reconnects
 *   disconnected  → red — transport is down
 *   connected     → nothing (banner hidden)
 *
 * Stationary truck state is NOT shown here — it has its own StationaryIndicator.
 */

import { WifiOff, Loader2 } from 'lucide-react'
import { ConnectionStatus } from '@/lib/gps/gps-feed.types'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ConnectionBannerProps {
  status: ConnectionStatus
  /** Transport type currently in use — shown to help dispatcher diagnose issues */
  activeTransport?: 'websocket' | 'polling' | null
  /** When the transport last went down — shown in disconnected state */
  disconnectedAt?: Date | null
  /** Suppress banner when deviation banner is already showing */
  suppressedByDeviation?: boolean
}

export function ConnectionBanner({
  status,
  activeTransport,
  disconnectedAt,
  suppressedByDeviation,
}: ConnectionBannerProps) {
  if (status === 'connected' || suppressedByDeviation) return null

  if (status === 'connecting') {
    return (
      <div
        className={cn(
          'absolute top-2 left-1/2 -translate-x-1/2 z-20',
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
          'bg-amber-500/90 text-white text-xs font-medium',
          'shadow-md backdrop-blur-sm pointer-events-none select-none',
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>
          {activeTransport === 'polling'
            ? 'Reconnecting via backup connection...'
            : 'Connecting to GPS...'}
        </span>
      </div>
    )
  }

  if (status === 'disconnected') {
    return (
      <div
        className={cn(
          'absolute top-2 left-1/2 -translate-x-1/2 z-20',
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
          'bg-destructive/90 text-destructive-foreground text-xs font-medium',
          'shadow-md backdrop-blur-sm pointer-events-none select-none',
        )}
      >
        <WifiOff className="h-3.5 w-3.5" />
        <span>
          GPS connection lost
          {disconnectedAt && (
            <span className="opacity-75">
              {' '}
              · {formatDistanceToNow(disconnectedAt, { addSuffix: true })}
            </span>
          )}
        </span>
      </div>
    )
  }

  return null
}
