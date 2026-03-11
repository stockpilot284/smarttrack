// lib/routing/call-radar-directions.ts
import axios from 'axios'
import { RadarRouteResult } from './routing.types'

const RADAR_DIRECTIONS_URL = 'https://api.radar.io/v1/route/directions'

export async function callRadarDirections(
  waypoints: string,
  preference?: 'fastest' | 'shortest' | 'balanced',
): Promise<RadarRouteResult | null> {
  let url = `${RADAR_DIRECTIONS_URL}?locations=${encodeURIComponent(waypoints)}&geometry=linestring`
  if (preference) {
    // Radar's parameter is likely 'optimize' – check docs
    url += `&optimize=${preference}`
  }

  try {
    const res = await axios.get(url, {
      headers: { Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY },
    })

    const routes = res.data?.routes
    if (!routes || routes.length === 0) return null

    let selectedRoute = routes[0]
    if (preference === 'shortest' && routes.length > 1) {
      selectedRoute = routes.reduce((shortest: any, current: any) =>
        current.distance < shortest.distance ? current : shortest,
      )
    }

    if (!selectedRoute?.geometry) return null
    console.log(selectedRoute)

    return {
      geometry: selectedRoute.geometry,
      distance: selectedRoute.distance,
      duration: selectedRoute.duration,
    }
  } catch (error: any) {
    console.error('Radar route error:', error.message)
    return null
  }
}
