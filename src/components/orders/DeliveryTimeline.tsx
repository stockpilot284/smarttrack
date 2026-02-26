import { FC } from 'react'
import { Check, Clock, Timer } from 'lucide-react'
import { OrderStatus } from '@/types/order.type'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import DeliveryTimelineSkeleton from '../skeletons/DeliveryTimelineSkeleton'

interface TimelineItem {
  status: OrderStatus
  timestamp: string
}

interface DeliveryTimelineProps {
  events: TimelineItem[]
  currentStatus: OrderStatus
  isLoading?: boolean
}

const statusLabels: Record<OrderStatus, string> = {
  CREATED: 'Order Created',
  ASSIGNED: 'Assigned to Driver',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
}

export const DeliveryTimeline: FC<DeliveryTimelineProps> = ({
  events,
  currentStatus,
}) => {
  const currentIndex = events.findIndex((e) => e.status === currentStatus)

  return (
    <motion.div
      className="flex flex-col gap-8 p-4 rounded-md bg-card shadow-xs flex-1"
      {...motionPresets.inViewFadeUp}
    >
      <SectionHeader title="Delivery Timeline" icon={Timer} />

      <ul className="relative flex flex-col gap-3 pl-3">
        {events.map((e, index) => {
          const isPast = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <motion.li
              key={e.status}
              className="relative flex gap-4"
              {...motionPresets.slideUp}
            >
              {/* Timeline circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={clsx(
                    'relative flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-colors',
                    isPast && 'bg-primary text-primary-foreground',
                    isCurrent && 'bg-background border border-primary',
                    !isPast &&
                      !isCurrent &&
                      'bg-background border border-border',
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {/* Glow for current */}
                  {isCurrent && (
                    <motion.span
                      className="absolute h-10 w-10 rounded-full bg-primary/30 dark:bg-primary/25"
                      animate={{
                        scale: [0.9, 1.05, 0.9],
                        opacity: [0.15, 0.25, 0.15],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Check for past */}
                  {isPast && (
                    <Check size={14} className="text-primary-foreground" />
                  )}
                </motion.div>

                {/* Line connecting */}
                {index !== events.length - 1 && (
                  <span
                    className={clsx(
                      'block h-7 w-1 rounded-xs shadow transition-colors duration-300',
                      index < currentIndex
                        ? 'bg-primary'
                        : 'bg-border dark:bg-border/60',
                    )}
                  />
                )}
              </div>

              {/* Status & timestamp */}
              <div className="flex flex-col gap-1">
                <span
                  className={clsx(
                    'text-sm font-medium transition-colors duration-300',
                    isPast || isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {statusLabels[e.status]}
                </span>

                <span className="text-xs text-muted-foreground">
                  {format(new Date(e.timestamp), 'MMM dd, hh:mm a')}
                </span>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}
