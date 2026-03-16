import { RouteRequest, RadarRouteResult } from '@/lib/routing/routing.types'
import { buildRouteWaypoints } from './build-route-waypoints'
import axios from 'axios'

const RADAR_DIRECTIONS_URL = 'https://api.radar.io/v1/route/directions'

/**
 * Enhanced Radar route fetcher.
 * @param input - RouteRequest with optional `preference` field:
 *   'fastest' | 'shortest' | 'balanced' (default: 'fastest')
 */
export async function fetchRadarRoute(
  input: RouteRequest & { preference?: 'fastest' | 'shortest' | 'balanced' },
): Promise<RadarRouteResult | null> {
  const waypoints = buildRouteWaypoints(input)
  if (!waypoints) return null

  // Build URL with preference parameter if provided
  let url = `${RADAR_DIRECTIONS_URL}?locations=${encodeURIComponent(
    waypoints,
  )}&geometry=linestring`

  if (input.preference) {
    // Map our preference to Radar's expected parameter (likely `optimize` or `preference`)
    // ⚠️ Check Radar's official docs for exact parameter name and values
    const prefParam =
      input.preference === 'fastest'
        ? 'fastest'
        : input.preference === 'shortest'
          ? 'shortest'
          : 'balanced' // fallback for 'balanced'
    url += `&optimize=${prefParam}` // example – adjust based on actual API
  }

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY,
      },
    })

    const routes = res.data?.routes
    if (!routes || routes.length === 0) return null

    // If multiple routes are returned, we can pick the shortest if requested
    let selectedRoute = routes[0]
    if (input.preference === 'shortest' && routes.length > 1) {
      // Assume each route has a `distance` property
      selectedRoute = routes.reduce((shortest: any, current: any) =>
        current.distance < shortest.distance ? current : shortest,
      )
    }

    if (!selectedRoute?.geometry) return null

    return selectedRoute
  } catch (error: any) {
    console.error('Radar route error:', error.message)
    return null
  }
}
