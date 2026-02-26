import OrderDetailContent from '@/components/orders/OrderDetailContent'
import PageError from '@/components/PageError'
import OrderDetailSkeleton from '@/components/skeletons/OrderDetailSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/')({
  component: OrderDetailRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
  pendingComponent: () => <OrderDetailSkeleton />,
  errorComponent: ({ error }) => <PageError />,
})

function OrderDetailRoute() {
  return <OrderDetailContent />
}
