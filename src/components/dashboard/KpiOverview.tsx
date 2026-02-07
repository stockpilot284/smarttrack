import KpiItem from './KpiItem'

export type KpiItemProps = {
  label: string
  value: number | string
  percentageChange: number // + or - from last month
}

const kpis: KpiItemProps[] = [
  {
    label: 'Total Orders',
    value: 2_340,
    percentageChange: 12.4,
  },
  {
    label: 'Successful Deliveries',
    value: 2_120,
    percentageChange: 8.1,
  },
  {
    label: 'Active Drivers',
    value: 84,
    percentageChange: -3.2,
  },
  {
    label: 'On-time Delivery',
    value: '92%',
    percentageChange: 4.6,
  },
]

export default function KpiOverview() {
  return (
    <section id="kpi-overview">
      <ul className="w-full flex justify-between items-center gap-3">
        {kpis.map((kpi) => (
          <KpiItem key={kpi.label} data={kpi} />
        ))}
      </ul>
    </section>
  )
}
