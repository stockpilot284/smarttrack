/**
 * build-route-waypoints.ts
 *
 * Fixes:
 * - Added coord validation to buildWaypointsString — previously a null/undefined
 *   point would produce "undefined,undefined" in the waypoint string, causing
 *   a silent API failure with no error message
 * - buildWaypointsString now throws if any point is invalid rather than
 *   sending a malformed request
 * - buildRouteWaypoints unchanged — validation was already correct there
 */

import { RouteRequest } from '@/lib/routing/routing.types'

type Coord = [number, number] // [lng, lat]

function isValidCoord(coord?: Coord | null): coord is Coord {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    Number.isFinite(coord[0]) &&
    Number.isFinite(coord[1])
  )
}

/**
 * Builds Radar-compatible waypoint string for single-order routing
 * Radar format: lat,lng|lat,lng
 */
export function buildRouteWaypoints(input: RouteRequest): string | null {
  const { mode, truck, pickup, dropoff } = input

  if (mode === 'TO_PICKUP') {
    if (!isValidCoord(truck) || !isValidCoord(pickup)) return null
    return `${truck[1]},${truck[0]}|${pickup[1]},${pickup[0]}`
  }

  if (mode === 'TO_DROPOFF') {
    if (!isValidCoord(truck) || !isValidCoord(dropoff)) return null
    return `${truck[1]},${truck[0]}|${dropoff[1]},${dropoff[0]}`
  }

  if (mode === 'COMPLETED') {
    if (!isValidCoord(pickup) || !isValidCoord(truck)) return null
    return `${pickup[1]},${pickup[0]}|${truck[1]},${truck[0]}`
  }

  return null
}

/**
 * Builds Radar-compatible waypoint string from an ordered array of [lng, lat] points.
 * Radar expects lat,lng order — this function performs the flip.
 * Throws if any point is invalid to prevent silent malformed API requests.
 */
export function buildWaypointsString(points: [number, number][]): string {
  if (points.length < 2) {
    throw new Error('At least 2 waypoints are required')
  }

  for (let i = 0; i < points.length; i++) {
    if (!isValidCoord(points[i])) {
      throw new Error(
        `Invalid coordinate at index ${i}: ${JSON.stringify(points[i])}`,
      )
    }
  }

  // Flip from [lng, lat] (GeoJSON/internal) to lat,lng (Radar API)
  return points.map((p) => `${p[1]},${p[0]}`).join('|')
}
