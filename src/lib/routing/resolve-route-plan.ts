import { OrderStatus } from '@/types/order.type'
import { RoutePlan } from './routing.types'
import { fetchRadarRoute } from './fetch-radar-route'

export function resolveRoutePlan(params: {
  status: OrderStatus
  truck: [number, number]
  pickup?: [number, number]
  dropoff?: [number, number]
}): RoutePlan {
  const { status, truck, pickup, dropoff } = params

  switch (status) {
    case OrderStatus.ASSIGNED:
      if (!pickup) return {}
      return {
        active: fetchRadarRoute({
          truck,
          pickup,
          mode: 'TO_PICKUP',
        }),
      }

    case OrderStatus.IN_TRANSIT:
      if (!pickup || !dropoff) return {}
      return {
        completed: fetchRadarRoute({
          pickup,
          truck,
          mode: 'COMPLETED',
        }),
        active: fetchRadarRoute({
          truck,
          dropoff,
          mode: 'TO_DROPOFF',
        }),
      }

    case OrderStatus.DELIVERED:
      if (!pickup || !dropoff) return {}
      return {
        completed: fetchRadarRoute({
          pickup,
          truck: dropoff,
          mode: 'COMPLETED',
        }),
      }

    default:
      return {}
  }
}
