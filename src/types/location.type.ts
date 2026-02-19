export type GeoLocation = {
  latitude: number
  longitude: number
}

export type SelectedLocation = {
  address: string
  coordinates: GeoLocation
  placeId?: string
}

export type SavedLocation = SelectedLocation & {
  id: string
  label: string
  notes?: string
}

export type LocationPickerValue = SelectedLocation | null

// export type SavedLocation = {
//   id: string
//   label: string
//   note?: string
//   location: LocationPickerValue
//   createdAt: string
// }
