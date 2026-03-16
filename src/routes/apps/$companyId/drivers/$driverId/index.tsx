import DriverDetail from '@/components/drivers/DriverDetail'
import PageError from '@/components/PageError'
import DriverDetailSkeleton from '@/components/skeletons/DriverDetailSkeleton'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/drivers/$driverId/')({
  component: DriverDetailRoute,
  loader: async () => {
    setTimeout(() => {
      'hello'
    }, 2000)
  },
  pendingComponent: () => <DriverDetailSkeleton />,
  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = useParams({
      from: '/apps/$companyId/drivers/$driverId/',
    })

    return (
      <PageError
        title="Failed to load driver"
        description="We couldn't load the driver details. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        onBack={() =>
          navigate({ to: '/apps/$companyId/drivers', params: { companyId } })
        }
      />
    )
  },
})

function DriverDetailRoute() {
  return <DriverDetail />
}
