// components/tracking/TrackingList.tsx
import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { TrackingFilterDialog, TrackingFilters } from './TrackingFilterDialog'
import { StatusFilterTabs } from './StatusFilterTabs'
import { TrackingCard } from './TrackingCard'
import { TrackingListSkeleton } from '@/components/skeletons/TrackingListSkeleton'
import EmptyState from '@/components/EmptyState'
import { mockTrackingItems } from '@/data/tracking'
import { MapPin, Navigation2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { useDebounce } from '@/hooks/use-debounce'

export function TrackingList() {
  const { companyId } = useParams({ from: '/apps/$companyId/tracking/' })
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const searchQuery = useDebounce(searchValue)
  const [advancedFilters, setAdvancedFilters] = useState<TrackingFilters>({})
  const [loading] = useState(false) // replace with real loading

  // Filter logic
  const filteredItems = mockTrackingItems.filter((item) => {
    // Status filter
    if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter)
      return false

    // Search query – now only checks order reference
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!item.reference.toLowerCase().includes(q)) return false
    }

    // Advanced filters
    if (
      advancedFilters.driver &&
      !item.driver.name
        .toLowerCase()
        .includes(advancedFilters.driver.toLowerCase())
    ) {
      return false
    }
    if (
      advancedFilters.vehicle &&
      !item.vehicle.plateNumber
        .toLowerCase()
        .includes(advancedFilters.vehicle.toLowerCase())
    ) {
      return false
    }
    return true
  })

  if (loading) return <TrackingListSkeleton />

  return (
    <div className="space-y-8 ">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <StatusFilterTabs
          value={statusFilter}
          onValueChange={setStatusFilter}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Search by order..."
            value={searchValue}
            type="search"
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full sm:w-64"
            size="sm"
          />
          <TrackingFilterDialog
            filters={advancedFilters}
            onApply={setAdvancedFilters}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          title="No tracking items"
          description="There are no active tracking items matching your criteria."
          Icon={MapPin}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          {...motionPresets.staggerContainer}
        >
          {filteredItems.map((item) => (
            <TrackingCard key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
