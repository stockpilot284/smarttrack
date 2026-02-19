import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type DeliveryChartData = {
  date: string
  delivered: number
  failed: number
}

type Props = {
  data: DeliveryChartData[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const delivered = payload.find((p) => p.dataKey === 'delivered')?.value ?? 0
  const failed = payload.find((p) => p.dataKey === 'failed')?.value ?? 0
  const total = delivered + failed

  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm text-xs">
      <p className="font-medium mb-1">{label}</p>

      <div className="flex flex-col gap-1">
        <span className="text-green-600">
          Delivered: <strong>{delivered}</strong>
        </span>
        <span className="text-red-600">
          Failed: <strong>{failed}</strong>
        </span>
        <span className="text-muted-foreground">
          Total: <strong>{total}</strong>
        </span>
      </div>
    </div>
  )
}

const legendFormatter = (value: string) => {
  return <span className="text-xs text-gray-500 capitalize">{value}</span>
}

export function DeliveryPerformanceChart({ data }: Props) {
  return (
    <div className="flex-1 min-h-[280px]">
      <ResponsiveContainer>
        <BarChart
          data={data}
          barGap={0}
          barCategoryGap="20%"
          responsive
          margin={{ left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            fill="#9ca3af"
            fontFamily="Inter"
            fontWeight={400}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            fill="#9ca3af"
            fontFamily="Inter"
            fontWeight={400}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            formatter={legendFormatter}
            wrapperStyle={{ paddingBottom: 8 }}
          />

          <Bar
            dataKey="delivered"
            fill="#16a34a"
            radius={[2, 2, 0, 0]}
            barSize={40}
          />

          <Bar
            dataKey="failed"
            fill="#dc2626"
            radius={[2, 2, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
