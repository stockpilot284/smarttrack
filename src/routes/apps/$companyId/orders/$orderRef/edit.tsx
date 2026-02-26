import EditOrderContent from '@/components/orders/EditOrderContent'
import PageError from '@/components/PageError'
import EditOrderSkeleton from '@/components/skeletons/EditOrderSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/edit')({
  component: EditOrderRoute,
  loader: async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve('hello')
      }, 1000),
    )
  },
  pendingComponent: () => <EditOrderSkeleton />,
  errorComponent: () => <PageError />,
})

function EditOrderRoute() {
  const params = Route.useParams()
  return <EditOrderContent params={params} />
}
