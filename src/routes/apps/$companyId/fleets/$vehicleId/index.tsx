import VehicleDetail from '@/components/fleets/VehicleDetail'
import PageError from '@/components/PageError'
import VehicleDetailSkeleton from '@/components/skeletons/VehicleDetailSkeleton'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/fleets/$vehicleId/')({
  component: VehicleDetailRoute,
  loader: async () => {
    setTimeout(() => {}, 2000)
  },
  pendingComponent: () => <VehicleDetailSkeleton />,
  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = useParams({
      from: '/apps/$companyId/drivers/$driverId/',
    })

    return (
      <PageError
        title="Failed to load vehicle"
        description="We couldn't load the vehicle details. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        onBack={() =>
          navigate({ to: '/apps/$companyId/fleets', params: { companyId } })
        }
      />
    )
  },
})

function VehicleDetailRoute() {
  return <VehicleDetail />
}
