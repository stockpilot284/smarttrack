export type TruckMotionState = {
  distanceAlongRoute: number
  targetDistance: number
  speed: number // meters per second
  lastTickAt: number
}
