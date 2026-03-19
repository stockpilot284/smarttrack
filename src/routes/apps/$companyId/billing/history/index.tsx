import BillingHistoryContent from '@/components/billing/BillingHistoryContent'
import PageError from '@/components/PageError'
import BillingHistorySkeleton from '@/components/skeletons/BillingHistorySkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/billing/history/')({
  component: BillingHistoryRoute,
  loader: () => {
    setTimeout(() => {}, 200)
  },
  pendingComponent: () => <BillingHistorySkeleton />,
  errorComponent: () => {
    const navigate = Route.useNavigate()
    return (
      <PageError
        title="Failed to load billing history"
        description="We couldn't load your billing history. Please check your connection and try again."
        onRetry={() => window.location.reload()}
        onBack={() => navigate({ to: '/apps/$companyId/billing' })}
      />
    )
  },
})

function BillingHistoryRoute() {
  return <BillingHistoryContent />
}
