import PageError from '@/components/PageError'
import MapPanel from '@/components/tracking/MapPanel'
import TrackingOrdersPanel from '@/components/tracking/TrackingOrdersPanel'
import { mockTrackingOrders } from '@/data/tracking'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/apps/$companyId/tracking/')({
  component: TrackingRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    trackingNumber: search.trackingNumber as string | undefined,
  }),

  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = Route.useParams()
    return (
      <PageError
        title="Failed to load tracking data"
        description="We couldn't load the tracking information. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        onBack={() =>
          navigate({ to: '/apps/$companyId/dashboard', params: { companyId } })
        }
      />
    )
  },
})

function TrackingRoute() {
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
      />
      <MapPanel selectedOrder={trackingOrder} />
    </div>
  )
}
