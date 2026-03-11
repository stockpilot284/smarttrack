import { RadarRouteResult } from './routing.types'
import { buildWaypointsString } from './build-route-waypoints'
import { callRadarDirections } from './call-radar-directions'

export async function fetchRadarRouteFromPoints(
  points: [number, number][],
  preference?: 'fastest' | 'shortest' | 'balanced',
): Promise<RadarRouteResult | null> {
  if (points.length < 2) return null
  const waypoints = buildWaypointsString(points)
  return callRadarDirections(waypoints, preference)
}
