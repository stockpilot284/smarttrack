/**
 * use-gps-feed.ts
 *
 * Connects to the GPS feed via WebSocket with automatic fallback to HTTP
 * polling. Exposes a shutdown() function so the caller can explicitly
 * disconnect when the trip reaches a terminal state.
 *
 * Now emits onConnectionStateChange on every real transport event so
 * MapPanel can drive a genuine GPS network status indicator — not a
 * staleness clock guess.
 *
 * Transport state transitions:
 *
 *   startup                    → 'connecting' (websocket)
 *   WS opened                  → 'connected'  (websocket)
 *   WS timed out / closed      → 'connecting' (polling)  ← fallback starting
 *   first poll succeeded       → 'connected'  (polling)
 *   poll error                 → 'disconnected' (polling)
 *   poll recovers              → 'connected'  (polling)
 *   deliberate shutdown        → 'shutdown'
 */

import { useEffect, useRef, useCallback } from 'react'
import { RouteGeometry, LngLat } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { projectPointOntoRoute } from '@/lib/routing/point-to-route-distance'
import { GPSWebSocket } from '@/lib/gps/gps-websocket'
import { GPSPoller } from '@/lib/gps/gps-poller'
import {
  GPSPayload,
  FeedConnectionState,
  FeedTransport,
} from '@/lib/gps/gps-feed.types'

const WS_BASE_URL = import.meta.env.VITE_GPS_WS_URL ?? 'wss://yourapi/ws/trips'
const WS_CONNECT_TIMEOUT_MS = 5_000

