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
    <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
      <p className="font-medium mb-1 dark:text-gray-200">{label}</p>

      <div className="flex flex-col gap-1">
        <span style={{ color: '#2b9c76' }}>
          Delivered: <strong>{delivered}</strong>
        </span>
        <span style={{ color: '#d94e4e' }}>
          Failed: <strong>{failed}</strong>
        </span>
        <span className="text-muted-foreground dark:text-gray-400">
          Total: <strong>{total}</strong>
        </span>
      </div>
    </div>
  )
}

const legendFormatter = (value: string) => {
  return (
    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
      {value}
    </span>
  )
}

export function DeliveryPerformanceChart({ data }: Props) {
  return (
    <div className="flex-1 min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={0}
          barCategoryGap="20%"
          margin={{ left: 0 }}
        >
          <CartesianGrid
            stroke="var(--chart-grid)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: 'var(--chart-axis)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: 'var(--chart-axis)' }}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            tickLine={{ stroke: 'var(--chart-grid)' }}
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
            fill="var(--chart-delivered)"
            radius={[10, 10, 10, 10]}
            barSize={40}
          />

          <Bar
            dataKey="failed"
            fill="var(--chart-failed)"
            radius={[10, 10, 10, 10]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
