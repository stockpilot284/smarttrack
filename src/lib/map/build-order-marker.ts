import { TrackingOrder, MapMarker } from '@/types/tracking.type'
import { MapEntityVisibility } from './derive-map-entities'

export function buildOrderMarkers(
  order: TrackingOrder,
  visibility: MapEntityVisibility,
): MapMarker[] {
  const markers: MapMarker[] = []

  /* =============================
     TRUCK (Driver)
  ============================== */
  if (visibility.showTruck && order.vehicle) {
    markers.push({
      id: `truck-${order.vehicle.id}`,
      type: 'truck',
      latitude: order.vehicle.latitude,
      longitude: order.vehicle.longitude,
      data: {
        ...order.driver,
        orderStatus: order.status,
      },
    })
  }

  /* =============================
     STOPS (Pickup / Dropoff)
  ============================== */
  for (const stop of order.stops) {
    if (stop.type === 'PICKUP' && !visibility.showPickup) continue
    if (stop.type === 'DROPOFF' && !visibility.showDropoff) continue

    markers.push({
      id: `${stop.type.toLowerCase()}-${stop.id}`,
      type: stop.type === 'PICKUP' ? 'pickup' : 'dropoff',
      latitude: stop.latitude,
      longitude: stop.longitude,
      data: {
        ...stop,
        orderStatus: order.status,
      },
    })
  }

  return markers
}
