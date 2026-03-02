import { useEffect, useRef } from 'react'
import { mockTruckPings } from '@/data/mock-geometry'

export function useMockTruckPings(
  onPing: (lng: number, lat: number) => void,
  interval = 1500,
) {
  const indexRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const point = mockTruckPings[indexRef.current]
      if (!point) return

      onPing(point.lng, point.lat)
      indexRef.current += 1
    }, interval)

    return () => clearInterval(id)
  }, [onPing, interval])
}
