import { DriverAvailability } from './driver.type'
import { OrderItem, OrderStatus } from './order.type'
import { VehicleType } from './vehicle.type'

/* ================================
   TRACKING ORDER
================================ */

export type LocationPing = {
  latitude: number
  longitude: number
  timestamp: string // ISO string
  heading?: number
  speed?: number
}

export type TrackingOrder = {
  id: string
  trackingNumber: string
  status: OrderStatus
  progress: number // 0–100

  /* ---------- DRIVER ---------- */
  driver: {
    id: string
    phone: string
    email: string
    name: string
    availability: DriverAvailability
  }

  /* ---------- VEHICLE ---------- */
  vehicle: {
    id: string
    type: VehicleType
    model: string
    plateNumber: string
    imageUrl?: string

    // live telemetry (current position)
    latitude: number
    longitude: number
    speed?: number
    heading?: number
    accuracy?: number
  }

  /* ---------- STOPS ---------- */
  stops: Array<{
    id: string
    address: string
    type: 'PICKUP' | 'DROPOFF'
    latitude: number
    longitude: number
    contactName: string
    contactPhone: string
  }>

  /* ---------- TIMELINE ---------- */
  timeline: {
    id: string
    status: OrderStatus
    message: string
    timestamp: string
  }[]

  /* ---------- LOCATION HISTORY (for replay) ---------- */
  locationHistory?: LocationPing[] // only present for delivered orders
}

export type MapMarkerType = 'pickup' | 'dropoff' | 'truck'

export type MapMarker = {
  id: string
  type: MapMarkerType
  latitude: number
  longitude: number
  data?: Record<string, any>
}

// ---------- Enums ----------
export type TrackingStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
export type StopType = 'PICKUP' | 'DROPOFF'
export type StopStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

// ---------- Shared structures ----------
export interface DriverInfo {
  id: string
  name: string
  phone: string
  email: string
  availability: DriverAvailability
  imageUrl?: string
}

export interface VehicleInfo {
  id: string
  type: VehicleType
  model: string
  plateNumber: string
  imageUrl?: string
  // live telemetry
  latitude: number
  longitude: number
  speed?: number
  heading?: number
}

export interface Stop {
  id: string
  type: StopType
  address: string
  latitude: number
  longitude: number
  contactName: string
  contactPhone: string
  status: StopStatus
  estimatedArrival?: string // ISO timestamp
  actualArrival?: string
  completedAt?: string
  orderId?: string
  items: OrderItem[]
}

// ---------- Main tracking item ----------
export interface TrackingItem {
  id: string
  type: 'order' | 'trip' // discriminator
  reference: string // order number or trip ID
  status: TrackingStatus
  driver: DriverInfo
  vehicle: VehicleInfo
  stops: Stop[] // always at least one stop
  createdAt: string
  estimatedCompletion?: string // overall ETA
  progress: number // 0–100, e.g., completed stops / total stops
  // for single orders
  orderId?: string
  // for multi‑stop trips
  orderIds?: string[] // all orders involved
}
