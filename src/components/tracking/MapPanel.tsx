import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  RefObject,
} from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import DriverInformation from './DriverInformation'
import Timeline from './Timeline'
import { TrackingOrder } from '@/types/tracking'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { buildOrderMarkers } from '@/lib/map/build-order-marker'
import { renderMarkers } from '@/lib/map/render-markers'
import { deriveMapEntities } from '@/lib/map/derive-map-entities'
import { fetchRadarRoute } from '@/lib/routing/fetch-radar-route'
import { drawRouteSegment } from '@/lib/map/draw-route'
import { deriveCameraIntent } from '@/lib/camera/derive-camera-intent'
import { createCameraState } from '@/lib/camera/camera-state'
import { useMapCameraController } from '@/hooks/use-map-camera-controller'
import { CameraContext } from '@/lib/camera/camera.types'
import { TruckMotionState } from '@/lib/routing/truck-motion.types'
import { LngLat, RouteGeometry } from '@/lib/routing/routing.types'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { useTruckMotion } from '@/hooks/use-truck-motion'

type MapPanelProps = {
  selectedOrder: TrackingOrder
}

export default function MapPanel({ selectedOrder }: MapPanelProps) {
  /* ================================
     REFS (IMPERATIVE MAP STATE)
  ================================ */
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const cameraStateRef = useRef(createCameraState())
  const motionRef = useRef<TruckMotionState | null>(null)
  const routeGeometryRef = useRef<RouteGeometry | null>(null)

  /* ================================
     THEME
  ================================ */
  const resolvedTheme = useResolvedTheme()
  const [clientReady, setClientReady] = useState(false)

  /* ================================
     MAP STYLE IDS (RADAR)
  ================================ */
  const darkMapStyleId = '8f2b1606-8dfc-497e-9827-58102e7519d9'
  const lightMapStyleId = '86a406e5-eb60-4582-97c8-27df8b365e7d'

  const mapStyle = useMemo(() => {
    if (!resolvedTheme) return ''
    return `https://api.radar.io/maps/styles/${
      resolvedTheme === 'dark' ? darkMapStyleId : lightMapStyleId
    }?publishableKey=${import.meta.env.VITE_RADAR_PUBLISHABLE_KEY}`
  }, [resolvedTheme])

  /* ================================
     DERIVED CAMERA INTENT
  ================================ */
  const cameraIntent = useMemo(
    () => deriveCameraIntent(selectedOrder),
    [selectedOrder],
  )

  /* ================================
     CLIENT READY (AVOID SSR ISSUES)
  ================================ */
  useEffect(() => {
    setClientReady(true)
  }, [])

  /* ================================
     DERIVED MAP ENTITIES (PURE)
  ================================ */
  const mapEntities = useMemo(
    () => deriveMapEntities(selectedOrder),
    [selectedOrder],
  )

  /* ================================
     INIT MAP (RUNS ONCE)
  ================================ */
  useEffect(() => {
    if (!clientReady || !mapRef.current || !mapStyle || mapInstance.current)
      return

    const fallbackCenter: [number, number] = [
      selectedOrder.stops[0].longitude,
      selectedOrder.stops[0].latitude,
    ]

    const center: [number, number] = mapEntities.showTruck
      ? [selectedOrder.driver.longitude, selectedOrder.driver.latitude]
      : fallbackCenter

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: mapStyle,
      center,
      zoom: 12,
    })

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left',
    )

    mapInstance.current = map

    map.on('load', () => {
      updateMarkersAndRoute()
    })

    return () => {
      map.remove()
      mapInstance.current = null
      markersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientReady, mapStyle])

  /* ================================
     MARKERS + ROUTE ORCHESTRATOR
  ================================ */
  const updateMarkersAndRoute = useCallback(async () => {
    const map = mapInstance.current
    if (!map || !map.isStyleLoaded()) return

    /* ---------- CLEAR MARKERS ---------- */
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    /* ---------- ADD MARKERS ---------- */
    const markerConfigs = buildOrderMarkers(selectedOrder, mapEntities)
    markersRef.current = renderMarkers(map, markerConfigs, resolvedTheme)

    /* ---------- ROUTE LAYER IDS ---------- */
    const completedLayerId = 'route-completed'
    const activeLayerId = 'route-active'
    const completedSourceId = `${completedLayerId}-source`
    const activeSourceId = `${activeLayerId}-source`

    /* ---------- CLEANUP EXISTING ROUTES ---------- */
    ;[completedLayerId, activeLayerId].forEach((layerId) => {
      if (map.getLayer(layerId)) map.removeLayer(layerId)
    })
    ;[completedSourceId, activeSourceId].forEach((sourceId) => {
      if (map.getSource(sourceId)) map.removeSource(sourceId)
    })

    /* ---------- ROUTING ---------- */
    const pickup = selectedOrder.stops.find((s) => s.type === 'PICKUP')
    const dropoff = selectedOrder.stops.find((s) => s.type === 'DROPOFF')

    // If truck is not present or pickup/dropoff missing, skip fetching but we already cleaned up old routes
    if (!pickup || !dropoff || !mapEntities.showTruck) return

    const truck: [number, number] = [
      selectedOrder.driver.longitude,
      selectedOrder.driver.latitude,
    ]
    const pickupCoord: [number, number] = [pickup.longitude, pickup.latitude]
    const dropoffCoord: [number, number] = [dropoff.longitude, dropoff.latitude]

    /* ---------- COMPLETED SEGMENT (PICKUP → TRUCK) ---------- */
    if (mapEntities.showPickup) {
      const completedRoute = await fetchRadarRoute({
        pickup: pickupCoord,
        truck,
        dropoff: undefined,
        mode: 'COMPLETED',
      })

      drawRouteSegment(
        map,
        completedRoute,
        resolvedTheme,
        completedLayerId,
        'COMPLETED', // faded / dashed
      )
    }

    /* ---------- ACTIVE SEGMENT (TRUCK → DROPOFF) ---------- */
    if (mapEntities.showDropoff) {
      const activeRoute = await fetchRadarRoute({
        pickup: undefined,
        truck,
        dropoff: dropoffCoord,
        mode: mapEntities.routeMode,
      })

      // AFTER activeRoute is fetched
      routeGeometryRef.current = buildRouteGeometry(
        activeRoute?.geometry.coordinates as LngLat[],
      )

      motionRef.current = {
        distanceAlongRoute: 0,
        targetDistance: 0,
        speed: 15, // m/s
        lastTickAt: performance.now(),
      }

      drawRouteSegment(
        map,
        activeRoute,
        resolvedTheme,
        activeLayerId,
        'ACTIVE', // solid / bright
      )
    }
  }, [selectedOrder, mapEntities, resolvedTheme])

  /* ================================
     REACT TO ORDER / THEME CHANGES
  ================================ */
  useEffect(() => {
    if (!mapInstance.current || !mapInstance.current.isStyleLoaded()) return
    updateMarkersAndRoute()
  }, [selectedOrder, resolvedTheme, updateMarkersAndRoute])

  /* ================================
     ADD CAMERA APPLICATION EFFECT
  ================================ */
  const pickup = selectedOrder.stops.find((s) => s.type === 'PICKUP')
  const dropoff = selectedOrder.stops.find((s) => s.type === 'DROPOFF')

  const cameraContext = useMemo(
    () => ({
      map: mapInstance.current,
      truck: mapEntities.showTruck
        ? [selectedOrder.driver.longitude, selectedOrder.driver.latitude]
        : undefined,
      pickup: pickup ? [pickup.longitude, pickup.latitude] : undefined,
      dropoff: dropoff ? [dropoff.longitude, dropoff.latitude] : undefined,
      routeBounds: mapInstance.current?.getBounds() ?? undefined,
    }),
    [mapInstance.current, mapEntities, selectedOrder],
  ) as CameraContext

  useMapCameraController({
    mapRef: mapInstance,
    cameraStateRef,
    cameraIntent,
    cameraContext,
  })

  /* ================================
     ADD CAMERA APPLICATION EFFECT
  ================================ */
  useTruckMotion({
    route: routeGeometryRef.current,
    motionRef: motionRef as RefObject<TruckMotionState>,
    onUpdate: (lngLat, bearing) => {
      truckMarker.setLngLat(lngLat)
      truckMarker.setRotation(bearing)
    },
  })
  /* ================================
     RESET CAMERA WHEN ORDER CHANGES
  ================================ */
  useEffect(() => {
    cameraStateRef.current = createCameraState()
  }, [selectedOrder.id])

  /* ================================
     UI
  ================================ */
  const { name, phone, email, availability } = selectedOrder.driver

  return (
    <div className="relative h-120 lg:h-auto lg:flex-1 overflow-hidden">
      {/* SIDE PANEL */}
      <div className="absolute right-4 top-4 z-10 h-full w-[235px]">
        <div className="flex h-full flex-col gap-4">
          <DriverInformation
            name={name}
            phone={phone}
            availability={availability}
            email={email}
          />
          <Timeline events={selectedOrder.timeline} />
        </div>
      </div>

      {/* MAP */}
      <div
        ref={mapRef}
        className={`h-full w-full ${
          !clientReady || !resolvedTheme ? 'invisible' : ''
        }`}
      />
    </div>
  )
}
