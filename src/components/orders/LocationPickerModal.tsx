import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin } from 'lucide-react'
import { useState, useEffect, ChangeEvent, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LocationPickerValue } from '@/types/location.type'
import { reverseGeocode, searchLocations } from '@/services/radar.service'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import LocationMapPreview from './LocationMapPreview'
import { getCurrentPosition } from '@/services/gps.service'
import { Spinner } from '../Spinner'
import SaveLocationPanel from './SaveLocationPanel'
import SavedLocationsPanel from './SavedLocationsPanel'
import { useDebounce } from '@/hooks/use-debounce'

type Props = {
  value: LocationPickerValue
  onApply: (location: LocationPickerValue) => void
  onClose: () => void
}

export default function LocationPickerModal({
  value,
  onApply,
  onClose,
}: Props) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [results, setResults] = useState<LocationPickerValue[]>([])
  const [selected, setSelected] = useState<LocationPickerValue | null>(value)
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'picker' | 'save' | 'saved'>('picker') // added 'saved'

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setResults([])
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    const performSearch = async () => {
      try {
        const searchResults = await searchLocations(
          debouncedQuery,
          selected?.coordinates,
        )
        if (isMounted) {
          setResults(searchResults)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to search locations. Please try again.')
          setResults([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    performSearch()

    return () => {
      isMounted = false
    }
  }, [debouncedQuery, selected])

  // Update query when selected changes (e.g., from map)
  useEffect(() => {
    if (selected?.address) {
      setQuery(selected.address)
    }
  }, [selected])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSelect = (location: LocationPickerValue) => {
    setSelected(location)
  }

  const handleUseCurrentLocation = async () => {
    try {
      setGpsLoading(true)
      setError(null)

      const position = await getCurrentPosition({ timeout: 15000 }, 50)
      const { latitude, longitude } = position.coords

      const location = await reverseGeocode(latitude, longitude)

      setSelected(location)
      setResults([location])
    } catch (err: any) {
      console.error('GPS error:', err)
      setError(err.message || 'Unable to get your current location.')
    } finally {
      setGpsLoading(false)
    }
  }

  const handleMapLocationChange = useCallback(
    (updatedLocation: LocationPickerValue) => {
      setSelected(updatedLocation)
    },
    [],
  )

  const handleClearSearch = () => {
    setQuery('')
    setResults([])
  }

  const handleSelectSavedLocation = (location: LocationPickerValue) => {
    setSelected(location)
    setView('picker') // return to picker with selected location
  }

  const isApplyDisabled = !selected?.address

  return (
    <DialogContent className="max-w-xl p-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'picker' && (
          <motion.div
            key="location-picker"
            className="flex flex-col h-[560px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ================= HEADER ================= */}
            <DialogHeader className="px-5 py-4 border-b border-border/40">
              <DialogTitle className="text-base font-semibold text-left">
                Select location
              </DialogTitle>
            </DialogHeader>

            {/* ================= CONTENT ================= */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-hidden">
              {/* Search with clear */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search for an address or place"
                    value={query}
                    onChange={handleChange}
                    className="pr-8"
                  />
                  {query && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="iconMd"
                  onClick={handleUseCurrentLocation}
                  disabled={gpsLoading}
                  title="Use current location"
                >
                  {gpsLoading ? (
                    <Spinner size="md" color="text-primary" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                  {error}
                </div>
              )}

              {/* Results */}
              <div className="h-30 rounded-lg border border-border/40 overflow-auto bg-muted/30">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    <Spinner className="text-primary" />
                  </div>
                ) : results.length === 0 && debouncedQuery.length >= 3 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No results found
                  </div>
                ) : results.length === 0 && debouncedQuery.length < 3 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Type at least 3 characters to search
                  </div>
                ) : (
                  <ul className="divide-y">
                    {results.map((res, idx) => (
                      <li
                        key={res?.placeId || idx}
                        className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selected?.placeId === res?.placeId
                            ? 'bg-muted/40'
                            : ''
                        }`}
                        onClick={() => handleSelect(res)}
                      >
                        <p className="text-sm font-medium">{res?.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {res?.coordinates.latitude.toFixed(5)},{' '}
                          {res?.coordinates.longitude.toFixed(5)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Map preview */}
              <div className="flex flex-col gap-3">
                <LocationMapPreview
                  location={selected}
                  onLocationChange={handleMapLocationChange}
                />
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <DialogFooter className="px-5 py-4 border-t border-border/40 bg-background flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('saved')}
              >
                My Places
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!selected?.address}
                onClick={() => setView('save')}
              >
                Save location
              </Button>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                disabled={isApplyDisabled}
                onClick={() => {
                  if (selected) onApply(selected)
                  onClose()
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </motion.div>
        )}

        {view === 'save' && selected && (
          <motion.div
            key="save-panel"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SaveLocationPanel
              location={selected}
              onBack={() => setView('picker')}
              onSave={(data) => {
                console.log('SAVE LOCATION', { ...data, location: selected })
                setView('picker')
                // Optionally refresh saved locations list
              }}
            />
          </motion.div>
        )}

        {view === 'saved' && (
          <motion.div
            key="saved-panel"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SavedLocationsPanel
              onSelect={handleSelectSavedLocation}
              onBack={() => setView('picker')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContent>
  )
}
