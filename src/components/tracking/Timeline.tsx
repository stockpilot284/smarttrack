import { motionPresets } from '@/lib/motion-presets'
import { OrderStatus } from '@/types/order.type'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  CheckCircle,
  LocateFixed,
  MapPin,
  Shrink,
  User,
} from 'lucide-react'
import React from 'react'
import { useMemo } from 'react'
import { Button } from '../ui/button'

type TimelineEvent = {
  id: string
  message: string
  status: OrderStatus
  timestamp: string
}

type TimelineProps = {
  events: TimelineEvent[]
}

const STATUS_STYLES: Record<OrderStatus, { bg: string; icon: string }> = {
  ['CREATED']: {
    icon: ' text-gray-700  dark:text-gray-300',
    bg: 'bg-gray-50/70 dark:bg-gray-500/10',
  },
  ['ASSIGNED']: {
    icon: ' text-indigo-700  dark:text-indigo-400',
    bg: 'bg-indigo-50/70 dark:bg-indigo-500/10',
  },
  ['PICKED_UP']: {
    icon: ' text-blue-700  dark:text-blue-400',
    bg: 'bg-blue-50/70 dark:bg-blue-500/10',
  },
  ['IN_TRANSIT']: {
    icon: ' text-sky-700  dark:text-sky-400',
    bg: 'bg-sky-50/70 dark:bg-sky-500/10',
  },
  ['DELIVERED']: {
    icon: 'text-green-700  dark:text-green-400',
    bg: 'bg-green-50/70 dark:bg-green-500/10',
  },
  ['CANCELLED']: {
    icon: ' text-yellow-700  dark:text-yellow-400',
    bg: 'bg-yellow-500 dark:bg-yellow-500/10',
  },
  ['FAILED']: {
    icon: 'text-red-700  dark:text-red-400',
    bg: 'bg-red-50/70 dark:bg-red-500/10',
  },
  ['DELETED']: {
    icon: 'text-red-700  dark:text-red-400',
    bg: 'bg-red-50/70 dark:bg-red-500/10',
  },
}

export default function Timeline({ events }: TimelineProps) {
  const sortedTimeline = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  const latestEventId = sortedTimeline[0]?.id
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <AnimatePresence mode="wait">
      {isExpanded ? (
        <motion.div
          className="bg-background p-4 rounded-md drop-shadow-2xl w-60"
          {...motionPresets.inViewFadeUp}
          key={'expanded'}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-[30px] h-[30px] rounded-md flex items-center justify-center bg-accent">
                <MapPin size={16} className="text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Timeline</span>
            </div>
            <Button
              variant="outline"
              size="iconXs"
              onClick={() => setIsExpanded(false)}
              title="collapse"
            >
              <Shrink size={16} />
            </Button>
          </div>

          <motion.ul
            {...motionPresets.staggerContainer}
            className="flex flex-col overflow-y-auto max-h-[300px] p-1.5 no-scrollbar"
          >
            {sortedTimeline.map((t, index) => {
              const isActive = t.id === latestEventId
              const isLast = index === sortedTimeline.length - 1
              const statusColors = STATUS_STYLES[t.status]

              // Determine icon: check for delivered, locateFixed otherwise
              const IconComponent =
                t.status === 'DELIVERED' ? CheckCircle : LocateFixed

              return (
                <motion.li
                  key={t.id}
                  layout
                  {...motionPresets.staggerItem}
                  className={`flex gap-4.5 rounded-md p-0.5`}
                >
                  {/* Icon */}
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
      relative w-[20px] h-[20px] rounded-full
      flex items-center justify-center
      ${
        isActive
          ? `${statusColors.bg} ${statusColors.icon}`
          : 'bg-muted/40 text-muted-foreground/60'
      }
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
                      className={`text-xs ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground/70'}`}
                    >
                      {t.message}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}
                      >
                        {format(new Date(t.timestamp), 'dd MMM yyyy')}
                      </span>
                      <div className="w-[12px] h-0.5 bg-muted-foreground/40" />
                      <span
                        className={`text-xs ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}
                      >
                        {format(new Date(t.timestamp), 'hh:mm a')}
                      </span>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        </motion.div>
      ) : (
        <motion.div
          className="w-full drop-shadow-2xl rounded-md flex items-center justify-end"
          {...motionPresets.inViewFadeUp}
          title="Timeline"
          key={'collapse'}
        >
          <Button
            variant="ghost"
            size="iconMd"
            className="rounded-full bg-card  drop-shadow-2xl"
            onClick={() => setIsExpanded(true)}
          >
            <Activity size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
