import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { LocationPickerValue } from '@/types/location.type'
import { reverseGeocode } from '@/services/radar.service'

type Props = {
  location: LocationPickerValue | null
  onLocationChange?: (location: LocationPickerValue) => void
}

export default function LocationMapPreview({
  location,
  onLocationChange,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    mapInstance.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
      center: [0, 0],
      zoom: 2,
    })
  }, [])

  // Update marker + center when location changes
  useEffect(() => {
    if (!mapInstance.current || !location) return

    const { latitude, longitude } = location.coordinates
    const lngLat: [number, number] = [longitude, latitude]

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ draggable: true })
        .setLngLat(lngLat)
        .addTo(mapInstance.current)

      markerRef.current.on('dragend', async () => {
        const pos = markerRef.current!.getLngLat()

        const updated = await reverseGeocode(pos.lat, pos.lng)

        onLocationChange?.(updated)
      })
    } else {
      markerRef.current.setLngLat(lngLat)
    }

    mapInstance.current.flyTo({
      center: lngLat,
      zoom: 15,
    })
  }, [location])

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
