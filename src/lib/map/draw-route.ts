import maplibregl from 'maplibre-gl'
import { RadarRouteResult } from '@/lib/routing/routing.types'

type RouteVariant = 'ACTIVE' | 'COMPLETED'

/**
 * Finds a suitable label layer ID to insert route layers before.
 * Returns the ID if found, otherwise undefined.
 */
function findLabelLayerBefore(map: maplibregl.Map): string | undefined {
  const labelLayerKeywords = [
    'road-label',
    'road-name',
    'place-label',
    'settlement-label',
    'waterway-label',
    'poi-label',
  ]

  for (const keyword of labelLayerKeywords) {
    if (map.getLayer(keyword)) return keyword

    const layers = map.getStyle().layers
    const found = layers?.find((layer) => layer.id.includes(keyword))
    if (found) return found.id
  }

  const firstSymbolLayer = map
    .getStyle()
    .layers?.find((layer) => layer.type === 'symbol')
  return firstSymbolLayer?.id
}

export function drawRouteSegment(
  map: maplibregl.Map,
  route: RadarRouteResult | null,
  theme: 'light' | 'dark',
  layerId: string,
  variant: RouteVariant,
) {
  const sourceId = `${layerId}-source`

  // Clean up existing layer/source
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId)
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId)
  }

  if (!route || !route.geometry?.coordinates?.length) return

  // Build a proper GeoJSON Feature from the coordinates
  const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: route.geometry.coordinates,
    },
    properties: {
      distance: route.distance,
      duration: route.duration,
    },
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: geojson,
  })

  // Paint configuration
  const paint: Record<string, any> = {
    'line-color':
      variant === 'ACTIVE'
        ? theme === 'dark'
          ? '#9c6ef7'
          : '#7634ec'
        : theme === 'dark'
          ? '#9c6ef7'
          : '#7634ec',
    'line-width': variant === 'ACTIVE' ? 4 : 2.5,
    'line-opacity': variant === 'ACTIVE' ? 0.85 : 0.5,
  }

  const beforeId = findLabelLayerBefore(map)

  map.addLayer(
    {
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint,
    },
    beforeId,
  )
}
