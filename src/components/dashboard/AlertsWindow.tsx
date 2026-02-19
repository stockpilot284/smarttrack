import { motion } from 'framer-motion'
import { easeInOut } from 'framer-motion'
import {
  ArrowRight,
  BellOff,
  Check,
  CircleAlert,
  CircleX,
  TriangleAlert,
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { Link } from '@tanstack/react-router'
import EmptyState from '../EmptyState'

/* Types */

export type AlertUI = {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  timestamp: string
  isRead: boolean
  href?: string
  actionLabel?: string
  badgeText?: string
}

/* Style Mapping  */

const ALERT_STYLES = {
  critical: {
    icon: <CircleX size={18} className="text-red-600" />,
  },
  warning: {
    icon: <TriangleAlert size={18} className="text-amber-600" />,
  },
  info: {
    icon: <CircleAlert size={18} className="text-blue-600" />,
  },
  success: {
    icon: <Check size={18} className="text-emerald-600" />,
  },
}

/* Motion Variants */

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: easeInOut,
    },
  },
}

/* Main Component  */

type AlertsWindowProps = {
  alerts: AlertUI[]
}

export default function AlertsWindow({ alerts }: AlertsWindowProps) {
  return (
    <motion.ul
      className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {alerts.length === 0 && (
        <motion.li variants={itemVariants} className="py-6">
          <EmptyState
            Icon={BellOff}
            title="You're all caught up"
            description="No new alerts at the moment. We’ll notify you if anything needs attention."
          />
        </motion.li>
      )}

      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </motion.ul>
  )
}

/* Alert Item  */

type AlertItemProps = {
  alert: AlertUI
}

function AlertItem({ alert }: AlertItemProps) {
  const style = ALERT_STYLES[alert.severity]

  return (
    <motion.li
      variants={itemVariants}
      className="group border-border/50 border-b flex justify-between items-start gap-4 py-3 last:border-b-0"
    >
      {/* Left */}
      <div className="flex gap-3 flex-1">
        <div className="mt-0.5">{style.icon}</div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {alert.title}
            </span>

            {/* {alert.badgeText && (
              <Badge className="text-[10px] px-2 py-0.5 bg-accent text-muted-foreground">
                {alert.badgeText}
              </Badge>
            )} */}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {alert.description}
          </p>

          <span className="text-xs text-muted-foreground mt-1">
            {alert.timestamp}
          </span>
        </div>
      </div>

      {/* Right Action */}
      {alert.href && (
        <Link
          to={alert.href}
          className="text-xs text-primary flex items-center gap-0.5 transition-colors hover:text-primary/70 pr-1"
        >
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </motion.li>
  )
}
