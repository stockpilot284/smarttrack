import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PageError from '@/components/PageError'
import { TrackingList } from '@/components/tracking/TrackingList'
import PageHeader from '@/components/PageHeader'

export const Route = createFileRoute('/apps/$companyId/tracking/')({
  component: TrackingRoute,
  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = Route.useParams()
    return (
      <PageError
        title="Failed to load tracking data"
        description="We couldn't load the tracking information. Please check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    )
  },
})

function TrackingRoute() {
  return (
    <div className="p-6 space-y-6 flex flex-col">
      <PageHeader
        title="Live Tracking"
        description="Monitor your active deliveries and trips."
      />
      <TrackingList />
    </div>
  )
}
