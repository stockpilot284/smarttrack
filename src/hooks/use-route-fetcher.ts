// hooks/use-route-fetcher.ts
import { useRef, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import { TrackingOrder, LocationPing } from '@/types/tracking.type'
import { clearRouteSources } from '@/lib/map/update-sources'
import { fetchRadarRoute } from '@/lib/routing/fetch-radar-route'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { drawRouteSegment } from '@/lib/map/draw-route'
import { RouteGeometry, RadarRouteResult } from '@/lib/routing/routing.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { useTrackingCapabilities } from './use-tracking-capabilities'
import { fetchRadarRouteFromPoints } from '@/lib/routing/fetch-radar-route-from-points'
import { cleanLocationHistory } from '@/lib/routing/clean-location-history'

interface UseRouteFetcherProps {
  mapInstance: React.RefObject<maplibregl.Map | null>
  selectedOrder: TrackingOrder
  capabilities: ReturnType<typeof useTrackingCapabilities>
  resolvedTheme: 'light' | 'dark'
  onError: (error: string) => void
  locationHistory?: LocationPing[] // new
}

export function useRouteFetcher({
  mapInstance,
  selectedOrder,
  capabilities,
  resolvedTheme,
  onError,
  locationHistory,
}: UseRouteFetcherProps) {
  const routeGeometryRef = useRef<RouteGeometry | null>(null)
  const motionRef = useRef<TruckMotionState | null>(null)
  const routeRequestIdRef = useRef(0)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false)

  const updateSourcesForOrder = useCallback(
    async (order: TrackingOrder) => {
      const map = mapInstance.current
      if (!map) {
        onError('Map not initialized')
        return
      }

      if (!capabilities.canShowRoute) {
        clearRouteSources(map)
        return
      }

      if (!map.isStyleLoaded()) {
        try {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error('Style load timeout')),
              10000,
            )
            const onStyleLoad = () => {
              clearTimeout(timeout)
              map.off('styledata', onStyleLoad)
              resolve()
            }
            map.once('styledata', onStyleLoad)
          })
        } catch {
          onError('Failed to load map style. Please retry.')
          setIsLoadingRoutes(false)
          return
        }
      }

      clearRouteSources(map)

      const requestId = ++routeRequestIdRef.current
      setIsLoadingRoutes(true)

      // --- Delivered order with location history ---
      if (
        order.status === 'DELIVERED' &&
        locationHistory &&
        locationHistory.length > 1
      ) {
        const cleanedHistory = cleanLocationHistory(locationHistory)
        const points = cleanedHistory.map(
          (p) => [p.longitude, p.latitude] as [number, number],
        )

        const geometry = buildRouteGeometry(points)
        routeGeometryRef.current = geometry
        const mockRoute: RadarRouteResult = {
          geometry: {
            coordinates: geometry.points as [number, number][],
          },
        }
        drawRouteSegment(
          map,
          mockRoute,
          resolvedTheme,
          'route-completed',
          'COMPLETED',
        )
        motionRef.current = null
        setIsLoadingRoutes(false)
        return
      }

      // --- Active order: fetch routes from Radar ---
      const pickup = order.stops.find((s) => s.type === 'PICKUP')
      const dropoff = order.stops.find((s) => s.type === 'DROPOFF')
      const truckCoord: [number, number] = [
        order.vehicle.longitude,
        order.vehicle.latitude,
      ]

      const pickupCoord = pickup
        ? ([pickup.longitude, pickup.latitude] as [number, number])
        : null
      const dropoffCoord = dropoff
        ? ([dropoff.longitude, dropoff.latitude] as [number, number])
        : null

      let completedRoute: RadarRouteResult | null = null
      let activeRoute: RadarRouteResult | null = null

      try {
        switch (order.status) {
          case 'ASSIGNED':
            if (pickupCoord) {
              ;[activeRoute] = await Promise.all([
                fetchRadarRoute({
                  truck: truckCoord,
                  pickup: pickupCoord,
                  dropoff: undefined,
                  mode: 'TO_PICKUP',
                }),
              ])
            }
            break
          case 'PICKED_UP':
          case 'IN_TRANSIT':
            if (pickupCoord && dropoffCoord) {
              ;[completedRoute, activeRoute] = await Promise.all([
                fetchRadarRoute({
                  pickup: pickupCoord,
                  truck: truckCoord,
                  dropoff: undefined,
                  mode: 'COMPLETED',
                }),
                fetchRadarRoute({
                  truck: truckCoord,
                  pickup: undefined,
                  dropoff: dropoffCoord,
                  mode: 'TO_DROPOFF',
                }),
              ])
            }
            break
          // DELIVERED is handled above, but fall through just in case
          default:
            break
        }
      } catch (error) {
        console.error('Route fetch failed:', error)
        onError('Failed to fetch route. Please check your connection.')
        setIsLoadingRoutes(false)
        return
      }

      if (routeRequestIdRef.current !== requestId) {
        setIsLoadingRoutes(false)
        return
      }

      if (activeRoute) {
        drawRouteSegment(
          map,
          activeRoute,
          resolvedTheme,
          'route-active',
          'ACTIVE',
        )
      }
      if (completedRoute) {
        drawRouteSegment(
          map,
          completedRoute,
          resolvedTheme,
          'route-completed',
          'COMPLETED',
        )
      }

      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error('Idle timeout')),
            10000,
          )
          if (map.loaded() && !map.isMoving()) {
            clearTimeout(timeout)
            resolve()
          } else {
            map.once('idle', () => {
              clearTimeout(timeout)
              resolve()
            })
          }
        })
      } catch (err) {
        console.warn('Map idle timeout, continuing...')
      }

      if (activeRoute?.geometry?.coordinates) {
        const geometry = buildRouteGeometry(activeRoute.geometry.coordinates)
        routeGeometryRef.current = geometry
        motionRef.current = {
          distanceAlongRoute: 0,
          targetDistance: 0,
          speed: 15,
          lastTickAt: performance.now(),
          bearing: 0,
        }
      } else {
        routeGeometryRef.current = null
        motionRef.current = null
      }

      setIsLoadingRoutes(false)
    },
    [mapInstance, capabilities, resolvedTheme, onError, locationHistory],
  )

  return {
    routeGeometryRef,
    motionRef,
    isLoadingRoutes,
    setIsLoadingRoutes,
    updateSourcesForOrder,
  }
}
