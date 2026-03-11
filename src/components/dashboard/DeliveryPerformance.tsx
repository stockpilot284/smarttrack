import { BarChart3, Gauge } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import { DeliveryPerformanceChart } from './DeliveryPerformanceChart'
import EmptyState from '../EmptyState'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Card, CardContent, CardHeader } from '../ui/card'

export type DeliveryChartData = {
  date: string // e.g. "Mon", "2026-02-01"
  delivered: number
  failed: number
}

const data: DeliveryChartData[] = [
  { date: 'Mon', delivered: 120, failed: 8 },
  { date: 'Tue', delivered: 98, failed: 12 },
  { date: 'Wed', delivered: 140, failed: 5 },
  { date: 'Thu', delivered: 110, failed: 9 },
  { date: 'Fri', delivered: 160, failed: 6 },
  { date: 'Sat', delivered: 90, failed: 4 },
  { date: 'Sun', delivered: 130, failed: 7 },
]

export default function DeliveryPerformance() {
  return (
    <motion.div {...motionPresets.slideUp} className="h-auto">
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Delivery Performance" icon={Gauge} />
        </CardHeader>
        <CardContent className="flex flex-1">
          {data.length > 0 ? (
            <DeliveryPerformanceChart data={data} />
          ) : (
            <EmptyState
              title="No delivery data yet"
              description="Delivery performance for the last 7 days will appear here once orders are completed."
              Icon={BarChart3}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
