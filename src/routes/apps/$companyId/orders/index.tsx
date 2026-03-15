import OrdersContent from '@/components/orders/OrdersContent'
import PageError from '@/components/PageError'
import OrdersSkeleton from '@/components/skeletons/OrdersSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/orders/')({
  component: OrdersRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(() => resolve('hello'), 1000))
    return null
  },

  pendingComponent: () => <OrdersSkeleton />,
  errorComponent: () => {
    return (
      <PageError
        title="Failed to load orders"
        description="We couldn't load your orders. Please check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    )
  },
})

function OrdersRoute() {
  return <OrdersContent />
}
