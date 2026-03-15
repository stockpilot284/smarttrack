import { createFileRoute, useNavigate } from '@tanstack/react-router'
import EditOrderContent from '@/components/orders/EditOrderContent'
import PageError from '@/components/PageError'
import EditOrderSkeleton from '@/components/skeletons/EditOrderSkeleton'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/edit')({
  component: EditOrderRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
  pendingComponent: () => <EditOrderSkeleton />,
  errorComponent: () => {
    const navigate = useNavigate()
    const { companyId } = Route.useParams()
    return (
      <PageError
        title="Failed to load order"
        description="We couldn't load the order you're trying to edit. It may have been deleted or there was a network issue."
        onRetry={() => window.location.reload()}
        onBack={() =>
          navigate({ to: '/apps/$companyId/orders', params: { companyId } })
        }
      />
    )
  },
})

function EditOrderRoute() {
  return <EditOrderContent />
}
