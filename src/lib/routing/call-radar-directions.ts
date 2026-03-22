/**
 * call-radar-directions.ts
 *
 * Fixes:
 * - Added 10s request timeout via AbortController
 * - Added transport mode param (truck) so routing uses correct road rules
 * - Throws on error instead of swallowing — lets callers distinguish
 *   network failure from empty result
 * - Removed dead 'shortest' multi-route reduction — Radar returns one route
 * - Kept preference param as 'optimize' query param for future use
 */

import axios from 'axios'
import { RadarRouteResult } from './routing.types'

const RADAR_DIRECTIONS_URL = 'https://api.radar.io/v1/route/directions'
const REQUEST_TIMEOUT_MS = 10_000

export async function callRadarDirections(
  waypoints: string,
  preference?: 'fastest' | 'shortest' | 'balanced',
): Promise<RadarRouteResult | null> {
  const params = new URLSearchParams({
    locations: waypoints,
    geometry: 'linestring',
    // Use truck mode — respects truck-specific road restrictions and routing
    modes: 'truck',
  })

  if (preference) {
    params.set('optimize', preference)
  }

  const url = `${RADAR_DIRECTIONS_URL}?${params.toString()}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await axios.get(url, {
      headers: { Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY },
      signal: controller.signal,
    })

    const routes = res.data?.routes
    if (!routes?.length) return null

    const selectedRoute = routes[0]
    if (!selectedRoute?.geometry) return null

    return {
      geometry: selectedRoute.geometry,
      distance: selectedRoute.distance.value,
      duration: selectedRoute.duration.value,
    }
  } catch (error: any) {
    if (axios.isCancel(error) || error.name === 'AbortError') {
      throw new Error('Route request timed out')
    }
    // Re-throw with a clean message so useTripRoute can surface it
    const message =
      error.response?.data?.message || error.message || 'Failed to fetch route'
    throw new Error(message)
  } finally {
    clearTimeout(timeout)
  }
}
