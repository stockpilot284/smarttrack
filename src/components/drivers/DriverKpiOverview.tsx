import { Truck, CheckCircle, Navigation, UserX, Users } from 'lucide-react'
import { DriverKpiItemProps } from '@/types/driver.type'
import DriverKpiItem from './DriverKpiItem'

const driverKpis: DriverKpiItemProps[] = [
  {
    label: 'Total Drivers',
    value: 120,
    Icon: Users,
    styles: 'bg-purple-50 text-primary',
    helperText: 'All registered drivers',
  },
  {
    label: 'Available',
    value: 48,
    Icon: CheckCircle,
    styles: 'bg-green-50 text-green-800',
    helperText: 'Ready for assignment',
  },
  {
    label: 'On Delivery',
    value: 57,
    Icon: Navigation,
    styles: 'bg-blue-50 text-blue-800',
    helperText: 'Currently delivering',
  },
  {
    label: 'Inactive',
    value: 15,
    Icon: UserX,
    styles: 'bg-gray-50 text-gray-700',
    helperText: 'Not available',
  },
]

export default function DriverKpiOverview() {
  return (
    <section id="driver-kpi-overview">
      <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {driverKpis.map((kpi) => (
          <DriverKpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
