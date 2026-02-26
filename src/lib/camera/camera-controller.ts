import { CameraContext, CameraIntent, CameraState } from './camera.types'
import { fitBounds, focusPoint, followTruck } from './camera-helpers'

/* ================================
   APPLY CAMERA INTENT
   - CALLED BY TICK LOOP
   - ASSUMES AUTO MODE
================================ */
export function applyCameraIntent(
  map: maplibregl.Map,
  intent: CameraIntent,
  camera: CameraState,
  context: CameraContext,
) {
  if (camera.locked) return

  const { truck, pickup, dropoff, routeBounds } = context

  switch (intent) {
    case 'FIT_ALL':
    case 'FIT_ROUTE': {
      if (routeBounds) {
        fitBounds(map, routeBounds)
      }
      break
    }

    case 'FOLLOW_TRUCK': {
      if (truck) {
        followTruck(map, truck)
      }
      break
    }

    case 'FOCUS_PICKUP': {
      if (pickup) {
        focusPoint(map, pickup)
      }
      break
    }

    case 'FOCUS_DROPOFF': {
      if (dropoff) {
        focusPoint(map, dropoff)
      }
      break
    }

    case 'STATIC':
    default:
      // No-op (camera stays where user left it)
      break
  }

  camera.lastAppliedIntent = intent
}

/* ================================
   AUTO CAMERA RESUME LOGIC
   - CALLED ON EACH TICK
================================ */
export function maybeResumeAutoCamera(camera: CameraState) {
  if (camera.mode !== 'MANUAL') return
  if (!camera.lastUserInteractionAt) return

  const AUTO_RESUME_DELAY = 6000 // ms

  if (Date.now() - camera.lastUserInteractionAt >= AUTO_RESUME_DELAY) {
    camera.mode = 'AUTO'
    camera.lastAppliedIntent = null // force next intent reapply
  }
}
