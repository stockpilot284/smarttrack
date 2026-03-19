import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/BackButton'
import { ShareTrackingButton } from './ShareTrackingButton'
import { RouteOverviewCard } from './RouteOverviewCard'
import { StopList } from './StopList'
import { OrderDetailsPanel } from './OrderDetailsPanel'
import MapPanel from './MapPanel'
import { TrackingItem } from '@/types/tracking.type'
import { mockTrackingItems } from '@/data/tracking'
import StatePlaceholder from '../StatePlaceholder'
import { Navigation2 } from 'lucide-react'
import { motionPresets } from '@/lib/motion-presets'

export function TrackingDetail() {
  const { trackingId, companyId } = useParams({
    from: '/apps/$companyId/tracking/$trackingId/',
  })
  const navigate = useNavigate()
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  const item = mockTrackingItems.find((i) => i.id === trackingId) as
    | TrackingItem
    | undefined

  // Set initial selected stop to the first non-completed stop (active or pending)
  useEffect(() => {
    if (item) {
      const firstActive = item.stops.find((s) => s.status !== 'COMPLETED')
      if (firstActive) {
        setSelectedStopId(firstActive.id)
      } else {
        // All stops completed – default to first stop
        setSelectedStopId(item.stops[0]?.id || null)
      }
    }
  }, [item])

  if (!item) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <StatePlaceholder
          icon={Navigation2}
          title="Tracking not found"
          description="The tracking item you're looking for doesn't exist or has been removed."
          buttonLabel="Back to tracking"
          onAction={() =>
            navigate({ to: '/apps/$companyId/tracking', params: { companyId } })
          }
        />
      </div>
    )
  }

  const selectedStop = item.stops.find((s) => s.id === selectedStopId)

  return (
    <div className="h-full flex flex-col w-full overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-2 border-b border-border/50 shrink-0 bg-card z-10 ">
        <div className="flex items-center gap-2">
          <BackButton
            fallbackTo="/apps/$companyId/tracking"
            params={{ companyId }}
          />
          <h1 className="text-lg font-semibold">{item.reference}</h1>
        </div>
        <ShareTrackingButton trackingId={trackingId} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        {/* Side panel with animation */}
        <motion.div
          {...motionPresets.slideUp}
          className="w-full lg:w-96 border-r border-border/50 dark:border-border relative h-full lg:h-auto z-10 bg-card"
        >
          {/* Scrollable container with fade gradients */}
          <div className="absolute inset-0 flex flex-col ">
            {/* Top fade gradient */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 ">
              <RouteOverviewCard item={item} />
              <StopList
                stops={item.stops}
                selectedStopId={selectedStopId}
                onStopClick={setSelectedStopId}
              />
              {selectedStop && <OrderDetailsPanel stop={selectedStop} />}
            </div>

            {/* Bottom fade gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
          </div>
        </motion.div>

        {/* Map panel */}
        <div className="flex-1 min-h-0">
          <MapPanel
            trackingItem={item}
            highlightedStopId={selectedStopId}
            // other props as needed
          />
        </div>
      </div>
    </div>
  )
}
