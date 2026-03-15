import OrderDetailContent from '@/components/orders/OrderDetailContent'
import PageError from '@/components/PageError'
import OrderDetailSkeleton from '@/components/skeletons/OrderDetailSkeleton'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/')({
  component: OrderDetailRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
  pendingComponent: () => <OrderDetailSkeleton />,
  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = Route.useParams()
    return (
      <PageError
        title="Order not found"
        description="We couldn't find the order you're looking for. It may have been deleted or the link is incorrect."
        onBack={() =>
          navigate({ to: '/apps/$companyId/orders', params: { companyId } })
        }
        onRetry={() => window.location.reload()}
      />
    )
  },
})

function OrderDetailRoute() {
  return <OrderDetailContent />
}
