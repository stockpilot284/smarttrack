/**
 * use-connection-status.ts
 *
 * Tracks GPS feed staleness by watching payload arrival timestamps.
 * Accepts an `enabled` flag — when false the timer stops immediately
 * and status is forced to 'connected' so no stale/disconnected banner
 * appears after an intentional GPS shutdown.
 */

import { useEffect, useRef, useCallback } from 'react'
import { ConnectionStatus } from '@/lib/gps/gps-feed.types'

const CHECK_INTERVAL_MS = 1_000

interface UseConnectionStatusOptions {
  staleThresholdMs?: number
  disconnectedThresholdMs?: number
  onStatusChange: (status: ConnectionStatus) => void
  /**
   * When false, the staleness timer stops and status resets to 'connected'.
   * Set to false after intentional GPS shutdown so the banner never appears.
   * Default: true
   */
  enabled?: boolean
}

interface UseConnectionStatusReturn {
  recordUpdate: () => void
}

export function useConnectionStatus({
  staleThresholdMs = 10_000,
  disconnectedThresholdMs = 30_000,
  onStatusChange,
  enabled = true,
}: UseConnectionStatusOptions): UseConnectionStatusReturn {
  const lastUpdateAtRef = useRef<number>(performance.now())
  const currentStatusRef = useRef<ConnectionStatus>('connected')
  const onStatusChangeRef = useRef(onStatusChange)

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange
  })

  const recordUpdate = useCallback(() => {
    lastUpdateAtRef.current = performance.now()

    if (currentStatusRef.current !== 'connected') {
      currentStatusRef.current = 'connected'
      onStatusChangeRef.current('connected')
    }
  }, [])

  useEffect(() => {
    // When disabled, reset status to connected so banner clears immediately
    if (!enabled) {
      if (currentStatusRef.current !== 'connected') {
        currentStatusRef.current = 'connected'
        onStatusChangeRef.current('connected')
      }
      return
    }

    const interval = setInterval(() => {
      const elapsed = performance.now() - lastUpdateAtRef.current
      const current = currentStatusRef.current

      let next: ConnectionStatus

      if (elapsed >= disconnectedThresholdMs) {
        next = 'disconnected'
      } else if (elapsed >= staleThresholdMs) {
        next = 'stale'
      } else {
        next = 'connected'
      }

      if (next !== current) {
        currentStatusRef.current = next
        onStatusChangeRef.current(next)
      }
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [enabled, staleThresholdMs, disconnectedThresholdMs])

  return { recordUpdate }
}
