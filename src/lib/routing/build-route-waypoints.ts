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
 * Builds Radar-compatible waypoint string
 * Radar format: lat,lng|lat,lng
 */
export function buildRouteWaypoints(input: RouteRequest): string | null {
  const { mode, truck, pickup, dropoff } = input

  /* ---------- TO PICKUP ---------- */
  if (mode === 'TO_PICKUP') {
    if (!isValidCoord(truck) || !isValidCoord(pickup)) return null

    return `${truck[1]},${truck[0]}|${pickup[1]},${pickup[0]}`
  }

  /* ---------- TO DROPOFF ---------- */
  if (mode === 'TO_DROPOFF') {
    if (!isValidCoord(truck) || !isValidCoord(dropoff)) return null

    return `${truck[1]},${truck[0]}|${dropoff[1]},${dropoff[0]}`
  }

  /* ---------- COMPLETED (pickup → truck) ---------- */
  if (mode === 'COMPLETED') {
    if (!isValidCoord(pickup) || !isValidCoord(truck)) return null

    return `${pickup[1]},${pickup[0]}|${truck[1]},${truck[0]}`
  }

  return null
}
