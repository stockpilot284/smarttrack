import { getRadar } from '@/lib/radar'
import { GeoLocation, LocationPickerValue } from '@/types/location.type'

export async function searchLocations(
  query: string,
  coordinates?: GeoLocation,
): Promise<LocationPickerValue[]> {
  if (!query || query.length < 3) return []

  const Radar = await getRadar()

  const res = await Radar.autocomplete({
    query,
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
    near: coordinates
      ? `${coordinates.latitude},${coordinates.longitude}`
      : undefined,
  })

  return (
    res.addresses?.map((item: any) => ({
      address: item.formattedAddress as string,
      coordinates: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
    })) ?? []
  )
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationPickerValue> {
  const res = await fetch(
    `https://api.radar.io/v1/geocode/reverse?coordinates=${latitude},${longitude}`,
    {
      headers: {
        Authorization: import.meta.env.VITE_RADAR_PUBLISHABLE_KEY,
      },
    },
  )

  const data = await res.json()
  const address = data.addresses?.[0]

  return {
    placeId: address?.placeId,
    address: address?.formattedAddress || 'Dropped location',
    coordinates: {
      latitude,
      longitude,
    },
  }
}
