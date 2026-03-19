import { TrackingOrder } from '@/types/tracking.type'

export type RouteMode =
  | 'NONE'
  | 'TO_PICKUP'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'TO_DROPOFF'
  | 'ACTIVE'

export type MapEntityVisibility = {
  showPickup: boolean
  showDropoff: boolean
  showTruck: boolean
  routeMode: RouteMode
}

export function deriveMapEntities(
  trackingOrder: TrackingOrder,
  isReplaying: boolean = false,
): MapEntityVisibility {
  switch (trackingOrder.status) {
    case 'ASSIGNED':
      return {
        showPickup: true,
        showTruck: true,
        showDropoff: false,
        routeMode: 'TO_PICKUP',
      }

    case 'PICKED_UP':
    case 'IN_TRANSIT':
      return {
        showPickup: true,
        showTruck: true,
        showDropoff: true,
        routeMode: 'IN_TRANSIT',
      }

    case 'DELIVERED':
      return {
        showPickup: true,
        showDropoff: true,
        showTruck: isReplaying, // only show truck during replay
        routeMode: 'COMPLETED',
      }

    case 'CANCELLED':
    case 'FAILED':
      return {
        showPickup: true,
        showDropoff: true,
        showTruck: false,
        routeMode: 'NONE',
      }

    default:
      return {
        showPickup: false,
        showDropoff: false,
        showTruck: false,
        routeMode: 'NONE',
      }
  }
}
