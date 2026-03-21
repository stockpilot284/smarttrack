/**
 * sort-trip-stops.ts
 *
 * Fix: DROPOFF stops with no orderId are warehouse-dispatched stops.
 * They don't have a matching PICKUP in the trip by design and should
 * never cause a validation error. Only DROPOFF stops WITH an orderId
 * need a matching PICKUP.
 */

import { Stop } from '@/types/tracking.type'

export function isStopOrderValid(stops: Stop[]): boolean {
  let seenDropoff = false
  for (const stop of stops) {
    if (stop.type === 'DROPOFF') seenDropoff = true
    if (stop.type === 'PICKUP' && seenDropoff) return false
  }
  const pickupOrderIds = new Set<string>()
  for (const stop of stops) {
    if (stop.type === 'PICKUP' && stop.orderId) pickupOrderIds.add(stop.orderId)
    // Only validate orderId-carrying DROPOFFS — warehouse stops have no orderId
    if (stop.type === 'DROPOFF' && stop.orderId) {
      if (!pickupOrderIds.has(stop.orderId)) return false
    }
  }
  return true
}

export function sortTripStops(stops: Stop[]): Stop[] {
  if (isStopOrderValid(stops)) return stops

  const pickups: Stop[] = []
  const dropoffs: Stop[] = []

  const pickupOrderIds = new Set(
    stops
      .filter((s) => s.type === 'PICKUP' && s.orderId)
      .map((s) => s.orderId as string),
  )

  for (const stop of stops) {
    if (stop.type === 'PICKUP') {
      pickups.push(stop)
    } else {
      // Only validate DROPOFF stops that carry an orderId.
      // Warehouse-dispatched stops (no orderId) are always valid.
      if (stop.orderId && !pickupOrderIds.has(stop.orderId)) {
        throw new Error(
          `Stop "${stop.id}" is a DROPOFF for order "${stop.orderId}" ` +
            `but no matching PICKUP exists in this trip. ` +
            `Add the PICKUP stop or mark this as a warehouse-dispatched stop (no orderId).`,
        )
      }
      dropoffs.push(stop)
    }
  }

  return [...pickups, ...dropoffs]
}

export function validateStopOrder(stops: Stop[]): string[] {
  const violations: string[] = []
  const pickupOrderIds = new Set<string>()
  let dropoffStarted = false

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]
    if (stop.type === 'PICKUP') {
      if (dropoffStarted) {
        violations.push(
          `Stop ${i + 1} (${stop.id}): PICKUP appears after a DROPOFF.`,
        )
      }
      if (stop.orderId) pickupOrderIds.add(stop.orderId)
    }
    if (stop.type === 'DROPOFF') {
      dropoffStarted = true
      // Only validate DROPOFFS with an orderId
      if (stop.orderId && !pickupOrderIds.has(stop.orderId)) {
        violations.push(
          `Stop ${i + 1} (${stop.id}): DROPOFF for order "${stop.orderId}" ` +
            `appears before its PICKUP.`,
        )
      }
    }
  }

  return violations
}
