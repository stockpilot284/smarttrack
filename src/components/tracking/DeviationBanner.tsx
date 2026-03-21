/**
 * DeviationBanner.tsx
 *
 * Three-state banner that lives inside MapPanel:
 *  - rerouting: deviation confirmed, fetching new route
 *  - success:   new route loaded, auto-dismisses after 3s
 *  - error:     reroute failed, shows retry button
 */

import { useEffect } from 'react'
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RerouteStatus } from '@/hooks/use-dynamic-reroute'
import { cn } from '@/lib/utils'

interface DeviationBannerProps {
  rerouteStatus: RerouteStatus
  deviationMetres: number
  onRetry: () => void
  onDismiss: () => void
}

export function DeviationBanner({
  rerouteStatus,
  deviationMetres,
  onRetry,
  onDismiss,
}: DeviationBannerProps) {
  const isVisible =
    rerouteStatus === 'rerouting' ||
    rerouteStatus === 'success' ||
    rerouteStatus === 'error'

  useEffect(() => {
    if (rerouteStatus !== 'success') return
    const timer = setTimeout(onDismiss, 3_000)
    return () => clearTimeout(timer)
  }, [rerouteStatus, onDismiss])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'absolute top-3 left-1/2 -translate-x-1/2 z-20',
        'flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg',
        'text-sm font-medium transition-all duration-300',
        'max-w-sm w-max',
        rerouteStatus === 'rerouting' && 'bg-amber-500 text-white',
        rerouteStatus === 'success' && 'bg-emerald-500 text-white',
        rerouteStatus === 'error' &&
          'bg-destructive text-destructive-foreground',
      )}
    >
      {rerouteStatus === 'rerouting' && (
        <>
          <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
          <span>Truck is {deviationMetres}m off route — recalculating…</span>
        </>
      )}

      {rerouteStatus === 'success' && (
        <>
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Route updated successfully</span>
        </>
      )}

      {rerouteStatus === 'error' && (
        <>
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Could not recalculate route</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="ml-1 h-6 px-2 text-xs"
          >
            Retry
          </Button>
        </>
      )}
    </div>
  )
}
