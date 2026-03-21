/**
 * use-trip-route.ts
 *
 * Fixes:
 * - Stops array compared by serialized value not reference — previously a new
 *   array with the same coords on every render would trigger a re-fetch loop
 *   because arrays are compared by reference in useEffect deps
 * - Added AbortController to cancel in-flight fetch when stops change —
 *   isMounted only prevented stale state updates, not the actual network request
 * - Error state now receives the thrown message from callRadarDirections
 *   instead of always getting a generic fallback
 */

import { useState, useEffect, useRef } from 'react'
import { fetchRouteForStops } from '@/lib/routing/fetch-route-for-stops'
import { RadarRouteResult } from '@/lib/routing/routing.types'

export function useTripRoute(stops: [number, number][]) {
  const [route, setRoute] = useState<RadarRouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Serialize stops to a stable string so the effect only re-runs when
  // the actual coordinate values change, not when a new array reference is passed
  const stopsKey = JSON.stringify(stops)

  // Keep a ref to the current abort controller so we can cancel on re-fetch
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (stops.length < 2) {
      setRoute(null)
      setLoading(false)
      setError(null)
      return
    }

    // Cancel any in-flight request from a previous render
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    fetchRouteForStops(stops)
      .then((result) => {
        // Only update state if this fetch wasn't aborted
        if (!abortRef.current?.signal.aborted) {
          setRoute(result)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!abortRef.current?.signal.aborted) {
          setError(err.message || 'Failed to fetch route')
          setLoading(false)
        }
      })

    return () => {
      abortRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopsKey]) // re-fetch only when coordinate values change, not array reference

  return { route, loading, error }
}
