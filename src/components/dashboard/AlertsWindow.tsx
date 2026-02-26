import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BellOff,
  Check,
  CircleAlert,
  CircleX,
  TriangleAlert,
  Dot,
} from 'lucide-react'
import { Badge } from '../ui/badge'
import { Link } from '@tanstack/react-router'
import EmptyState from '../EmptyState'
import { cn } from '@/lib/utils'

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

/* Style mapping */
const SEVERITY = {
  critical: {
    color: 'bg-red-50',
    accent: 'bg-red-500',
    icon: <CircleX size={18} className="text-red-600" />,
  },
  warning: {
    color: 'bg-amber-50',
    accent: 'bg-amber-400',
    icon: <TriangleAlert size={18} className="text-amber-600" />,
  },
  info: {
    color: 'bg-sky-50',
    accent: 'bg-sky-500',
    icon: <CircleAlert size={18} className="text-sky-600" />,
  },
  success: {
    color: 'bg-emerald-50',
    accent: 'bg-emerald-500',
    icon: <Check size={18} className="text-emerald-600" />,
  },
}

/* Motion variants */
const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
}

/* Main */
type AlertsWindowProps = { alerts: AlertUI[] }

export default function AlertsWindow({ alerts }: AlertsWindowProps) {
  return (
    <motion.ul
      className="flex flex-col gap-3 p-2 overflow-y-auto no-scrollbar"
      variants={listVariants}
      initial="hidden"
      animate="visible"
      role="list"
      aria-label="Alerts"
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

      {alerts.map((a) => (
        <AlertItem key={a.id} alert={a} />
      ))}
    </motion.ul>
  )
}

/* Item */
type AlertItemProps = { alert: AlertUI }

function AlertItem({ alert }: AlertItemProps) {
  const s = SEVERITY[alert.severity]
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        'group relative flex items-start gap-4 rounded-lg border border-transparent hover:shadow-sm transition-shadow bg-transparent',
        !alert.isRead && 'ring-1 ring-primary/10',
      )}
      role="listitem"
      aria-labelledby={`alert-title-${alert.id}`}
    >
      {/* Left accent */}
      <div className={cn('w-1 rounded-l-lg', s.accent)} aria-hidden="true" />

      {/* Content */}
      <div className="flex flex-1 items-start gap-3 p-3">
        <div className="flex-shrink-0 mt-0.5">{s.icon}</div>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              id={`alert-title-${alert.id}`}
              className="text-sm font-semibold text-foreground truncate"
            >
              {alert.title}
            </h3>

            {alert.badgeText && (
              <Badge className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground">
                {alert.badgeText}
              </Badge>
            )}

            {!alert.isRead && (
              <span className="ml-1" aria-hidden="true">
                <Dot size={10} className="text-primary animate-pulse" />
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
            {alert.description}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <time className="text-xs text-muted-foreground">
              {alert.timestamp}
            </time>

            {alert.actionLabel && (
              <span className="text-xs text-primary/90 font-medium">
                {alert.actionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-2 flex items-center gap-2">
          {alert.href ? (
            <Link
              to={alert.href}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={`Open ${alert.title}`}
            >
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="More actions"
            >
              <ArrowRight size={16} className="opacity-40 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </motion.li>
  )
}
