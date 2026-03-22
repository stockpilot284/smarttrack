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
//
// Cancellation rule:
//   ASSIGNED   → cancellable (no goods collected, full rollback is safe)
//   IN_TRANSIT → NOT cancellable (goods physically on truck — use order-level
//                cancel instead; trip must complete or fail naturally)
//   All others → terminal, no transitions possible
export type TrackingStatus =
  | 'ASSIGNED' // Driver allocated, truck not yet moving
  | 'IN_TRANSIT' // Truck actively moving, all tracking live — NOT cancellable
  | 'COMPLETED' // All stops done, trip finished
  | 'CANCELLED' // Deliberately stopped — only valid from ASSIGNED
  | 'FAILED' // Could not complete — system or operational failure

// ─── Stop status — physical visit lifecycle ───────────────────────────────────
// Answers: "Has the truck physically visited this location?"
// Owned by: GPS / tracking system
export type StopType = 'PICKUP' | 'DROPOFF'

export type StopStatus =
  | 'PENDING' // Not yet reached
  | 'IN_PROGRESS' // Truck arrived, driver working the stop
  | 'COMPLETED' // Stop successfully finished
  | 'FAILED' // Could not complete (no one home, wrong address, etc.)
  | 'SKIPPED' // Driver bypassed — flagged for retry
  | ''

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

export type SkippedReasonCode = 'ORDER_CANCELLED' | 'DISPATCHER_SKIP'

export interface TripFailureReason {
  code: TripFailureReasonCode
  message?: string
  failedAt: string // ISO timestamp
  reportedBy?: string // dispatcher ID or 'system'
}

export interface CancellationInfo {
  cancelledBy: string // dispatcher ID
  cancelledAt: string // ISO timestamp
  /**
   * Required — cancellation is only permitted on ASSIGNED trips where the
   * dispatcher always has a clear reason (wrong driver, vehicle issue, etc.)
   * IN_TRANSIT trips cannot be cancelled; order-level cancel handles those.
   */
  reason: string
}

export interface StopFailureReason {
  code: StopFailureReasonCode
  message?: string
  failedAt: string // ISO timestamp
}

export interface SkippedReason {
  code: SkippedReasonCode
  message?: string
  skippedAt: string // ISO timestamp
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

// ─── Stop ─────────────────────────────────────────────────────────────────────
// A single physical visit point in the trip sequence.
// One Stop = one location the truck visits (either a pickup OR a dropoff).

export interface Stop {
  id: string
  type: StopType
  status: StopStatus
  address: string
  latitude: number
  longitude: number
  contactName: string
  contactPhone: string
  estimatedArrival?: string // ISO — from route planning
  actualArrival?: string // ISO — set when IN_PROGRESS
  completedAt?: string // ISO — set when COMPLETED
  skippedAt?: string // ISO — set when SKIPPED
  failureReason?: StopFailureReason
  skippedReason?: SkippedReason
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
  progress: number // 0–100: resolved stops / total stops
  failureReason?: TripFailureReason
  cancellationInfo?: CancellationInfo
  orderId?: string // single-order trips
  orderIds?: string[] // multi-stop trips
}

// ─── Status cascade helpers ───────────────────────────────────────────────────

/**
 * Derives the order status update from a stop completion event.
 *
 *   PICKUP  completed → IN_TRANSIT  (truck has the item)
 *   DROPOFF completed → DELIVERED   (customer received it)
 *   PICKUP  failed    → ASSIGNED    (never picked up)
 *   DROPOFF failed    → FAILED      (could not deliver)
 *   DROPOFF skipped   → IN_TRANSIT  (will retry)
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

/**
 * Returns true if the trip can be cancelled by a dispatcher.
 * Only ASSIGNED trips are cancellable — IN_TRANSIT trips have goods physically
 * on the truck and must be resolved via order-level cancellation instead.
 */
export function isTripCancellable(status: TrackingStatus): boolean {
  return status === 'ASSIGNED'
}

/** Returns true if a stop is resolved — no further action needed */
export function isStopResolved(status: StopStatus): boolean {
  return status === 'COMPLETED' || status === 'FAILED' || status === 'SKIPPED'
}

/** Returns true if a stop still needs to be visited */
export function isStopPending(status: StopStatus): boolean {
  return status === 'PENDING' || status === 'IN_PROGRESS'
}

/** Returns the next unresolved stop, or null if all stops are done */
export function getActiveStop(stops: Stop[]): Stop | null {
  return stops.find((s) => isStopPending(s.status)) ?? null
}
