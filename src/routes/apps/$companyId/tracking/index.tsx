import MapPanel from '@/components/tracking/MapPanel'
import TrackingOrdersPanel from '@/components/tracking/TrackingOrdersPanel'
import { trackingOrders } from '@/data/tracking'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/apps/$companyId/tracking/')({
  component: TrackingRoute,
})

function TrackingRoute() {
  const [trackingOrder, setTrackingOrder] = useState(trackingOrders[0])
  return (
    <div className="p-6  flex flex-col gap-8 lg:p-0 lg:gap-0 lg:flex-row  lg:h-full bg-background">
      <TrackingOrdersPanel
        trackingOrders={trackingOrders}
        selectedOrder={trackingOrder}
        setSelectedOrder={setTrackingOrder}
      />
      <MapPanel selectedOrder={trackingOrder} />
    </div>
  )
}
