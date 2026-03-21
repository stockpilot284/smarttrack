/**
 * use-connection-status.ts
 *
 * Reflects actual GPS transport health — WebSocket or HTTP polling.
 * Source of truth is entirely FeedConnectionState events emitted by
 * useGPSFeed. No clocks, no timers, no guessing from packet intervals.
 *
 * State machine:
 *
 *   FeedConnectionState  →  ConnectionStatus
 *   ─────────────────────────────────────────
 *   'connecting'         →  'connecting'
 *   'connected'          →  'connected'
 *   'disconnected'       →  'disconnected'
 *   'shutdown'           →  hook goes silent (no further emissions)
 *
 * Stationary truck detection is NOT handled here — that is a separate
 * concern surfaced by useStationaryDetection and shown in its own UI
 * indicator, not by downgrading the connection status.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { ConnectionStatus, FeedConnectionState } from '@/lib/gps/gps-feed.types'

interface UseConnectionStatusOptions {
  /** Disable entirely once trip reaches a terminal state */
  enabled?: boolean
  onStatusChange?: (status: ConnectionStatus) => void
}

interface UseConnectionStatusReturn {
  status: ConnectionStatus
  /**
   * Call this whenever the GPS feed transport state changes.
   * This is the only input — there is no secondary timer or clock.
   */
  notifyConnectionState: (state: FeedConnectionState) => void
}

export function useConnectionStatus({
  enabled = true,
  onStatusChange,
}: UseConnectionStatusOptions = {}): UseConnectionStatusReturn {
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const onStatusChangeRef = useRef(onStatusChange)
  const isShutdownRef = useRef(false)

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange
  }, [onStatusChange])

  const emitStatus = useCallback(
    (next: ConnectionStatus) => {
      if (!enabled || isShutdownRef.current) return
      setStatus((prev) => {
        if (prev === next) return prev
        onStatusChangeRef.current?.(next)
        return next
      })
    },
    [enabled],
  )

  const notifyConnectionState = useCallback(
    (state: FeedConnectionState) => {
      if (!enabled) return

      switch (state) {
        case 'connecting':
          isShutdownRef.current = false
          emitStatus('connecting')
          break

        case 'connected':
          isShutdownRef.current = false
          emitStatus('connected')
          break

        case 'disconnected':
          emitStatus('disconnected')
          break

        case 'shutdown':
          // Trip is terminal — silence any further emissions
          isShutdownRef.current = true
          break
      }
    },
    [enabled, emitStatus],
  )

  // When disabled mid-session (trip became terminal), stop emitting
  useEffect(() => {
    if (!enabled) {
      isShutdownRef.current = true
    }
  }, [enabled])

  return { status, notifyConnectionState }
}
