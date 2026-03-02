import maplibregl from 'maplibre-gl'
import { LngLat } from '@/lib/routing/routing.types'
import { RadarRouteResult } from '@/lib/routing/routing.types'

/* ================================
   Truck / Pickup / Dropoff / Routes
================================ */
export function updateTruckSource(
  map: maplibregl.Map,
  coord: LngLat,
  bearing: number,
) {
  const source = map.getSource('truck-source') as maplibregl.GeoJSONSource
  if (!source) return

  source.setData({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: coord },
        properties: { rotation: bearing },
      },
    ],
  })
}

export function updatePickupSource(map: maplibregl.Map, coord: LngLat | null) {
  const source = map.getSource('pickup-source') as maplibregl.GeoJSONSource
  if (!source) return

  source.setData({
    type: 'FeatureCollection',
    features: coord
      ? [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: coord },
            properties: {},
          },
        ]
      : [],
  })
}

export function updateDropoffSource(map: maplibregl.Map, coord: LngLat | null) {
  const source = map.getSource('dropoff-source') as maplibregl.GeoJSONSource
  if (!source) return

  source.setData({
    type: 'FeatureCollection',
    features: coord
      ? [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: coord },
            properties: {},
          },
        ]
      : [],
  })
}

export function updateRouteSource(
  map: maplibregl.Map,
  route: RadarRouteResult | null,
  variant: 'ACTIVE' | 'COMPLETED',
) {
  const sourceId =
    variant === 'ACTIVE' ? 'route-active-source' : 'route-completed-source'
  const source = map.getSource(sourceId) as maplibregl.GeoJSONSource
  if (!source) return

  if (!route) {
    source.setData({
      type: 'FeatureCollection',
      features: [],
    })
    return
  }

  source.setData(route)
}

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
