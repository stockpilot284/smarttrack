import DriverDetail from '@/components/drivers/DriverDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/drivers/$driverId/')({
  component: DriverDetailsRoute,
})

function DriverDetailsRoute() {
  return <DriverDetail />
}
