import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { TrackingOrder } from '@/types/tracking'

interface UseMapInitializationProps {
  mapStyleUrl: string
  selectedOrder: TrackingOrder
  onError: (error: string) => void
}

export function useMapInitialization({
  mapStyleUrl,
  selectedOrder,
  onError,
}: UseMapInitializationProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cleanupMap = useCallback(() => {
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }
    setIsMapLoaded(false)
  }, [])

  const initializeMap = useCallback(async () => {
    console.log('🚀 initializeMap CALLED at', Date.now())
    cleanupMap()
    if (!mapContainerRef.current || !mapStyleUrl) return

    setError(null)
    setIsInitializing(true)

    // Use the current order for the initial center – this is only used once
    const fallbackCenter: [number, number] = [
      selectedOrder.stops[0]?.longitude ?? 0,
      selectedOrder.stops[0]?.latitude ?? 0,
    ]

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: fallbackCenter,
      zoom: 12,
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
      onError('Failed to load map. Please retry.')
    })

    map.on('load', () => {
      setIsMapLoaded(true)
      setIsInitializing(false)
    })
  }, [mapStyleUrl, cleanupMap, onError])

  useEffect(() => {
    initializeMap()
  }, [])

  return {
    mapContainerRef,
    mapInstance,
    isMapLoaded,
    isInitializing,
    error,
    setError,
    cleanupMap,
    initializeMap,
  }
}
