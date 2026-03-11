import AddDriver from '@/components/drivers/AddDriver'
import DriversTable from '@/components/drivers/DriversTable'
import FleetKpiOverview from '@/components/fleets/FleetKpiOverview'
import FleetsTable from '@/components/fleets/FleetsTable'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { mockFleetData } from '@/data/fleets'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

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

        <Button leftIcon={<Plus size={20} />} size={'sm'}>
          Add Vehicle
        </Button>
      </div>

      <FleetKpiOverview />

      <section className="bg-card px-4 py-8 md:p-8 rounded-md shadow-xs  dark:border dark:border-border">
        <FleetsTable
          data={mockFleetData}
          enableActionsColumn
          enableRowSelection
          enableSearchAndFilter
          enablePagination
        />
      </section>
    </div>
  )
}
