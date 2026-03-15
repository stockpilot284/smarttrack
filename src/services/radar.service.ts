import { getRadar } from '@/lib/radar'
import { GeoLocation, LocationPickerValue } from '@/types/location.type'

/**
 * Fallback location search using OpenStreetMap Nominatim.
 * Respects usage policy – set a custom User-Agent.
 */
async function searchLocationsFallback(
  query: string,
  coordinates?: GeoLocation,
): Promise<LocationPickerValue[]> {
  if (!query || query.trim().length < 3) return []

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query.trim())
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '10')
  if (coordinates) {
    // Nominatim can use `lat` and `lon` to bias results, but not all instances support it.
    // We'll add them as hints if available.
    url.searchParams.set('lat', coordinates.latitude.toString())
    url.searchParams.set('lon', coordinates.longitude.toString())
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        // Required by Nominatim's usage policy
        'User-Agent': 'SmartTrack/1.0 (smarttrack284@gmail.com)',
      },
    })
    if (!response.ok) {
      console.error('Nominatim fallback failed:', response.status)
      return []
    }
    const data = await response.json()

    console.log(data)
    return data.map((item: any) => ({
      placeId: item.place_id?.toString(),
      address: item.display_name,
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      },
    }))
  } catch (error) {
    console.error('Nominatim fallback error:', error)
    return []
  }
}

/**
 * Searches for locations based on a query string.
 * Uses Radar autocomplete with optional proximity bias.
 * Falls back to OpenStreetMap Nominatim if Radar fails or returns no results.
 */
export async function searchLocations(
  query: string,
  coordinates?: GeoLocation,
): Promise<LocationPickerValue[]> {
  if (!query || query.trim().length < 3) return []

  // Try Radar first
  try {
    const Radar = await getRadar()
    if (Radar) {
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

      const radarResults =
        res.addresses?.map((item: any) => ({
          placeId: item.placeId,
          address: item.formattedAddress as string,
          coordinates: {
            latitude: item.latitude,
            longitude: item.longitude,
          },
        })) ?? []

      if (radarResults.length > 0) {
        return radarResults
      }
      // No results – fall through to fallback
    }
  } catch (error) {
    console.error('Radar search failed, trying fallback:', error)
    // Fall through to fallback
  }

  // Fallback to Nominatim
  return searchLocationsFallback(query, coordinates)
}

/**
 * Reverse geocodes coordinates to obtain a location address.
 * Uses Radar's reverse geocode endpoint, with fallback to Nominatim.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationPickerValue> {
  // Try Radar first
  try {
    const Radar = await getRadar()
    if (Radar) {
      const res = await Radar.reverseGeocode({
        coordinates: [longitude, latitude],
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
  } catch (error) {
    console.error('Radar reverse geocode failed, trying fallback:', error)
  }

  // Fallback to Nominatim reverse
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.set('lat', latitude.toString())
    url.searchParams.set('lon', longitude.toString())
    url.searchParams.set('format', 'json')
    url.searchParams.set('addressdetails', '1')

    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'SmartTrack/1.0 (smarttrack284@gmail.com)' },
    })
    if (!response.ok)
      throw new Error(`Nominatim reverse failed: ${response.status}`)
    const data = await response.json()
    return {
      placeId: data.place_id?.toString(),
      address: data.display_name,
      coordinates: { latitude, longitude },
    }
  } catch (error) {
    console.error('Nominatim reverse geocode error:', error)
    // Final fallback: coordinates only
    return {
      address: `Dropped location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      coordinates: { latitude, longitude },
    }
  }
}
