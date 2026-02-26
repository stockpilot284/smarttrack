import { CameraState } from './camera.types'

export function createCameraState(): CameraState {
  return {
    mode: 'AUTO',
    intent: 'STATIC',
    lastAppliedIntent: null,
    lastUserInteractionAt: null,
    locked: false,
  }
}
