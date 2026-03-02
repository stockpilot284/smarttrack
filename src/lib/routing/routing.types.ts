import type { Feature, LineString, Position } from 'geojson'
import { RouteMode } from '@/lib/map/derive-map-entities'

export type RouteRequest = {
  mode: RouteMode
  truck: [number, number] // [lng, lat]
  pickup?: [number, number]
  dropoff?: [number, number]
}

/**
 * Radar route result – a GeoJSON Feature with LineString geometry.
 * It may contain additional properties (duration, distance, etc.) depending on the API response.
 */
export type RadarRouteResult = Feature<
  LineString,
  {
    duration?: number
    distance?: number
    [key: string]: unknown
  }
>

export type LngLat = [number, number]

export type RouteSegment = {
  start: Position
  end: Position
  length: number // meters
  cumulativeStart: number // meters from start of route
  cumulativeEnd: number // meters from start of route
}

export type RouteGeometry = {
  points: Position[] // all points along the route
  segments: RouteSegment[] // broken into segments (e.g., for interpolation)
  totalLength: number // meters
}

export type RoutePlan = {
  completed?: Promise<RadarRouteResult | null> | null
  active?: Promise<RadarRouteResult | null> | null
}
