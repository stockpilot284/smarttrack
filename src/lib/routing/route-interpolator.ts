import { RouteGeometry, LngLat } from './routing.types'

export function interpolateRoutePosition(
  route: RouteGeometry,
  distance: number,
): { position: LngLat; bearing: number } {
  const seg = route.segments.find(
    (s) => distance >= s.cumulativeStart && distance <= s.cumulativeEnd,
  )

  if (!seg) {
    const last = route.segments.at(-1)!
    return {
      position: last.end,
      bearing: 0,
    }
  }

  const t = (distance - seg.cumulativeStart) / seg.length

  const lng = seg.start[0] + (seg.end[0] - seg.start[0]) * t
  const lat = seg.start[1] + (seg.end[1] - seg.start[1]) * t

  const bearing =
    (Math.atan2(seg.end[0] - seg.start[0], seg.end[1] - seg.start[1]) * 180) /
    Math.PI

  return {
    position: [lng, lat],
    bearing,
  }
}
