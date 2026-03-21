/**
 * use-trip-completion.ts
 *
 * Handles all terminal trip states:
 *   COMPLETED  — all stops resolved + truck near end of route
 *   FAILED     — detected externally via trip.status prop
 *   CANCELLED  — detected externally via trip.status prop
 *
 * Note: trips COMPLETE, orders get DELIVERED. These are separate lifecycles.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { RouteGeometry } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import {
  TrackingStatus,
  TripFailureReason,
  CancellationInfo,
  isTripTerminal,
} from '@/types/tracking.type'

const COMPLETION_THRESHOLD = 0.98

export interface TripSummary {
  stopsDelivered: number
  totalStops: number
  tripDuration: string
  totalDistanceKm: string
  averageSpeedKmh: string
  deviationCount: number
  completedAt: Date
}

export type TerminalState =
  | { type: 'completed'; summary: TripSummary }
  | { type: 'failed'; reason?: TripFailureReason; partialSummary: TripSummary }
  | { type: 'cancelled'; info?: CancellationInfo }
  | null

interface UseTripCompletionOptions {
  motionRef: React.RefObject<TruckMotionState | null>
  routeGeometry: RouteGeometry | null
  visitedStopIds: React.RefObject<Set<string>>
  totalStops: number
  tripStatus: TrackingStatus
  failureReason?: TripFailureReason
  cancellationInfo?: CancellationInfo
  deviationCountRef: React.RefObject<number>
  tripStartedAt: Date | null
  onTripComplete: (summary: TripSummary) => void
  onTripFailed: (reason?: TripFailureReason) => void
  onTripCancelled: (info?: CancellationInfo) => void
}

interface UseTripCompletionReturn {
  terminalState: TerminalState
  isTerminal: boolean
  notifyDeviation: () => void
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

function formatDistance(metres: number): string {
  return `${(metres / 1000).toFixed(1)} km`
}

function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`
}

export function useTripCompletion({
  motionRef,
  routeGeometry,
  visitedStopIds,
  totalStops,
  tripStatus,
  failureReason,
  cancellationInfo,
  deviationCountRef,
  tripStartedAt,
  onTripComplete,
  onTripFailed,
  onTripCancelled,
}: UseTripCompletionOptions): UseTripCompletionReturn {
  const [terminalState, setTerminalState] = useState<TerminalState>(null)
  const hasFiredRef = useRef(false)
  const deviationCountInternalRef = useRef(0)
  const speedSamplesRef = useRef<number[]>([])

  const onTripCompleteRef = useRef(onTripComplete)
  const onTripFailedRef = useRef(onTripFailed)
  const onTripCancelledRef = useRef(onTripCancelled)
  useEffect(() => {
    onTripCompleteRef.current = onTripComplete
    onTripFailedRef.current = onTripFailed
    onTripCancelledRef.current = onTripCancelled
  })

  // Reset on route change — handles reroutes mid-trip
  useEffect(() => {
    if (!routeGeometry) return
    hasFiredRef.current = false
    speedSamplesRef.current = []
  }, [routeGeometry])

  const buildSummary = useCallback((): TripSummary => {
    const completedAt = new Date()
    const durationMs = tripStartedAt
      ? completedAt.getTime() - tripStartedAt.getTime()
      : 0
    const samples = speedSamplesRef.current
    const avgSpeedKmh =
      samples.length > 0
        ? samples.reduce((a, b) => a + b, 0) / samples.length
        : 0
    const totalLength = routeGeometry?.totalLength ?? 0

    return {
      stopsDelivered: visitedStopIds.current.size,
      totalStops,
      tripDuration: durationMs > 0 ? formatDuration(durationMs) : '—',
      totalDistanceKm: formatDistance(totalLength),
      averageSpeedKmh: formatSpeed(avgSpeedKmh),
      deviationCount:
        deviationCountRef.current ?? deviationCountInternalRef.current,
      completedAt,
    }
  }, [
    tripStartedAt,
    routeGeometry,
    visitedStopIds,
    totalStops,
    deviationCountRef,
  ])

  const stopMotion = useCallback(() => {
    const motion = motionRef.current
    if (!motion) return
    motion.targetDistance = 0
    motion.distanceAlongRoute = 0
    motion.speed = 0
  }, [motionRef])

  // Speed sampling
  useEffect(() => {
    if (!routeGeometry || terminalState) return
    const interval = setInterval(() => {
      const speed = motionRef.current?.speed ?? 0
      if (speed > 0) speedSamplesRef.current.push(speed * 3.6)
    }, 1_000)
    return () => clearInterval(interval)
  }, [routeGeometry, motionRef, terminalState])

  // React to FAILED or CANCELLED arriving via trip.status prop
  useEffect(() => {
    if (hasFiredRef.current) return
    if (!isTripTerminal(tripStatus)) return
    if (tripStatus === 'COMPLETED') return // handled by completion check below

    hasFiredRef.current = true
    stopMotion()

    if (tripStatus === 'FAILED') {
      const partial = buildSummary()
      setTerminalState({
        type: 'failed',
        reason: failureReason,
        partialSummary: partial,
      })
      onTripFailedRef.current(failureReason)
    }

    if (tripStatus === 'CANCELLED') {
      setTerminalState({ type: 'cancelled', info: cancellationInfo })
      onTripCancelledRef.current(cancellationInfo)
    }
  }, [tripStatus, failureReason, cancellationInfo, stopMotion, buildSummary])

  // Local detection for COMPLETED — distance + all stops resolved
  useEffect(() => {
    if (!routeGeometry || terminalState) return

    const check = setInterval(() => {
      if (hasFiredRef.current) return

      const motion = motionRef.current
      if (!motion) return

      const { totalLength } = routeGeometry
      const distanceComplete =
        motion.distanceAlongRoute >= totalLength * COMPLETION_THRESHOLD
      const stopsComplete = visitedStopIds.current.size >= totalStops

      if (!distanceComplete || !stopsComplete) return

      hasFiredRef.current = true
      stopMotion()

      const summary = buildSummary()
      setTerminalState({ type: 'completed', summary })
      onTripCompleteRef.current(summary)
    }, 500)

    return () => clearInterval(check)
  }, [
    routeGeometry,
    motionRef,
    visitedStopIds,
    totalStops,
    terminalState,
    stopMotion,
    buildSummary,
  ])

  const notifyDeviation = useCallback(() => {
    deviationCountInternalRef.current += 1
  }, [])

  return {
    terminalState,
    isTerminal: terminalState !== null,
    notifyDeviation,
  }
}
