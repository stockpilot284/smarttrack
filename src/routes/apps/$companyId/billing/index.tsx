import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/billing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/apps/$companyId/billing/"!</div>
}
