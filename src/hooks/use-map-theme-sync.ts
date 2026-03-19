// hooks/use-map-theme-sync.ts
import { useEffect } from 'react'
import maplibregl from 'maplibre-gl'

export function useMapThemeSync(
  mapInstance: React.RefObject<maplibregl.Map | null>,
  theme: string | undefined,
  mapStyleUrl: string,
) {
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !mapStyleUrl) return

    const center = map.getCenter()
    const zoom = map.getZoom()
    const bearing = map.getBearing()
    const pitch = map.getPitch()

    const onStyleLoad = () => {
      map.jumpTo({ center, zoom, bearing, pitch })
    }

    map.once('styledata', onStyleLoad)
    map.setStyle(mapStyleUrl)

    return () => {
      map.off('styledata', onStyleLoad)
    }
  }, [theme, mapInstance, mapStyleUrl]) // depends on theme
}
