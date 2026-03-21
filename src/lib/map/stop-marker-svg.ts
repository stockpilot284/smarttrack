/**
 * stop-marker-svg.ts
 *
 * SVG marker definitions for all stop states.
 * Each marker has a drop shadow and clear visual hierarchy.
 *
 * States:
 *   pending      → grey pin (stop not yet reached)
 *   in_progress  → blue pulsing pin (truck arrived, driver working)
 *   approaching  → amber pulsing ring (truck nearby, heading here)
 *   completed    → green pin with checkmark
 *   failed       → red pin with X
 *   skipped      → muted orange pin with dash
 *
 * Each state has PICKUP and DROPOFF variants — different icons inside
 * so dispatchers can distinguish pickup vs dropoff at a glance.
 */

import { StopType } from '@/types/tracking.type'

type MarkerTheme = 'dark' | 'light' | undefined

// Pickup icon — upward arrow (collecting)
const PICKUP_ICON = `
  <polyline points="12,16 12,8" stroke="white" stroke-width="2"
    stroke-linecap="round"/>
  <polyline points="8.5,11.5 12,8 15.5,11.5" fill="none" stroke="white"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
`

// Dropoff icon — downward arrow (delivering)
const DROPOFF_ICON = `
  <polyline points="12,8 12,16" stroke="white" stroke-width="2"
    stroke-linecap="round"/>
  <polyline points="8.5,12.5 12,16 15.5,12.5" fill="none" stroke="white"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
`

// Checkmark icon for completed state
const CHECK_ICON = `
  <polyline points="8,12 11,15 16,9" fill="none" stroke="white"
    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
`

// X icon for failed state
const X_ICON = `
  <line x1="9" y1="9" x2="15" y2="15" stroke="white" stroke-width="2.2"
    stroke-linecap="round"/>
  <line x1="15" y1="9" x2="9" y2="15" stroke="white" stroke-width="2.2"
    stroke-linecap="round"/>
`

// Dash icon for skipped state
const DASH_ICON = `
  <line x1="8.5" y1="12" x2="15.5" y2="12" stroke="white" stroke-width="2.2"
    stroke-linecap="round"/>
`

/**
 * Pin-shaped marker with a pointed bottom — clear directional indicator.
 * The icon appears in the circular head of the pin.
 */
function pinMarker(fill: string, icon: string, size = 36, opacity = 1): string {
  const s = size
  const cx = s / 2
  // Pin head radius — 42% of total size
  const r = s * 0.42
  // Pin tip y position
  const tipY = s - 2
  // Head center y — sits above the tip with enough room for the pointer
  const headY = r + 2

  return `
    <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"
      xmlns="http://www.w3.org/2000/svg" opacity="${opacity}"
      style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <!-- Pin body: circle head + downward pointer -->
      <path d="
        M ${cx},${tipY}
        C ${cx - 3},${headY + r * 0.6} ${cx - r},${headY + r * 0.3}
          ${cx - r},${headY}
        A ${r},${r} 0 1,1 ${cx + r},${headY}
        C ${cx + r},${headY + r * 0.3} ${cx + 3},${headY + r * 0.6}
          ${cx},${tipY}
        Z
      " fill="${fill}"/>
      <!-- Icon centered in the head -->
      <g transform="translate(${cx - 12}, ${headY - 12})">${icon}</g>
    </svg>`
}

/**
 * Approaching state — larger marker with animated outer ring.
 * CSS animation is injected once into document.head.
 */
function approachingMarker(stopType: StopType): string {
  const icon = stopType === 'PICKUP' ? PICKUP_ICON : DROPOFF_ICON
  const fill = '#f59e0b' // amber

  // Inject keyframe animation once
  if (
    typeof document !== 'undefined' &&
    !document.getElementById('stop-approaching-style')
  ) {
    const style = document.createElement('style')
    style.id = 'stop-approaching-style'
    style.textContent = `
      @keyframes stopApproachPulse {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50%       { opacity: 0.5; transform: scale(1.15); }
      }
      .stop-approach-ring {
        animation: stopApproachPulse 1.4s ease-in-out infinite;
        transform-origin: center;
      }
    `
    document.head.appendChild(style)
  }

  const s = 44
  const cx = s / 2
  const r = s * 0.42
  const headY = r + 2

  return `
    <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"
      xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(0 2px 6px rgba(245,158,11,0.5))">
      <!-- Pulsing outer ring -->
      <circle cx="${cx}" cy="${headY}" r="${r + 5}"
        fill="${fill}" class="stop-approach-ring"/>
      <!-- Pin -->
      <path d="
        M ${cx},${s - 2}
        C ${cx - 3},${headY + r * 0.6} ${cx - r},${headY + r * 0.3}
          ${cx - r},${headY}
        A ${r},${r} 0 1,1 ${cx + r},${headY}
        C ${cx + r},${headY + r * 0.3} ${cx + 3},${headY + r * 0.6}
          ${cx},${s - 2}
        Z
      " fill="${fill}"/>
      <g transform="translate(${cx - 12}, ${headY - 12})">${icon}</g>
    </svg>`
}

/**
 * In-progress state — solid blue with subtle pulse on the head only.
 */
function inProgressMarker(stopType: StopType): string {
  const icon = stopType === 'PICKUP' ? PICKUP_ICON : DROPOFF_ICON
  const fill = '#3b82f6' // blue-500

  if (
    typeof document !== 'undefined' &&
    !document.getElementById('stop-inprogress-style')
  ) {
    const style = document.createElement('style')
    style.id = 'stop-inprogress-style'
    style.textContent = `
      @keyframes stopInProgressPulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.75; }
      }
      .stop-inprogress-head { animation: stopInProgressPulse 1.8s ease-in-out infinite; }
    `
    document.head.appendChild(style)
  }

  const s = 40
  const cx = s / 2
  const r = s * 0.42
  const headY = r + 2
  const tipY = s - 2

  return `
    <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"
      xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(0 2px 6px rgba(59,130,246,0.5))">
      <path class="stop-inprogress-head" d="
        M ${cx},${tipY}
        C ${cx - 3},${headY + r * 0.6} ${cx - r},${headY + r * 0.3}
          ${cx - r},${headY}
        A ${r},${r} 0 1,1 ${cx + r},${headY}
        C ${cx + r},${headY + r * 0.3} ${cx + 3},${headY + r * 0.6}
          ${cx},${tipY}
        Z
      " fill="${fill}"/>
      <g transform="translate(${cx - 12}, ${headY - 12})">${icon}</g>
    </svg>`
}

export type StopMarkerState =
  | 'pending'
  | 'in_progress'
  | 'approaching'
  | 'completed'
  | 'failed'
  | 'skipped'

export function stopMarkerSVG(
  state: StopMarkerState,
  stopType: StopType,
  _theme: MarkerTheme,
): string {
  const icon = stopType === 'PICKUP' ? PICKUP_ICON : DROPOFF_ICON

  switch (state) {
    case 'pending':
      // Grey — neutral, not yet relevant
      return pinMarker('#6b7280', icon, 34)

    case 'in_progress':
      return inProgressMarker(stopType)

    case 'approaching':
      return approachingMarker(stopType)

    case 'completed':
      // Green with checkmark — done
      return pinMarker('#22c55e', CHECK_ICON, 34)

    case 'failed':
      // Red with X — could not complete
      return pinMarker('#ef4444', X_ICON, 34)

    case 'skipped':
      // Muted orange with dash — bypassed
      return pinMarker('#f97316', DASH_ICON, 34, 0.75)

    default:
      return pinMarker('#6b7280', icon, 34)
  }
}
