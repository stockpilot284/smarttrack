// components/ui/status-badge.tsx
import { cn } from '@/lib/utils'

export type StatusBadgeSize = 'sm' | 'md' | 'lg'

export interface StatusBadgeProps {
  /** The status value (e.g., 'ACTIVE', 'SUSPENDED', 'INVITED') */
  status: string
  /** Optional variant to pick from predefined style sets */
  variant?: 'driver' | 'member' | 'order' | 'vehicle' | 'default'
  /** Optional custom status styles mapping (overrides variant) */
  statusStyles?: Record<string, { badge: string; dot: string }>
  /** Size of the badge */
  size?: StatusBadgeSize
  /** Whether to show the dot indicator */
  showDot?: boolean
  /** Additional class names */
  className?: string
}

// Predefined style sets
const defaultStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: {
    badge:
      'bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    dot: 'bg-green-500 dark:bg-green-400',
  },
  SUSPENDED: {
    badge:
      'bg-yellow-50/70 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500 dark:bg-yellow-400',
  },
  INACTIVE: {
    badge: 'bg-gray-50/70 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
    dot: 'bg-gray-500 dark:bg-gray-400',
  },
  DELETED: {
    badge: 'bg-red-50/70 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  INVITED: {
    badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  PENDING: {
    badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
}

const driverStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: defaultStatusStyles.ACTIVE,
  SUSPENDED: defaultStatusStyles.SUSPENDED,
  INACTIVE: defaultStatusStyles.INACTIVE,
  DELETED: defaultStatusStyles.DELETED,
  AVAILABLE: defaultStatusStyles.ACTIVE, // green
  UNAVAILABLE: defaultStatusStyles.INACTIVE, // gray
  ON_BREAK: defaultStatusStyles.INACTIVE, // gray
  BUSY: {
    badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
}

const memberStatusStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: defaultStatusStyles.ACTIVE,
  SUSPENDED: defaultStatusStyles.SUSPENDED,
  DELETED: defaultStatusStyles.DELETED,
  INVITED: defaultStatusStyles.INVITED,
}

const orderStatusStyles: Record<string, { badge: string; dot: string }> = {
  CREATED: {
    badge:
      'bg-purple-50/70 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    dot: 'bg-purple-500 dark:bg-purple-400',
  },
  ASSIGNED: {
    badge:
      'bg-indigo-50/70 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    dot: 'bg-indigo-500 dark:bg-indigo-400',
  },
  PICKED_UP: {
    badge:
      'bg-amber-50/70 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  IN_TRANSIT: {
    badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  DELIVERED: defaultStatusStyles.ACTIVE,
  CANCELLED: defaultStatusStyles.DELETED,
}

// New vehicle styles (combines status and availability)
const vehicleStyles: Record<string, { badge: string; dot: string }> = {
  ACTIVE: defaultStatusStyles.ACTIVE,
  SUSPENDED: defaultStatusStyles.SUSPENDED,
  MAINTENANCE: {
    badge:
      'bg-orange-50/70 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
    dot: 'bg-orange-500 dark:bg-orange-400',
  },
  DELETED: defaultStatusStyles.DELETED,
  AVAILABLE: defaultStatusStyles.ACTIVE, // green
  IN_USE: {
    badge: 'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  UNAVAILABLE: defaultStatusStyles.INACTIVE, // gray
}

const variantStyles: Record<
  string,
  Record<string, { badge: string; dot: string }>
> = {
  driver: driverStatusStyles,
  member: memberStatusStyles,
  order: orderStatusStyles,
  vehicle: vehicleStyles,
  default: defaultStatusStyles,
}

const sizeClasses: Record<
  StatusBadgeSize,
  { padding: string; text: string; dot: string }
> = {
  sm: { padding: 'px-2 py-0.5', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
  md: { padding: 'px-3 py-1', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  lg: { padding: 'px-4 py-2', text: 'text-sm', dot: 'w-2 h-2' },
}

export function StatusBadge({
  status,
  variant = 'default',
  statusStyles,
  size = 'md',
  showDot = true,
  className,
}: StatusBadgeProps) {
  // Determine which style set to use
  let styleSet = variantStyles[variant] || defaultStatusStyles
  if (statusStyles) {
    styleSet = { ...styleSet, ...statusStyles }
  }

  const styles = styleSet[status] ||
    styleSet['default'] || {
      badge:
        'bg-gray-50/70 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
      dot: 'bg-gray-500 dark:bg-gray-400',
    }

  const sizeClass = sizeClasses[size]

  // Format status text: lowercase, replace underscores, capitalize words
  const statusText = status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full',
        sizeClass.padding,
        sizeClass.text,
        'font-medium',
        styles.badge,
        className,
      )}
    >
      {showDot && (
        <span className={cn('rounded-full', sizeClass.dot, styles.dot)} />
      )}
      {statusText}
    </span>
  )
}
