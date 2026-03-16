import { useCallback, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { TrackingOrder } from '@/types/tracking'
import { buildOrderMarkers } from '@/lib/map/build-order-marker'
import { renderMarkers } from '@/lib/map/render-markers'
import { deriveMapEntities } from '@/lib/map/derive-map-entities'

interface UseMapMarkersProps {
  mapInstance: React.RefObject<maplibregl.Map | null>
  resolvedTheme: 'light' | 'dark'
  isReplaying: boolean
}

export function useMapMarkers({
  mapInstance,
  resolvedTheme,
  isReplaying,
}: UseMapMarkersProps) {
  const markersRef = useRef<{
    all: maplibregl.Marker[]
    truck?: maplibregl.Marker
  }>({ all: [] })

  const updateMarkers = useCallback(
    (order: TrackingOrder) => {
      const map = mapInstance.current
      if (!map) return

      markersRef.current.all.forEach((marker) => marker.remove())
      markersRef.current = { all: [] }

      const mapEntities = deriveMapEntities(order, isReplaying)
      const markerData = buildOrderMarkers(order, mapEntities)
      const rendered = renderMarkers(map, markerData, resolvedTheme)
      markersRef.current = rendered
    },
    [mapInstance, resolvedTheme, isReplaying],
  )

  return { markersRef, updateMarkers }
}
