/**
 * point-to-route-distance.ts
 *
 * Computes the shortest distance in metres from a geographic point
 * to the nearest segment of a route polyline, using the Haversine formula
 * for accurate real-world distances at any latitude.
 */

import { LngLat, RouteGeometry, RouteSegment } from './routing.types'

const EARTH_RADIUS_M = 6_371_000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Haversine distance in metres between two positions */
function haversineDistance(a: LngLat, b: LngLat): number {
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * sinDLng * sinDLng
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

/**
 * Shortest distance in metres from point P to segment [A, B].
 * Projects P onto the segment and clamps t to [0,1] so the result
 * is always the nearest point *on* the segment, not the infinite line.
 */
function pointToSegmentDistance(p: LngLat, a: LngLat, b: LngLat): number {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const lenSq = dx * dx + dy * dy

  if (lenSq === 0) return haversineDistance(p, a)

  const t = Math.max(
    0,
    Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lenSq),
  )

  const nearest: LngLat = [a[0] + t * dx, a[1] + t * dy]
  return haversineDistance(p, nearest)
}

/**
 * Returns the shortest distance in metres from `point` to any segment
 * of the route, iterating over RouteGeometry.segments directly so we
 * reuse the already-computed segment boundaries.
 */
export function pointToRouteDistance(
  point: LngLat,
  routeGeometry: RouteGeometry,
): number {
  const { segments } = routeGeometry
  if (!segments?.length) return Infinity

  let minDistance = Infinity

  for (const segment of segments) {
    const dist = pointToSegmentDistance(
      point as LngLat,
      segment.start as LngLat,
      segment.end as LngLat,
    )
    if (dist < minDistance) minDistance = dist
  }

  return minDistance
}

/**
 * Returns the cumulative distance along the route (in metres) of the
 * point on the route nearest to `point`. Used to determine which stops
 * are still ahead of the truck.
 */
export function projectPointOntoRoute(
  point: LngLat,
  routeGeometry: RouteGeometry,
): number {
  const { segments } = routeGeometry
  if (!segments?.length) return 0

  let minDistance = Infinity
  let projectedCumulative = 0

  for (const segment of segments) {
    const dx = segment.end[0] - segment.start[0]
    const dy = segment.end[1] - segment.start[1]
    const lenSq = dx * dx + dy * dy

    const t =
      lenSq === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              ((point[0] - segment.start[0]) * dx +
                (point[1] - segment.start[1]) * dy) /
                lenSq,
            ),
          )

    const nearest: LngLat = [
      segment.start[0] + t * dx,
      segment.start[1] + t * dy,
    ]
    const dist = haversineDistance(point as LngLat, nearest)

    if (dist < minDistance) {
      minDistance = dist
      // Cumulative LngLat = start of this segment + how far along it we are
      projectedCumulative = segment.cumulativeStart + t * segment.length
    }
  }

  return projectedCumulative
}

/**
 * Adaptive deviation threshold in metres based on current speed.
 * City speeds (~30 km/h) → 30m threshold (tight urban streets).
 * Highway speeds (~90 km/h) → 75m threshold (GPS drift is larger at speed).
 * Interpolates linearly between the two.
 */
export function adaptiveThreshold(speedMs: number): number {
  const speedKmh = speedMs * 3.6
  const MIN_SPEED_KMH = 30
  const MAX_SPEED_KMH = 90
  const MIN_THRESHOLD_M = 30
  const MAX_THRESHOLD_M = 75

  const t = Math.max(
    0,
    Math.min(1, (speedKmh - MIN_SPEED_KMH) / (MAX_SPEED_KMH - MIN_SPEED_KMH)),
  )

  return MIN_THRESHOLD_M + t * (MAX_THRESHOLD_M - MIN_THRESHOLD_M)
}
