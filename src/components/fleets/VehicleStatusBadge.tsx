import { VehicleStatus } from '@/types/vehicle.type'

const STATUS_STYLES: Record<VehicleStatus, { badge: string; dot: string }> = {
  ['ACTIVE']: {
    badge:
      'bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    dot: 'bg-green-500 dark:bg-green-400',
  },
  ['SUSPENDED']: {
    badge:
      'bg-yellow-50/70 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500 dark:bg-yellow-400',
  },
  ['INACTIVE']: {
    badge: 'bg-gray-50/70 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
    dot: 'bg-gray-500 dark:bg-gray-400',
  },
  ['DELETED']: {
    badge: 'bg-red-50/70 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  ['MAINTENANCE']: {
    badge:
      'bg-amber-50/70 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
}

type VehicleStatusBadgeProps = {
  status: VehicleStatus
  size?: 'sm' | 'md' | 'lg'
}

export default function VehicleStatusBadge({
  status,
  size = 'md',
}: VehicleStatusBadgeProps) {
  const statusText = status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const styles = STATUS_STYLES[status]

  const sizeClasses = {
    sm: {
      padding: 'px-2 py-0.5',
      text: 'text-[10px]',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      padding: 'px-3 py-1',
      text: 'text-xs',
      dot: 'w-1.5 h-1.5',
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      dot: 'w-2 h-2',
    },
  }

  const { padding, text, dot } = sizeClasses[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${padding} ${text} font-medium ${styles.badge}`}
    >
      <span className={`rounded-full ${dot} ${styles.dot}`} />
      {statusText}
    </span>
  )
}
