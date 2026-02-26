import maplibregl from 'maplibre-gl'

export function createMarkerPopup(
  markerType: 'truck' | 'pickup' | 'dropoff',
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
    statusColor = data.availability === 'Available' ? '#10b981' : '#f59e0b'
    header = 'Driver Info'
    body = `
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Phone:</b> ${data.phone}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p>
        <b>Status:</b>
        <span style="color:${statusColor}; font-weight:600">
          ${data.availability}
        </span>
      </p>
    `
  } else {
    header = markerType === 'pickup' ? 'Pickup Stop' : 'Dropoff Stop'
    body = `
      <p><b>Address:</b> ${data.address}</p>
      <p><b>Contact:</b> ${data.contactName}</p>
      <p><b>Phone:</b> ${data.contactPhone}</p>
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
        max-width: 280px;
        background: ${bgColor};
        color: ${textColor};
        border: 1px solid ${borderColor};
        border-radius: 14px;
        box-shadow: 0 12px 24px rgba(0,0,0,.15);
        animation: popupIn .2s ease;
        position: relative;
        font-family: Inter, sans-serif;
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
        font-size: 14px;
        line-height: 1.5;
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
      }

      @keyframes popupIn {
        from { opacity: 0; transform: translateY(-6px) scale(.96); }
        to { opacity: 1; transform: none; }
      }
    </style>
  `)

  /* =============================
     SAFE CLOSE HANDLER
  ============================== */
  popup.on('open', () => {
    const el = popup.getElement()
    el?.querySelector('.popup-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation()
      popup.remove()
    })
  })

  return popup
}
