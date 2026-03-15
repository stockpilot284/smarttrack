import PageHeader from '@/components/PageHeader'
import { createFileRoute } from '@tanstack/react-router'
import { driverKpis, mockDriverDetails } from '@/data/drivers'
import DriversTable from '@/components/drivers/DriversTable'
import DriversSkeleton from '@/components/skeletons/DriversSkeleton'
import PageError from '@/components/PageError'
import KpiOverview from '@/components/KpiOverview'
import { Card, CardContent } from '@/components/ui/card'

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
  errorComponent: () => <PageError />,
})

function DriversRoute() {
  return (
    <div className="p-6 flex flex-col gap-8 h-full">
      <PageHeader
        title="Drivers"
        description="Manage your delivery drivers and track their availability."
      />

      <KpiOverview kpis={driverKpis} />

      <Card>
        <CardContent>
          <DriversTable
            data={mockDriverDetails}
            enableActionsColumn
            enableRowSelection
            enableSearchAndFilter
            enablePagination
          />
        </CardContent>
      </Card>
    </div>
  )
}
