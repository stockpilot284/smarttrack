import { SelectedLocation } from './location.type'

export enum OrderStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export type OrderTable = {
  orderRef: string
  customer: string
  driver: string
  createdAt: string
  status: OrderStatus
  vehicle: string
  dropOffLocation: string
  pickupLocation: string
}

export type OrdersTableProps = {
  data: OrderTable[]
  enableSearchAndFilter?: boolean
  enableRowSelection?: boolean
  enableActionsColumn?: boolean
  enablePagination?: boolean
}

export enum DeliveryTiming {
  SCHEDULED = 'SCHEDULED',
  SEND_NOW = 'SEND_NOW',
}

export type OrderItem = {
  quantity: number
  name: string
  description?: string
}
export type Order = {
  customerName: string
  customerEmail: string
  pickupLocation: SelectedLocation | null
  pickupContactName: string
  pickupContactPhone: string
  dropoffLocation: SelectedLocation | null
  recipientName: string
  recipientPhone: string
  deliveryTiming: DeliveryTiming
  customerPhone?: string
  orderLabel?: string
  packageWeight?: string
  deliveryNotes?: string
  externalReference?: string
  scheduledPickupAt?: string
  status?: OrderStatus
  createdAt?: string
  estimatedArrival?: string
  items: OrderItem[]
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
