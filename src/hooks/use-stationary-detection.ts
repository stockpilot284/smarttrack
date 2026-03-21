/**
 * use-stationary-detection.ts
 *
 * Detects when a truck is connected but not moving.
 * This is completely separate from connection status — the transport can be
 * perfectly healthy while the truck is parked at a stop or in traffic.
 *
 * Source of truth: speedMs from GPS position updates.
 *
 * A truck is considered stationary when:
 *   - speedMs is 0 (or below the movement threshold) AND
 *   - it has remained so for at least stationaryThresholdMs (default 30s)
 *
 * This is intentionally lenient — brief stops at traffic lights should not
 * trigger the indicator. Only sustained stillness does.
 *
 * Usage:
 *   const { isStationary, notifySpeed } = useStationaryDetection()
 *
 *   // In onPositionUpdate:
 *   notifySpeed(speedMs)
 *
 *   // In UI:
 *   {isStationary && <StationaryIndicator />}
 */

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseStationaryDetectionOptions {
  /** Speed below which the truck is considered stationary (m/s). Default 0.5 m/s ≈ 1.8 km/h */
  movementThresholdMs?: number
  /** How long truck must be below threshold before isStationary becomes true. Default 30s */
  stationaryThresholdMs?: number
  /** Disable during terminal state */
  enabled?: boolean
  onStationary?: () => void
  onMoving?: () => void
}

interface UseStationaryDetectionReturn {
  isStationary: boolean
  /** Call with speedMs on every GPS position update */
  notifySpeed: (speedMs: number) => void
}

export function useStationaryDetection({
  movementThresholdMs = 0.5,
  stationaryThresholdMs = 30_000,
  enabled = true,
  onStationary,
  onMoving,
}: UseStationaryDetectionOptions = {}): UseStationaryDetectionReturn {
  const [isStationary, setIsStationary] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isStationaryRef = useRef(false)
  const onStationaryRef = useRef(onStationary)
  const onMovingRef = useRef(onMoving)

  useEffect(() => {
    onStationaryRef.current = onStationary
  }, [onStationary])
  useEffect(() => {
    onMovingRef.current = onMoving
  }, [onMoving])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const markMoving = useCallback(() => {
    clearTimer()
    if (isStationaryRef.current) {
      isStationaryRef.current = false
      setIsStationary(false)
      onMovingRef.current?.()
    }
  }, [clearTimer])

  const notifySpeed = useCallback(
    (speedMs: number) => {
      if (!enabled) return

      if (speedMs > movementThresholdMs) {
        // Truck is moving — clear any pending stationary timer
        markMoving()
        return
      }

      // Speed is at or below threshold — start the stationary timer if not already running
      if (!timerRef.current && !isStationaryRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          isStationaryRef.current = true
          setIsStationary(true)
          onStationaryRef.current?.()
        }, stationaryThresholdMs)
      }
    },
    [enabled, movementThresholdMs, stationaryThresholdMs, markMoving],
  )

  // Clean up timer on unmount or when disabled
  useEffect(() => {
    if (!enabled) {
      clearTimer()
      if (isStationaryRef.current) {
        isStationaryRef.current = false
        setIsStationary(false)
      }
    }
    return clearTimer
  }, [enabled, clearTimer])

  return { isStationary, notifySpeed }
}
