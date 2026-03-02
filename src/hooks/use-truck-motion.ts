import { useEffect, useRef } from 'react'
import { LngLat, RouteGeometry } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { interpolateRoutePosition } from '@/lib/routing/route-interpolator'

type Input = {
  route: RouteGeometry | null
  motionRef: React.RefObject<TruckMotionState | null>
  onUpdate: (lngLat: LngLat, bearing: number) => void
}

export function useTruckMotion({ route, motionRef, onUpdate }: Input) {
  const rafRef = useRef<number | null>(null)

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

      onUpdate(position, bearing)
      rafRef.current = requestAnimationFrame(tick)
    }

    // 🛑 Guard initial setup
    if (motionRef.current) {
      motionRef.current.lastTickAt = performance.now()
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [route, onUpdate])
}
