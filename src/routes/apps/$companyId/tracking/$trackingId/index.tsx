import { TrackingDetail } from '@/components/tracking/TrackingDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/tracking/$trackingId/')({
  component: TrackingDetailsRoute,
})

function TrackingDetailsRoute() {
  return <TrackingDetail />
}
