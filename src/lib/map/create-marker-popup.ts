// lib/map/create-marker-popup.ts
import maplibregl from 'maplibre-gl'
import { Stop } from '@/types/tracking.type'

export function createMarkerPopup(
  markerType: 'truck' | 'stop',
  data: any,
  theme: 'light' | 'dark',
) {
  const bgColor = theme === 'dark' ? '#0f172a' : '#ffffff'
  const textColor = theme === 'dark' ? '#f1f5f9' : '#111827'
  const borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'

  let header = ''
  let body = ''
  let statusColor = '#3b82f6'

  if (markerType === 'truck') {
    // data: { name, phone, email, availability, vehicle }
    statusColor = data.availability === 'AVAILABLE' ? '#10b981' : '#f59e0b'
    header = 'Driver & Vehicle'
    body = `
      <p><b>Driver:</b> ${data.name}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p>
        <b>Availability:</b>
        <span style="color:${statusColor}; font-weight:600">
          ${data.availability}
        </span>
      </p>
      <hr style="margin:8px 0; border-color:${borderColor}" />
      <p><b>Vehicle:</b> ${data.vehicle.model}</p>
      <p><b>Plate:</b> ${data.vehicle.plateNumber}</p>
    `
  } else {
    // data is a Stop object
    statusColor =
      data.status === 'COMPLETED'
        ? '#22c55e'
        : data.status === 'IN_PROGRESS'
          ? '#3b82f6'
          : '#9ca3af'
    header = data.type === 'PICKUP' ? 'Pickup Stop' : 'Dropoff Stop'

    let itemsHtml = ''
    if (data.items && data.items.length > 0) {
      itemsHtml =
        '<p><b>Items:</b></p><ul style="margin:4px 0 0 16px; padding:0;">'
      data.items.forEach((item: any) => {
        itemsHtml += `<li>${item.quantity}x ${item.name}${item.description ? ` – ${item.description}` : ''}</li>`
      })
      itemsHtml += '</ul>'
    }

    body = `
      <p><b>Contact:</b> ${data.contactName}</p>
      <p><b>Phone:</b> ${data.contactPhone}</p>
      <p><b>Address:</b> ${data.address}</p>
      ${data.orderId ? `<p><b>Order ID:</b> ${data.orderId}</p>` : ''}
      ${itemsHtml}
    `
  }

  const popup = new maplibregl.Popup({
    offset: 18,
    closeButton: false,
    closeOnClick: false,
    className: 'saas-popup',
  })

  popup.setHTML(`
    <div class="popup-root">
      <button class="popup-close-btn">✕</button>

      <div class="popup-header">
        <span class="status-dot" style="background:${statusColor}"></span>
        ${header}
      </div>

      <div class="popup-body">${body}</div>
    </div>

    <style>
      .maplibregl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none !important;
      }

      .maplibregl-popup-tip {
        display: none !important;
      }

      .popup-root {
        min-width: 220px;
        max-width: 300px;
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${borderColor};
        border-radius: 14px;
        box-shadow: 0 12px 24px rgba(0,0,0,.15);
        animation: popupIn .2s ease;
        position: relative;
        font-family: Inter, sans-serif;
        font-size: 13px;
        line-height: 1.5;
      }

      .popup-header {
        padding: 10px 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 1px solid ${borderColor};
      }

      .status-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
      }

      .popup-body {
        padding: 10px 12px;
      }

      .popup-body p {
        margin: 4px 0;
      }

      .popup-body hr {
        margin: 8px 0;
        border: none;
        border-top: 1px solid ${borderColor};
      }

      .popup-close-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        border: none;
        background: transparent;
        font-size: 14px;
        cursor: pointer;
        color: inherit;
        opacity: 0.6;
        transition: opacity 0.2s;
        z-index: 10;
      }

      .popup-close-btn:hover {
        opacity: 1;
      }

      @keyframes popupIn {
        from { opacity: 0; transform: translateY(-6px) scale(.96); }
        to { opacity: 1; transform: none; }
      }
    </style>
  `)

  popup.on('open', () => {
    const el = popup.getElement()
    el?.querySelector('.popup-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation()
      popup.remove()
    })
  })

  return popup
}
