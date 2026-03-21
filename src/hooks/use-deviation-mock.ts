/**
 * use-deviation-mock.ts
 *
 * Development-only mock that lets you manually trigger and clear
 * deviations without waiting for the truck to naturally wander off route.
 *
 * Replaces the real simulation interval in MapPanel when enabled.
 * Remove this file and all references to it before shipping to production.
 *
 * USAGE in MapPanel:
 *   const { mockControls } = useDeviationMock({ routeGeometry, motionRef, enabled: true })
 *
 * Then render <DeviationMockControls controls={mockControls} /> somewhere
 * visible on screen (e.g. fixed bottom-left corner).
 */

import { useRef, useCallback } from 'react'
import { RouteGeometry, LngLat } from '@/lib/routing/routing.types'
import { TruckMotionRef } from '@/hooks/use-truck-motion'

// How far off-route the mock moves the truck (metres converted to degrees ~0.001° ≈ 111m)
const DEVIATION_OFFSET_DEG = 0.0008 // ~90m — safely above any adaptive threshold

export interface MockControls {
  /** Instantly move the truck 90m off the current route */
  triggerDeviation: () => void
  /** Move the truck back onto the route */
  clearDeviation: () => void
  /** Skip the truck forward along the route to test remaining-stops logic */
  skipForward: (metres: number) => void
  /** Reset truck to the beginning of the route */
  resetRoute: () => void
}

interface UseDeviationMockOptions {
  routeGeometry: RouteGeometry | null
  motionRef: React.RefObject<TruckMotionRef | null>
  /** Set to false to disable the mock without removing the hook call */
  enabled?: boolean
  /** Called by the mock on each frame so MapPanel's onUpdate still fires */
  onPositionOverride?: (lngLat: LngLat, speedMs: number) => void
}

interface UseDeviationMockReturn {
  mockControls: MockControls
  /** Current override position — null means use normal simulation */
  getOverridePosition: () => LngLat | null
}

export function useDeviationMock({
  routeGeometry,
  motionRef,
  enabled = true,
  onPositionOverride,
}: UseDeviationMockOptions): UseDeviationMockReturn {
  // When non-null, this position overrides the normal interpolated position
  const overridePositionRef = useRef<LngLat | null>(null)
  const isDeviatingRef = useRef(false)

  const triggerDeviation = useCallback(() => {
    if (!enabled) return
    const geometry = routeGeometry
    if (!geometry || !motionRef.current) return

    // Find the truck's current interpolated position from distanceAlongRoute
    const m = motionRef.current
    const segments = geometry.segments

    // Walk segments to find which one contains the current distance
    let currentPos: LngLat = [0, 0]
    for (const seg of segments) {
      if (
        m.distanceAlongRoute >= seg.cumulativeStart &&
        m.distanceAlongRoute <= seg.cumulativeEnd
      ) {
        const t =
          seg.length === 0
            ? 0
            : (m.distanceAlongRoute - seg.cumulativeStart) / seg.length
        currentPos = [
          seg.start[0] + t * (seg.end[0] - seg.start[0]),
          seg.start[1] + t * (seg.end[1] - seg.start[1]),
        ]
        break
      }
    }

    // Offset the position perpendicular to the route by DEVIATION_OFFSET_DEG
    // Simple approach: offset latitude so it's clearly off any road
    const deviatedPos: LngLat = [
      currentPos[0],
      currentPos[1] + DEVIATION_OFFSET_DEG,
    ]

    overridePositionRef.current = deviatedPos
    isDeviatingRef.current = true

    // Notify MapPanel's onUpdate chain with the deviated position
    onPositionOverride?.(deviatedPos, motionRef.current?.speed ?? 14)

    console.log(
      '[DeviationMock] 🔴 Deviation triggered — truck moved to',
      deviatedPos,
    )
  }, [enabled, routeGeometry, motionRef, onPositionOverride])

  const clearDeviation = useCallback(() => {
    if (!enabled) return
    overridePositionRef.current = null
    isDeviatingRef.current = false
    console.log('[DeviationMock] 🟢 Deviation cleared — truck back on route')
  }, [enabled])

  const skipForward = useCallback(
    (metres: number) => {
      if (!enabled || !motionRef.current) return
      const geometry = routeGeometry
      if (!geometry) return

      const m = motionRef.current
      const newDistance = Math.min(
        m.distanceAlongRoute + metres,
        geometry.totalLength - 1,
      )
      m.distanceAlongRoute = newDistance
      m.targetDistance = newDistance
      m.lastTickAt = performance.now()

      console.log(
        `[DeviationMock] ⏭ Skipped forward ${metres}m — now at ${Math.round(newDistance)}m / ${Math.round(geometry.totalLength)}m`,
      )
    },
    [enabled, motionRef, routeGeometry],
  )

  const resetRoute = useCallback(() => {
    if (!enabled || !motionRef.current) return
    overridePositionRef.current = null
    isDeviatingRef.current = false
    motionRef.current.distanceAlongRoute = 0
    motionRef.current.targetDistance = 0
    motionRef.current.lastTickAt = performance.now()
    console.log('[DeviationMock] 🔄 Route reset to beginning')
  }, [enabled, motionRef])

  const getOverridePosition = useCallback((): LngLat | null => {
    return overridePositionRef.current
  }, [])

  return {
    mockControls: { triggerDeviation, clearDeviation, skipForward, resetRoute },
    getOverridePosition,
  }
}
