import BillingContent from '@/components/billing/BillingContent'
import PageError from '@/components/PageError'
import BillingSkeleton from '@/components/skeletons/BillingSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/billing/')({
  component: BillingRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return null
  },
  pendingComponent: () => <BillingSkeleton />,
  errorComponent: () => (
    <PageError
      title="Failed to load billing"
      description="We couldn't load your billing. Please check your connection and try again."
      onRetry={() => window.location.reload()}
    />
  ),
})

function BillingRoute() {
  return <BillingContent />
}
