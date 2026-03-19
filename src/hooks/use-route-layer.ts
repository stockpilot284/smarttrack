// hooks/use-route-layer.ts
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { RadarRouteResult } from '@/lib/routing/routing.types'
import { Stop } from '@/types/tracking.type'
import { splitRouteAtFraction } from '@/lib/routing/split-route'

export function useRouteLayer(
  map: maplibregl.Map | null,
  route: RadarRouteResult | null,
  stops: Stop[],
  theme: 'light' | 'dark',
) {
  const sourceAddedRef = useRef(false)

  const addRouteLayers = () => {
    if (!map || !route?.geometry?.coordinates) return
    const completedStops = stops.filter((s) => s.status === 'COMPLETED').length
    const totalStops = stops.length
    const progress = totalStops > 0 ? completedStops / totalStops : 0

    const coords = route.geometry.coordinates as [number, number][]
    const { completed, remaining } = splitRouteAtFraction(coords, progress)

    const completedSourceId = 'route-completed-source'
    const completedLayerId = 'route-completed-layer'
    const remainingSourceId = 'route-remaining-source'
    const remainingLayerId = 'route-remaining-layer'

    // Remove old sources/layers
    ;[completedLayerId, remainingLayerId].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id)
    })
    ;[completedSourceId, remainingSourceId].forEach((id) => {
      if (map.getSource(id)) map.removeSource(id)
    })

    // Add completed route (gray dashed) if any
    if (completed.length > 1) {
      map.addSource(completedSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: completed },
          properties: {},
        },
      })
      map.addLayer({
        id: completedLayerId,
        type: 'line',
        source: completedSourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color':
            theme === 'dark'
              ? 'rgba(156,110,247,0.6)'
              : 'rgba(156,110,247,0.7)',
          'line-width': 4,
          'line-opacity': 0.6,
          'line-dasharray': [2, 2],
        },
      })
    }

    // Add remaining route (solid primary)
    if (remaining.length > 1) {
      map.addSource(remainingSourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: remaining },
          properties: {},
        },
      })
      map.addLayer({
        id: remainingLayerId,
        type: 'line',
        source: remainingSourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': theme === 'dark' ? '#9c6ef7' : '#7634ec',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      })
    }

    sourceAddedRef.current = true
  }

  useEffect(() => {
    if (!map || !route || stops.length === 0) return

    const handleLoad = () => addRouteLayers()

    if (map.loaded()) {
      addRouteLayers()
      console.log('Map is loaded')
    } else {
      console.log('Map is loaded')
      map.once('load', handleLoad)
    }

    return () => {
      try {
        if (map && sourceAddedRef.current) {
          const ids = ['route-completed-layer', 'route-remaining-layer']
          ids.forEach((id) => {
            if (map.getLayer(id)) map.removeLayer(id)
          })
          const sourceIds = ['route-completed-source', 'route-remaining-source']
          sourceIds.forEach((id) => {
            if (map.getSource(id)) map.removeSource(id)
          })
          sourceAddedRef.current = false
        }
      } catch (error) {}
    }
  }, [map, route, stops, theme])
}
