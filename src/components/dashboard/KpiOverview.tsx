import { CheckCircle, Clock, LucideIcon, Package, Truck } from 'lucide-react'
import KpiItem from './KpiItem'

export type KpiItemProps = {
  label: string
  value: number | string
  percentageChange?: number // + or - from last month
  Icon: LucideIcon
  styles: string
}

const kpis: KpiItemProps[] = [
  {
    label: 'Total Orders',
    value: 2_230,
    percentageChange: 13.1,
    Icon: Package,
    styles: 'bg-purple-50 text-primary',
  },
  {
    label: 'Successful Deliveries',
    value: 2_120,
    percentageChange: 8.1,
    Icon: CheckCircle,
    styles: 'bg-green-50 text-green-800',
  },
  {
    label: 'Active Drivers',
    value: 84,
    percentageChange: -3.2,
    Icon: Truck,
    styles: 'bg-blue-50 text-blue-800',
  },
  {
    label: 'On-time Delivery',
    value: '92%',
    percentageChange: 4.6,
    Icon: Clock,
    styles: 'bg-amber-50 text-amber-800',
  },
]

export default function KpiOverview() {
  return (
    <section id="kpi-overview">
      <ul className="w-full grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-3 lg:gap-4">
        {kpis.map((kpi) => (
          <KpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
