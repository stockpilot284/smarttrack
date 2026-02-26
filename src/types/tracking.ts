import { DriverAvailability } from './driver.type'
import { OrderStatus } from './order.type'

export type TrackingOrder = {
  id: string
  trackingNumber: string
  status: OrderStatus
  progress: number // 0–100

  driver: {
    id: string
    phone: string
    email: string
    name: string
    accuracy: number
    speed: number
    latitude: number
    longitude: number
    availability: DriverAvailability
  }

  stops: Array<{
    id: string
    address: string
    type: 'PICKUP' | 'DROPOFF'
    latitude: number
    longitude: number
    contactName: string
    contactPhone: string
  }>

  timeline: {
    id: string
    status: OrderStatus
    message: string
    timestamp: string
  }[]
}

export type LiveTracking = {
  orderId: string
  driverId: string

  location: {
    latitude: number
    longitude: number
    accuracy?: number
    speed?: number
    heading?: number
  }

  updatedAt: string // ISO timestamp
}

export type LineSegment = {
  from: [number, number] // [lng, lat]
  to: [number, number]
}

export type MapMarkerType = 'pickup' | 'dropoff' | 'truck'

export type MapMarker = {
  id: string
  type: MapMarkerType
  latitude: number
  longitude: number
  data?: Record<string, any>
}
