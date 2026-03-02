import { DriverStatus } from '@/types/driver.type'

const STATUS_STYLES: Record<DriverStatus, { badge: string; dot: string }> = {
  [DriverStatus.ACTIVE]: {
    badge:
      'bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    dot: 'bg-green-500 dark:bg-green-400',
  },
  [DriverStatus.SUSPENDED]: {
    badge:
      'bg-yellow-50/70 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    dot: 'bg-yellow-500 dark:bg-yellow-400',
  },
  [DriverStatus.INACTIVE]: {
    badge: 'bg-gray-50/70 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300',
    dot: 'bg-gray-500 dark:bg-gray-400',
  },
  [DriverStatus.DELETED]: {
    badge: 'bg-red-50/70 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    dot: 'bg-red-500 dark:bg-red-400',
  },
}

type DriversStatusBadgeProps = {
  status: DriverStatus
  size?: 'sm' | 'md' | 'lg'
}

export default function DriversStatusBadge({
  status,
  size = 'md',
}: DriversStatusBadgeProps) {
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
