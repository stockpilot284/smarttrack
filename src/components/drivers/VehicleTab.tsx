import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Truck, MapPin, Calendar, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/components/SectionHeader'
import { DriverDetail } from '@/types/driver.type'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

interface VehicleTabProps {
  driver: DriverDetail
}

export function VehicleTab({ driver }: VehicleTabProps) {
  return (
    <div className="space-y-6">
      {/* Current Vehicle & Trip Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Current Vehicle Card */}
        <motion.div {...motionPresets.inViewFadeUp} className="h-full">
          <Card className="h-full">
            <CardHeader>
              <SectionHeader title="Current Vehicle" icon={Truck} />
            </CardHeader>
            <CardContent>
              {driver.vehicle ? (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{driver.vehicle.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {driver.vehicle.plate}
                    </p>
                  </div>
                  {driver.vehicleHistory &&
                    driver.vehicleHistory.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Since{' '}
                        {format(
                          new Date(
                            driver.vehicleHistory.find(
                              (v) => v.plate === driver.vehicle?.plate,
                            )?.assignedAt ||
                              driver.vehicleHistory[0].assignedAt,
                          ),
                          'MMM yyyy',
                        )}
                      </Badge>
                    )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No vehicle assigned
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Trip Card */}
        <motion.div {...motionPresets.inViewFadeUp} className="h-full">
          <Card className="h-full">
            <CardHeader>
              <SectionHeader title="Current Trip" icon={MapPin} />
            </CardHeader>
            <CardContent>
              {driver.currentTrip ? (
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {driver.currentTrip.destination}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {driver.currentTrip.status}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active trip</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Vehicle History List */}
      {driver.vehicleHistory && driver.vehicleHistory.length > 0 && (
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card>
            <CardHeader>
              <SectionHeader title="Vehicle History" icon={Calendar} />
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border/50 dark:divide-border">
                {driver.vehicleHistory.map((vh, idx) => {
                  const isCurrent = vh.plate === driver.vehicle?.plate
                  return (
                    <li
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full',
                            isCurrent ? 'bg-primary' : 'bg-muted-foreground/30',
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {vh.model}{' '}
                            <span className="text-muted-foreground">
                              ({vh.plate})
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Assigned {format(new Date(vh.assignedAt), 'PPP')}
                          </p>
                        </div>
                      </div>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
