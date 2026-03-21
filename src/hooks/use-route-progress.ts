/**
 * use-route-progress.ts
 *
 * Derives human-readable progress metrics from motionRef and route geometry.
 * Recalculates on a fixed interval (default 1s) rather than on every RAF
 * frame — the HUD doesn't need 60fps updates and this keeps re-renders cheap.
 *
 * ETA behaviour when stationary:
 *   Speed = 0 → ETA is held at the last calculated value until the truck
 *   moves again. When speed > 0, ETA recalculates from current distance
 *   and live speed.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { RouteGeometry } from '@/lib/routing/routing.types'
import { TruckMotionRef } from '@/hooks/use-truck-motion'
import { Stop } from '@/types/tracking.type'
import { projectPointOntoRoute } from '@/lib/routing/point-to-route-distance'

export interface RouteProgressMetrics {
  /** 0–100 */
  progressPercent: number
  /** e.g. "12.3 km" or "800 m" */
  remainingDistance: string
  /** e.g. "4 min" — null when no next stop or still calculating */
  etaToNextStop: string | null
  /** km/h rounded to nearest integer */
  currentSpeedKmh: number
  stopsCompleted: number
  stopsTotal: number
  /** True on first render before first calculation */
  isCalculating: boolean
}

interface UseRouteProgressOptions {
  motionRef: React.RefObject<TruckMotionRef | null>
  routeGeometry: RouteGeometry | null
  nextStop: Stop | null
  visitedStopIds: React.RefObject<Set<string>>
  totalStops: number
  /** How often to recalculate in ms — default 1000 */
  refreshMs?: number
}

function formatDistance(metres: number): string {
  if (metres >= 1000) {
    return `${(metres / 1000).toFixed(1)} km`
  }
  return `${Math.round(metres)} m`
}

function formatMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`
}

export function useRouteProgress({
  motionRef,
  routeGeometry,
  nextStop,
  visitedStopIds,
  totalStops,
  refreshMs = 1_000,
}: UseRouteProgressOptions): RouteProgressMetrics {
  const [metrics, setMetrics] = useState<RouteProgressMetrics>({
    progressPercent: 0,
    remainingDistance: '—',
    etaToNextStop: null,
    currentSpeedKmh: 0,
    stopsCompleted: 0,
    stopsTotal: totalStops,
    isCalculating: true,
  })

  // Hold last valid ETA so we can show it while stationary
  const lastEtaRef = useRef<string | null>(null)
  const nextStopRef = useRef(nextStop)
  const routeGeometryRef = useRef(routeGeometry)

  useEffect(() => {
    nextStopRef.current = nextStop
    routeGeometryRef.current = routeGeometry
  })

  const calculate = useCallback(() => {
    const motion = motionRef.current
    const geometry = routeGeometryRef.current

    if (!motion || !geometry) {
      setMetrics((prev) => ({ ...prev, isCalculating: true }))
      return
    }

    const { distanceAlongRoute, speed } = motion
    const { totalLength } = geometry

    const remainingMetres = Math.max(0, totalLength - distanceAlongRoute)
    const progressPercent = Math.min(
      100,
      Math.round((distanceAlongRoute / totalLength) * 100),
    )
    const currentSpeedKmh = Math.round(speed * 3.6)
    const stopsCompleted = visitedStopIds.current.size

    // ETA to next stop
    let etaToNextStop: string | null = null
    const stop = nextStopRef.current

    if (stop && speed > 0) {
      // Project the next stop onto the route to get its cumulative distance
      const stopCumulative = projectPointOntoRoute(
        [stop.longitude, stop.latitude],
        geometry,
      )
      const distanceToStop = Math.max(0, stopCumulative - distanceAlongRoute)
      const etaSeconds = distanceToStop / speed
      etaToNextStop = formatMinutes(etaSeconds)
      lastEtaRef.current = etaToNextStop
    } else if (stop && speed === 0) {
      // Stationary — hold last known ETA
      etaToNextStop = lastEtaRef.current
    } else {
      // No next stop
      etaToNextStop = null
      lastEtaRef.current = null
    }

    setMetrics({
      progressPercent,
      remainingDistance: formatDistance(remainingMetres),
      etaToNextStop,
      currentSpeedKmh,
      stopsCompleted,
      stopsTotal: totalStops,
      isCalculating: false,
    })
  }, [motionRef, visitedStopIds, totalStops])

  useEffect(() => {
    if (!routeGeometry) return

    // Calculate immediately on mount / route change
    calculate()

    const interval = setInterval(calculate, refreshMs)
    return () => clearInterval(interval)
  }, [routeGeometry, calculate, refreshMs])

  return metrics
}
