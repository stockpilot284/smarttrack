import VehicleDetail from '@/components/fleets/VehicleDetail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/fleets/$vehicleId/')({
  component: VehicleDetailRoute,
})

function VehicleDetailRoute() {
  return <VehicleDetail />
}
