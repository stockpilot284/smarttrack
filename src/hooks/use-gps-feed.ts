/**
 * use-gps-feed.ts
 *
 * Connects to the GPS feed via WebSocket with automatic fallback to HTTP
 * polling. Exposes a shutdown() function so the caller can explicitly
 * disconnect when the trip reaches a terminal state (DELIVERED, FAILED,
 * CANCELLED) — passing an empty tripId alone does not disconnect an
 * already-running feed.
 */

import { useEffect, useRef, useCallback } from 'react'
import { RouteGeometry, LngLat } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { projectPointOntoRoute } from '@/lib/routing/point-to-route-distance'
import { GPSWebSocket } from '@/lib/gps/gps-websocket'
import { GPSPoller } from '@/lib/gps/gps-poller'
import { GPSPayload } from '@/lib/gps/gps-feed.types'

const WS_BASE_URL = import.meta.env.VITE_GPS_WS_URL ?? 'wss://yourapi/ws/trips'
const WS_CONNECT_TIMEOUT_MS = 5_000

interface UseGPSFeedOptions {
  tripId: string
  token: string
  routeGeometry: RouteGeometry | null
  motionRef: React.RefObject<TruckMotionState | null>
  onPositionUpdate?: (lngLat: LngLat, bearing: number, speedMs: number) => void
  pollIntervalMs?: number
}

interface UseGPSFeedReturn {
  /** Immediately disconnects WebSocket and stops polling. Safe to call multiple times. */
  shutdown: () => void
}

export function useGPSFeed({
  tripId,
  token,
  routeGeometry,
  motionRef,
  onPositionUpdate,
  pollIntervalMs = 5_000,
}: UseGPSFeedOptions): UseGPSFeedReturn {
  const wsRef = useRef<GPSWebSocket | null>(null)
  const pollerRef = useRef<GPSPoller | null>(null)
  const wsConnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isShutDownRef = useRef(false)

  const routeGeometryRef = useRef(routeGeometry)
  const onPositionUpdateRef = useRef(onPositionUpdate)
  useEffect(() => {
    routeGeometryRef.current = routeGeometry
    onPositionUpdateRef.current = onPositionUpdate
  })

  const stopPolling = useCallback(() => {
    pollerRef.current?.stop()
    pollerRef.current = null
  }, [])

  const stopWebSocket = useCallback(() => {
    if (wsConnectTimerRef.current) {
      clearTimeout(wsConnectTimerRef.current)
      wsConnectTimerRef.current = null
    }
    wsRef.current?.disconnect()
    wsRef.current = null
  }, [])

  // Exposed shutdown — stops everything immediately and prevents reconnects
  const shutdown = useCallback(() => {
    if (isShutDownRef.current) return
    isShutDownRef.current = true
    stopWebSocket()
    stopPolling()
    console.log('[useGPSFeed] Feed shut down')
  }, [stopWebSocket, stopPolling])

  const handlePayload = useCallback(
    (payload: GPSPayload) => {
      // Ignore any late-arriving packets after shutdown
      if (isShutDownRef.current) return

      const geometry = routeGeometryRef.current
      const motion = motionRef.current
      const lngLat: LngLat = [payload.longitude, payload.latitude]

      if (geometry && motion) {
        const distanceAlongRoute = projectPointOntoRoute(lngLat, geometry)
        if (distanceAlongRoute > motion.targetDistance) {
          motion.targetDistance = distanceAlongRoute
          motion.speed = payload.speed > 0 ? payload.speed : motion.speed
        }
      }

      onPositionUpdateRef.current?.(lngLat, payload.bearing, payload.speed)
    },
    [motionRef],
  )

  const startPolling = useCallback(() => {
    if (pollerRef.current || isShutDownRef.current) return
    console.log('[useGPSFeed] Starting polling fallback')

    pollerRef.current = new GPSPoller({
      tripId,
      token,
      intervalMs: pollIntervalMs,
      onMessage: handlePayload,
      onError: (err) => console.error('[useGPSFeed] Poll error:', err),
    })
    pollerRef.current.start()
  }, [tripId, token, pollIntervalMs, handlePayload])

  const startWebSocket = useCallback(() => {
    if (isShutDownRef.current) return

    wsRef.current = new GPSWebSocket({
      url: `${WS_BASE_URL}/${tripId}`,
      token,
      onMessage: (payload) => {
        if (wsConnectTimerRef.current) {
          clearTimeout(wsConnectTimerRef.current)
          wsConnectTimerRef.current = null
        }
        stopPolling()
        handlePayload(payload)
      },
      onOpen: () => console.log('[useGPSFeed] WebSocket connected'),
      onClose: () => {
        if (!isShutDownRef.current) {
          console.log('[useGPSFeed] WebSocket closed — falling back to polling')
          startPolling()
        }
      },
      onError: (err) => console.error('[useGPSFeed] WebSocket error:', err),
    })

    wsRef.current.connect()

    wsConnectTimerRef.current = setTimeout(() => {
      if (!isShutDownRef.current) {
        console.warn(
          '[useGPSFeed] WebSocket timed out — falling back to polling',
        )
        stopWebSocket()
        startPolling()
      }
    }, WS_CONNECT_TIMEOUT_MS)
  }, [tripId, token, handlePayload, startPolling, stopPolling, stopWebSocket])

  useEffect(() => {
    if (!tripId || !token) return

    // Reset shutdown flag when a new trip starts
    isShutDownRef.current = false
    startWebSocket()

    return () => {
      // Cleanup on unmount — but don't set isShutDownRef so a remount
      // can reconnect if needed
      stopWebSocket()
      stopPolling()
    }
  }, [tripId, token, startWebSocket, stopWebSocket, stopPolling])

  return { shutdown }
}
