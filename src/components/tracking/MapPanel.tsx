import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import DriverInformation from './DriverInformation'
import Timeline from './Timeline'
import VehicleInformation from './VehicleInformation'
import { MapEtaBadge } from './MapEtaBadge'

import { TrackingOrder, MapMarker } from '@/types/tracking'
import { OrderStatus } from '@/types/order.type'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { useMapCameraController } from '@/hooks/use-map-camera-controller'
import { useTruckMotion } from '@/hooks/use-truck-motion'
import { useRouteEta } from '@/hooks/use-route-eta'

import { addMapSources } from '@/lib/map/add-sources'
import { clearRouteSources } from '@/lib/map/update-sources'
import { fetchRadarRoute } from '@/lib/routing/fetch-radar-route'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { deriveCameraIntent } from '@/lib/camera/derive-camera-intent'
import { createCameraState } from '@/lib/camera/camera-state'
import { CameraContext } from '@/lib/camera/camera.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import {
  LngLat,
  RouteGeometry,
  RadarRouteResult,
} from '@/lib/routing/routing.types'
import { buildOrderMarkers } from '@/lib/map/build-order-marker'
import { renderMarkers } from '@/lib/map/render-markers'
import { drawRouteSegment } from '@/lib/map/draw-route' // <-- new import
import { deriveMapEntities } from '@/lib/map/derive-map-entities'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Spinner } from '../Spinner'
import { motionPresets } from '@/lib/motion-presets'

type MapPanelProps = {
  selectedOrder: TrackingOrder
}

const DARK_MAP_STYLE_ID = '8f2b1606-8dfc-497e-9827-58102e7519d9'
const LIGHT_MAP_STYLE_ID = '86a406e5-eb60-4582-97c8-27df8b365e7d'

