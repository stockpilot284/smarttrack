import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { LocationPickerValue } from '@/types/location.type'
import { reverseGeocode } from '@/services/radar.service'
import { useResolvedTheme } from '@/hooks/use-resolved-theme'
import { Loader2 } from 'lucide-react'
import { Spinner } from '../Spinner'

type Props = {
  location: LocationPickerValue | null
  onLocationChange?: (location: LocationPickerValue) => void
}

const DARK_MAP_STYLE_ID = import.meta.env.VITE_RADAR_DARK_MAP_STYLE_ID!
const LIGHT_MAP_STYLE_ID = import.meta.env.VITE_RADAR_LIGHT_MAP_STYLE_ID!
const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128] // New York

export default function LocationMapPreview({
  location,
  onLocationChange,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const [clientReady, setClientReady] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const resolvedTheme = useResolvedTheme()

  /* -------------------------------
     MAP STYLE URL (Memoized)
  ------------------------------- */
  const mapStyleUrl = useMemo(() => {
    if (!resolvedTheme) return ''
    const styleId =
      resolvedTheme === 'dark' ? DARK_MAP_STYLE_ID : LIGHT_MAP_STYLE_ID
    return `https://api.radar.io/maps/styles/${styleId}?publishableKey=${
      import.meta.env.VITE_RADAR_PUBLISHABLE_KEY
    }`
  }, [resolvedTheme])

  useEffect(() => setClientReady(true), [])

  /* -------------------------------
     INITIALIZE MAP
  ------------------------------- */
  useEffect(() => {
    if (
      !mapContainerRef.current ||
      mapInstance.current ||
      !clientReady ||
      !mapStyleUrl
    )
      return

    setIsMapLoading(true)
    setMapError(null)

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyleUrl,
        center: DEFAULT_CENTER,
        zoom: 2,
        attributionControl: false, // Optional: remove if you want attributions
      })

      // Add navigation control
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        'bottom-right',
      )

      // Wait for map to load before hiding loading state
      map.on('load', () => {
        setIsMapLoading(false)
      })

      // Handle errors
      map.on('error', (e) => {
        console.error('Map error:', e)
        setMapError('Failed to load map')
        setIsMapLoading(false)
      })

      mapInstance.current = map
    } catch (error) {
      console.error('Failed to initialize map:', error)
      setMapError('Failed to initialize map')
      setIsMapLoading(false)
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markerRef.current = null
      }
    }
  }, [clientReady, mapStyleUrl]) // Reinitialize when theme changes

  /* -------------------------------
     UPDATE MARKER & CENTER WHEN LOCATION CHANGES
  ------------------------------- */
  useEffect(() => {
    if (!mapInstance.current || !location) return

    const { latitude, longitude } = location.coordinates
    const lngLat: [number, number] = [longitude, latitude]

    // Wait for map to be fully loaded before interacting
    if (!mapInstance.current.loaded()) {
      mapInstance.current.once('load', () => updateMarkerAndCenter(lngLat))
    } else {
      updateMarkerAndCenter(lngLat)
    }

    function updateMarkerAndCenter(lngLat: [number, number]) {
      if (!mapInstance.current) return

      if (!markerRef.current) {
        // Create draggable marker
        markerRef.current = new maplibregl.Marker({
          draggable: true,
          color: resolvedTheme === 'dark' ? '#9c6ef7' : '#7634ec', // Match your brand color
        })
          .setLngLat(lngLat)
          .addTo(mapInstance.current)

        // Handle marker drag end
        markerRef.current.on('dragend', async () => {
          if (!markerRef.current) return

          const pos = markerRef.current.getLngLat()

          try {
            setIsMapLoading(true) // Show loading while reverse geocoding
            const updated = await reverseGeocode(pos.lat, pos.lng)
            onLocationChange?.(updated)
          } catch (error) {
            console.error('Reverse geocoding failed:', error)
          } finally {
            setIsMapLoading(false)
          }
        })
      } else {
        markerRef.current.setLngLat(lngLat)
      }

      // Smooth fly to location
      mapInstance.current.flyTo({
        center: lngLat,
        zoom: 15,
        essential: true,
        duration: 1000,
      })
    }
  }, [location, resolvedTheme]) // Recreate marker when theme changes (color update)

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
      {/* Loading overlay */}
      {isMapLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}

      {/* Error overlay */}
      {mapError && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center z-10">
          <p className="text-sm text-destructive">{mapError}</p>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ visibility: mapError ? 'hidden' : 'visible' }}
      />
    </div>
  )
}
