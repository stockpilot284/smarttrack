import DashboardContent from '@/components/dashboard/DashboardContent'
import PageError from '@/components/PageError'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/dashboard/')({
  component: DashboardRoute,
  loader: async () => {
    // Simulate a delay for loading data
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return null // Return any necessary data here
  },
  pendingComponent: () => <DashboardSkeleton />,
  errorComponent: ({ error }) => (
    <PageError onRetry={() => window.location.reload()} />
  ),
})

function DashboardRoute() {
  return <DashboardContent />
}
