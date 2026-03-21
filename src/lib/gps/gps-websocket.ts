/**
 * gps-websocket.ts
 *
 * Manages a single WebSocket connection to the GPS feed.
 * Handles connection, reconnection with exponential backoff,
 * and message parsing. Consumed by useGPSFeed.
 */

import { GPSPayload } from './gps-feed.types'

const MAX_RECONNECT_ATTEMPTS = 5
const BASE_RECONNECT_DELAY_MS = 1_000
const MAX_RECONNECT_DELAY_MS = 30_000

interface GPSWebSocketOptions {
  url: string // wss://... with :tripId already interpolated
  token: string
  onMessage: (payload: GPSPayload) => void
  onOpen: () => void
  onClose: () => void
  onError: (error: Event) => void
}

export class GPSWebSocket {
  private ws: WebSocket | null = null
  private opts: GPSWebSocketOptions
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isManuallyClosed = false

  constructor(opts: GPSWebSocketOptions) {
    this.opts = opts
  }

  connect() {
    this.isManuallyClosed = false
    this.openConnection()
  }

  disconnect() {
    this.isManuallyClosed = true
    this.clearReconnectTimer()
    this.ws?.close()
    this.ws = null
  }

  private openConnection() {
    // Append token as query param — browsers cannot set WS headers
    const urlWithToken = `${this.opts.url}${
      this.opts.url.includes('?') ? '&' : '?'
    }token=${encodeURIComponent(this.opts.token)}`

    this.ws = new WebSocket(urlWithToken)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.opts.onOpen()
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data) as GPSPayload
        if (this.isValidPayload(payload)) {
          this.opts.onMessage(payload)
        } else {
          console.warn('[GPSWebSocket] Ignoring malformed payload:', payload)
        }
      } catch {
        console.warn('[GPSWebSocket] Failed to parse message:', event.data)
      }
    }

    this.ws.onerror = (error: Event) => {
      this.opts.onError(error)
    }

    this.ws.onclose = () => {
      this.opts.onClose()
      if (!this.isManuallyClosed) {
        this.scheduleReconnect()
      }
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn('[GPSWebSocket] Max reconnect attempts reached — giving up')
      return
    }

    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * 2 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    )

    console.log(
      `[GPSWebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`,
    )

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.openConnection()
    }, delay)
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private isValidPayload(p: any): p is GPSPayload {
    return (
      typeof p?.latitude === 'number' &&
      typeof p?.longitude === 'number' &&
      typeof p?.bearing === 'number' &&
      typeof p?.speed === 'number'
    )
  }
}
