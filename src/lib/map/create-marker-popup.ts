// lib/map/create-marker-popup.ts
import maplibregl from 'maplibre-gl'

type MarkerTheme = 'light' | 'dark' | undefined

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  // Stop statuses
  COMPLETED: '#22c55e',
  IN_PROGRESS: '#3b82f6',
  PENDING: '#9ca3af',
  FAILED: '#ef4444',
  SKIPPED: '#f97316',
  // Driver availability
  AVAILABLE: '#10b981',
  BUSY: '#f59e0b',
  ON_BREAK: '#a78bfa',
  UNAVAILABLE: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  FAILED: 'Failed',
  SKIPPED: 'Skipped',
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  ON_BREAK: 'On Break',
  UNAVAILABLE: 'Unavailable',
}

function statusColor(key: string): string {
  return STATUS_COLORS[key] ?? '#9ca3af'
}

function statusLabel(key: string): string {
  return STATUS_LABELS[key] ?? key
}

function formatTime(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Popup builder ────────────────────────────────────────────────────────────

export function createMarkerPopup(
  markerType: 'truck' | 'stop',
  data: any,
  theme: MarkerTheme,
) {
  const isDark = theme === 'dark'
  const bgColor = isDark ? '#0f172a' : '#ffffff'
  const textColor = isDark ? '#f1f5f9' : '#111827'
  const mutedColor = isDark ? '#94a3b8' : '#6b7280'
  const borderColor = isDark ? '#334155' : '#e2e8f0'
  const rowBg = isDark ? '#1e293b' : '#f8fafc'

  let header = ''
  let body = ''
  let dotColor = '#9ca3af'

  // ─── Truck popup ───────────────────────────────────────────────────────────
  if (markerType === 'truck') {
    dotColor = statusColor(data.availability)
    header = 'Driver &amp; Vehicle'

    body = `
      <div class="pm-row">
        <span class="pm-label">Driver</span>
        <span class="pm-value">${data.name}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Phone</span>
        <span class="pm-value">${data.phone}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Email</span>
        <span class="pm-value pm-truncate">${data.email}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Status</span>
        <span class="pm-badge" style="background:${dotColor}20;color:${dotColor}">
          ${statusLabel(data.availability)}
        </span>
      </div>
      <div class="pm-divider"></div>
      <div class="pm-row">
        <span class="pm-label">Vehicle</span>
        <span class="pm-value">${data.vehicle.model}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Plate</span>
        <span class="pm-value">${data.vehicle.plateNumber}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Type</span>
        <span class="pm-value">${data.vehicle.type}</span>
      </div>
    `
  }

  // ─── Stop popup ────────────────────────────────────────────────────────────
  else {
    const sc = statusColor(data.status)
    dotColor = sc
    header =
      data.type === 'PICKUP' ? '&#8593; Pickup Stop' : '&#8595; Dropoff Stop'

    // Status badge row
    const statusRow = `
      <div class="pm-row">
        <span class="pm-label">Status</span>
        <span class="pm-badge" style="background:${sc}20;color:${sc}">
          ${statusLabel(data.status)}
        </span>
      </div>
    `

    // Failure reason block
    const failureBlock = data.failureReason
      ? `
      <div class="pm-failure">
        <span class="pm-failure-label">Reason</span>
        <span>${data.failureReason.message ?? data.failureReason.code}</span>
      </div>
    `
      : ''

    // Timestamps — only show what's available
    const timestamps = [
      data.estimatedArrival &&
        `
        <div class="pm-row">
          <span class="pm-label">ETA</span>
          <span class="pm-value">${formatTime(data.estimatedArrival)}</span>
        </div>`,
      data.actualArrival &&
        `
        <div class="pm-row">
          <span class="pm-label">Arrived</span>
          <span class="pm-value">${formatTime(data.actualArrival)}</span>
        </div>`,
      data.completedAt &&
        `
        <div class="pm-row">
          <span class="pm-label">Completed</span>
          <span class="pm-value">${formatTime(data.completedAt)}</span>
        </div>`,
      data.skippedAt &&
        `
        <div class="pm-row">
          <span class="pm-label">Skipped at</span>
          <span class="pm-value">${formatTime(data.skippedAt)}</span>
        </div>`,
    ]
      .filter(Boolean)
      .join('')

    // Items list
    let itemsHtml = ''
    if (data.items?.length) {
      const rows = data.items
        .map(
          (item: any) => `
        <div class="pm-item-row">
          <span class="pm-item-qty">${item.quantity}x</span>
          <span class="pm-item-name">${item.name}</span>
          ${
            item.description
              ? `<span class="pm-item-desc">${item.description}</span>`
              : ''
          }
        </div>
      `,
        )
        .join('')
      itemsHtml = `
        <div class="pm-divider"></div>
        <div class="pm-items-label">Items</div>
        <div class="pm-items">${rows}</div>
      `
    }

    body = `
      ${statusRow}
      ${failureBlock}
      <div class="pm-divider"></div>
      <div class="pm-row">
        <span class="pm-label">Contact</span>
        <span class="pm-value">${data.contactName}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Phone</span>
        <span class="pm-value">${data.contactPhone}</span>
      </div>
      <div class="pm-row">
        <span class="pm-label">Address</span>
        <span class="pm-value">${data.address}</span>
      </div>
      ${
        data.orderId
          ? `
        <div class="pm-row">
          <span class="pm-label">Order</span>
          <span class="pm-value pm-mono">${data.orderId}</span>
        </div>`
          : ''
      }
      ${timestamps ? `<div class="pm-divider"></div>${timestamps}` : ''}
      ${itemsHtml}
    `
  }

  // ─── Build popup ──────────────────────────────────────────────────────────

  const popup = new maplibregl.Popup({
    offset: 18,
    closeButton: false,
    closeOnClick: false,
    className: 'saas-popup',
  })

  popup.setHTML(`
    <div class="pm-root">
      <button class="pm-close">✕</button>

      <div class="pm-header">
        <span class="pm-dot" style="background:${dotColor}"></span>
        <span>${header}</span>
      </div>

      <div class="pm-body">${body}</div>
    </div>

    <style>
      .maplibregl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .maplibregl-popup-tip { display: none !important; }

      .pm-root {
        min-width: 230px;
        max-width: 300px;
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${borderColor};
        border-radius: 14px;
        box-shadow: 0 12px 28px rgba(0,0,0,.18);
        position: relative;
        font-family: Inter, system-ui, sans-serif;
        font-size: 12.5px;
        line-height: 1.5;
        animation: pmIn .18s ease;
        overflow: hidden;
      }

      .pm-header {
        padding: 10px 36px 10px 12px;
        font-weight: 600;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid ${borderColor};
        background: ${rowBg};
      }

      .pm-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .pm-body {
        padding: 8px 0;
        max-height: 320px;
        overflow-y: auto;
      }

      .pm-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        padding: 3px 12px;
      }

      .pm-label {
        color: ${mutedColor};
        white-space: nowrap;
        flex-shrink: 0;
        padding-top: 1px;
      }

      .pm-value {
        text-align: right;
        font-weight: 500;
      }

      .pm-truncate {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pm-mono {
        font-family: monospace;
        font-size: 11.5px;
      }

      .pm-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 8px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .pm-divider {
        height: 1px;
        background: ${borderColor};
        margin: 6px 0;
      }

      .pm-failure {
        margin: 2px 12px 4px;
        padding: 6px 8px;
        background: #ef444415;
        border: 1px solid #ef444430;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 12px;
        color: #ef4444;
      }

      .pm-failure-label {
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        opacity: 0.8;
      }

      .pm-items-label {
        padding: 2px 12px 4px;
        font-weight: 600;
        color: ${mutedColor};
        font-size: 11.5px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .pm-items {
        padding: 0 12px 4px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .pm-item-row {
        display: flex;
        flex-direction: column;
        gap: 1px;
        padding: 4px 8px;
        background: ${rowBg};
        border-radius: 6px;
      }

      .pm-item-qty {
        font-weight: 700;
        font-size: 11px;
        color: ${mutedColor};
      }

      .pm-item-name {
        font-weight: 600;
      }

      .pm-item-desc {
        font-size: 11.5px;
        color: ${mutedColor};
      }

      .pm-close {
        position: absolute;
        top: 7px;
        right: 8px;
        border: none;
        background: transparent;
        font-size: 13px;
        cursor: pointer;
        color: ${mutedColor};
        opacity: 0.7;
        transition: opacity 0.15s;
        z-index: 10;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 4px;
      }

      .pm-close:hover { opacity: 1; background: ${borderColor}; }

      @keyframes pmIn {
        from { opacity: 0; transform: translateY(-6px) scale(.96); }
        to   { opacity: 1; transform: none; }
      }
    </style>
  `)

  popup.on('open', () => {
    const el = popup.getElement()
    el?.querySelector('.pm-close')?.addEventListener('click', (e) => {
      e.stopPropagation()
      popup.remove()
    })
  })

  return popup
}
