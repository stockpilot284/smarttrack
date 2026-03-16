import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SectionHeader } from '@/components/SectionHeader'
import { DriverDetail } from '@/types/driver.type'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Calendar, Package, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        Deliveries:{' '}
        <span className="font-bold text-foreground">{payload[0].value}</span>
      </p>
    </div>
  )
}

interface HistoryTabProps {
  driver: DriverDetail
}

export function HistoryTab({ driver }: HistoryTabProps) {
  // Mock performance data – replace with real data from driver if available
  const performanceData = driver.tripHistory
    ? [
        { name: 'Mon', deliveries: 4 },
        { name: 'Tue', deliveries: 6 },
        { name: 'Wed', deliveries: 5 },
        { name: 'Thu', deliveries: 7 },
        { name: 'Fri', deliveries: 8 },
      ]
    : []

  // You could derive these from actual driver data
  const totalDeliveries = driver.tripHistory?.length || 127
  const onTimeRate = '94%'
  const avgDeliveryTime = '32 min'
  const monthlyDistance = '1,245 km'

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column – Trip History (spans 2 columns on large screens) */}
      <motion.div {...motionPresets.slideUp} className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <SectionHeader title="Recent Trips" icon={Calendar} />
          </CardHeader>
          <CardContent>
            {driver.tripHistory && driver.tripHistory.length > 0 ? (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
                {driver.tripHistory.slice(0, 10).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between border-b border-border/50 dark:border-border pb-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{trip.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(trip.date), 'PP')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        trip.status === 'Delivered' ? 'softSuccess' : 'outline'
                      }
                      className="text-xs"
                    >
                      {trip.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trip history</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Right column – stacked cards */}
      <div className="space-y-6">
        {/* Metrics Card */}
        <motion.div {...motionPresets.slideUp}>
          <Card>
            <CardHeader>
              <SectionHeader title="Performance Metrics" icon={TrendingUp} />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">
                  Total deliveries
                </span>
                <p className="text-base font-semibold">{totalDeliveries}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">
                  On‑time rate
                </span>
                <p className="text-base font-semibold text-green-600">
                  {onTimeRate}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">
                  Avg. delivery time
                </span>
                <p className="text-base font-semibold">{avgDeliveryTime}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-sm">
                  Distance (month)
                </span>
                <p className="text-base font-semibold">{monthlyDistance}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Deliveries Chart Card */}
        <motion.div {...motionPresets.slideUp}>
          <Card>
            <CardHeader>
              <SectionHeader title="Daily Deliveries" icon={Package} />
            </CardHeader>
            <CardContent>
              {performanceData.length > 0 ? (
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="deliveries"
                        fill="var(--chart-delivered)"
                        radius={[10, 10, 10, 10]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No chart data</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
