import PageHeader from '@/components/PageHeader'
import { createFileRoute } from '@tanstack/react-router'
import { driverKpis, mockDriverDetails } from '@/data/drivers'
import DriversTable from '@/components/drivers/DriversTable'
import DriversSkeleton from '@/components/skeletons/DriversSkeleton'
import PageError from '@/components/PageError'
import KpiOverview from '@/components/KpiOverview'
import { Card, CardContent } from '@/components/ui/card'
import DriversContent from '@/components/drivers/DriversContent'

export const Route = createFileRoute('/apps/$companyId/drivers/')({
  component: DriversRoute,
  loader: async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve('hello')
      }, 1000),
    )
  },
  pendingComponent: () => <DriversSkeleton />,
  errorComponent: () => (
    <PageError
      title="Failed to load drivers"
      description="We couldn't load the drivers list. Please check your connection and try again."
      onRetry={() => window.location.reload()}
    />
  ),
})

function DriversRoute() {
  return <DriversContent />
}
