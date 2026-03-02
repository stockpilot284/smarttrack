import { createFileRoute } from '@tanstack/react-router'
import { DispatchPanel } from '@/components/dispatch/DispatchPanel'
import PageHeader from '@/components/PageHeader'
import DispatchSkeleton from '@/components/skeletons/DispatchSkeleton'
import PageError from '@/components/PageError'

export const Route = createFileRoute('/apps/$companyId/dispatch/')({
  component: RouteComponent,
  loader: async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve('hello')
      }, 1000),
    )
  },
  pendingComponent: () => <DispatchSkeleton />,
  errorComponent: () => <PageError />,
})

function RouteComponent() {
  return (
    <div className="p-6 h-full flex flex-col gap-8">
      <PageHeader
        title="Dispatch"
        description="Assign driver and vehicle to unassigned orders"
      />
      <DispatchPanel />
    </div>
  )
}
