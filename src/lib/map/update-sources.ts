import maplibregl from 'maplibre-gl'

/* ================================
   Clear route sources (active & completed)
================================ */
export function clearRouteSources(map: maplibregl.Map) {
  const activeSource = map.getSource(
    'route-active-source',
  ) as maplibregl.GeoJSONSource
  if (activeSource) {
    activeSource.setData({
      type: 'FeatureCollection',
      features: [],
    })
  }
  const completedSource = map.getSource(
    'route-completed-source',
  ) as maplibregl.GeoJSONSource
  if (completedSource) {
    completedSource.setData({
      type: 'FeatureCollection',
      features: [],
    })
  }
}

/* ================================
   Clear truck, dropoff, pickup sources 
================================ */
export function clearTruckDropoffPickupSources(map: maplibregl.Map) {
  const truckSource = map.getSource('truck-source') as maplibregl.GeoJSONSource
  if (truckSource) {
    truckSource.setData({
      type: 'FeatureCollection',
      features: [],
    })
  }

  const dropoffSource = map.getSource(
    'dropoff-source',
  ) as maplibregl.GeoJSONSource
  if (dropoffSource) {
    dropoffSource.setData({
      type: 'FeatureCollection',
      features: [],
    })
  }

  const pickupSource = map.getSource(
    'pickup-source',
  ) as maplibregl.GeoJSONSource
  if (pickupSource) {
    pickupSource.setData({
      type: 'FeatureCollection',
      features: [],
    })
  }
}
