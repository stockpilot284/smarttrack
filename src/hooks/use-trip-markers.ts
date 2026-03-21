/**
 * use-trip-markers.ts
 *
 * Root cause of grey markers: getMarkerState was gating on visitedStopIds
 * before reading stop.status. visitedStopIds is a RefObject<Set> — a ref,
 * not state — so it is always empty on the first render when stops arrive
 * pre-resolved from the server. The markers rebuilt with an empty set and
 * every stop fell through to 'pending' (grey).
 *
 * Fix: read stop.status directly. The status IS the single source of truth
 * for what happened at a stop. No secondary set needed.
 *
 * visitedStopIds is kept in the signature only for the one narrow case where
 * useStopArrival has locally confirmed an arrival (dwell timer fired) but the
 * server hasn't updated stop.status yet — in that window the stop is still
 * PENDING on the server but the truck is physically there.
 */

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { Stop, StopStatus } from '@/types/tracking.type'
import { createMarkerPopup } from '@/lib/map/create-marker-popup'
import { stopMarkerSVG, StopMarkerState } from '@/lib/map/stop-marker-svg'

type MarkerTheme = 'dark' | 'light' | undefined

interface UseTripMarkersOptions {
  map: maplibregl.Map | null
  isMapLoaded: boolean
  stops: Stop[]
  theme: MarkerTheme
  highlightedStopId?: string | null
  /**
   * IDs of stops locally confirmed as arrived but not yet synced to server.
   * Only used to upgrade PENDING → in_progress in that narrow sync window.
   * NOT used to determine completed/failed/skipped — stop.status owns that.
   */
  locallyArrivedIds?: Set<string>
  approachingStopId?: string | null
}

/**
 * Maps stop.status → StopMarkerState.
 *
 * Direct status mapping — no secondary set, no conditional gating.
 * stop.status is the authoritative source for all terminal states.
 *
 * Priority:
 *   approaching     — GPS detection override (truck is nearby right now)
 *   COMPLETED       → completed  (green)
 *   FAILED          → failed     (red)
 *   SKIPPED         → skipped    (muted orange)
 *   IN_PROGRESS     → in_progress (blue pulse)
 *   PENDING + local → in_progress (truck arrived, server not synced yet)
 *   PENDING         → pending    (grey)
 */
function getMarkerState(
  stop: Stop,
  locallyArrivedIds: Set<string>,
  approachingStopId: string | null | undefined,
): StopMarkerState {
  // GPS approaching override — highest priority
  if (approachingStopId === stop.id) return 'approaching'

  // Direct status mapping — covers all server-set states immediately
  switch (stop.status as StopStatus) {
    case 'COMPLETED':
      return 'completed'
    case 'FAILED':
      return 'failed'
    case 'SKIPPED':
      return 'skipped'
    case 'IN_PROGRESS':
      return 'in_progress'
    case 'PENDING':
      // Narrow sync window: truck arrived locally but server not updated yet
      return locallyArrivedIds.has(stop.id) ? 'in_progress' : 'pending'
    default:
      return 'pending'
  }
}

export function useTripMarkers({
  map,
  isMapLoaded,
  stops,
  theme,
  highlightedStopId,
  locallyArrivedIds = new Set(),
  approachingStopId,
}: UseTripMarkersOptions) {
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())

  useEffect(() => {
    if (!map || !isMapLoaded || !stops.length) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    for (const stop of stops) {
      const state = getMarkerState(stop, locallyArrivedIds, approachingStopId)
      const isHighlighted = highlightedStopId === stop.id

      const el = document.createElement('div')
      el.className = `stop-marker stop-marker--${state}`
      el.innerHTML = stopMarkerSVG(state, stop.type, theme)

      if (isHighlighted) {
        el.style.transform = 'scale(1.2)'
        el.style.zIndex = '10'
        el.style.transformOrigin = 'bottom center'
      }

      const popup = createMarkerPopup(
        'stop',
        {
          address: stop.address,
          contactName: stop.contactName,
          contactPhone: stop.contactPhone,
          status: stop.status,
          type: stop.type,
          estimatedArrival: stop.estimatedArrival,
          actualArrival: stop.actualArrival,
          completedAt: stop.completedAt,
          failureReason: stop.failureReason,
        },
        theme as 'light' | 'dark',
      )

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([stop.longitude, stop.latitude])
        .setPopup(popup)
        .addTo(map)

      markersRef.current.set(stop.id, marker)
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
    }
  }, [
    map,
    isMapLoaded,
    stops,
    theme,
    highlightedStopId,
    locallyArrivedIds,
    approachingStopId,
  ])
}
