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
  isLoading,
}) => {
  if (isLoading) {
    return <DeliveryTimelineSkeleton />
  }
  const currentIndex = events.findIndex((e) => e.status === currentStatus)

  return (
    <motion.div
      className="flex flex-col gap-8 p-4 rounded-md bg-background shadow-xs flex-1"
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
              className="flex gap-4 relative"
              {...motionPresets.slideUp}
            >
              {/* Timeline circle */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center shadow-md',
                    isPast
                      ? 'bg-primary text-white'
                      : isCurrent
                        ? 'bg-white border border-primary'
                        : 'bg-white border border-gray-200',
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  {/* Glow for current */}
                  {isCurrent && (
                    <motion.span
                      className="absolute w-10 h-10 rounded-full bg-primary opacity-30"
                      animate={{
                        scale: [0.9, 1.01, 0.9],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Check for past */}
                  {isPast && <Check size={16} className="text-white" />}
                </motion.div>

                {/* Line connecting */}
                {index !== events.length - 1 && (
                  <span
                    className={clsx(
                      'block w-1 h-7 rounded-xs transition-colors duration-300 shadow',
                      index < currentIndex ? 'bg-primary' : 'bg-gray-200',
                    )}
                  />
                )}
              </div>

              {/* Status & timestamp */}
              <div className="flex flex-col gap-1">
                <span
                  className={clsx(
                    'text-sm font-medium transition-colors duration-300',
                    isPast || isCurrent ? 'text-foreground' : 'text-gray-400',
                  )}
                >
                  {statusLabels[e.status]}
                </span>
                <span className="text-xs text-gray-400">
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
