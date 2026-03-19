// lib/routing/fetch-route-for-stops.ts
import { RadarRouteResult } from './routing.types'
import { callRadarDirections } from './call-radar-directions'
import { buildWaypointsString } from './build-route-waypoints'

export async function fetchRouteForStops(
  stops: [number, number][], // array of [lng, lat] in order
  preference?: 'fastest' | 'shortest' | 'balanced',
): Promise<RadarRouteResult | null> {
  if (stops.length < 2) return null
  const waypoints = buildWaypointsString(stops)
  return callRadarDirections(waypoints, preference)
}
