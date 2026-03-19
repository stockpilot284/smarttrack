// hooks/use-trip-route.ts
import { useState, useEffect } from 'react'
import { fetchRouteForStops } from '@/lib/routing/fetch-route-for-stops'
import { RadarRouteResult } from '@/lib/routing/routing.types'

export function useTripRoute(stops: [number, number][]) {
  const [route, setRoute] = useState<RadarRouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (stops.length < 2) {
      setRoute(null)
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    fetchRouteForStops(stops)
      .then((result) => {
        if (isMounted) {
          setRoute(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch route')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [stops]) // re‑fetch if stops change (e.g., reorder)

  return { route, loading, error }
}
