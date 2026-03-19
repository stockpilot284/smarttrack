export function truckSVG(theme: 'light' | 'dark') {
  const dotColor = '#8b5cf6' // purple glow

  return `
  <svg
    width="40"
    height="40"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Animated glow filter (applied to the central glow circle) -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur">
          <animate
            attributeName="stdDeviation"
            values="3;6;3"
            dur="2s"
            repeatCount="indefinite"
          />
        </feGaussianBlur>
        <feColorMatrix
          in="blur"
          type="matrix"
          values="
            0 0 0 0 0.545
            0 0 0 0 0.361
            0 0 0 0 0.965
            0 0 0 0.6 0
          "
        />
      </filter>

      <!-- Opacity pulse for the glow circle -->
      <animate
        xlink:href="#glowCircle"
        attributeName="opacity"
        values="0.4;0.8;0.4"
        dur="2s"
        repeatCount="indefinite"
      />
    </defs>

    <!-- Glow pulse (centered at 32,32) -->
    <circle
      id="glowCircle"
      cx="32"
      cy="32"
      r="18"
      fill="${dotColor}"
      filter="url(#glow)"
      opacity="0.6"
    />

    <!-- White marker base -->
    <circle
      cx="32"
      cy="32"
      r="16"
      fill="#ffffff"
    />

    <!-- Big center dot -->
    <circle
      cx="32"
      cy="32"
      r="8"
      fill="${dotColor}"
    />

    <!-- Glowing wave – clean, expanding ring -->
    <circle
      cx="32"
      cy="32"
      r="20"
      fill="none"
      stroke="${dotColor}"
      stroke-width="4"
      opacity="0.7"
    >
      <animate
        attributeName="r"
        values="20;32;20"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.7;0.1;0.7"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
  `
}
export function dropoffSVG(theme: 'light' | 'dark') {
  const pinColor = '#ef4444' // solid red
  const shadowColor = 'rgba(0,0,0,0.3)' // soft shadow
  const iconColor = '#ffffff' // user icon color

  return `
  <svg width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Float the pin and icon */
      .float {
        animation: float 2s infinite ease-in-out;
        transform-origin: center;
      }

      /* Dynamic shadow scale and opacity */
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

    <!-- Shadow ellipse stays on ground but animates scale and opacity -->
    <ellipse class="shadow" cx="24" cy="38" rx="10" ry="3" fill="${shadowColor}" />

    <!-- Group pin and user icon for floating -->
    <g class="float">
      <!-- Pin -->
      <path d="M24 6 C18 6 12 12 12 18 C12 25 24 38 24 38 C24 38 36 25 36 18 C36 12 30 6 24 6 Z" fill="${pinColor}" />

      <!-- User icon -->
      <g transform="translate(24,18)">
        <!-- Head -->
        <circle cx="0" cy="-2" r="3" fill="${iconColor}" />
        <!-- Body -->
        <path d="M-4 4 C-4 0, 4 0, 4 4 Q4 6 -4 6 Z" fill="${iconColor}" />
      </g>
    </g>
  </svg>
  `
}
export function pickupSVG(theme: 'light' | 'dark') {
  const pinColor = theme === 'dark' ? '#dc2626' : '#ef4444' // red pin
  const shadowColor = 'rgba(0,0,0,0.3)'
  const iconColor = '#ffffff'

  return `
  <svg
    width="40"
    height="40"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
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

    <!-- Animated ground shadow -->
    <ellipse
      class="shadow"
      cx="24"
      cy="38"
      rx="10"
      ry="3"
      fill="${shadowColor}"
    />

    <!-- Floating pin + icon -->
    <g class="float">
      <!-- Marker pin -->
      <path
        d="M24 6
           C18 6 12 12 12 18
           C12 25 24 38 24 38
           C24 38 36 25 36 18
           C36 12 30 6 24 6 Z"
        fill="${pinColor}"
      />

      <!-- Home icon -->
      <path
        d="M19 20
           V15
           L24 11
           L29 15
           V20
           H26
           V17
           H22
           V20
           Z"
        fill="${iconColor}"
      />
    </g>
  </svg>
  `
}
