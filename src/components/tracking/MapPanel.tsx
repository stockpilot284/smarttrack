import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { Spinner } from '../Spinner'
import { AlertTriangle, Crosshair } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { useMap } from '@/hooks/use-map'
import { useMapThemeSync } from '@/hooks/use-map-theme-sync'
import { useMapCamera } from '@/hooks/use-map-camera'
import { useDeviationDetection } from '@/hooks/use-deviation-detection'
import { useDynamicReroute } from '@/hooks/use-dynamic-reroute'
import { useGPSFeed } from '@/hooks/use-gps-feed'
import { useConnectionStatus } from '@/hooks/use-connection-status'
import { useStationaryDetection } from '@/hooks/use-stationary-detection'
import { useStopArrival } from '@/hooks/use-stop-arrival'
import { useStopArrivalToast } from '@/hooks/use-stop-arrival-toast'
import { useRouteProgress } from '@/hooks/use-route-progress'
import { useTripCompletion, TripSummary } from '@/hooks/use-trip-completion'
import {
  Stop,
  TrackingItem,
  TripFailureReason,
  CancellationInfo,
  isTripTerminal,
  isTripTrackable,
  deriveOrderStatusFromStop,
} from '@/types/tracking.type'
import { sortTripStops } from '@/lib/routing/sort-trip-stops'
import { OrderStatus } from '@/types/order.type'
import { useTripRoute } from '@/hooks/use-trip-route'
import { useRouteLayer } from '@/hooks/use-route-layer'
import { useTripMarkers } from '@/hooks/use-trip-markers'
import { useTruckMotion, TruckMotionRef } from '@/hooks/use-truck-motion'
import { DeviationBanner } from '@/components/tracking/DeviationBanner'
import { ConnectionBanner } from '@/components/tracking/ConnectionBanner'
import { StationaryIndicator } from '@/components/tracking/StationaryIndicator'
import { RouteProgressHUD } from '@/components/tracking/RouteProgressHUD'
import { TripTerminalOverlay } from '@/components/tracking/TripTerminalOverlay'
import { truckSVG } from '@/lib/map/map-markers'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createMarkerPopup } from '@/lib/map/create-marker-popup'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { projectPointOntoRoute } from '@/lib/routing/point-to-route-distance'
import { RouteGeometry, LngLat } from '@/lib/routing/routing.types'
import {
  ConnectionStatus,
  FeedConnectionState,
  FeedTransport,
} from '@/lib/gps/gps-feed.types'

const DARK_MAP_STYLE_ID = '8f2b1606-8dfc-497e-9827-58102e7519d9'
const LIGHT_MAP_STYLE_ID = '86a406e5-eb60-4582-97c8-27df8b365e7d'
const CAMERA_IDLE_TIMEOUT = 3 * 60 * 1000
const FOLLOW_ZOOM = 15

interface MapPanelProps {
  trackingItem?: TrackingItem | null
  highlightedStopId?: string | null
  authToken: string
  tripStartedAt?: Date | null
  onTripStarted?: () => void
  onTripComplete?: (summary: TripSummary) => void
  onTripFailed?: (reason?: TripFailureReason) => void
  onTripCancelled?: (info?: CancellationInfo) => void
  onOrderStatusChange?: (orderId: string, status: OrderStatus) => void
}

