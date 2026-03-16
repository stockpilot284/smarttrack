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
  const loadTimeoutRef = useRef<number | null>(null)

  // Store initial center once
  const initialCenterRef = useRef<[number, number]>([
    selectedOrder.stops[0]?.longitude ?? 0,
    selectedOrder.stops[0]?.latitude ?? 0,
  ])

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

    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }

    // Set a timeout to show error if map doesn't load within 15 seconds
    loadTimeoutRef.current = window.setTimeout(() => {
      console.error('Map load timeout')
      if (!isMapLoaded) {
        setError('Map failed to load. Please retry.')
        onError('Map failed to load. Please retry.')
        setIsInitializing(false)
      }
    }, 15000)

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: initialCenterRef.current,
      zoom: 12,
      attributionControl: false,
    })

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left',
    )
    mapInstance.current = map

    map.on('error', (e) => {
      console.error('Map error event:', e)
      if (!isMapLoaded) {
        setError('Failed to load map. Please retry.')
        onError('Failed to load map. Please retry.')
        setIsInitializing(false)
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current)
          loadTimeoutRef.current = null
        }
      }
    })

    map.on('load', () => {
      console.log('Map loaded successfully')
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
      setIsMapLoaded(true)
      setIsInitializing(false)
    })
  }, [mapStyleUrl, cleanupMap, onError]) // no selectedOrder dependency

  useEffect(() => {
    initializeMap()
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }
  }, []) // runs once

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
