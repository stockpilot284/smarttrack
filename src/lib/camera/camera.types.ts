import maplibregl from 'maplibre-gl'

/* ================================
   CAMERA MODES
================================ */
export type CameraMode = 'AUTO' | 'MANUAL'

/* ================================
   CAMERA INTENTS
================================ */
export type CameraIntent =
  | 'FIT_ALL'
  | 'FIT_ROUTE'
  | 'FOLLOW_TRUCK'
  | 'FOCUS_PICKUP'
  | 'FOCUS_DROPOFF'
  | 'STATIC'

/* ================================
   CAMERA STATE
================================ */
export type CameraState = {
  mode: CameraMode
  intent: CameraIntent
  lastAppliedIntent: CameraIntent | null
  lastUserInteractionAt: number | null
  locked: boolean
}

/* ================================
   CAMERA CONTEXT
================================ */
export type CameraContext = {
  map: maplibregl.Map
  truck?: [number, number]
  pickup?: [number, number]
  dropoff?: [number, number]
  routeBounds?: maplibregl.LngLatBoundsLike
}
