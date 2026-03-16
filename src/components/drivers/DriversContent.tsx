import PageHeader from '../PageHeader'
import KpiOverview from '../KpiOverview'
import { driverKpis, mockDriverDetails } from '@/data/drivers'
import { Card, CardContent } from '../ui/card'
import DriversTable from './DriversTable'

export default function DriversContent() {
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
