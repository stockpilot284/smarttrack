import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { CalendarClock, Phone, Truck, User } from 'lucide-react'
import { format } from 'date-fns'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import AssignmentScheduleSkeleton from '../skeletons/AssignmentScheduleSkeleton'

interface AssignmentScheduleProps {
  driverName?: string
  driverPhone?: string
  scheduledPickupAt?: string
  estimatedArrival?: string
}

export default function AssignmentScheduleCard({
  driverName,
  driverPhone,
  scheduledPickupAt,
  estimatedArrival,
}: AssignmentScheduleProps) {
  return (
    <motion.div {...motionPresets.inViewFadeUp} className="flex-1">
      <Card className="relative overflow-hidden  p-6 shadow-xs">
        {/* Ambient glow */}

        <SectionHeader title="Assignment & Schdedule" icon={Truck} />

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 ">
          {/* Assignment */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            className="relative rounded-md border border-border/40 dark:border-border bg-transparent p-5"
          >
            <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
              Driver
            </span>

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
          </motion.div>

          {/* Schedule */}
          <motion.div
            whileHover={{ scale: 1.015 }}
            className="relative rounded-md border border-border/40 bg-transparent dark:border-border p-5"
          >
            <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
              Timing
            </span>

            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase  tracking-wide text-muted-foreground">
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

              <div>
                <p className="text-xs text-muted-foreground">
                  Estimated Arrival
                </p>
                <p className="text-sm font-medium">
                  {estimatedArrival
                    ? format(new Date(estimatedArrival), 'MMM dd, hh:mm a')
                    : '—'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
