import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin } from 'lucide-react'
import { useState, useEffect, ChangeEvent } from 'react'
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
import { Label } from '../ui/label'
import { getCurrentPosition } from '@/services/gps.service'
import { Spinner } from '../Spinner'
import SaveLocationPanel from './SaveLocationPanel'
import { motionPresets } from '@/lib/motion-presets'

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
  const [results, setResults] = useState<LocationPickerValue[]>([])
  const [selected, setSelected] = useState<LocationPickerValue | null>(value)
  const [loading, setLoading] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [view, setView] = useState<'picker' | 'save'>('picker')

  // ✅ Fetch Radar results when query changes
  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    searchLocations(query, selected?.coordinates).then((res) => {
      if (!cancelled) {
        setResults(res)
        console.log(res)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [query])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSelect = (location: LocationPickerValue) => {
    setSelected(location)
    setQuery(location?.address as string)
  }

  const handleUseCurrentLocation = async () => {
    try {
      setGpsLoading(true)

      const pos = await getCurrentPosition()
      const { latitude, longitude } = pos.coords

      const location = await reverseGeocode(latitude, longitude)

      setSelected(location)
      setQuery(location?.address as string)
      setResults([location])
    } catch (err) {
      console.error('GPS error:', err)
    } finally {
      setGpsLoading(false)
    }
  }

  return (
    <DialogContent className="max-w-xl p-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'picker' && (
          <div key="location-picker" className="flex flex-col h-[560px]">
            {/* ================= HEADER ================= */}
            <DialogHeader className="px-5 py-4 border-b border-border/40">
              <DialogTitle className="text-base font-semibold text-left">
                Select location
              </DialogTitle>
            </DialogHeader>

            {/* ================= CONTENT ================= */}
            <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search for an address or place"
                  value={query}
                  onChange={handleChange}
                />

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
              {/* Results */}
              <div className="h-30 rounded-lg border border-border/40 overflow-auto bg-muted/30 ">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    <Spinner className="text-primary" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No results
                  </div>
                ) : (
                  <ul className="divide-y">
                    {results.map((res, idx) => (
                      <li
                        key={idx}
                        className={`p-3 cursor-pointer hover:bg-muted/50 ${
                          selected?.placeId === res?.placeId
                            ? 'bg-muted/40'
                            : ''
                        }`}
                        onClick={() => handleSelect(res)}
                      >
                        <p className="text-sm font-medium">{res?.address}</p>
                        <p className="text-xs text-muted-foreground">
                          {res?.coordinates.latitude},{' '}
                          {res?.coordinates.longitude}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Selected Preview */}{' '}
              <div className="flex flex-col gap-3">
                {/* Map preview */}
                <LocationMapPreview
                  location={selected}
                  onLocationChange={(updated) => {
                    setSelected(updated)

                    // Sync search input
                    setQuery(updated?.address as string)

                    // Replace results with dragged location
                    setResults([updated])
                  }}
                />
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <DialogFooter className="px-5 py-4 border-t border-border/40 bg-background flex flex-row justify-end">
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
                disabled={!selected?.address}
                onClick={() => {
                  onApply(selected)
                  onClose()
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </div>
        )}

        {view === 'save' && selected && (
          <SaveLocationPanel
            location={selected}
            onBack={() => setView('picker')}
            onSave={(data) => {
              console.log('SAVE LOCATION', {
                ...data,
                location: selected,
              })
              setView('picker')
            }}
          />
        )}
      </AnimatePresence>
    </DialogContent>
  )
}