export default function MapPanel({ selectedOrder }: MapPanelProps) {
  /* -------------------------------
     REFS & STATE
  ------------------------------- */
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const routeGeometryRef = useRef<RouteGeometry | null>(null)
  const motionRef = useRef<TruckMotionState | null>(null)
  const routeRequestIdRef = useRef(0)
  const cameraStateRef = useRef(createCameraState())
  const isInitializedRef = useRef(false)
  const markersRef = useRef<{
    all: maplibregl.Marker[]
    truck?: maplibregl.Marker
  }>({ all: [] })

  const resolvedTheme = useResolvedTheme()
  const [clientReady, setClientReady] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false)

  const cameraIntent = useMemo(
    () => deriveCameraIntent(selectedOrder),
    [selectedOrder],
  )

  const mapEntities = useMemo(
    () => deriveMapEntities(selectedOrder),
    [selectedOrder],
  )

  /* -------------------------------
     MAP STYLE URL
  ------------------------------- */
  const mapStyleUrl = useMemo(() => {
    if (!resolvedTheme) return ''
    const styleId =
      resolvedTheme === 'dark' ? DARK_MAP_STYLE_ID : LIGHT_MAP_STYLE_ID
    return `https://api.radar.io/maps/styles/${styleId}?publishableKey=${
      import.meta.env.VITE_RADAR_PUBLISHABLE_KEY
    }`
  }, [resolvedTheme])

  useEffect(() => setClientReady(true), [])

  /* -------------------------------
     HELPER: Update Markers
  ------------------------------- */
  const updateMarkers = useCallback(
    (order: TrackingOrder) => {
      const map = mapInstance.current
      if (!map) return

      // Remove existing markers
      markersRef.current.all.forEach((marker) => marker.remove())
      markersRef.current = { all: [] }

      // Build new markers based on order and current theme
      const markerData = buildOrderMarkers(order, mapEntities)
      const rendered = renderMarkers(map, markerData, resolvedTheme)
      markersRef.current = rendered
    },
    [resolvedTheme, mapEntities],
  )

  /* -------------------------------
     UPDATE SOURCES (routes only, using drawRouteSegment)
  ------------------------------- */
  const updateSourcesForOrder = useCallback(
    async (order: TrackingOrder) => {
      const map = mapInstance.current
      if (!map) return

      // Wait for the map style to be fully loaded (not just loaded, but ready for sources)
      if (!map.isStyleLoaded()) {
        await new Promise<void>((resolve) => {
          const onStyleLoad = () => {
            map.off('styledata', onStyleLoad)
            resolve()
          }
          map.once('styledata', onStyleLoad)
        })
      }

      // Clear stale route data (sources)
      clearRouteSources(map)

      const requestId = ++routeRequestIdRef.current
      setIsLoadingRoutes(true)

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
          case OrderStatus.ASSIGNED:
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

          case OrderStatus.IN_TRANSIT:
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

          case OrderStatus.DELIVERED:
            if (pickupCoord && dropoffCoord) {
              ;[completedRoute] = await Promise.all([
                fetchRadarRoute({
                  pickup: pickupCoord,
                  truck: dropoffCoord,
                  dropoff: undefined,
                  mode: 'COMPLETED',
                }),
              ])
            }
            break
        }
      } catch (error) {
        console.error('Route fetch failed:', error)
        setIsLoadingRoutes(false)
        return
      }

      if (routeRequestIdRef.current !== requestId) {
        setIsLoadingRoutes(false)
        return
      }

      // Draw routes using drawRouteSegment
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

      // Wait for the map to be idle (all tiles loaded, rendering finished)
      await new Promise<void>((resolve) => {
        if (map.loaded() && !map.isMoving()) {
          resolve()
        } else {
          map.once('idle', resolve)
        }
      })

      // Force a repaint to catch any remaining visual updates
      map.triggerRepaint()

      // Prepare route geometry for truck motion
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

        // Explicit camera control for route fitting
        if (cameraIntent === 'FIT_ROUTE' && geometry.points.length > 0) {
          const bounds = new maplibregl.LngLatBounds()
          geometry.points.forEach(([lng, lat]) => bounds.extend([lng, lat]))
          map.fitBounds(bounds, { padding: 50, duration: 1000 })

          // Wait for the camera animation to finish
          await new Promise<void>((resolve) => {
            if (!map.isMoving()) {
              resolve()
            } else {
              map.once('moveend', resolve)
            }
          })
        }
      } else {
        routeGeometryRef.current = null
        motionRef.current = null
      }

      setIsLoadingRoutes(false)
    },
    [cameraIntent, resolvedTheme],
  )

  /* -------------------------------
     INITIALIZE MAP & STYLE
  ------------------------------- */
  useEffect(() => {
    if (
      !clientReady ||
      !mapContainerRef.current ||
      !mapStyleUrl ||
      mapInstance.current ||
      isInitializedRef.current
    )
      return

    const fallbackCenter: [number, number] = [
      selectedOrder.stops[0]?.longitude ?? 0,
      selectedOrder.stops[0]?.latitude ?? 0,
    ]

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: fallbackCenter,
      zoom: 12,
    })

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left',
    )

    mapInstance.current = map
    isInitializedRef.current = true

    const handleMapLoad = async () => {
      setIsMapLoaded(true)
      await initializeMapLayersAndSources(map, selectedOrder)
      setIsInitializing(false)
    }

    map.on('load', handleMapLoad)

    return () => {
      map.off('load', handleMapLoad)
      map.remove()
      mapInstance.current = null
      isInitializedRef.current = false
      setIsMapLoaded(false)
      setIsInitializing(true)
    }
  }, [clientReady, mapStyleUrl])

  /* -------------------------------
     THEME CHANGE HANDLING
  ------------------------------- */
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !mapStyleUrl) return

    const center = map.getCenter()
    const zoom = map.getZoom()
    const bearing = map.getBearing()
    const pitch = map.getPitch()

    const onStyleLoad = async () => {
      await initializeMapLayersAndSources(map, selectedOrder)
      map.jumpTo({ center, zoom, bearing, pitch })
    }

    map.once('styledata', onStyleLoad)
    map.setStyle(mapStyleUrl)

    return () => {
      map.off('styledata', onStyleLoad)
    }
  }, [resolvedTheme])

  /* -------------------------------
     HELPER: Initialize sources, draw routes & markers
  ------------------------------- */
  const initializeMapLayersAndSources = useCallback(
    async (map: maplibregl.Map, order: TrackingOrder) => {
      addMapSources(map) // only route sources
      // drawRouteSegment will create layers as needed
      await updateSourcesForOrder(order)
      updateMarkers(order)
    },
    [updateSourcesForOrder, updateMarkers],
  )

  /* -------------------------------
     REACT TO ORDER CHANGES
  ------------------------------- */
  useEffect(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return
    updateSourcesForOrder(selectedOrder)
    updateMarkers(selectedOrder)
  }, [selectedOrder, updateSourcesForOrder, updateMarkers])

  /* -------------------------------
     TRUCK MOTION (update marker position)
  ------------------------------- */
  useTruckMotion({
    route: routeGeometryRef.current,
    motionRef,
    onUpdate: (lngLat, bearing) => {
      const truckMarker = markersRef.current.truck
      if (truckMarker) {
        truckMarker.setLngLat(lngLat)
        // Optionally rotate the marker element to show bearing
        const el = truckMarker.getElement()
        const svg = el.querySelector('svg')
        if (svg) {
          svg.style.transform = `rotate(${bearing}deg)`
        }
      }
    },
  })

  /* -------------------------------
     CAMERA CONTROLLER
  ------------------------------- */
  const pickup = selectedOrder.stops.find((s) => s.type === 'PICKUP')
  const dropoff = selectedOrder.stops.find((s) => s.type === 'DROPOFF')

  const cameraContext = useMemo<CameraContext>(
    () => ({
      map: mapInstance.current as maplibregl.Map,
      truck: [selectedOrder.vehicle.longitude, selectedOrder.vehicle.latitude],
      pickup: pickup ? [pickup.longitude, pickup.latitude] : undefined,
      dropoff: dropoff ? [dropoff.longitude, dropoff.latitude] : undefined,
      routeBounds: mapInstance.current?.getBounds(),
    }),
    [selectedOrder, mapInstance.current],
  )

  useMapCameraController({
    mapRef: mapInstance,
    cameraStateRef,
    cameraIntent,
    cameraContext,
  })

  /* -------------------------------
     RESET CAMERA ON ORDER CHANGE
  ------------------------------- */
  useEffect(() => {
    cameraStateRef.current = createCameraState()
  }, [selectedOrder.id])

  /* -------------------------------
     ETA
  ------------------------------- */
  const etaSeconds = useRouteEta({
    status: selectedOrder.status,
    route: routeGeometryRef.current,
    distanceTraveledMeters: motionRef.current?.distanceAlongRoute ?? 0,
  })

  /* -------------------------------
     RENDER
  ------------------------------- */
  const { name, phone, email, availability } = selectedOrder.driver

  return (
    <motion.div
      className="relative h-120 lg:h-full lg:flex-1 overflow-hidden"
      {...motionPresets.fade}
    >
      <div className="absolute right-4 top-4 z-10  flex flex-col gap-4">
        <div className="flex items-start gap-2 w-full justify-end">
          <AnimatePresence mode="wait">
            {etaSeconds && <MapEtaBadge etaSeconds={etaSeconds} />}
          </AnimatePresence>
          <DriverInformation
            name={name}
            phone={phone}
            email={email}
            availability={availability}
          />
        </div>
        <Timeline events={selectedOrder.timeline} />
        <VehicleInformation
          model={selectedOrder.vehicle.model}
          plateNumber={selectedOrder.vehicle.plateNumber}
          imageUrl={selectedOrder.vehicle.imageUrl}
          vehicleType={selectedOrder.vehicle.type}
        />
      </div>

      <div className="relative h-full w-full">
        <div
          ref={mapContainerRef}
          className={`h-full w-full ${
            !clientReady || !resolvedTheme || !isMapLoaded ? 'invisible' : ''
          }`}
        />
        {(isInitializing || isLoadingRoutes) && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
            <Spinner size="lg" color="#9c6ef7" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
