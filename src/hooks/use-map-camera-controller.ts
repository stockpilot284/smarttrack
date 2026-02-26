import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

import {
  CameraIntent,
  CameraState,
  CameraContext,
} from '@/lib/camera/camera.types'

import {
  applyCameraIntent,
  maybeResumeAutoCamera,
} from '@/lib/camera/camera-controller'

/* ================================
   CONSTANTS
================================ */
const CAMERA_TICK_INTERVAL = 750 // ms
const MAP_POLL_INTERVAL = 50 // ms to check if map is ready

/* ================================
   INPUT TYPE
================================ */
type UseMapCameraControllerInput = {
  mapRef: React.RefObject<maplibregl.Map | null>
  cameraStateRef: React.RefObject<CameraState>
  cameraIntent: CameraIntent | null
  cameraContext: CameraContext | null
}

/* ================================
   HOOK
================================ */
export function useMapCameraController({
  mapRef,
  cameraStateRef,
  cameraIntent,
  cameraContext,
}: UseMapCameraControllerInput) {
  const intervalRef = useRef<number | null>(null)
  const listenersAttachedRef = useRef(false)

  // Keep latest intent/context without restarting interval
  const latestIntentRef = useRef<CameraIntent | null>(cameraIntent)
  const latestContextRef = useRef<CameraContext | null>(cameraContext)

  /* ================================
     KEEP INTENT & CONTEXT FRESH
  ================================ */
  useEffect(() => {
    latestIntentRef.current = cameraIntent
  }, [cameraIntent])

  useEffect(() => {
    latestContextRef.current = cameraContext
  }, [cameraContext])

  /* ================================
     USER INTERACTION → MANUAL MODE
     Wait until map exists before attaching
  ================================ */
  useEffect(() => {
    if (listenersAttachedRef.current) return
    const poll = setInterval(() => {
      const map = mapRef.current
      if (!map) return

      const onUserInteraction = () => {
        const camera = cameraStateRef.current
        camera.mode = 'MANUAL'
        camera.lastUserInteractionAt = Date.now()
      }

      map.on('mousedown', onUserInteraction)
      map.on('wheel', onUserInteraction)
      map.on('touchstart', onUserInteraction)
      map.on('dragstart', onUserInteraction)

      // Cleanup when hook unmounts
      listenersAttachedRef.current = true
      clearInterval(poll)
    }, MAP_POLL_INTERVAL)

    return () => clearInterval(poll)
  }, [mapRef, cameraStateRef])

  /* ================================
     CAMERA TICK LOOP (HEARTBEAT)
     Wait until map exists and is style loaded
  ================================ */
  useEffect(() => {
    if (intervalRef.current) return

    intervalRef.current = window.setInterval(() => {
      const map = mapRef.current
      if (!map || !map.isStyleLoaded()) return

      const camera = cameraStateRef.current
      const intent = latestIntentRef.current
      const context = latestContextRef.current

      if (!intent || !context) return

      // MANUAL MODE → maybe resume AUTO after idle
      if (camera.mode === 'MANUAL') {
        maybeResumeAutoCamera(camera)
        return
      }

      // AUTO MODE → apply intent if changed
      if (camera.lastAppliedIntent === intent) return

      applyCameraIntent(map, intent, camera, context)
    }, CAMERA_TICK_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mapRef, cameraStateRef])
}
