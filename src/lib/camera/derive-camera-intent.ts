import { TrackingOrder } from '@/types/tracking'
import { CameraIntent } from './camera.types'
import { OrderStatus } from '@/types/order.type'

export function deriveCameraIntent(order: TrackingOrder): CameraIntent {
  switch (order.status) {
    case OrderStatus.ASSIGNED:
      return 'FIT_ALL'

    case OrderStatus.PICKED_UP:
      return 'FIT_ROUTE'

    case OrderStatus.IN_TRANSIT:
      return 'FOLLOW_TRUCK'

    case OrderStatus.DELIVERED:
    case OrderStatus.CANCELLED:
    case OrderStatus.FAILED:
      return 'FIT_ALL'

    default:
      return 'STATIC'
  }
}
