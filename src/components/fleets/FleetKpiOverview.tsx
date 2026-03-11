import { Truck, CheckCircle, Navigation, Settings, Wrench } from 'lucide-react'
import { FleetKpiItemProps } from '@/types/vehicle.type'
import FleetKpiItem from './FleetKpiItem'
import { mockFleetData } from '@/data/fleets'

const availableVehiclesCount = mockFleetData.filter(
  (v) => v.availability === 'AVAILABLE',
).length

const inUseVehiclesCount = mockFleetData.filter(
  (v) => v.availability === 'IN_USE',
).length

const maintenanceVehiclesCount = mockFleetData.filter(
  (v) => v.status === 'MAINTENANCE',
).length

const fleetsKpi: FleetKpiItemProps[] = [
  {
    label: 'Total Vehicles',
    value: mockFleetData.length,
    Icon: Truck,
    styles:
      'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    helperText: 'All registered vehicles',
  },
  {
    label: 'Available',
    value: availableVehiclesCount,
    Icon: CheckCircle,
    styles:
      'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    helperText: 'Ready for assignment',
  },
  {
    label: 'In Use',
    value: inUseVehiclesCount,
    Icon: Navigation,
    styles: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    helperText: 'Currently delivering',
  },
  {
    label: 'Maintainace',
    value: maintenanceVehiclesCount,
    Icon: Wrench,
    styles:
      'bg-amber-50/70 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',

    helperText: 'Vehicles under repair',
  },
]

export default function FleetKpiOverview() {
  return (
    <section id="fleet-kpi-overview">
      <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {fleetsKpi.map((kpi) => (
          <FleetKpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
