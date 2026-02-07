import React, { useMemo } from 'react'

type BackgroundFloatingCirclesProps = {
  children: React.ReactNode
  count?: number
}

const SIZES = [360, 280, 220, 180]

export function BackgroundFloatingCircles({
  children,
  count = 6,
}: BackgroundFloatingCirclesProps) {
  const clouds = useMemo(
    () =>
      Array.from({ length: count }).map((_, index) => {
        const size = SIZES[index % SIZES.length]

        return {
          size,
          top: Math.random() * 70,
          left: Math.random() * 70,
          duration: Math.random() * 35 + 30,
          delay: Math.random() * -15,
        }
      }),
    [count],
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3F0F9]">
      {/* Cloudy blobs */}
      <div className="pointer-events-none absolute inset-0">
        {clouds.map((cloud, index) => (
          <span
            key={index}
            className="cloud-blob"
            style={{
              width: cloud.size,
              height: cloud.size,
              top: `${cloud.top}%`,
              left: `${cloud.left}%`,
              animationDuration: `${cloud.duration}s`,
              animationDelay: `${cloud.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center">
        {children}
      </div>

      <style>{`
        .cloud-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          mix-blend-mode: multiply;

          background: radial-gradient(
            circle at 30% 30%,
            rgba(118, 52, 236, 0.9),
            rgba(118, 52, 236, 0.45),
            rgba(118, 52, 236, 0)
          );

          animation-name: cloudFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes cloudFloat {
          0% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(80px, -60px);
          }
          66% {
            transform: translate(-60px, 70px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  )
}
