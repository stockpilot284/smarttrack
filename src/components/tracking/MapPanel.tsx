import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { Spinner } from '../Spinner'
import { AlertTriangle, Crosshair } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { useMap } from '@/hooks/use-map'
import { useMapThemeSync } from '@/hooks/use-map-theme-sync'
import { useMapCamera } from '@/hooks/use-map-camera'
import { TrackingItem } from '@/types/tracking.type'
import { useTripRoute } from '@/hooks/use-trip-route'
import { useRouteLayer } from '@/hooks/use-route-layer'
import { useTripMarkers } from '@/hooks/use-trip-markers'
import { useTruckMotion, TruckMotionRef } from '@/hooks/use-truck-motion'
import { truckSVG } from '@/lib/map/map-markers'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createMarkerPopup } from '@/lib/map/create-marker-popup'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { RouteGeometry } from '@/lib/routing/routing.types'

const DARK_MAP_STYLE_ID = '8f2b1606-8dfc-497e-9827-58102e7519d9'
const LIGHT_MAP_STYLE_ID = '86a406e5-eb60-4582-97c8-27df8b365e7d'

const SIMULATION_SPEED_MS = 14
const CAMERA_IDLE_TIMEOUT = 3 * 60 * 1000

interface MapPanelProps {
  trackingItem?: TrackingItem | null
  highlightedStopId?: string | null
}

export default function MapPanel({
  trackingItem,
  highlightedStopId,
}: MapPanelProps) {
  const { resolvedTheme } = useResolvedTheme()
  const trip = trackingItem
  const truckMarkerRef = useRef<maplibregl.Marker | null>(null)
  const truckInnerRef = useRef<HTMLDivElement | null>(null)
  const motionRef = useRef<TruckMotionRef | null>(null)
  const [isUserControlling, setIsUserControlling] = useState(false)
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometry | null>(null)

  const stopCoordinates = useMemo(() => {
    if (!trip) return []
    return trip.stops.map((s) => [s.longitude, s.latitude] as [number, number])
  }, [trip])

  const {
    route,
    loading: routeLoading,
    error: routeError,
  } = useTripRoute(stopCoordinates)

  useEffect(() => {
    const coords = route?.geometry?.coordinates as
      | [number, number][]
      | undefined
    if (!coords?.length) {
      setRouteGeometry(null)
      return
    }
    setRouteGeometry(buildRouteGeometry(coords))
  }, [route?.geometry?.coordinates])

  useEffect(() => {
    if (!routeGeometry) return

    const totalDistance = routeGeometry.totalLength

    motionRef.current = {
      distanceAlongRoute: 0,
      targetDistance: 0,
      speed: SIMULATION_SPEED_MS,
      lastTickAt: performance.now(),
    }

    const interval = setInterval(() => {
      const m = motionRef.current
      if (!m) return
      const next = m.targetDistance + SIMULATION_SPEED_MS * 0.5
      if (next >= totalDistance) {
        m.targetDistance = 0
        m.distanceAlongRoute = 0
        m.lastTickAt = performance.now()
      } else {
        m.targetDistance = next
      }
    }, 500)

    return () => {
      clearInterval(interval)
      motionRef.current = null
    }
  }, [routeGeometry])

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
    initialCenter: trip?.vehicle
      ? [trip.vehicle.longitude, trip.vehicle.latitude]
      : [0, 0],
    initialZoom: 15,
  })

  const onUserInteractionStart = useCallback(() => {
    setIsUserControlling(true)
  }, [])

  const onAutoResumed = useCallback(() => {
    setIsUserControlling(false)
  }, [])

  const { updateTruckPosition, recenter } = useMapCamera(
    mapInstance,
    isMapLoaded,
    {
      idleTimeout: CAMERA_IDLE_TIMEOUT,
      onUserInteractionStart,
      onAutoResumed,
    },
  )

  useMapThemeSync(mapInstance, resolvedTheme, mapStyleUrl)
  useRouteLayer(mapInstance.current, route, trip?.stops || [], resolvedTheme)
  useTripMarkers({
    map: mapInstance.current,
    isMapLoaded,
    stops: trip?.stops || [],
    theme: resolvedTheme,
    highlightedStopId,
  })

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded || !trip) return

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

  useTruckMotion({
    route: routeGeometry,
    motionRef,
    onUpdate: (lngLat, bearing) => {
      const marker = truckMarkerRef.current
      if (!marker) return

      marker.setLngLat([lngLat[0], lngLat[1]])

      if (truckInnerRef.current) {
        truckInnerRef.current.style.transform = `rotate(${bearing}deg)`
      }

      updateTruckPosition(lngLat)
    },
  })

  const handleRecenter = () => {
    recenter()
    setIsUserControlling(false)
  }

  const activeError = mapError || routeError

  return (
    <div
      className="relative h-64 sm:h-96 lg:h-full w-full px-4 lg:px-0 rounded-md lg:rounded-none z-0"
      key={trip?.id}
    >
      <div
        ref={mapContainerRef}
        className={`h-full w-full ${!mapStyleUrl || !isMapLoaded ? 'invisible' : ''}`}
      />

      {isUserControlling && !activeError && (
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

      {activeError && (
        <div className="absolute inset-0 bg-muted/50 dark:bg-background backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
          <Card className="w-full md:w-80">
            <CardContent className="flex flex-col items-center gap-6 py-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">{activeError}</p>
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

      {!activeError && (isInitializing || routeLoading) && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center pointer-events-none">
          <Spinner />
        </div>
      )}
    </div>
  )
}
