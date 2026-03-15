import { motion } from 'framer-motion'
import { MapPin, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SavedLocation } from '@/types/location.type'
import { useEffect, useState, useMemo } from 'react'
import { Spinner } from '../Spinner'
import { ScrollableWithFade } from '../ScrollableWithFade'

type SavedLocationsPanelProps = {
  onSelect: (location: SavedLocation) => void
  onBack: () => void
}

// Mock function – replace with actual API
const fetchSavedLocations = async (): Promise<SavedLocation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: '1',
      placeId: 'saved-1',
      label: 'Home',
      address: '123 Main St, Accra, Ghana',
      coordinates: { latitude: 5.6037, longitude: -0.187 },
      note: 'Apartment 4B, gate code 1234',
    },
    {
      id: '2',
      placeId: 'saved-2',
      label: 'Office',
      address: '45 Independence Ave, Kumasi, Ghana',
      coordinates: { latitude: 6.688, longitude: -1.624 },
      note: 'Parking in the back',
    },
    {
      id: '3',
      placeId: 'saved-3',
      label: 'Warehouse',
      address: '78 Harbour Rd, Takoradi, Ghana',
      coordinates: { latitude: 4.912, longitude: -1.758 },
      note: 'Loading dock B',
    },
  ]
}

export default function SavedLocationsPanel({
  onSelect,
  onBack,
}: SavedLocationsPanelProps) {
  const [locations, setLocations] = useState<SavedLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetchSavedLocations()
      .then((data) => {
        if (isMounted) setLocations(data)
      })
      .catch(() => {
        if (isMounted) setError('Failed to load saved locations.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locations
    const term = searchTerm.toLowerCase()
    return locations.filter(
      (loc) =>
        loc.label?.toLowerCase().includes(term) ||
        loc.address?.toLowerCase().includes(term) ||
        loc.note?.toLowerCase().includes(term),
    )
  }, [locations, searchTerm])

  return (
    <div className="flex flex-col h-[560px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2">
        <Button variant="ghost" size="iconSm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-base font-semibold">My Saved Places</h2>
      </div>

      {/* Search input */}
      <div className="px-5 py-2 border-b border-border/40">
        <div className="relative py-2.5">
          <Input
            type="text"
            placeholder="Search saved places..."
            value={searchTerm}
            size="sm"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="iconSm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="text-primary" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            {searchTerm
              ? 'No places match your search.'
              : "You haven't saved any locations yet."}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredLocations.map((loc) => (
              <li
                key={loc.placeId}
                className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelect(loc)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{loc.label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {loc.address}
                    </p>
                    {loc.note && (
                      <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                        {loc.note}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      {loc.coordinates.latitude.toFixed(5)},{' '}
                      {loc.coordinates.longitude.toFixed(5)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