export default function MapPanel({
  trackingItem,
  highlightedStopId,
  authToken,
  tripStartedAt = null,
  onTripStarted,
  onTripComplete,
  onTripFailed,
  onTripCancelled,
  onOrderStatusChange,
}: MapPanelProps) {
  const { resolvedTheme } = useResolvedTheme()
  const trip = trackingItem

  const tripStatus = trip?.status ?? 'ASSIGNED'
  const isTrackable = isTripTrackable(tripStatus)
  const isTerminalFromProps = isTripTerminal(tripStatus)

  const stops = useMemo<Stop[]>(() => {
    if (!trip?.stops?.length) return []
    try {
      return sortTripStops(trip.stops)
    } catch (err) {
      console.error('[MapPanel] Invalid stop order:', err)
      return trip.stops
    }
  }, [trip?.stops])

  const truckMarkerRef = useRef<maplibregl.Marker | null>(null)
  const truckInnerRef = useRef<HTMLDivElement | null>(null)
  const motionRef = useRef<TruckMotionRef | null>(null)
  const [isUserControlling, setIsUserControlling] = useState(false)
  const hasTransitionedToInTransitRef = useRef(false)
  const hasInitialFocusedRef = useRef(false)

  // Connection state — driven by real transport events, not a staleness clock
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting')
  const [activeTransport, setActiveTransport] = useState<FeedTransport | null>(
    null,
  )
  const [disconnectedAt, setDisconnectedAt] = useState<Date | null>(null)
  const connectionStatusRef = useRef<ConnectionStatus>('connecting')

  const [approachingStopId, setApproachingStopId] = useState<string | null>(
    null,
  )
  const [locallyArrivedIds, setLocallyArrivedIds] = useState<Set<string>>(
    new Set(),
  )

  const [activeRoute, setActiveRoute] = useState<any>(null)
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometry | null>(null)

  const lastDeviationRef = useRef<{
    position: [number, number]
    remainingStops: any[]
  } | null>(null)
  const deviationCountRef = useRef(0)

  // ─── Truck GPS position ───────────────────────────────────────────────────
  //
  // null when vehicle has no record or coords are [0,0] (GPS cold start).
  // Polyline is always drawn from stops — this only affects camera + motionRef.
  const initialTruckPosition = useMemo<LngLat | null>(() => {
    if (!trip?.vehicle) return null
    if (trip.vehicle.latitude === 0 && trip.vehicle.longitude === 0) return null
    return [trip.vehicle.longitude, trip.vehicle.latitude]
  }, [trip?.vehicle])

  // ─── Initial map center ───────────────────────────────────────────────────
  //
  // 1. Truck GPS  2. First PICKUP stop  3. First stop  4. [0,0]
  const initialCenter = useMemo<LngLat>(() => {
    if (initialTruckPosition) return initialTruckPosition
    const firstPickup = stops.find((s) => s.type === 'PICKUP')
    if (firstPickup) return [firstPickup.longitude, firstPickup.latitude]
    const firstStop = stops[0]
    if (firstStop) return [firstStop.longitude, firstStop.latitude]
    return [0, 0]
  }, [initialTruckPosition, stops])

  // ─── Route coordinates ────────────────────────────────────────────────────
  //
  // Always derived from stops — never from vehicle position.
  const stopCoordinates = useMemo(
    () => stops.map((s) => [s.longitude, s.latitude] as [number, number]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stops.map((s) => `${s.id}:${s.longitude},${s.latitude}`).join('|')],
  )

  const {
    route: initialRoute,
    loading: routeLoading,
    error: routeError,
  } = useTripRoute(stopCoordinates)

  useEffect(() => {
    if (initialRoute) setActiveRoute(initialRoute)
  }, [initialRoute])

  useEffect(() => {
    const coords = activeRoute?.geometry?.coordinates as
      | [number, number][]
      | undefined
    if (!coords?.length) {
      setRouteGeometry(null)
      return
    }
    setRouteGeometry(buildRouteGeometry(coords))
  }, [activeRoute])

  // Seed motionRef when geometry arrives.
  // No GPS → seededDistance = 0 → full route draws as "remaining" (blue).
  // GPS present → project onto route so split starts at real truck position.
  useEffect(() => {
    if (!routeGeometry) return
    const seededDistance = initialTruckPosition
      ? projectPointOntoRoute(initialTruckPosition, routeGeometry)
      : 0
    motionRef.current = {
      distanceAlongRoute: seededDistance,
      targetDistance: seededDistance,
      speed: trip?.vehicle?.speed ?? 0,
      lastTickAt: performance.now(),
    }
    return () => {
      motionRef.current = null
    }
  }, [routeGeometry, initialTruckPosition, trip?.vehicle?.speed])

  const mapStyleUrl = useMemo(() => {
    if (!resolvedTheme) return ''
    const styleId =
      resolvedTheme === 'dark' ? DARK_MAP_STYLE_ID : LIGHT_MAP_STYLE_ID
    return `https://api.radar.io/maps/styles/${styleId}?publishableKey=${import.meta.env.VITE_RADAR_PUBLISHABLE_KEY}`
  }, [resolvedTheme])

  const {
    mapContainerRef,
    mapInstance,
    isMapLoaded,
    isInitializing,
    error: mapError,
  } = useMap({
    mapStyleUrl,
    initialCenter,
    initialZoom: FOLLOW_ZOOM,
  })

  // ─── Camera ──────────────────────────────────────────────────────────────

  const onUserInteractionStart = useCallback(
    () => setIsUserControlling(true),
    [],
  )
  const onAutoResumed = useCallback(() => setIsUserControlling(false), [])

  const { updateTruckPosition, setTruckPosition, recenter, getCameraMode } =
    useMapCamera(mapInstance, isMapLoaded, {
      idleTimeout: CAMERA_IDLE_TIMEOUT,
      followZoom: FOLLOW_ZOOM,
      onUserInteractionStart,
      onAutoResumed,
      initialPosition: initialTruckPosition,
    })

  // Jump to real truck position once map is ready and GPS is available.
  // When GPS isn't ready yet, map stays on stop fallback center — correct.
  useEffect(() => {
    if (!isMapLoaded || !initialTruckPosition || hasInitialFocusedRef.current)
      return
    const map = mapInstance.current
    if (!map) return
    hasInitialFocusedRef.current = true
    map.jumpTo({
      center: [initialTruckPosition[0], initialTruckPosition[1]],
      zoom: FOLLOW_ZOOM,
    })
  }, [isMapLoaded, initialTruckPosition, mapInstance])

  useEffect(() => {
    if (!isMapLoaded) hasInitialFocusedRef.current = false
  }, [isMapLoaded])

  // ─── Reroute ─────────────────────────────────────────────────────────────

  const { rerouteStatus, triggerReroute, resetStatus } = useDynamicReroute({
    onRerouteSuccess: useCallback((newRoute, newGeometry) => {
      setActiveRoute(newRoute)
      setRouteGeometry(newGeometry)
      if (motionRef.current && truckMarkerRef.current) {
        const cur = truckMarkerRef.current.getLngLat()
        const projected = projectPointOntoRoute([cur.lng, cur.lat], newGeometry)
        motionRef.current.distanceAlongRoute = projected
        motionRef.current.targetDistance = projected
        motionRef.current.lastTickAt = performance.now()
      }
    }, []),
    onRerouteError: useCallback(() => {}, []),
  })

  // ─── Stop arrival toasts ──────────────────────────────────────────────────

  const { notifyApproaching, notifyArrived, notifyDeparted } =
    useStopArrivalToast()

  // ─── Stop arrival detection ───────────────────────────────────────────────

  const {
    updatePosition: updateStopPosition,
    visitedStopIds,
    getNextStop,
  } = useStopArrival({
    stops,
    onApproaching: useCallback(
      (stop: Stop, distanceM: number) => {
        setApproachingStopId(stop.id)
        notifyApproaching(stop, distanceM)
      },
      [notifyApproaching],
    ),
    onArrived: useCallback(
      (stop: Stop) => {
        setLocallyArrivedIds((prev) => new Set([...prev, stop.id]))
        setApproachingStopId(null)
        notifyArrived(stop)
      },
      [notifyArrived],
    ),
    onDeparted: useCallback(
      (stop: Stop) => {
        setLocallyArrivedIds((prev) => {
          const n = new Set(prev)
          n.delete(stop.id)
          return n
        })
        notifyDeparted(stop)
        if (stop.orderId && onOrderStatusChange) {
          const s = deriveOrderStatusFromStop(stop.type, stop.status)
          if (s) onOrderStatusChange(stop.orderId, s)
        }
      },
      [notifyDeparted, onOrderStatusChange],
    ),
  })

  // ─── Route progress ───────────────────────────────────────────────────────

  const nextStop = getNextStop()

  const progressMetrics = useRouteProgress({
    motionRef,
    routeGeometry,
    nextStop,
    visitedStopIds,
    totalStops: stops.length,
  })

  // ─── Deviation detection ──────────────────────────────────────────────────

  const { updatePosition: updateDeviationPosition, getDeviationState } =
    useDeviationDetection({
      routeGeometry,
      stops,
      visitedStopIds,
      onDeviationConfirmed: useCallback(
        (position, remainingStops) => {
          deviationCountRef.current += 1
          lastDeviationRef.current = { position, remainingStops }
          triggerReroute(position, remainingStops)
        },
        [triggerReroute],
      ),
      onReturned: useCallback(() => resetStatus(), [resetStatus]),
    })

  // ─── GPS feed ─────────────────────────────────────────────────────────────
  //
  // Declared before useTripCompletion so shutdownGPS is available
  // in the completion callbacks below.

  // notifyConnectionState and notifySpeed are declared after their hooks,
  // so we use stable refs to allow useGPSFeed callbacks to call them without
  // creating a circular dependency in hook order.
  const notifyConnectionStateRef = useRef<
    ((state: FeedConnectionState) => void) | null
  >(null)
  const notifySpeedRef = useRef<((speedMs: number) => void) | null>(null)

  const { shutdown: shutdownGPS } = useGPSFeed({
    tripId: isTrackable ? (trip?.id ?? '') : '',
    token: authToken,
    routeGeometry,
    motionRef,

    onConnectionStateChange: useCallback(
      (state: FeedConnectionState, transport: FeedTransport) => {
        notifyConnectionStateRef.current?.(state)
        setActiveTransport(transport)
      },
      [],
    ),

    onPositionUpdate: useCallback(
      (lngLat: LngLat, _bearing: number, speedMs: number) => {
        if (isTerminalFromProps) return

        notifySpeedRef.current?.(speedMs)

        if (
          tripStatus === 'ASSIGNED' &&
          speedMs > 0 &&
          !hasTransitionedToInTransitRef.current
        ) {
          hasTransitionedToInTransitRef.current = true
          onTripStarted?.()
        }

        if (
          tripStatus === 'IN_TRANSIT' &&
          connectionStatusRef.current !== 'disconnected'
        ) {
          updateTruckPosition(lngLat)
        }

        if (tripStatus === 'IN_TRANSIT') {
          updateStopPosition(lngLat)
          updateDeviationPosition(lngLat, speedMs)
        }
      },
      [
        isTerminalFromProps,
        tripStatus,
        updateTruckPosition,
        updateStopPosition,
        updateDeviationPosition,
        onTripStarted,
      ],
    ),
  })

  // ─── Trip completion ──────────────────────────────────────────────────────
  //
  // Must come before useConnectionStatus and useStationaryDetection
  // because both consume isTerminal from this hook.

  const { terminalState, isTerminal } = useTripCompletion({
    motionRef,
    routeGeometry,
    visitedStopIds,
    totalStops: stops.length,
    tripStatus,
    failureReason: trip?.failureReason,
    cancellationInfo: trip?.cancellationInfo,
    deviationCountRef,
    tripStartedAt,
    onTripComplete: useCallback(
      (summary: TripSummary) => {
        shutdownGPS()
        connectionStatusRef.current = 'disconnected'
        onTripComplete?.(summary)
      },
      [shutdownGPS, onTripComplete],
    ),
    onTripFailed: useCallback(
      (reason?: TripFailureReason) => {
        shutdownGPS()
        connectionStatusRef.current = 'disconnected'
        onTripFailed?.(reason)
      },
      [shutdownGPS, onTripFailed],
    ),
    onTripCancelled: useCallback(
      (info?: CancellationInfo) => {
        shutdownGPS()
        connectionStatusRef.current = 'disconnected'
        onTripCancelled?.(info)
      },
      [shutdownGPS, onTripCancelled],
    ),
  })

  useEffect(() => {
    if (isTerminalFromProps) shutdownGPS()
  }, [isTerminalFromProps, shutdownGPS])

  // ─── Connection status ────────────────────────────────────────────────────
  //
  // Placed after useTripCompletion so isTerminal is available.
  // Source of truth is transport events from useGPSFeed via notifyConnectionStateRef.

  const { status: gpsConnectionStatus, notifyConnectionState } =
    useConnectionStatus({
      enabled: !isTerminal && !isTerminalFromProps,
      onStatusChange: useCallback((status: ConnectionStatus) => {
        connectionStatusRef.current = status
        setConnectionStatus(status)
        if (status === 'disconnected') setDisconnectedAt(new Date())
        if (status === 'connected') setDisconnectedAt(null)
      }, []),
    })

  // Sync notifyConnectionState into the ref so the GPS feed callback
  // (declared above) can call it without a forward-reference error
  useEffect(() => {
    notifyConnectionStateRef.current = notifyConnectionState
  }, [notifyConnectionState])

  // ─── Stationary detection ─────────────────────────────────────────────────
  //
  // Placed after useTripCompletion so isTerminal is available.
  // Only active during IN_TRANSIT — doesn't fire at stops or pre-trip.

  const { isStationary, notifySpeed } = useStationaryDetection({
    enabled: !isTerminal && !isTerminalFromProps && tripStatus === 'IN_TRANSIT',
  })

  // Sync notifySpeed into the ref so the GPS feed callback can call it
  useEffect(() => {
    notifySpeedRef.current = notifySpeed
  }, [notifySpeed])

  // ─── Map layers ───────────────────────────────────────────────────────────

  useMapThemeSync(mapInstance, resolvedTheme, mapStyleUrl)
  useRouteLayer(mapInstance, isMapLoaded, routeGeometry, stops, resolvedTheme, {
    motionRef,
  })
  useTripMarkers({
    map: mapInstance.current,
    isMapLoaded,
    stops,
    theme: resolvedTheme,
    highlightedStopId,
    locallyArrivedIds,
    approachingStopId,
  })

  // ─── Truck marker ─────────────────────────────────────────────────────────
  //
  // Not rendered until valid GPS coordinates exist.
  // Route and stop pins are always visible regardless.

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded || !trip) return
    if (
      !trip.vehicle ||
      (trip.vehicle.latitude === 0 && trip.vehicle.longitude === 0)
    ) {
      return
    }

    truckMarkerRef.current?.remove()
    truckMarkerRef.current = null
    truckInnerRef.current = null

    const outer = document.createElement('div')
    outer.className = 'truck-marker'
    const inner = document.createElement('div')
    inner.style.transformOrigin = 'center center'
    inner.innerHTML = truckSVG(resolvedTheme)
    outer.appendChild(inner)
    truckInnerRef.current = inner

    const popup = createMarkerPopup(
      'truck',
      {
        name: trip.driver.name,
        phone: trip.driver.phone,
        email: trip.driver.email,
        availability: trip.driver.availability,
        vehicle: trip.vehicle,
      },
      resolvedTheme,
    )

    truckMarkerRef.current = new maplibregl.Marker({
      element: outer,
      anchor: 'center',
    })
      .setLngLat([trip.vehicle.longitude, trip.vehicle.latitude])
      .setPopup(popup)
      .addTo(map)

    map.resize()

    return () => {
      truckMarkerRef.current?.remove()
      truckMarkerRef.current = null
      truckInnerRef.current = null
    }
  }, [mapInstance, isMapLoaded, trip, resolvedTheme])

  // ─── Truck motion ─────────────────────────────────────────────────────────

  useTruckMotion({
    route: routeGeometry,
    motionRef,
    onUpdate: (lngLat, bearing) => {
      if (isTerminal) return
      const marker = truckMarkerRef.current
      if (!marker) return
      marker.setLngLat([lngLat[0], lngLat[1]])
      if (truckInnerRef.current)
        truckInnerRef.current.style.transform = `rotate(${bearing}deg)`
      setTruckPosition(lngLat)
    },
  })

  // ─── UI ───────────────────────────────────────────────────────────────────

  const handleRecenter = () => {
    recenter()
    setIsUserControlling(false)
  }
  const handleBannerRetry = () => {
    if (!lastDeviationRef.current) return
    triggerReroute(
      lastDeviationRef.current.position,
      lastDeviationRef.current.remainingStops,
    )
  }

  const { deviationMetres } = getDeviationState()
  const deviationIsActive = rerouteStatus !== 'idle'
  const activeError = mapError || routeError
  const showTrackingUI = !isTerminal && !isTerminalFromProps

  return (
    <div className="relative w-full h-full z-0" key={trip?.id}>
      {/* MapLibre canvas */}
      <div
        ref={mapContainerRef}
        className={`absolute inset-0 ${!mapStyleUrl || !isMapLoaded ? 'invisible' : ''}`}
      />

      {/* Route progress HUD */}
      {isMapLoaded &&
        !activeError &&
        showTrackingUI &&
        tripStatus === 'IN_TRANSIT' && (
          <RouteProgressHUD metrics={progressMetrics} nextStop={nextStop} />
        )}

      {/* Deviation + GPS connection banners */}
      {showTrackingUI && (
        <>
          <DeviationBanner
            rerouteStatus={rerouteStatus}
            deviationMetres={deviationMetres}
            onRetry={handleBannerRetry}
            onDismiss={resetStatus}
          />
          <ConnectionBanner
            status={gpsConnectionStatus}
            activeTransport={activeTransport}
            disconnectedAt={disconnectedAt}
            suppressedByDeviation={deviationIsActive}
          />
        </>
      )}

      {/* Recenter button — only when truck has GPS */}
      {isUserControlling &&
        !activeError &&
        showTrackingUI &&
        initialTruckPosition && (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRecenter}
              leftIcon={<Crosshair className="h-4 w-4" />}
            >
              Recenter
            </Button>
          </div>
        )}

      {/* Stationary indicator — bottom-left, subtle, informational only */}
      <StationaryIndicator visible={showTrackingUI && isStationary} />

      {/* Terminal overlay */}
      {(isTerminal || isTerminalFromProps) && terminalState && (
        <TripTerminalOverlay
          terminalState={terminalState}
          driverName={trip?.driver.name}
        />
      )}

      {/* Error state */}
      {activeError && (
        <div className="absolute inset-0 bg-muted/50 dark:bg-background backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
          <Card className="w-full max-w-xs">
            <CardContent className="flex flex-col items-center gap-5 py-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-sm font-semibold mb-1">
                  Something went wrong
                </h2>
                <p className="text-xs text-muted-foreground">{activeError}</p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading spinner */}
      {!activeError && (isInitializing || routeLoading) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Spinner />
        </div>
      )}
    </div>
  )
}
