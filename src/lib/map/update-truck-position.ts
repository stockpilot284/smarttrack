import maplibregl from 'maplibre-gl'
import { createTruckFeature } from './truck-geojson'

export function updateTruckPosition(
  map: maplibregl.Map,
  lngLat: [number, number],
  bearing: number,
) {
  const source = map.getSource('truck-source') as maplibregl.GeoJSONSource
  if (!source) return

  source.setData(createTruckFeature(lngLat[0], lngLat[1], bearing))
}
