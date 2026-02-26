import { RouteGeometry, RouteSegment, LngLat } from './routing.types'

const toRad = (d: number) => (d * Math.PI) / 180

function haversine(a: LngLat, b: LngLat): number {
  const R = 6371000
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])

  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(h))
}

export function buildRouteGeometry(points: LngLat[]): RouteGeometry {
  const segments: RouteSegment[] = []
  let cumulative = 0

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]
    const length = haversine(start, end)

    segments.push({
      start,
      end,
      length,
      cumulativeStart: cumulative,
      cumulativeEnd: cumulative + length,
    })

    cumulative += length
  }

  return {
    points,
    segments,
    totalLength: cumulative,
  }
}
