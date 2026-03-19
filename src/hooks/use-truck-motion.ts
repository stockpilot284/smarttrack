import { useEffect, useRef } from 'react'
import { LngLat, RouteGeometry } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { interpolateRoutePosition } from '@/lib/routing/route-interpolator'

// Exported so MapPanel (and others) can type their motionRef correctly
export type TruckMotionRef = TruckMotionState

type Input = {
  route: RouteGeometry | null
  motionRef: React.RefObject<TruckMotionRef | null>
  onUpdate: (lngLat: LngLat, bearing: number) => void
}

export function useTruckMotion({ route, motionRef, onUpdate }: Input) {
  const rafRef = useRef<number | null>(null)

  // Stable ref for onUpdate — prevents the animation loop from restarting
  // every render just because the parent passed a new inline function reference
  const onUpdateRef = useRef(onUpdate)
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (!route) return

    const tick = () => {
      const m = motionRef.current

      if (!m) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const now = performance.now()
      const dt = (now - m.lastTickAt) / 1000

      m.lastTickAt = now

      m.distanceAlongRoute = Math.min(
        m.distanceAlongRoute + m.speed * dt,
        m.targetDistance,
      )

      const { position, bearing } = interpolateRoutePosition(
        route,
        m.distanceAlongRoute,
      )

      // Call through the stable ref, not the captured closure value
      onUpdateRef.current(position, bearing)
      rafRef.current = requestAnimationFrame(tick)
    }

    // Reset tick timestamp so dt doesn't spike on first frame
    if (motionRef.current) {
      motionRef.current.lastTickAt = performance.now()
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // onUpdate intentionally omitted — handled via onUpdateRef above
  }, [route, motionRef])
}
