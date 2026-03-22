/**
 * use-route-layer.ts
 *
 * Root causes of polyline never drawing:
 *
 * 1. MapPanel called useRouteLayer(mapInstance.current, ...) — passing ref.current
 *    as a plain value. On first render ref.current is null, and React never
 *    re-runs the hook when it mutates to the map instance because ref mutations
 *    don't trigger re-renders. The hook received null forever.
 *
 * 2. MapPanel passed `activeRoute` (the raw Radar API response object) but this
 *    hook expects a RouteGeometry. The hook received the wrong shape.
 *
 * Fix:
 * - Accept mapInstance as RefObject<Map | null> + isMapLoaded as a boolean.
 *   isMapLoaded flipping true IS a re-render, so effects re-run with the live map.
 * - Accept routeGeometry: RouteGeometry | null directly (caller builds it).
 * - Listen for 'style.load' to re-add layers after theme changes wipe them.
 */

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { Stop } from '@/types/tracking.type'
import { RouteGeometry } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'

const SOURCE_COMPLETED = 'trip-route-completed'
const SOURCE_REMAINING = 'trip-route-remaining'
const LAYER_COMPLETED = 'trip-route-line-completed'
const LAYER_REMAINING = 'trip-route-line-remaining'

type RouteLayerTheme = 'dark' | 'light' | undefined

function completedColor(theme: RouteLayerTheme): string {
  // lighter slate shades
  return theme === 'dark' ? '#64748b' : '#cbd5e1'
}

function remainingColor(theme: RouteLayerTheme): string {
  // lighter blues
  return theme === 'dark' ? '#60a5fa' : '#3b82f6'
}

function splitRouteAtDistance(
  geometry: RouteGeometry,
  distanceM: number,
): [[number, number][], [number, number][]] {
  const { points, segments, totalLength } = geometry

  if (distanceM <= 0) {
    return [[], points.map((p) => [p[0], p[1]] as [number, number])]
  }
  if (distanceM >= totalLength) {
    return [points.map((p) => [p[0], p[1]] as [number, number]), []]
  }

  const completedPts: [number, number][] = []
  const remainingPts: [number, number][] = []
  let accumulated = 0
  let splitDone = false

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const segStart = points[i] as [number, number]
    const segEnd = points[i + 1] as [number, number]
    const segEndAcc = accumulated + seg.length

    if (splitDone) {
      if (remainingPts.length === 0) remainingPts.push(segStart)
      remainingPts.push(segEnd)
      accumulated = segEndAcc
      continue
    }

    if (distanceM <= segEndAcc) {
      const t = seg.length > 0 ? (distanceM - accumulated) / seg.length : 0
      const splitPt: [number, number] = [
        segStart[0] + t * (segEnd[0] - segStart[0]),
        segStart[1] + t * (segEnd[1] - segStart[1]),
      ]
      if (completedPts.length === 0) completedPts.push(segStart)
      completedPts.push(splitPt)
      remainingPts.push(splitPt, segEnd)
      splitDone = true
    } else {
      if (completedPts.length === 0) completedPts.push(segStart)
      completedPts.push(segEnd)
    }

    accumulated = segEndAcc
  }

  return [completedPts, remainingPts]
}

function emptyGeojson(): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [] },
  }
}

function toGeojson(
  coords: [number, number][],
): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: coords },
  }
}

function removeLayers(map: maplibregl.Map) {
  try {
    if (map.getLayer(LAYER_COMPLETED)) map.removeLayer(LAYER_COMPLETED)
    if (map.getLayer(LAYER_REMAINING)) map.removeLayer(LAYER_REMAINING)
    if (map.getSource(SOURCE_COMPLETED)) map.removeSource(SOURCE_COMPLETED)
    if (map.getSource(SOURCE_REMAINING)) map.removeSource(SOURCE_REMAINING)
  } catch {
    /* already gone after style wipe */
  }
}

