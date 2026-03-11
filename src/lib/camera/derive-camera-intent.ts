import { TrackingOrder } from '@/types/tracking'
import { CameraIntent } from './camera.types'
import { OrderStatus } from '@/types/order.type'

export function deriveCameraIntent(order: TrackingOrder): CameraIntent {
  switch (order.status) {
    case 'ASSIGNED':
      return 'FOLLOW_TRUCK'

    case 'PICKED_UP':
      return 'FIT_ROUTE'

    case 'IN_TRANSIT':
      return 'FOLLOW_TRUCK'

    case 'DELIVERED':
      return 'FOLLOW_TRUCK'

    case 'CANCELLED':
    case 'FAILED':
      return 'FIT_ALL'

    default:
      return 'STATIC'
  }
}
