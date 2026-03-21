/**
 * gps-feed.types.ts
 *
 * Shared types for the GPS feed system.
 */

/** Raw payload shape from backend GPS source */
export interface GPSPayload {
  latitude: number
  longitude: number
  bearing: number
  speed: number // m/s
}

export type ConnectionStatus = 'connected' | 'stale' | 'disconnected'
export type FeedTransport = 'websocket' | 'polling'
