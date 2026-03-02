import MapPanel from '@/components/tracking/MapPanel'
import TrackingOrdersPanel from '@/components/tracking/TrackingOrdersPanel'
import { mockTrackingOrders } from '@/data/tracking'
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/apps/$companyId/tracking/')({
  component: TrackingRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    trackingNumber: search.trackingNumber as string | undefined,
  }),
})

function TrackingRoute() {
  const { companyId } = Route.useParams()
  const { trackingNumber } = Route.useSearch()
  const [trackingOrder, setTrackingOrder] = useState(() => {
    if (trackingNumber) {
      const found = mockTrackingOrders.find(
        (o) => o.trackingNumber === trackingNumber,
      )
      if (found) return found
    }
    return mockTrackingOrders[0]
  })

  // Sync selected order when URL query changes
  useEffect(() => {
    if (trackingNumber) {
      const found = mockTrackingOrders.find(
        (o) => o.trackingNumber === trackingNumber,
      )
      if (found) {
        setTrackingOrder(found)
      }
    } else {
      setTrackingOrder(mockTrackingOrders[0])
    }
  }, [trackingNumber])

  return (
    <div className="p-6 flex flex-col gap-8 lg:p-0 lg:gap-0 lg:flex-row lg:h-full bg-background">
      <TrackingOrdersPanel
        trackingOrders={mockTrackingOrders}
        selectedOrder={trackingOrder}
        setSelectedOrder={setTrackingOrder}
        // companyId={companyId} // 👈 pass companyId for the Link
      />
      <MapPanel selectedOrder={trackingOrder} />
    </div>
  )
}