function addLayers(map: maplibregl.Map, theme: RouteLayerTheme) {
  if (!map.getSource(SOURCE_COMPLETED)) {
    map.addSource(SOURCE_COMPLETED, { type: 'geojson', data: emptyGeojson() })
    map.addLayer({
      id: LAYER_COMPLETED,
      type: 'line',
      source: SOURCE_COMPLETED,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': completedColor(theme),
        'line-width': 3,
        'line-opacity': 0.55,
      },
    })
  }
  if (!map.getSource(SOURCE_REMAINING)) {
    map.addSource(SOURCE_REMAINING, { type: 'geojson', data: emptyGeojson() })
    map.addLayer({
      id: LAYER_REMAINING,
      type: 'line',
      source: SOURCE_REMAINING,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': remainingColor(theme),
        'line-width': 4,
        'line-opacity': 0.85,
      },
    })
  }
}

function applyData(
  map: maplibregl.Map,
  geometry: RouteGeometry | null,
  distanceM: number,
) {
  try {
    const cs = map.getSource(SOURCE_COMPLETED) as
      | maplibregl.GeoJSONSource
      | undefined
    const rs = map.getSource(SOURCE_REMAINING) as
      | maplibregl.GeoJSONSource
      | undefined
    if (!cs || !rs) return

    if (!geometry) {
      cs.setData(emptyGeojson())
      rs.setData(emptyGeojson())
      return
    }

    const [completed, remaining] = splitRouteAtDistance(geometry, distanceM)
    cs.setData(toGeojson(completed))
    rs.setData(toGeojson(remaining))
  } catch {
    /* sources may not be ready */
  }
}

interface UseRouteLayerOptions {
  motionRef?: React.RefObject<TruckMotionState | null>
  splitIntervalMs?: number
}

export function useRouteLayer(
  mapInstance: React.RefObject<maplibregl.Map | null>,
  isMapLoaded: boolean,
  routeGeometry: RouteGeometry | null,
  _stops: Stop[],
  theme: RouteLayerTheme,
  { motionRef, splitIntervalMs = 500 }: UseRouteLayerOptions = {},
) {
  const themeRef = useRef<RouteLayerTheme>(theme)
  const geometryRef = useRef<RouteGeometry | null>(routeGeometry)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])
  useEffect(() => {
    geometryRef.current = routeGeometry
  }, [routeGeometry])

  // ── Effect 1: set up layers when map becomes ready ─────────────────────────
  // isMapLoaded is a boolean React state — when it flips true, this effect
  // re-runs with the live mapInstance.current. No ref.current timing issues.
  // ── Effect 1: set up layers and listen for style reloads ─────────────────
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded) return

    function draw() {
      if (!map) return
      removeLayers(map)
      addLayers(map, themeRef.current)
      applyData(
        map,
        geometryRef.current,
        motionRef?.current?.distanceAlongRoute ?? 0,
      )
      // Re-sync canvas size after style reload — without this the map shrinks
      // when the theme changes because MapLibre loses its container dimensions
      // during the style swap.
      map.resize()
    }

    map.on('style.load', draw)

    if (map.isStyleLoaded()) {
      draw()
    }

    return () => {
      map.off('style.load', draw)
      try {
        if (map.isStyleLoaded()) removeLayers(map)
      } catch {
        /* ignore on unmount */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance, isMapLoaded])

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded) return

    // Style is mid-reload (theme change in progress) — bail out.
    // Effect 1's style.load listener will call draw() once it's ready.
    if (!map.isStyleLoaded()) return

    addLayers(map, theme)
    applyData(map, routeGeometry, motionRef?.current?.distanceAlongRoute ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeGeometry, theme, isMapLoaded])

  // ── Effect 3: poll to advance the completed/remaining split as truck moves ─
  useEffect(() => {
    if (!motionRef) return
    const interval = setInterval(() => {
      const map = mapInstance.current
      if (!map || !isMapLoaded || !geometryRef.current) return
      applyData(
        map,
        geometryRef.current,
        motionRef.current?.distanceAlongRoute ?? 0,
      )
    }, splitIntervalMs)
    return () => clearInterval(interval)
  }, [mapInstance, isMapLoaded, motionRef, splitIntervalMs])
}
