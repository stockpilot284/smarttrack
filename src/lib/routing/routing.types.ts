import { RouteMode } from '@/lib/map/derive-map-entities'

export type RouteRequest = {
  mode: RouteMode
  truck: [number, number] // [lng, lat]
  pickup?: [number, number]
  dropoff?: [number, number]
}

export type RadarRouteResult = GeoJSON.Feature<GeoJSON.LineString>

export type LngLat = [number, number]

export type RouteSegment = {
  start: LngLat
  end: LngLat
  length: number
  cumulativeStart: number
  cumulativeEnd: number
}

export type RouteGeometry = {
  points: LngLat[]
  segments: RouteSegment[]
  totalLength: number
}
