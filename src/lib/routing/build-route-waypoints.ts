import { RouteRequest } from '@/lib/routing/routing.types'

/**
 * Builds Radar-compatible waypoint string.
 * Radar expects: lat,lng|lat,lng
 */
export function buildRouteWaypoints(input: RouteRequest): string | null {
  const { mode, truck, pickup, dropoff } = input

  switch (mode) {
    /**
     * Driver moving toward pickup
     * truck → pickup
     */
    case 'TO_PICKUP': {
      if (!truck || !pickup) return null

      return `${truck[1]},${truck[0]}|${pickup[1]},${pickup[0]}`
    }

    /**
     * Driver delivering order
     * truck → dropoff
     */
    case 'IN_TRANSIT': {
      if (!truck || !dropoff) return null

      return `${truck[1]},${truck[0]}|${dropoff[1]},${dropoff[0]}`
    }

    /**
     * Completed portion of route
     * pickup → truck
     * (used for faded / dashed path)
     */
    case 'COMPLETED': {
      if (!pickup || !truck) return null

      return `${pickup[1]},${pickup[0]}|${truck[1]},${truck[0]}`
    }

    default:
      return null
  }
}
