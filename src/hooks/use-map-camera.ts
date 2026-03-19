import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { LngLat } from '@/lib/routing/routing.types'

export type CameraMode = 'auto' | 'user' | 'idle'

interface UseMapCameraOptions {
  idleTimeout?: number
  followZoom?: number
  recenterEaseDuration?: number
  followThrottleMs?: number
  followEaseDuration?: number
  onUserInteractionStart?: () => void
  onAutoResumed?: () => void
}

interface UseMapCameraReturn {
  updateTruckPosition: (lngLat: LngLat) => void
  getCameraMode: () => CameraMode
  recenter: () => void
}

export function useMapCamera(
  mapInstance: React.RefObject<maplibregl.Map | null>,
  isMapLoaded: boolean,
  {
    idleTimeout = 3 * 60 * 1000,
    followZoom = 15,
    recenterEaseDuration = 800,
    followThrottleMs = 500,
    followEaseDuration = 450,
    onUserInteractionStart,
    onAutoResumed,
  }: UseMapCameraOptions = {},
): UseMapCameraReturn {
  const cameraModeRef = useRef<CameraMode>('auto')
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTruckPositionRef = useRef<LngLat | null>(null)
  const lastEaseAtRef = useRef<number>(0)
  const userIsInteractingRef = useRef(false)
  const isProgrammaticMoveRef = useRef(false)
  // Counts how many programmatic easeTo calls are in-flight.
  // Only when this hits 0 does moveend clear the programmatic flag.
  const programmaticCountRef = useRef(0)

  const optionsRef = useRef({
    idleTimeout,
    followZoom,
    recenterEaseDuration,
    followThrottleMs,
    followEaseDuration,
    onUserInteractionStart,
    onAutoResumed,
  })
  useEffect(() => {
    optionsRef.current = {
      idleTimeout,
      followZoom,
      recenterEaseDuration,
      followThrottleMs,
      followEaseDuration,
      onUserInteractionStart,
      onAutoResumed,
    }
  })

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  const startIdleCountdown = useCallback(() => {
    clearIdleTimer()
    cameraModeRef.current = 'idle'
    idleTimerRef.current = setTimeout(() => {
      cameraModeRef.current = 'auto'
      optionsRef.current.onAutoResumed?.()
    }, optionsRef.current.idleTimeout)
  }, [clearIdleTimer])

  // Use the map identity (style URL changes produce a new map object) as the
  // dep — isMapLoaded stays true across theme changes on some map hooks,
  // so it cannot be relied on to re-trigger this effect.
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded) return

    cameraModeRef.current = 'auto'
    userIsInteractingRef.current = false
    isProgrammaticMoveRef.current = false
    programmaticCountRef.current = 0
    lastEaseAtRef.current = 0
    clearIdleTimer()

    const onInteractionStart = (e: any) => {
      if (isProgrammaticMoveRef.current) return
      userIsInteractingRef.current = true
      cameraModeRef.current = 'user'
      clearIdleTimer()
      optionsRef.current.onUserInteractionStart?.()
    }

    const onInteractionEnd = (e: any) => {
      if (isProgrammaticMoveRef.current) return
      userIsInteractingRef.current = false
      if (cameraModeRef.current === 'user') startIdleCountdown()
    }

    const onMoveEnd = () => {
      // Decrement the in-flight counter — only clear the flag when ALL
      // overlapping programmatic animations have finished
      if (programmaticCountRef.current > 0) {
        programmaticCountRef.current -= 1
      }
      if (programmaticCountRef.current === 0) {
        isProgrammaticMoveRef.current = false
      }
    }

    map.on('dragstart', onInteractionStart)
    map.on('zoomstart', onInteractionStart)
    map.on('pitchstart', onInteractionStart)
    map.on('dragend', onInteractionEnd)
    map.on('zoomend', onInteractionEnd)
    map.on('pitchend', onInteractionEnd)
    map.on('moveend', onMoveEnd)

    return () => {
      map.off('dragstart', onInteractionStart)
      map.off('zoomstart', onInteractionStart)
      map.off('pitchstart', onInteractionStart)
      map.off('dragend', onInteractionEnd)
      map.off('zoomend', onInteractionEnd)
      map.off('pitchend', onInteractionEnd)
      map.off('moveend', onMoveEnd)
      clearIdleTimer()
    }
  }, [mapInstance, isMapLoaded, clearIdleTimer, startIdleCountdown])

  const programmaticEaseTo = useCallback(
    (map: maplibregl.Map, options: maplibregl.EaseToOptions) => {
      isProgrammaticMoveRef.current = true
      programmaticCountRef.current += 1
      map.easeTo(options)
    },
    [],
  )

  const updateTruckPosition = useCallback((lngLat: LngLat) => {
    lastTruckPositionRef.current = lngLat

    if (cameraModeRef.current !== 'auto' || userIsInteractingRef.current) return

    const map = mapInstance.current
    if (!map) return

    const now = performance.now()
    if (now - lastEaseAtRef.current < optionsRef.current.followThrottleMs)
      return
    lastEaseAtRef.current = now

    programmaticEaseTo(map, {
      center: [lngLat[0], lngLat[1]],
      zoom: optionsRef.current.followZoom,
      duration: optionsRef.current.followEaseDuration,
      easing: (t) => t,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const recenter = useCallback(() => {
    clearIdleTimer()
    cameraModeRef.current = 'auto'
    userIsInteractingRef.current = false

    const map = mapInstance.current
    if (!map || !lastTruckPositionRef.current) return

    // Push lastEaseAtRef forward by the full recenter duration so
    // updateTruckPosition cannot fire another easeTo while recenter is running
    lastEaseAtRef.current =
      performance.now() + optionsRef.current.recenterEaseDuration

    console.log('[recenter] → easeTo')
    programmaticEaseTo(map, {
      center: [
        lastTruckPositionRef.current[0],
        lastTruckPositionRef.current[1],
      ],
      zoom: optionsRef.current.followZoom,
      duration: optionsRef.current.recenterEaseDuration,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCameraMode = useCallback((): CameraMode => {
    return cameraModeRef.current
  }, [])

  return { updateTruckPosition, getCameraMode, recenter }
}
