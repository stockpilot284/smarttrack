import { OrderStatus } from '@/types/order.type'
import { TrackingOrder } from '@/types/tracking'

export type RouteMode = 'NONE' | 'TO_PICKUP' | 'IN_TRANSIT' | 'COMPLETED'

export type MapEntityVisibility = {
  showPickup: boolean
  showDropoff: boolean
  showTruck: boolean
  routeMode: RouteMode
}

export function deriveMapEntities(
  trackingOrder: TrackingOrder,
): MapEntityVisibility {
  switch (trackingOrder.status) {
    case OrderStatus.ASSIGNED:
      return {
        showPickup: true,
        showTruck: true,
        showDropoff: false,
        routeMode: 'TO_PICKUP',
      }

    case OrderStatus.PICKED_UP:
    case OrderStatus.IN_TRANSIT:
      return {
        showPickup: true,
        showTruck: true,
        showDropoff: true,
        routeMode: 'IN_TRANSIT',
      }

    case OrderStatus.DELIVERED:
      return {
        showPickup: true,
        showDropoff: true,
        showTruck: false,
        routeMode: 'COMPLETED',
      }

    case OrderStatus.CANCELLED:
    case OrderStatus.FAILED:
      return {
        // 📌 Show context only — no routing, no movement
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
