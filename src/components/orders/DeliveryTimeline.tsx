import { FC } from 'react'
import { CheckCircle, LocateFixed, Timer } from 'lucide-react'
import { OrderStatus } from '@/types/order.type'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import { Card, CardContent, CardHeader } from '../ui/card'

interface TimelineEvent {
  id: string
  message: string
  status: OrderStatus
  timestamp: string
}

interface DeliveryTimelineProps {
  events: TimelineEvent[]
}

export const DeliveryTimeline: FC<DeliveryTimelineProps> = ({ events }) => {
  // Sort events by timestamp descending (latest first)
  const sortedTimeline = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  // The latest event is the first one (top)
  const latestEventId = sortedTimeline.length > 0 ? sortedTimeline[0].id : null

  return (
    <motion.div {...motionPresets.slideUp} className="flex-1">
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Delivery Timeline" icon={Timer} />
        </CardHeader>

        <CardContent>
          <div>
            <motion.ul
              variants={motionPresets.staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col overflow-y-auto max-h-[320px] p-1.5 no-scrollbar"
            >
              {sortedTimeline.map((event, index) => {
                const isActive = event.id === latestEventId
                const isLast = index === sortedTimeline.length - 1

                const IconComponent =
                  event.status === 'DELIVERED' ? CheckCircle : LocateFixed

                // Determine icon background color
                let iconBgClass = ''
                if (event.status === 'DELIVERED') {
                  iconBgClass = 'bg-green-500 text-white' // success for delivered
                } else if (isActive) {
                  iconBgClass = 'bg-primary text-primary-foreground' // primary for active non‑delivered
                } else {
                  iconBgClass = 'bg-muted/40 text-muted-foreground/60' // muted for inactive
                }

                return (
                  <motion.li
                    key={event.id}
                    layout
                    variants={motionPresets.staggerItem}
                    className="flex gap-4 rounded-md p-0.5"
                  >
                    {/* Icon column */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={
                          isActive
                            ? {
                                boxShadow: [
                                  '0 0 0 0 rgba(0,0,0,0)',
                                  '0 0 0 6px rgba(0,0,0,0.08)',
                                  '0 0 0 10px rgba(0,0,0,0)',
                                ],
                                scale: [1, 1.08, 1],
                              }
                            : {}
                        }
                        transition={
                          isActive
                            ? {
                                duration: 1.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : undefined
                        }
                        className={`
                          relative w-5 h-5 rounded-full
                          flex items-center justify-center
                          ${iconBgClass}
                        `}
                      >
                        <IconComponent size={14} />
                      </motion.div>

                      {!isLast && (
                        <div className="w-[1px] h-[37px] border border-dashed border-border/60" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-sm ${
                          isActive
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground/70'
                        }`}
                      >
                        {event.message}
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-xs ${
                            isActive
                              ? 'text-muted-foreground'
                              : 'text-muted-foreground/60'
                          }`}
                        >
                          {format(new Date(event.timestamp), 'dd MMM yyyy')}
                        </span>
                        <div className="w-3 h-0.5 bg-muted-foreground/40" />
                        <span
                          className={`text-sm ${
                            isActive
                              ? 'text-muted-foreground'
                              : 'text-muted-foreground/60'
                          }`}
                        >
                          {format(new Date(event.timestamp), 'hh:mm a')}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
