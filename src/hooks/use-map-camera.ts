/**
 * use-map-camera.ts
 *
 * Camera state machine — auto, user, idle.
 *
 * Exposes:
 *   updateTruckPosition — called from GPS feed, moves camera in auto mode
 *   setTruckPosition    — called from motion loop, syncs recenter target only
 *   recenter            — user-triggered smooth ease back to truck
 *   focusOnLoad         — call once when map loads, jumpTo truck with no side effects
 *   getCameraMode       — read current mode
 */

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
  initialPosition?: LngLat | null
}

interface UseMapCameraReturn {
  updateTruckPosition: (lngLat: LngLat) => void
  setTruckPosition: (lngLat: LngLat) => void
  getCameraMode: () => CameraMode
  recenter: () => void
  /**
   * Call once after isMapLoaded becomes true.
   * Uses jumpTo so it doesn't trigger any map events or touch the
   * camera state machine — purely positions the viewport on the truck.
   */
  focusOnLoad: () => void
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
    initialPosition,
  }: UseMapCameraOptions = {},
): UseMapCameraReturn {
  const cameraModeRef = useRef<CameraMode>('auto')
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTruckPositionRef = useRef<LngLat | null>(initialPosition ?? null)
  const lastEaseAtRef = useRef<number>(0)
  const userIsInteractingRef = useRef(false)
  const isProgrammaticMoveRef = useRef(false)
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

  // Update seed if initialPosition arrives after first render
  useEffect(() => {
    if (initialPosition && !lastTruckPositionRef.current) {
      lastTruckPositionRef.current = initialPosition
    }
  }, [initialPosition])

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

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !isMapLoaded) return

    cameraModeRef.current = 'auto'
    userIsInteractingRef.current = false
    isProgrammaticMoveRef.current = false
    programmaticCountRef.current = 0
    lastEaseAtRef.current = 0
    clearIdleTimer()

    const onInteractionStart = () => {
      if (isProgrammaticMoveRef.current) return
      userIsInteractingRef.current = true
      cameraModeRef.current = 'user'
      clearIdleTimer()
      optionsRef.current.onUserInteractionStart?.()
    }

    const onInteractionEnd = () => {
      if (isProgrammaticMoveRef.current) return
      userIsInteractingRef.current = false
      if (cameraModeRef.current === 'user') startIdleCountdown()
    }

    const onMoveEnd = () => {
      if (programmaticCountRef.current > 0) programmaticCountRef.current -= 1
      if (programmaticCountRef.current === 0)
        isProgrammaticMoveRef.current = false
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

  const updateTruckPosition = useCallback((lngLat: LngLat) => {
    lastTruckPositionRef.current = lngLat

    if (cameraModeRef.current !== 'auto' || userIsInteractingRef.current) return

    const map = mapInstance.current
    if (!map) return

    const now = performance.now()
    if (now - lastEaseAtRef.current < optionsRef.current.followThrottleMs)
      return
    lastEaseAtRef.current = now

    isProgrammaticMoveRef.current = true
    programmaticCountRef.current += 1
    map.easeTo({
      center: [lngLat[0], lngLat[1]],
      zoom: optionsRef.current.followZoom,
      duration: optionsRef.current.followEaseDuration,
      easing: (t) => t,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setTruckPosition = useCallback((lngLat: LngLat) => {
    lastTruckPositionRef.current = lngLat
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Instant jump to truck on page load — no animation, no events fired,
   * no interaction with the camera state machine.
   * jumpTo does not emit zoomstart/dragstart so nothing gets misread
   * as user interaction.
   */
  const focusOnLoad = useCallback(() => {
    const map = mapInstance.current
    if (!map || !lastTruckPositionRef.current) return
    map.jumpTo({
      center: [
        lastTruckPositionRef.current[0],
        lastTruckPositionRef.current[1],
      ],
      zoom: optionsRef.current.followZoom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const recenter = useCallback(() => {
    clearIdleTimer()
    cameraModeRef.current = 'auto'
    userIsInteractingRef.current = false

    const map = mapInstance.current
    if (!map || !lastTruckPositionRef.current) return

    isProgrammaticMoveRef.current = true
    programmaticCountRef.current += 1
    map.easeTo({
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

  return {
    updateTruckPosition,
    setTruckPosition,
    getCameraMode,
    recenter,
    focusOnLoad,
  }
}
