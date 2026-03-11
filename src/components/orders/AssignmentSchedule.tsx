import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CalendarClock, Phone, Truck, User, Car } from 'lucide-react'
import { format } from 'date-fns'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import { Badge } from '../ui/badge'

interface AssignmentScheduleProps {
  driverName?: string
  driverPhone?: string
  vehicleModel?: string
  vehiclePlate?: string
  vehicleType?: string
  scheduledPickupAt?: string
  estimatedArrival?: string
}

export default function AssignmentScheduleCard({
  driverName,
  driverPhone,
  vehicleModel,
  vehiclePlate,
  vehicleType,
  scheduledPickupAt,
}: AssignmentScheduleProps) {
  return (
    <motion.div {...motionPresets.inViewFadeUp} className="flex-1">
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Assignment & Schedule" icon={Truck} />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {/* Assignment section */}
            <motion.div className="relative rounded-md border border-border/40 dark:border-border bg-transparent p-5">
              <div className="absolute right-3 top-3">
                <Badge variant="soft" size="sm">
                  Driver
                </Badge>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs font-normal tracking-wide uppercase text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Assignment
              </div>

              {driverName ? (
                <>
                  <p className="text-sm font-medium">{driverName}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {driverPhone}
                  </div>
                </>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No driver assigned yet
                </p>
              )}

              {/* Vehicle details */}
              {(vehicleModel || vehiclePlate || vehicleType) && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="absolute right-3 top-20">
                    <Badge variant="soft" size="sm">
                      Vehicle
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-normal tracking-wide uppercase text-muted-foreground mb-2">
                    <Car className="h-3.5 w-3.5" />
                    Vehicle
                  </div>
                  <p className="text-sm">
                    {vehicleModel} {vehicleType && `(${vehicleType})`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehiclePlate}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Schedule section */}
            <motion.div className="relative rounded-md border border-border/40 bg-transparent dark:border-border p-5">
              <div className="absolute right-3 top-3">
                <Badge variant="soft" size="sm">
                  Timing
                </Badge>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="text-sm font-medium">
                    {scheduledPickupAt
                      ? format(new Date(scheduledPickupAt), 'MMM dd, hh:mm a')
                      : '—'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
