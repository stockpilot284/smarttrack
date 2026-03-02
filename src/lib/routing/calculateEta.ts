import { LngLat } from 'maplibre-gl'
import { RouteGeometry } from '@/lib/routing/routing.types'

export function haversine(a: LngLat, b: LngLat): number {
  const R = 6371e3

  const φ1 = (a.lat * Math.PI) / 180
  const φ2 = (b.lat * Math.PI) / 180
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180

  const x =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

/**
 * Calculates remaining distance using cumulative segment data
 */
export function calculateRemainingDistance(
  route: RouteGeometry,
  distanceTraveledMeters: number,
): number {
  if (!route?.segments?.length) {
    return Math.max(route?.totalLength - distanceTraveledMeters, 0)
  }

  // 🔒 Clamp
  const traveled = Math.min(
    Math.max(distanceTraveledMeters, 0),
    route.totalLength,
  )

  return route.totalLength - traveled
}

export function calculateRemainingDistanceFromIndex(
  route: RouteGeometry,
  pointIndex: number,
): number {
  if (!route.segments.length || pointIndex >= route.points.length - 1) {
    return 0
  }

  const segment = route.segments.find(
    (s) =>
      s.start === route.points[pointIndex] ||
      s.end === route.points[pointIndex + 1],
  )

  if (!segment) return 0

  return route.totalLength - segment.cumulativeStart
}

export function calculateEtaSeconds(
  remainingMeters: number,
  speedMps = 10, // ~36 km/h realistic avg
): number {
  if (remainingMeters <= 0) return 0
  return Math.ceil(remainingMeters / speedMps)
}
