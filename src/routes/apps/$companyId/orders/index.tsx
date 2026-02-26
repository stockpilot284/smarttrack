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
  errorComponent: () => <PageError />,
})

function OrdersRoute() {
  return <OrdersContent />
}
