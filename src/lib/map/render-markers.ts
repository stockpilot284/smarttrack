import maplibregl from 'maplibre-gl'
import { MapMarker } from '@/types/tracking'
import { dropoffSVG, pickupSVG, truckSVG } from './map-markers'
import { createMarkerPopup } from './create-marker-popup'

export function renderMarkers(
  map: maplibregl.Map,
  markers: MapMarker[],
  theme: 'light' | 'dark',
) {
  let activePopup: maplibregl.Popup | null = null
  let truckMarker: maplibregl.Marker | undefined
  const _markers: maplibregl.Marker[] = []

  markers.map((marker) => {
    const el = document.createElement('div')
    el.className = 'map-marker cursor-pointer'
    el.style.pointerEvents = 'auto'
    el.style.background = 'none'
    el.style.boxShadow = 'none'

    /* =============================
       SVG MARKER
    ============================== */
    if (marker.type === 'pickup') el.innerHTML = pickupSVG(theme)
    if (marker.type === 'dropoff') el.innerHTML = dropoffSVG(theme)
    if (marker.type === 'truck') el.innerHTML = truckSVG(theme)

    el.querySelector('svg')?.setAttribute('pointer-events', 'none')

    /* =============================
       POPUP
    ============================== */
    const popup = createMarkerPopup(marker.type, marker.data, theme)

    const mapMarker = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([marker.longitude, marker.latitude])
      .addTo(map)

    if (marker.type === 'truck') {
      truckMarker = mapMarker
    }

    /* =============================
       CLICK HANDLER
    ============================== */
    el.addEventListener('click', (e) => {
      e.stopPropagation()

      // Close previously open popup
      if (activePopup && activePopup !== popup) {
        activePopup.remove()
      }

      popup.setLngLat([marker.longitude, marker.latitude]).addTo(map)
      activePopup = popup
    })

    _markers.push(mapMarker)

    return mapMarker
  })

  return { all: _markers, truck: truckMarker }
}
