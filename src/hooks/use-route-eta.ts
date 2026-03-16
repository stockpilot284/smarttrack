import { useEffect, useState } from 'react'
import { OrderStatus } from '@/types/order.type'
import { RouteGeometry } from '@/lib/routing/routing.types'
import {
  calculateRemainingDistance,
  calculateEtaSeconds,
} from '@/lib/routing/calculateEta'
import { TrackingOrder } from '@/types/tracking'

interface UseRouteEtaParams {
  status: OrderStatus
  route: RouteGeometry | null
  distanceTraveledMeters: number
  selectedOrder: TrackingOrder
  speedMps?: number
}

/**
 * Computes ETA based on route geometry + truck motion progress
 */
export function useRouteEta({
  status,
  route,
  distanceTraveledMeters,
  selectedOrder,
  speedMps = 10, // ~36 km/h default
}: UseRouteEtaParams) {
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null)

  useEffect(() => {
    /* ---------- STATUS GATING ---------- */
    if (status !== 'IN_TRANSIT') {
      setEtaSeconds(null)
      return
    }

    if (!route || route.totalLength === 0) {
      setEtaSeconds(null)
      return
    }

    /* ---------- DISTANCE ---------- */
    const remainingMeters = calculateRemainingDistance(
      route,
      distanceTraveledMeters,
    )

    /* ---------- ARRIVAL ---------- */
    if (remainingMeters <= 5) {
      setEtaSeconds(0)
      return
    }

    /* ---------- ETA ---------- */
    const eta = calculateEtaSeconds(remainingMeters, speedMps)
    setEtaSeconds(eta)
  }, [status, route, distanceTraveledMeters, speedMps, selectedOrder.id])

  return etaSeconds
}