interface UseGPSFeedOptions {
  tripId: string
  token: string
  routeGeometry: RouteGeometry | null
  motionRef: React.RefObject<TruckMotionState | null>
  onPositionUpdate?: (lngLat: LngLat, bearing: number, speedMs: number) => void
  /**
   * Called on every transport state change with the new state and which
   * transport is active. Wire this into useConnectionStatus.notifyConnectionState
   * in MapPanel to drive the real GPS network indicator.
   */
  onConnectionStateChange?: (
    state: FeedConnectionState,
    transport: FeedTransport,
  ) => void
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
  onConnectionStateChange,
  pollIntervalMs = 5_000,
}: UseGPSFeedOptions): UseGPSFeedReturn {
  const wsRef = useRef<GPSWebSocket | null>(null)
  const pollerRef = useRef<GPSPoller | null>(null)
  const wsConnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isShutDownRef = useRef(false)
  const pollerConnectedRef = useRef(false)

  const routeGeometryRef = useRef(routeGeometry)
  const onPositionUpdateRef = useRef(onPositionUpdate)
  const onConnectionStateChangeRef = useRef(onConnectionStateChange)

  useEffect(() => {
    routeGeometryRef.current = routeGeometry
    onPositionUpdateRef.current = onPositionUpdate
    onConnectionStateChangeRef.current = onConnectionStateChange
  })

  // ── helpers ──────────────────────────────────────────────────────────────

  const emitConnectionState = useCallback(
    (state: FeedConnectionState, transport: FeedTransport) => {
      onConnectionStateChangeRef.current?.(state, transport)
    },
    [],
  )

  const stopPolling = useCallback(() => {
    pollerRef.current?.stop()
    pollerRef.current = null
    pollerConnectedRef.current = false
  }, [])

  const stopWebSocket = useCallback(() => {
    if (wsConnectTimerRef.current) {
      clearTimeout(wsConnectTimerRef.current)
      wsConnectTimerRef.current = null
    }
    wsRef.current?.disconnect()
    wsRef.current = null
  }, [])

  // ── shutdown ──────────────────────────────────────────────────────────────

  const shutdown = useCallback(() => {
    if (isShutDownRef.current) return
    isShutDownRef.current = true
    stopWebSocket()
    stopPolling()
    emitConnectionState('shutdown', 'websocket')
    console.log('[useGPSFeed] Feed shut down')
  }, [stopWebSocket, stopPolling, emitConnectionState])

  // ── payload handling ──────────────────────────────────────────────────────

  const handlePayload = useCallback(
    (payload: GPSPayload) => {
      if (isShutDownRef.current) return

      const geometry = routeGeometryRef.current
      const motion = motionRef.current
      const lngLat: LngLat = [payload.longitude, payload.latitude]

      if (geometry && motion) {
        const distanceAlongRoute = projectPointOntoRoute(lngLat, geometry)
        if (distanceAlongRoute > motion.targetDistance) {
          motion.targetDistance = distanceAlongRoute
          motion.speed = payload.speedMs > 0 ? payload.speedMs : motion.speed
        }
      }

      onPositionUpdateRef.current?.(lngLat, payload.bearing, payload.speedMs)
    },
    [motionRef],
  )

  // ── polling fallback ──────────────────────────────────────────────────────

  const startPolling = useCallback(() => {
    if (pollerRef.current || isShutDownRef.current) return
    console.log('[useGPSFeed] Starting polling fallback')

    // Emit connecting on the polling transport so the banner says
    // "Reconnecting via backup connection..."
    emitConnectionState('connecting', 'polling')
    pollerConnectedRef.current = false

    pollerRef.current = new GPSPoller({
      tripId,
      token,
      intervalMs: pollIntervalMs,
      onMessage: (payload) => {
        if (isShutDownRef.current) return

        // First successful poll — emit connected
        if (!pollerConnectedRef.current) {
          pollerConnectedRef.current = true
          emitConnectionState('connected', 'polling')
          console.log('[useGPSFeed] Polling connected')
        }

        handlePayload(payload)
      },
      onError: (err) => {
        if (isShutDownRef.current) return
        console.error('[useGPSFeed] Poll error:', err)

        // If we were connected and now get an error, emit disconnected
        if (pollerConnectedRef.current) {
          pollerConnectedRef.current = false
          emitConnectionState('disconnected', 'polling')
        }
      },
    })

    pollerRef.current.start()
  }, [tripId, token, pollIntervalMs, handlePayload, emitConnectionState])

  // ── WebSocket primary ─────────────────────────────────────────────────────

  const startWebSocket = useCallback(() => {
    if (isShutDownRef.current) return

    // Emit connecting immediately so the banner shows on initial load
    emitConnectionState('connecting', 'websocket')

    wsRef.current = new GPSWebSocket({
      url: `${WS_BASE_URL}/${tripId}`,
      token,
      onOpen: () => {
        if (isShutDownRef.current) return
        // Clear the connect timeout — WS opened before the deadline
        if (wsConnectTimerRef.current) {
          clearTimeout(wsConnectTimerRef.current)
          wsConnectTimerRef.current = null
        }
        emitConnectionState('connected', 'websocket')
        console.log('[useGPSFeed] WebSocket connected')
      },
      onMessage: (payload) => {
        if (isShutDownRef.current) return
        // Receiving a message while polling is running means WS recovered —
        // stop polling and switch back
        if (pollerRef.current) {
          console.log('[useGPSFeed] WebSocket recovered — stopping polling')
          stopPolling()
          emitConnectionState('connected', 'websocket')
        }
        handlePayload(payload)
      },
      onClose: () => {
        if (isShutDownRef.current) return
        console.log('[useGPSFeed] WebSocket closed — falling back to polling')
        startPolling()
      },
      onError: (err) => {
        if (isShutDownRef.current) return
        console.error('[useGPSFeed] WebSocket error:', err)
        // onClose will fire after onError so polling fallback happens there
      },
    })

    wsRef.current.connect()

    // If WS hasn't opened within the timeout, fall back to polling
    wsConnectTimerRef.current = setTimeout(() => {
      if (isShutDownRef.current) return
      console.warn('[useGPSFeed] WebSocket timed out — falling back to polling')
      stopWebSocket()
      startPolling()
    }, WS_CONNECT_TIMEOUT_MS)
  }, [
    tripId,
    token,
    handlePayload,
    startPolling,
    stopPolling,
    stopWebSocket,
    emitConnectionState,
  ])

  // ── lifecycle ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!tripId || !token) return

    isShutDownRef.current = false
    startWebSocket()

    return () => {
      stopWebSocket()
      stopPolling()
    }
  }, [tripId, token, startWebSocket, stopWebSocket, stopPolling])

  return { shutdown }
}
