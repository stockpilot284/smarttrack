import { RouteGeometry, LngLat } from './routing.types'

function projectPointToSegment(p: LngLat, a: LngLat, b: LngLat) {
  const ax = a[0]
  const ay = a[1]
  const bx = b[0]
  const by = b[1]
  const px = p[0]
  const py = p[1]

  const dx = bx - ax
  const dy = by - ay

  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return { t: 0 }

  const t = ((px - ax) * dx + (py - ay) * dy) / lenSq
  return { t: Math.max(0, Math.min(1, t)) }
}

export function projectPointToRoute(
  point: LngLat,
  route: RouteGeometry,
): number {
  let bestDistance = Infinity
  let bestRouteDistance = 0

  for (const segment of route.segments) {
    const { t } = projectPointToSegment(point, segment.start, segment.end)

    const projLng = segment.start[0] + (segment.end[0] - segment.start[0]) * t
    const projLat = segment.start[1] + (segment.end[1] - segment.start[1]) * t

    const dx = point[0] - projLng
    const dy = point[1] - projLat
    const distSq = dx * dx + dy * dy

    if (distSq < bestDistance) {
      bestDistance = distSq
      bestRouteDistance = segment.cumulativeStart + segment.length * t
    }
  }

  return bestRouteDistance
}
