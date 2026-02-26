import { LngLat, RouteGeometry } from './routing.types'
import { TruckMotionState } from './truck-motion.types'
import { projectPointToRoute } from './project-point-to-route'

export function applyGpsPing(
  gps: LngLat,
  route: RouteGeometry,
  motion: TruckMotionState,
) {
  const projectedDistance = projectPointToRoute(gps, route)

  motion.targetDistance = Math.max(motion.targetDistance, projectedDistance)
}
