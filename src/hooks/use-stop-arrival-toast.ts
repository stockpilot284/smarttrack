/**
 * use-stop-arrival-toast.ts
 *
 * Fires toast notifications on stop arrival and approach.
 * Kept separate from useStopArrival so the detection logic
 * has no UI dependency.
 *
 * Uses Sonner — toast is a direct function import, not a hook.
 */

import { useCallback } from 'react'
import { toast } from 'sonner'
import { Stop } from '@/types/tracking.type'

export function useStopArrivalToast() {
  const notifyApproaching = useCallback((stop: Stop, distanceM: number) => {
    toast.info(`Approaching ${stop.address}`, {
      description: `${distanceM}m away — ${stop.contactName} (${stop.contactPhone})`,
      duration: 4_000,
    })
  }, [])

  const notifyArrived = useCallback((stop: Stop) => {
    toast.success('Arrived at stop', {
      description: stop.address,
      duration: 6_000,
    })
  }, [])

  const notifyDeparted = useCallback((stop: Stop) => {
    toast('Departed stop', {
      description: `Left ${stop.address} — heading to next stop`,
      duration: 3_000,
    })
  }, [])

  return { notifyApproaching, notifyArrived, notifyDeparted }
}
