/**
 * use-dynamic-reroute.ts
 *
 * Handles re-routing when a deviation is confirmed.
 * Uses callRadarDirections — the same function as useTripRoute —
 * so the endpoint, coordinate format, and auth are always consistent.
 */

import { useRef, useCallback, useState } from 'react'
import { LngLat, RouteGeometry } from '@/lib/routing/routing.types'
import { Stop } from '@/types/tracking.type'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { callRadarDirections } from '@/lib/routing/call-radar-directions'

export type RerouteStatus = 'idle' | 'rerouting' | 'success' | 'error'

interface UseDynamicRerouteOptions {
  onRerouteSuccess: (newRoute: any, newGeometry: RouteGeometry) => void
  onRerouteError: (message: string) => void
}

interface UseDynamicRerouteReturn {
  rerouteStatus: RerouteStatus
  triggerReroute: (currentPosition: LngLat, remainingStops: Stop[]) => void
  resetStatus: () => void
}

/**
 * Formats waypoints for callRadarDirections.
 * Radar expects "lat,lng|lat,lng|..." — note lat first, lng second.
 */
function buildWaypointString(waypoints: [number, number][]): string {
  // waypoints arrive as [lng, lat] — flip to lat,lng for Radar
  return waypoints.map(([lng, lat]) => `${lat},${lng}`).join('|')
}

export function useDynamicReroute({
  onRerouteSuccess,
  onRerouteError,
}: UseDynamicRerouteOptions): UseDynamicRerouteReturn {
  const [rerouteStatus, setRerouteStatus] = useState<RerouteStatus>('idle')
  const isReroutingRef = useRef(false)

  const onRerouteSuccessRef = useRef(onRerouteSuccess)
  const onRerouteErrorRef = useRef(onRerouteError)
  onRerouteSuccessRef.current = onRerouteSuccess
  onRerouteErrorRef.current = onRerouteError

  const triggerReroute = useCallback(
    async (currentPosition: LngLat, remainingStops: Stop[]) => {
      if (isReroutingRef.current) return
      isReroutingRef.current = true
      setRerouteStatus('rerouting')

      try {
        // Need at least current position + one remaining stop
        if (remainingStops.length === 0) {
          throw new Error('No remaining stops to reroute to')
        }

        // Build [lng, lat] tuples — buildWaypointString flips to lat,lng for Radar
        const waypoints: [number, number][] = [
          [currentPosition[0], currentPosition[1]],
          ...remainingStops.map(
            (s) => [s.longitude, s.latitude] as [number, number],
          ),
        ]

        const waypointString = buildWaypointString(waypoints)
        console.log('[useDynamicReroute] rerouting via:', waypointString)

        const result = await callRadarDirections(waypointString)

        if (!result?.geometry?.coordinates?.length) {
          throw new Error('Route response missing geometry')
        }

        const newGeometry: RouteGeometry = buildRouteGeometry(
          result.geometry.coordinates as [number, number][],
        )

        setRerouteStatus('success')
        onRerouteSuccessRef.current(result, newGeometry)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to recalculate route'
        console.error('[useDynamicReroute]', message)
        setRerouteStatus('error')
        onRerouteErrorRef.current(message)
      } finally {
        isReroutingRef.current = false
      }
    },
    [],
  )

  const resetStatus = useCallback(() => {
    setRerouteStatus('idle')
  }, [])

  return { rerouteStatus, triggerReroute, resetStatus }
}
