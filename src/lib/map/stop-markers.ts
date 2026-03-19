// lib/map/stop-markers.ts
export function stopMarkerSVG(
  type: 'PICKUP' | 'DROPOFF',
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
  theme: 'light' | 'dark',
): string {
  // Pin colors
  let pinColor = ''
  let shadowColor = 'rgba(0,0,0,0.3)' // default gray shadow (only used if active)
  switch (status) {
    case 'COMPLETED':
      pinColor = '#22c55e' // green-500
      break
    case 'IN_PROGRESS':
      pinColor = '#3b82f6' // blue-500
      shadowColor = 'rgba(59,130,246,0.5)' // semi‑transparent blue
      break
    default:
      pinColor = '#9ca3af' // gray-400
  }

  const iconColor = '#ffffff'
  const animate = status === 'IN_PROGRESS'

  // Inner icon based on type
  const icon =
    type === 'PICKUP'
      ? `<g transform="translate(24,18)">
        <rect x="-4" y="-4" width="8" height="8" fill="${iconColor}" />
        <rect x="-5" y="-1" width="10" height="2" fill="${iconColor}" opacity="0.7" />
      </g>`
      : `<g transform="translate(24,18)">
        <circle cx="0" cy="-2" r="3" fill="${iconColor}" />
        <path d="M-4 4 C-4 0, 4 0, 4 4 Q4 6 -4 6 Z" fill="${iconColor}" />
      </g>`

  // Animation classes (only applied if animate)
  const floatClass = animate ? 'float' : ''
  const shadowClass = animate ? 'shadow' : ''

  // Build SVG parts
  const shadowEllipse = animate
    ? `<ellipse class="${shadowClass}" cx="24" cy="38" rx="10" ry="3" fill="${shadowColor}" />`
    : ''

  return `
    <svg width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <style>
        .float {
          animation: float 2s infinite ease-in-out;
          transform-origin: center;
        }
        .shadow {
          animation: shadow 2s infinite ease-in-out;
          transform-origin: center;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shadow {
          0%, 100% { transform: scaleX(1.5); opacity: 0.3; }
          50% { transform: scaleX(0.7); opacity: 1; }
        }
      </style>

      ${shadowEllipse}

      <!-- Group pin and icon -->
      <g class="${floatClass}">
        <path d="M24 6 C18 6 12 12 12 18 C12 25 24 38 24 38 C24 38 36 25 36 18 C36 12 30 6 24 6 Z" fill="${pinColor}" />
        ${icon}
      </g>
    </svg>
  `
}
