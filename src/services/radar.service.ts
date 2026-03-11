import { getRadar } from '@/lib/radar'
import { GeoLocation, LocationPickerValue } from '@/types/location.type'

/**
 * Searches for locations based on a query string.
 * Uses Radar autocomplete with optional proximity bias.
 */
export async function searchLocations(
  query: string,
  coordinates?: GeoLocation,
): Promise<LocationPickerValue[]> {
  // Early exit for short queries
  if (!query || query.trim().length < 3) return []

  try {
    const Radar = await getRadar()
    if (!Radar) {
      console.error('Radar SDK not initialized')
      return []
    }

    const res = await Radar.autocomplete({
      query: query.trim(),
      limit: 10,
      layers: [
        'address',
        'place',
        'locality',
        'neighborhood',
        'state',
        'coarse',
        'country',
        'fine',
      ],
      ...(coordinates && {
        near: `${coordinates.latitude},${coordinates.longitude}`,
      }),
    })

    // Map the response to our internal format
    return (
      res.addresses?.map((item: any) => ({
        placeId: item.placeId, // preserve Radar's place ID if available
        address: item.formattedAddress as string,
        coordinates: {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      })) ?? []
    )
  } catch (error) {
    console.error('Location search failed:', error)
    return [] // Fail gracefully
  }
}

/**
 * Reverse geocodes coordinates to obtain a location address.
 * Uses Radar's reverse geocode endpoint.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationPickerValue> {
  try {
    // Prefer using Radar SDK if available
    const Radar = await getRadar()
    if (Radar) {
      const res = await Radar.reverseGeocode({
        coordinates: [longitude, latitude], // Radar uses [lng, lat]
        layers: [
          'address',
          'place',
          'locality',
          'neighborhood',
          'state',
          'country',
        ],
      })
      const address = res.addresses?.[0]
      if (address) {
        return {
          placeId: address.placeId,
          address: address.formattedAddress,
          coordinates: { latitude, longitude },
        }
      }
    }

    // Fallback to direct fetch if SDK fails or not available
    const response = await fetch(
      `https://api.radar.io/v1/geocode/reverse?coordinates=${latitude},${longitude}`,
      {
        headers: {
          Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`)
    }

    const data = await response.json()
    const address = data.addresses?.[0]

    return {
      placeId: address?.placeId,
      address:
        address?.formattedAddress ||
        `Dropped location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      coordinates: { latitude, longitude },
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    // Return a fallback with coordinates if everything fails
    return {
      address: `Dropped location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      coordinates: { latitude, longitude },
    }
  }
}
