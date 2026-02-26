import { RouteRequest, RadarRouteResult } from '@/lib/routing/routing.types'
import { buildRouteWaypoints } from './build-route-waypoints'
import axios from 'axios'

const RADAR_DIRECTIONS_URL = 'https://api.radar.io/v1/route/directions'

export async function fetchRadarRoute(
  input: RouteRequest,
): Promise<RadarRouteResult | null> {
  const waypoints = buildRouteWaypoints(input)
  if (!waypoints) return null

  const url = `${RADAR_DIRECTIONS_URL}?locations=${encodeURIComponent(
    waypoints,
  )}&geometry=linestring`

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY,
      },
    })

    const route = res.data?.routes?.[0]
    if (!route?.geometry) return null

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.geometry.coordinates,
      },
      properties: {
        distance: route.distance,
        duration: route.duration,
      },
    }
  } catch (error: any) {
    console.error('Radar route error:', error.message)
    return null
  }
}
