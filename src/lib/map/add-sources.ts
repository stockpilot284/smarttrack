import maplibregl from 'maplibre-gl'

/* ================================
   ADD SOURCES (only for routes)
================================ */
export function addMapSources(map: maplibregl.Map) {
  /* ------------------------------
     ROUTE SOURCES
  ------------------------------ */
  const routeSources = ['route-active', 'route-completed'] as const
  routeSources.forEach((id) => {
    const sourceId = `${id}-source`
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })
    }
  })
}
