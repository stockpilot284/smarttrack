/**
 * fetch-route-for-stops.ts
 *
 * No bugs found — clean pass-through.
 * callRadarDirections now throws on error so that propagates correctly here.
 */

import { RadarRouteResult } from './routing.types'
import { callRadarDirections } from './call-radar-directions'
import { buildWaypointsString } from './build-route-waypoints'

export async function fetchRouteForStops(
  stops: [number, number][], // array of [lng, lat] in order
  preference?: 'fastest' | 'shortest' | 'balanced',
): Promise<RadarRouteResult | null> {
  if (stops.length < 2) return null

  // buildWaypointsString throws on invalid coords — propagates to useTripRoute
  const waypoints = buildWaypointsString(stops)
  return callRadarDirections(waypoints, preference)
}
