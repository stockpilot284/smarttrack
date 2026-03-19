// hooks/use-trip-markers.ts
import { useCallback, useRef, useEffect } from 'react'
import maplibregl from 'maplibre-gl'
import { Stop } from '@/types/tracking.type'
import { stopMarkerSVG } from '@/lib/map/stop-markers'
import { createMarkerPopup } from '@/lib/map/create-marker-popup'

interface UseTripMarkersProps {
  map: maplibregl.Map | null
  isMapLoaded: boolean
  stops: Stop[]
  theme: 'light' | 'dark'
  highlightedStopId?: string | null
}

export function useTripMarkers({
  map,
  isMapLoaded,
  stops,
  theme,
  highlightedStopId,
}: UseTripMarkersProps) {
  const markersRef = useRef<maplibregl.Marker[]>([])
  const activePopupRef = useRef<maplibregl.Popup | null>(null)

  const renderMarkers = useCallback(() => {
    if (!map || !isMapLoaded || stops.length === 0) return

    // Remove old markers (they are removed from map automatically)
    markersRef.current.forEach((m) => {
      try {
        m.remove()
      } catch (err) {
        console.warn('Error removing marker:', err)
      }
    })
    markersRef.current = []

    // Create and add new markers
    stops.forEach((stop) => {
      const el = document.createElement('div')
      el.innerHTML = stopMarkerSVG(stop.type, stop.status, theme)
      el.className = 'cursor-pointer'
      el.style.pointerEvents = 'auto'
      el.style.background = 'none'
      el.style.boxShadow = 'none'

      if (stop.id === highlightedStopId) {
        el.style.transform = 'scale(1.2)'
        el.style.zIndex = '10'
      } else {
        el.style.zIndex = '5'
      }

      const popup = createMarkerPopup('stop', stop, theme)
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([stop.longitude, stop.latitude])
        .setPopup(popup)
        .addTo(map)

      /* =============================
         CLICK HANDLER
      ============================== */
      el.addEventListener('click', (e) => {
        e.stopPropagation()

        // Close previously open popup
        if (activePopupRef.current) {
          activePopupRef.current.remove()
        }

        // Toggle this marker's popup
        marker.togglePopup()
        activePopupRef.current = marker.getPopup()
      })

      markersRef.current.push(marker)
    })

    // Force a resize to ensure correct positioning
    map.resize()
  }, [map, isMapLoaded, stops, theme, highlightedStopId])

  useEffect(() => {
    renderMarkers()
  }, [renderMarkers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activePopupRef.current) {
        activePopupRef.current.remove()
      }
      markersRef.current.forEach((m) => {
        try {
          m.remove()
        } catch (err) {
          // Ignore errors during unmount
        }
      })
      markersRef.current = []
    }
  }, [])
}
