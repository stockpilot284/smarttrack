/**
 * gps-feed.types.ts
 *
 * ConnectionStatus — what the UI shows in ConnectionBanner.
 *   connected     → transport is up (WS or polling), data flowing
 *   connecting    → initial connect or reconnect in progress
 *   disconnected  → transport is definitively down
 *
 * No 'stale' here — a connected but stationary truck is handled separately
 * via the 'stationary' signal, not by downgrading the connection status.
 *
 * FeedConnectionState — emitted by useGPSFeed on transport events.
 *   connecting    → WS connecting / polling starting
 *   connected     → WS opened OR first poll succeeded
 *   disconnected  → WS closed unexpectedly OR polling HTTP error
 *   shutdown      → deliberate shutdown, do not reconnect
 *
 * FeedTransport — which transport is currently active.
 *   websocket     → primary
 *   polling       → fallback (WS failed, polling took over)
 */

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export type FeedConnectionState =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'shutdown'

export type FeedTransport = 'websocket' | 'polling'

export interface GPSPayload {
  tripId: string
  latitude: number
  longitude: number
  bearing: number
  speedMs: number
  timestamp: string
}
