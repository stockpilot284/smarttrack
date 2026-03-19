import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

export function useMap({
  mapStyleUrl,
  initialCenter = [0, 0],
  initialZoom = 2,
}: {
  mapStyleUrl: string
  initialCenter?: [number, number]
  initialZoom?: number
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // mapStyleUrl is empty on first render before theme resolves — wait for it
    if (!mapContainerRef.current || !mapStyleUrl) return

    setIsMapLoaded(false)
    setIsInitializing(true)
    setError(null)

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    })

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left',
    )

    mapInstance.current = map

    map.on('error', (e) => {
      console.error('Map error:', e)
      setError('Failed to load map. Please retry.')
      setIsInitializing(false)
    })

    map.on('load', () => {
      setIsMapLoaded(true)
      setIsInitializing(false)
    })

    return () => {
      // Reset loaded state immediately so all dependent hooks know the
      // map is gone before the new one is created on the next render
      setIsMapLoaded(false)
      setIsInitializing(true)
      map.remove()
      mapInstance.current = null
    }
    // initialCenter and initialZoom intentionally excluded — these are
    // mount-time values. Changing them after mount should not recreate the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyleUrl])

  return {
    mapContainerRef,
    mapInstance,
    isMapLoaded,
    isInitializing,
    error,
    setError,
  }
}
