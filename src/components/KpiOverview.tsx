import { LucideIcon } from 'lucide-react'
import { KpiItemProps } from './KpiItem'
import KpiItem from './KpiItem'

export type KpiOverview = {
  label: string
  value: number | string
  Icon: LucideIcon
  helperText: string
}

type KpiOverviewProps = {
  kpis: KpiItemProps[]
}
export default function KpiOverview({ kpis }: KpiOverviewProps) {
  return (
    <section>
      <ul className="w-full grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-3 lg:gap-4">
        {kpis.map((kpi) => (
          <KpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
