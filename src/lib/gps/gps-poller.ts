/**
 * gps-poller.ts
 *
 * HTTP polling fallback for when WebSocket is unavailable.
 * Hits GET /api/trips/:tripId/location on a fixed interval.
 * Consumed by useGPSFeed.
 */

import axios from 'axios'
import { GPSPayload } from './gps-feed.types'

interface GPSPollerOptions {
  tripId: string
  token: string
  intervalMs: number
  onMessage: (payload: GPSPayload) => void
  onError: (error: unknown) => void
}

export class GPSPoller {
  private opts: GPSPollerOptions
  private timer: ReturnType<typeof setInterval> | null = null
  private isRunning = false

  constructor(opts: GPSPollerOptions) {
    this.opts = opts
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true
    // Poll immediately then on interval
    this.poll()
    this.timer = setInterval(() => this.poll(), this.opts.intervalMs)
  }

  stop() {
    this.isRunning = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private async poll() {
    if (!this.isRunning) return

    try {
      const res = await axios.get<GPSPayload>(
        `/api/trips/${this.opts.tripId}/location`,
        {
          headers: {
            Authorization: `Bearer ${this.opts.token}`,
          },
        },
      )

      const payload = res.data
      if (this.isValidPayload(payload)) {
        this.opts.onMessage(payload)
      } else {
        console.warn('[GPSPoller] Ignoring malformed payload:', payload)
      }
    } catch (error) {
      this.opts.onError(error)
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
