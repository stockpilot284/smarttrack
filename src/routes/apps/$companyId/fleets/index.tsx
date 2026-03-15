import { AddVehicleSheet } from '@/components/fleets/AddVehicleSheet'
import FleetsTable from '@/components/fleets/FleetsTable'
import KpiOverview from '@/components/KpiOverview'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fleetsKpi, mockFleetData } from '@/data/fleets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/fleets/')({
  component: FleetsRoute,
})

function FleetsRoute() {
  return (
    <div className="p-6 flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Fleets"
          description="Manage your vehicles and track their availability."
        />

        <AddVehicleSheet />
      </div>

      <KpiOverview kpis={fleetsKpi} />

      <Card>
        <CardContent>
          <FleetsTable
            data={mockFleetData}
            enableActionsColumn
            enableSearchAndFilter
            enablePagination
          />
        </CardContent>
      </Card>
    </div>
  )
}
