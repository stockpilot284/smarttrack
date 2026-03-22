import { SelectedLocation } from './location.type'
import { VehicleType } from './vehicle.type'

type OrderCancellation = {
  cancelledBy: string // dispatcher user id
  cancelledAt: string // ISO timestamp
  reason: string
  hadActivePickup: boolean // true if pickup was already COMPLETED
}

export type OrderStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'DELETED'
  | 'FAILED'

export type OrderTable = {
  orderRef: string
  customer: string
  driver?: string
  createdAt: string
  status: OrderStatus
  vehicle?: string
  dropOffLocation: string
  pickupLocation: string
  tripId?: string
}

export type OrdersTableProps = {
  data: OrderTable[]
  enableSearchAndFilter?: boolean
  enableRowSelection?: boolean
  enableActionsColumn?: boolean
  enablePagination?: boolean
}

export type DeliveryTiming = 'SCHEDULED' | 'SEND_NOW'
export type OrderPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export type OrderItem = {
  id?: string
  quantity: number
  name: string
  description?: string
}
export type Order = {
  id: string
  orderReference?: string
  customerName: string
  customerEmail: string
  pickupLocation: SelectedLocation | null
  pickupContactName: string
  pickupContactPhone: string
  dropoffLocation: SelectedLocation | null
  recipientName: string
  recipientPhone: string
  deliveryTiming: DeliveryTiming
  customerPhone: string
  priority?: OrderPriority
  tripId?: string
  orderLabel?: string
  packageWeight?: string
  deliveryNotes?: string
  scheduledPickupAt?: string
  status?: OrderStatus
  createdAt?: string
  estimatedArrival?: string
  items: OrderItem[]
  driver?: {
    name: string
    phone: string
    imageUrl?: string
  }
  vehicle?: {
    model: string
    plateNumber: string
    type: VehicleType
    imageUrl?: string
  }
  orderCancellation?: OrderCancellation
  proofOfDelivery?: {
    type: 'signature' | 'photo' | 'both'
    url: string
  }
}

type InputOrderField = Exclude<
  keyof Order,
  'pickupLocation' | 'dropoffLocation' | 'deliveryTiming' | 'items'
>

export type OrderField = {
  name: InputOrderField
  label: string
  placeholder?: string
  required?: boolean
}

export const OrderStatuses: OrderStatus[] = [
  'CREATED',
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]
