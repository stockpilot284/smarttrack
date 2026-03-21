// components/ui/status-badge.tsx
import { cn } from '@/lib/utils'

export type StatusBadgeSize = 'sm' | 'md' | 'lg'

export interface StatusBadgeProps {
  status: string
  variant?: 'driver' | 'member' | 'order' | 'vehicle' | 'trip' | 'default'
  statusStyles?: Record<string, { badge: string; dot: string }>
  size?: StatusBadgeSize
  showDot?: boolean
  className?: string
}

// ─── Shared atomic styles ─────────────────────────────────────────────────────

const green = {
  badge:
    'bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  dot: 'bg-green-500 dark:bg-green-400',
}
const yellow = {
  badge:
    'bg-yellow-50/70 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
  dot: 'bg-yellow-500 dark:bg-yellow-400',
}
const gray = {
  badge: 'bg-gray-50/70 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
  dot: 'bg-gray-500 dark:bg-gray-400',
}
const red = {
  badge: 'bg-red-50/70 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  dot: 'bg-red-500 dark:bg-red-400',
}
const blue = {
  badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  dot: 'bg-blue-500 dark:bg-blue-400',
}
const indigo = {
  badge:
    'bg-indigo-50/70 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
  dot: 'bg-indigo-500 dark:bg-indigo-400',
}
const amber = {
  badge:
    'bg-amber-50/70 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  dot: 'bg-amber-500 dark:bg-amber-400',
}
const purple = {
  badge:
    'bg-purple-50/70 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
  dot: 'bg-purple-500 dark:bg-purple-400',
}
const orange = {
  badge:
    'bg-orange-50/70 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  dot: 'bg-orange-500 dark:bg-orange-400',
}
const emerald = {
  badge:
    'bg-emerald-50/70 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  dot: 'bg-emerald-500 dark:bg-emerald-400',
}
const slate = {
  badge:
    'bg-slate-50/70 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  dot: 'bg-slate-400 dark:bg-slate-400',
}

// ─── Variant maps ─────────────────────────────────────────────────────────────

const defaultStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: green,
  SUSPENDED: yellow,
  INACTIVE: gray,
  DELETED: red,
  INVITED: blue,
  PENDING: blue,
  FAILED: red,
  COMPLETED: emerald,
  CANCELLED: slate,
}

const driverStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: green,
  SUSPENDED: yellow,
  INACTIVE: gray,
  DELETED: red,
  AVAILABLE: green,
  UNAVAILABLE: gray,
  ON_BREAK: amber,
  BUSY: blue,
}

const memberStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: green,
  SUSPENDED: yellow,
  DELETED: red,
  INVITED: blue,
}

const orderStatusStyles: Record<string, { badge: string; dot: string }> = {
  // Order lifecycle
  CREATED: purple,
  ASSIGNED: indigo,
  PICKED_UP: amber,
  IN_TRANSIT: blue,
  DELIVERED: emerald,
  FAILED: red,
  CANCELLED: slate,
  // Trip lifecycle (order variant also used on TrackingCard via item.status)
  COMPLETED: emerald,
}

// Trip-specific variant — maps TrackingStatus values
const tripStatusStyles: Record<string, { badge: string; dot: string }> = {
  ASSIGNED: indigo,
  IN_TRANSIT: blue,
  COMPLETED: emerald,
  FAILED: red,
  CANCELLED: slate,
}

const vehicleStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: green,
  SUSPENDED: yellow,
  MAINTENANCE: orange,
  DELETED: red,
  AVAILABLE: green,
  IN_USE: blue,
  UNAVAILABLE: gray,
}

const variantStyles: Record<
  string,
  Record<string, { badge: string; dot: string }>
> = {
  driver: driverStatusStyles,
  member: memberStatusStyles,
  order: orderStatusStyles,
  trip: tripStatusStyles,
  vehicle: vehicleStyles,
  default: defaultStatusStyles,
}

// ─── Size config ──────────────────────────────────────────────────────────────

const sizeClasses: Record<
  StatusBadgeSize,
  { padding: string; text: string; dot: string }
> = {
  sm: { padding: 'px-2 py-0.5', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
  md: { padding: 'px-3 py-1', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  lg: { padding: 'px-4 py-2', text: 'text-sm', dot: 'w-2 h-2' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusBadge({
  status,
  variant = 'default',
  statusStyles,
  size = 'md',
  showDot = true,
  className,
}: StatusBadgeProps) {
  let styleSet = variantStyles[variant] ?? defaultStatusStyles
  if (statusStyles) styleSet = { ...styleSet, ...statusStyles }

  const styles = styleSet[status] ?? styleSet['default'] ?? gray
  const sizeClass = sizeClasses[size]

  const statusText = status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClass.padding,
        sizeClass.text,
        styles.badge,
        className,
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full flex-shrink-0',
            sizeClass.dot,
            styles.dot,
          )}
        />
      )}
      {statusText}
    </span>
  )
}
