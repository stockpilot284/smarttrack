import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CalendarClock, Phone, Truck, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import { AvatarFallback, Avatar, AvatarImage } from '../ui/avatar'
import { avatarClass } from '@/utils/avatar-styles'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DriverInfo {
  name: string
  phone?: string
  imageUrl?: string
}

interface VehicleInfo {
  model: string
  plateNumber: string
  type: string
  imageUrl?: string
}

interface AssignmentScheduleProps {
  driver?: DriverInfo
  vehicle?: VehicleInfo
  scheduledPickupAt?: string
  estimatedArrival?: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// function Avatar({
//   imageUrl,
//   name,
//   size = 'md',
// }: {
//   imageUrl?: string
//   name: string
//   size?: 'sm' | 'md'
// }) {
//   const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-11 w-11 text-sm'
//   const initials = name
//     .split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2)

//   if (imageUrl) {
//     return (
//       <img
//         src={imageUrl}
//         alt={name}
//         className={`${dim} rounded-full object-cover ring-2 ring-border/40 shrink-0`}
//       />
//     )
//   }

//   return (
//     <div
//       className={`${dim} rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground ring-2 ring-border/40 shrink-0`}
//     >
//       {initials}
//     </div>
//   )
// }

function VehicleThumbnail({
  imageUrl,
  model,
}: {
  imageUrl?: string
  model: string
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={model}
        className="h-11 w-16 rounded-md object-cover ring-1 ring-border/40 shrink-0"
      />
    )
  }

  return (
    <div className="h-11 w-16 rounded-md bg-muted flex items-center justify-center ring-1 ring-border/40 shrink-0">
      <Truck className="h-5 w-5 text-muted-foreground/50" />
    </div>
  )
}

// ─── Schedule row ──────────────────────────────────────────────────────────────

function ScheduleRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <span className="text-xs font-medium text-foreground tabular-nums whitespace-nowrap">
        {value}
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AssignmentScheduleCard({
  driver,
  vehicle,
  scheduledPickupAt,
  estimatedArrival,
}: AssignmentScheduleProps) {
  const hasAssignment = driver || vehicle
  const hasSchedule = scheduledPickupAt || estimatedArrival

  return (
    <motion.div {...motionPresets.slideUp} className="flex-1">
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Assignment & Schedule" icon={Truck} />
        </CardHeader>

        <CardContent className="space-y-3">
          {/* ── Driver row ── */}
          <div className="rounded-lg border border-border/40 dark:border-border p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Driver
            </p>

            {driver ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={driver.imageUrl} alt={driver.name} />
                  <AvatarFallback className={avatarClass(driver.name)}>
                    {driver.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{driver.name}</p>
                  {driver.phone && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {driver.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                No driver assigned
              </p>
            )}
          </div>

          {/* ── Vehicle row ── */}
          <div className="rounded-lg border border-border/40 dark:border-border p-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Vehicle
            </p>

            {vehicle ? (
              <div className="flex items-center gap-3">
                <VehicleThumbnail
                  imageUrl={vehicle.imageUrl}
                  model={vehicle.model}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {vehicle.model}
                    {vehicle.type && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        {vehicle.type}
                      </span>
                    )}
                  </p>
                  {vehicle.plateNumber && (
                    <span className="mt-1 inline-flex items-center rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground tracking-wider">
                      {vehicle.plateNumber}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                No vehicle assigned
              </p>
            )}
          </div>

          {/* ── Schedule row ── */}
          {hasSchedule && (
            <div className="rounded-lg border border-border/40 dark:border-border p-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-3">
                Schedule
              </p>
              <div className="space-y-2.5">
                {scheduledPickupAt && (
                  <ScheduleRow
                    icon={MapPin}
                    label="Pickup"
                    value={format(
                      new Date(scheduledPickupAt),
                      'MMM dd, hh:mm a',
                    )}
                  />
                )}
                {estimatedArrival && (
                  <ScheduleRow
                    icon={Clock}
                    label="Est. arrival"
                    value={format(
                      new Date(estimatedArrival),
                      'MMM dd, hh:mm a',
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
