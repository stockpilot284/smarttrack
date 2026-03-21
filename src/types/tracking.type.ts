import { DriverAvailability } from './driver.type'
import { OrderItem, OrderStatus } from './order.type'
import { VehicleType } from './vehicle.type'

export type MapMarkerType = 'pickup' | 'dropoff' | 'truck'

export type MapMarker = {
  id: string
  type: MapMarkerType
  latitude: number
  longitude: number
  data?: Record<string, any>
}

// ─── Trip status — operational lifecycle ─────────────────────────────────────
// Answers: "Is this delivery run happening?"
// Owned by: Dispatcher
export type TrackingStatus =
  | 'ASSIGNED' // Driver allocated, truck not yet moving
  | 'IN_TRANSIT' // Truck actively moving, all tracking live
  | 'COMPLETED' // All stops done, trip finished — trips complete, not delivered
  | 'CANCELLED' // Deliberately stopped by dispatcher
  | 'FAILED' // Could not complete — system or operational failure

// ─── Stop status — physical visit lifecycle ──────────────────────────────────
// Answers: "Has the truck physically visited this location?"
// Owned by: GPS / tracking system
export type StopType = 'PICKUP' | 'DROPOFF'

export type StopStatus =
  | 'PENDING' // Not yet reached
  | 'IN_PROGRESS' // Truck arrived, driver working the stop
  | 'COMPLETED' // Stop successfully finished
  | 'FAILED' // Could not complete (no one home, wrong address, etc.)
  | 'SKIPPED' // Driver bypassed — flagged for retry

// ─── Failure and cancellation metadata ───────────────────────────────────────

export type TripFailureReasonCode =
  | 'GPS_LOST'
  | 'VEHICLE_BREAKDOWN'
  | 'MAX_ATTEMPTS_EXCEEDED'
  | 'TRIP_TIMEOUT'
  | 'DRIVER_INCIDENT'
  | 'OTHER'

export type StopFailureReasonCode =
  | 'NO_ONE_HOME'
  | 'WRONG_ADDRESS'
  | 'ACCESS_DENIED'
  | 'ITEM_DAMAGED'
  | 'CUSTOMER_REFUSED'
  | 'OTHER'

export interface TripFailureReason {
  code: TripFailureReasonCode
  message?: string
  failedAt: string // ISO timestamp
  reportedBy?: string // dispatcher ID or 'system'
}

export interface CancellationInfo {
  cancelledBy: string // dispatcher ID
  cancelledAt: string // ISO timestamp
  reason?: string
}

export interface StopFailureReason {
  code: StopFailureReasonCode
  message?: string
  failedAt: string // ISO timestamp
}

// ─── Shared structures ────────────────────────────────────────────────────────

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
  actualArrival?: string // ISO timestamp — set when IN_PROGRESS
  completedAt?: string // ISO timestamp — set when COMPLETED
  failureReason?: StopFailureReason
  skippedAt?: string // ISO timestamp — set when SKIPPED
  orderId?: string // which order this stop belongs to
  items: OrderItem[]
}

// ─── Main tracking item ───────────────────────────────────────────────────────

export interface TrackingItem {
  id: string
  type: 'order' | 'trip'
  reference: string // order number or trip ID
  status: TrackingStatus
  driver: DriverInfo
  vehicle: VehicleInfo
  stops: Stop[] // ordered sequence — always at least one
  createdAt: string // ISO timestamp
  startedAt?: string // ISO timestamp — set when IN_TRANSIT begins
  estimatedCompletion?: string // ISO timestamp — overall ETA
  completedAt?: string // ISO timestamp — set when COMPLETED
  progress: number // 0–100, resolved stops / total stops
  failureReason?: TripFailureReason
  cancellationInfo?: CancellationInfo
  orderId?: string // single order trips
  orderIds?: string[] // multi-stop trips
}

// ─── Status cascade helpers ───────────────────────────────────────────────────

/**
 * Derives the order status update from a stop completion event.
 * The tracking system reports physical events — the parent decides
 * what those events mean for the order.
 *
 *   PICKUP  completed → order is now IN_TRANSIT (truck has the item)
 *   DROPOFF completed → order is DELIVERED (customer received it)
 *   PICKUP  failed    → order stays ASSIGNED (never picked up)
 *   DROPOFF failed    → order is FAILED (could not deliver)
 *   DROPOFF skipped   → order stays IN_TRANSIT (will retry)
 */
export function deriveOrderStatusFromStop(
  stopType: StopType,
  stopStatus: StopStatus,
): OrderStatus | null {
  if (stopStatus === 'COMPLETED') {
    return stopType === 'PICKUP' ? 'IN_TRANSIT' : 'DELIVERED'
  }
  if (stopStatus === 'FAILED') {
    return stopType === 'PICKUP' ? 'ASSIGNED' : 'FAILED'
  }
  if (stopStatus === 'SKIPPED') {
    // Skipped dropoff — item still with driver, will retry
    return stopType === 'DROPOFF' ? 'IN_TRANSIT' : null
  }
  return null
}

/** Returns true for any terminal trip status — no further transitions possible */
export function isTripTerminal(status: TrackingStatus): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED' || status === 'FAILED'
}

/** Returns true if the trip should have an active GPS feed */
export function isTripTrackable(status: TrackingStatus): boolean {
  return status === 'ASSIGNED' || status === 'IN_TRANSIT'
}

/** Returns true if a stop is resolved — no further action needed */
export function isStopResolved(status: StopStatus): boolean {
  return status === 'COMPLETED' || status === 'FAILED' || status === 'SKIPPED'
}

/** Returns true if a stop still needs to be visited */
export function isStopPending(status: StopStatus): boolean {
  return status === 'PENDING' || status === 'IN_PROGRESS'
}
