/**
 * use-stop-arrival.ts
 *
 * Monitors the truck's real-time position against each active stop.
 * Handles all StopStatus values — PENDING, IN_PROGRESS, COMPLETED,
 * FAILED, and SKIPPED.
 *
 * FAILED and SKIPPED stops are excluded from arrival detection and
 * from remaining stops passed to deviation rerouting — they are
 * resolved and need no further action from the truck.
 */

import { useRef, useCallback, useEffect } from 'react'
import { LngLat } from '@/lib/routing/routing.types'
import { Stop, isStopResolved } from '@/types/tracking.type'

const EARTH_RADIUS_M = 6_371_000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

type StopArrivalPhase = 'idle' | 'approaching' | 'arrived' | 'departed'

interface StopArrivalState {
  phase: StopArrivalPhase
  approachingSince: number | null
  arrivedAt: number | null
}

interface UseStopArrivalOptions {
  stops: Stop[]
  arrivalRadiusM?: number
  dwellMs?: number
  departureRadiusM?: number
  onApproaching?: (stop: Stop, distanceM: number) => void
  onArrived: (stop: Stop) => void
  onDeparted?: (stop: Stop) => void
}

interface UseStopArrivalReturn {
  updatePosition: (lngLat: LngLat) => void
  visitedStopIds: React.RefObject<Set<string>>
  getNextStop: () => Stop | null
  getApproachingStop: () => Stop | null
}

export function useStopArrival({
  stops,
  arrivalRadiusM = 50,
  dwellMs = 3_000,
  departureRadiusM = 100,
  onApproaching,
  onArrived,
  onDeparted,
}: UseStopArrivalOptions): UseStopArrivalReturn {
  const visitedStopIds = useRef<Set<string>>(new Set())
  const arrivalStates = useRef<Map<string, StopArrivalState>>(new Map())
  const approachingStopRef = useRef<Stop | null>(null)

  const onApproachingRef = useRef(onApproaching)
  const onArrivedRef = useRef(onArrived)
  const onDepartedRef = useRef(onDeparted)
  const stopsRef = useRef(stops)

  useEffect(() => {
    onApproachingRef.current = onApproaching
    onArrivedRef.current = onArrived
    onDepartedRef.current = onDeparted
    stopsRef.current = stops
  })

  useEffect(() => {
    for (const stop of stops) {
      if (!arrivalStates.current.has(stop.id)) {
        if (isStopResolved(stop.status)) {
          // Pre-seed resolved stops — COMPLETED, FAILED, and SKIPPED
          // all count as done and should not be detected again
          visitedStopIds.current.add(stop.id)
          arrivalStates.current.set(stop.id, {
            phase: 'departed',
            approachingSince: null,
            arrivedAt: null,
          })
        } else {
          arrivalStates.current.set(stop.id, {
            phase: 'idle',
            approachingSince: null,
            arrivedAt: null,
          })
        }
      } else {
        // If a stop's status was updated externally (e.g. dispatcher marks
        // it FAILED or SKIPPED via backend), sync that into local state
        const state = arrivalStates.current.get(stop.id)!
        if (isStopResolved(stop.status) && state.phase !== 'departed') {
          visitedStopIds.current.add(stop.id)
          state.phase = 'departed'
          state.approachingSince = null
          state.arrivedAt = null
          if (approachingStopRef.current?.id === stop.id) {
            approachingStopRef.current = null
          }
        }
      }
    }
  }, [stops])

  const updatePosition = useCallback(
    (lngLat: LngLat) => {
      const now = performance.now()
      const [lng, lat] = lngLat
      let currentApproaching: Stop | null = null

      for (const stop of stopsRef.current) {
        // Skip all resolved stops — COMPLETED, FAILED, SKIPPED
        if (visitedStopIds.current.has(stop.id)) continue

        const state = arrivalStates.current.get(stop.id)
        if (!state || state.phase === 'departed') continue

        const distanceM = haversineDistance(
          lat,
          lng,
          stop.latitude,
          stop.longitude,
        )

        const withinArrival = distanceM <= arrivalRadiusM
        const withinDeparture = distanceM <= departureRadiusM

        switch (state.phase) {
          case 'idle': {
            if (withinArrival) {
              state.phase = 'approaching'
              state.approachingSince = now
              approachingStopRef.current = stop
              currentApproaching = stop
              onApproachingRef.current?.(stop, Math.round(distanceM))
            }
            break
          }

          case 'approaching': {
            if (!withinArrival) {
              state.phase = 'idle'
              state.approachingSince = null
              if (approachingStopRef.current?.id === stop.id) {
                approachingStopRef.current = null
              }
              break
            }

            currentApproaching = stop

            const dwellTime = now - (state.approachingSince ?? now)
            if (dwellTime >= dwellMs) {
              state.phase = 'arrived'
              state.arrivedAt = now
              visitedStopIds.current.add(stop.id)
              approachingStopRef.current = null
              onArrivedRef.current(stop)
            }
            break
          }

          case 'arrived': {
            if (!withinDeparture) {
              state.phase = 'departed'
              onDepartedRef.current?.(stop)
            }
            break
          }
        }
      }

      if (currentApproaching) {
        approachingStopRef.current = currentApproaching
      } else if (approachingStopRef.current) {
        const s = approachingStopRef.current
        if (!visitedStopIds.current.has(s.id)) {
          const d = haversineDistance(lat, lng, s.latitude, s.longitude)
          if (d > arrivalRadiusM) {
            approachingStopRef.current = null
          }
        }
      }
    },
    [arrivalRadiusM, dwellMs, departureRadiusM],
  )

  const getNextStop = useCallback((): Stop | null => {
    // Next stop is the first stop that is not resolved —
    // skips COMPLETED, FAILED, and SKIPPED stops entirely
    for (const stop of stopsRef.current) {
      if (!isStopResolved(stop.status)) return stop
    }
    return null
  }, [])

  const getApproachingStop = useCallback((): Stop | null => {
    return approachingStopRef.current
  }, [])

  return {
    updatePosition,
    visitedStopIds,
    getNextStop,
    getApproachingStop,
  }
}
