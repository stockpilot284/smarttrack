import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrackingItem } from '@/types/tracking.type'
import { cn } from '@/lib/utils'
import { Truck, LocateFixed, Calendar, CheckCircle, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { StatusBadge } from '@/components/StatusBadge'
import { DriverAvatar } from './DriverAvatar'

interface TrackingCardProps {
  item: TrackingItem
}

export function TrackingCard({ item }: TrackingCardProps) {
  const { companyId } = useParams({ from: '/apps/$companyId/tracking/' })
  const navigate = useNavigate()
  const firstStop = item.stops[0]
  const lastStop = item.stops[item.stops.length - 1]
  const completedStops = item.stops.filter(
    (s) => s.status === 'COMPLETED',
  ).length
  const clampedProgress = (completedStops / item.stops.length) * 100

  return (
    <motion.div {...motionPresets.staggerItem}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/10">
              {item.status === 'DELIVERED' ? (
                <CheckCircle
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              ) : (
                <Truck size={16} className="text-primary" />
              )}
            </div>
            <span className="text-sm font-medium">{item.reference}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} size="sm" variant="order" />
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pb-3">
          {/* Progress bar */}
          <div className="relative flex items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-100 dark:bg-accent/10 text-muted-foreground">
              <LocateFixed size={14} />
            </div>
            <div className="relative flex-1 h-[2px] mx-1">
              <div className="absolute inset-0 border-dashed border border-border/40" />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${clampedProgress}%` }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center border border-border/40 opacity-50">
              <LocateFixed size={14} />
            </div>
            {item.status !== 'DELIVERED' && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-10 w-5 h-5 flex items-center justify-center bg-background shadow-md rounded-full"
                animate={{ left: `calc(${clampedProgress}% - 10px)` }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <div className="w-3 h-3 rounded-full bg-primary" />
              </motion.div>
            )}
          </div>

          {/* Addresses */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="max-w-32 truncate" title={firstStop?.address}>
                {firstStop?.address}
              </p>
              <span className="text-xs text-muted-foreground">Pickup</span>
            </div>
            <div className="text-right">
              <p className="max-w-32 truncate" title={lastStop?.address}>
                {lastStop?.address}
              </p>
              <span className="text-xs text-muted-foreground">Drop-off</span>
            </div>
          </div>

          {/* Stop count with fraction for all orders */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground justify-start">
            <MapPin className="h-3 w-3" />
            <span>
              {completedStops}/{item.stops.length} stops
            </span>
          </div>

          {/* Driver & Vehicle */}
          <div className="flex items-center justify-between border rounded-md p-2">
            <div className="flex items-center gap-3">
              <DriverAvatar driver={item.driver} showStatus />
              <div className="space-y-0.5">
                <p
                  className="text-sm font-medium truncate max-w-28"
                  title={item.driver.name}
                >
                  {item.driver.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.vehicle.model} · {item.vehicle.plateNumber}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 h-full">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() =>
              navigate({
                to: '/apps/$companyId/tracking/$trackingId',
                params: { companyId, trackingId: item.id },
              })
            }
          >
            Track
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
