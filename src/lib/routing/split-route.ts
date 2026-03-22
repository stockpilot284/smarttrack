// lib/routing/split-route.ts
import { LngLat } from 'maplibre-gl'

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
export function splitRouteAtFraction(
  coordinates: [number, number][],
  fraction: number,
): { completed: [number, number][]; remaining: [number, number][] } {
  if (coordinates.length < 2) return { completed: [], remaining: coordinates }
  if (fraction <= 0) return { completed: [], remaining: coordinates }
  if (fraction >= 1) return { completed: coordinates, remaining: [] }

  // Compute cumulative distances along the route
  const distances: number[] = [0]
  for (let i = 1; i < coordinates.length; i++) {
    const a = {
      lat: coordinates[i - 1][1],
      lng: coordinates[i - 1][0],
    } as LngLat
    const b = { lat: coordinates[i][1], lng: coordinates[i][0] } as LngLat
    distances.push(distances[i - 1] + haversine(a, b))
  }
  const totalDist = distances[distances.length - 1]
  const targetDist = totalDist * fraction

  // Find the segment containing the target distance
  let segIndex = 0
  while (
    segIndex < distances.length - 1 &&
    distances[segIndex + 1] < targetDist
  ) {
    segIndex++
  }

  if (segIndex === coordinates.length - 1) {
    // Fraction exactly at the last point
    return { completed: coordinates, remaining: [] }
  }

  const startCoord = coordinates[segIndex]
  const endCoord = coordinates[segIndex + 1]
  const segStartDist = distances[segIndex]
  const segEndDist = distances[segIndex + 1]
  const segLength = segEndDist - segStartDist
  const segFraction = (targetDist - segStartDist) / segLength

  // Interpolate the split point
  const lng = startCoord[0] + (endCoord[0] - startCoord[0]) * segFraction
  const lat = startCoord[1] + (endCoord[1] - startCoord[1]) * segFraction
  const splitPoint: [number, number] = [lng, lat]

  const completed = [...coordinates.slice(0, segIndex + 1), splitPoint]
  const remaining = [splitPoint, ...coordinates.slice(segIndex + 1)]

  return { completed, remaining }
}
