import { OrderStatus } from '@/types/order.type'

export const events = [
  {
    id: '1',
    message: 'Order Created',
    timestamp: '2026-02-15T08:20:00Z',
    status: OrderStatus.CREATED,
  },
  {
    id: '2',
    message: 'Order Assigned to Driver',
    timestamp: '2026-02-15T08:40:00Z',
    status: OrderStatus.ASSIGNED,
  },
  {
    id: '3',
    message: 'Order Picked Up',
    timestamp: '2026-02-15T10:00:00Z',
    status: OrderStatus.PICKED_UP,
  },
  {
    id: '4',
    message: 'In Transit',
    timestamp: '2026-02-15T11:15:00Z',
    status: OrderStatus.IN_TRANSIT,
  },
]
