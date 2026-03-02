// lib/map/add-layers.ts
import maplibregl from 'maplibre-gl'

export type MapTheme = 'light' | 'dark'

/**
 * Adds route layers (active and completed) to the map.
 * Assumes the corresponding sources have been added via addMapSources.
 */
export function addMapLayers(map: maplibregl.Map, theme: MapTheme) {
  /* ================================
     ROUTE LAYERS
  ================================ */
  const routeLayers = [
    {
      id: 'route-active',
      color: theme === 'dark' ? '#9c6ef7' : '#7634ec',
      width: 4,
      opacity: 0.85,
    },
    {
      id: 'route-completed',
      color: theme === 'dark' ? '#9c6ef7' : '#7634ec',
      width: 3,
      opacity: 0.35,
    },
  ] as const

  routeLayers.forEach(({ id, color, width, opacity }) => {
    if (!map.getLayer(id)) {
      map.addLayer({
        id,
        type: 'line',
        source: `${id}-source`,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': color,
          'line-width': width,
          'line-opacity': opacity,
        },
      })
    }
  })
}
