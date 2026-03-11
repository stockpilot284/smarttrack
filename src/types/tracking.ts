import { DriverAvailability } from './driver.type'
import { OrderStatus } from './order.type'
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
