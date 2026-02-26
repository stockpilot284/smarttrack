import maplibregl from 'maplibre-gl'
import { RadarRouteResult } from '@/lib/routing/routing.types'

type RouteVariant = 'ACTIVE' | 'COMPLETED'

export function drawRouteSegment(
  map: maplibregl.Map,
  route: RadarRouteResult | null,
  theme: 'light' | 'dark',
  layerId: string,
  variant: RouteVariant,
) {
  const sourceId = `${layerId}-source`

  /* ================================
     CLEANUP (SAFE RE-DRAW)
  ================================ */
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId)
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId)
  }

  /* ================================
     RETURN IF NO ROUTE
  ================================ */
  if (!route) return

  /* ================================
     ADD SOURCE
  ================================ */
  map.addSource(sourceId, {
    type: 'geojson',
    data: route,
  })

  /* ================================
     LAYER PAINT CONFIG
  ================================ */
  const paint: Record<string, any> = {
    'line-color':
      variant === 'ACTIVE'
        ? theme === 'dark'
          ? '#9c6ef7' // bright purple
          : '#7634ec'
        : theme === 'dark'
          ? '#9c6ef7' // faded/completed color
          : '#7634ec',

    'line-width': variant === 'ACTIVE' ? 4 : 3,
    'line-opacity': variant === 'ACTIVE' ? 0.85 : 0.35,
  }

  /* ================================
     ADD LAYER
  ================================ */
  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint,
  })
}
