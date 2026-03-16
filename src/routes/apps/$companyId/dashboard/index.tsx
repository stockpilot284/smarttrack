import DashboardContent from '@/components/dashboard/DashboardContent'
import PageError from '@/components/PageError'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/dashboard/')({
  component: DashboardRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return null
  },
  pendingComponent: () => <DashboardSkeleton />,
  errorComponent: () => (
    <PageError
      title="Failed to load dashboard"
      description="We couldn't load your dashboard. Please check your connection and try again."
      onRetry={() => window.location.reload()}
    />
  ),
})

function DashboardRoute() {
  return <DashboardContent />
}
