import maplibregl from 'maplibre-gl'

export function fitBounds(
  map: maplibregl.Map,
  bounds: maplibregl.LngLatBoundsLike,
) {
  map.fitBounds(bounds, {
    padding: 80,
    duration: 800,
  })
}

export function focusPoint(map: maplibregl.Map, coord: [number, number]) {
  map.easeTo({
    center: coord,
    zoom: 14,
    duration: 600,
  })
}

export function followTruck(map: maplibregl.Map, coord: [number, number]) {
  map.easeTo({
    center: coord,
    zoom: Math.max(map.getZoom(), 13),
    duration: 500,
  })
}
