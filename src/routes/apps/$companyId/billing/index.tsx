import BillingContent from '@/components/billing/BillingContent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/billing/')({
  component: BillingRoute,
})

function BillingRoute() {
  return <BillingContent />
}
