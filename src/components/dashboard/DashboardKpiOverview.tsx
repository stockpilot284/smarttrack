import { LucideIcon } from 'lucide-react'
import DashboardKpiItem from './DashboardKpiItem'

export type DashboardKpiItemProps = {
  label: string
  value: number | string
  percentageChange?: number // + or - from last month
  Icon: LucideIcon
  styles: string
}

type KpiOverviewProps = {
  kpis: DashboardKpiItemProps[]
}
export default function DashboardKpiOverview({ kpis }: KpiOverviewProps) {
  return (
    <section id="kpi-overview">
      <ul className="w-full grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-3 lg:gap-4">
        {kpis.map((kpi) => (
          <DashboardKpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
