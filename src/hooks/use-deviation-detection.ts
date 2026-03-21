/**
 * use-deviation-detection.ts
 *
 * Detects when the truck has strayed off its planned route.
 *
 * Now accepts visitedStopIds from useStopArrival — the event-driven
 * source of truth for which stops are done. This replaces the previous
 * projection-based approach which could misclassify stops near turns.
 */

import { useEffect, useRef, useCallback } from 'react'
import { LngLat, RouteGeometry } from '@/lib/routing/routing.types'
import { Stop } from '@/types/tracking.type'
import {
  pointToRouteDistance,
  adaptiveThreshold,
} from '@/lib/routing/point-to-route-distance'

export interface DeviationState {
  isDeviated: boolean
  deviationMetres: number
  deviatedSince: Date | null
}

interface UseDeviationDetectionOptions {
  routeGeometry: RouteGeometry | null
  stops: Stop[]
  /** Ref from useStopArrival — always reflects current visited state */
  visitedStopIds: React.RefObject<Set<string>>
  sustainedMs?: number
  onDeviationConfirmed: (
    currentPosition: LngLat,
    remainingStops: Stop[],
  ) => void
  onReturned: () => void
}

interface UseDeviationDetectionReturn {
  updatePosition: (lngLat: LngLat, speedMs: number) => void
  getDeviationState: () => DeviationState
}

export function useDeviationDetection({
  routeGeometry,
  stops,
  visitedStopIds,
  sustainedMs = 8_000,
  onDeviationConfirmed,
  onReturned,
}: UseDeviationDetectionOptions): UseDeviationDetectionReturn {
  const isDeviatedRef = useRef(false)
  const deviationMetresRef = useRef(0)
  const deviatedSinceRef = useRef<Date | null>(null)
  const offRouteSinceRef = useRef<number | null>(null)
  const deviationFiredRef = useRef(false)

  const routeGeometryRef = useRef(routeGeometry)
  const stopsRef = useRef(stops)
  const sustainedMsRef = useRef(sustainedMs)
  const onDeviationConfirmedRef = useRef(onDeviationConfirmed)
  const onReturnedRef = useRef(onReturned)

  useEffect(() => {
    routeGeometryRef.current = routeGeometry
    stopsRef.current = stops
    sustainedMsRef.current = sustainedMs
    onDeviationConfirmedRef.current = onDeviationConfirmed
    onReturnedRef.current = onReturned
  })

  // Full reset when route changes (after a reroute)
  useEffect(() => {
    isDeviatedRef.current = false
    deviationMetresRef.current = 0
    deviatedSinceRef.current = null
    offRouteSinceRef.current = null
    deviationFiredRef.current = false
  }, [routeGeometry])

  /**
   * Uses visitedStopIds ref directly — always current, no projection needed.
   * Stops are sorted by their order in the stops array so the reroute
   * waypoints follow the original intended sequence.
   */
  const getRemainingStops = useCallback((): Stop[] => {
    return stopsRef.current.filter(
      (stop) => !visitedStopIds.current.has(stop.id),
    )
  }, [visitedStopIds])

  const updatePosition = useCallback(
    (lngLat: LngLat, speedMs: number) => {
      const geometry = routeGeometryRef.current
      if (!geometry) return

      const distanceFromRoute = pointToRouteDistance(lngLat, geometry)
      const threshold = adaptiveThreshold(speedMs)
      const now = performance.now()
      const isOffRoute = distanceFromRoute > threshold

      deviationMetresRef.current = Math.round(distanceFromRoute)

      if (isOffRoute) {
        if (offRouteSinceRef.current === null) {
          offRouteSinceRef.current = now
          deviatedSinceRef.current = new Date()
        }

        const timeOffRoute = now - offRouteSinceRef.current

        if (
          timeOffRoute >= sustainedMsRef.current &&
          !deviationFiredRef.current
        ) {
          isDeviatedRef.current = true
          deviationFiredRef.current = true

          // Use event-driven visited state — accurate and always current
          const remainingStops = getRemainingStops()
          onDeviationConfirmedRef.current(lngLat, remainingStops)
        }
      } else {
        if (offRouteSinceRef.current !== null) {
          offRouteSinceRef.current = null
          deviatedSinceRef.current = null
          deviationFiredRef.current = false

          if (isDeviatedRef.current) {
            isDeviatedRef.current = false
            onReturnedRef.current()
          }
        }
      }
    },
    [getRemainingStops],
  )

  const getDeviationState = useCallback(
    (): DeviationState => ({
      isDeviated: isDeviatedRef.current,
      deviationMetres: deviationMetresRef.current,
      deviatedSince: deviatedSinceRef.current,
    }),
    [],
  )

  return { updatePosition, getDeviationState }
}
