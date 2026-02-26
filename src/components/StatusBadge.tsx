import React from 'react'

export enum OrderStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

const STATUS_STYLES: Record<OrderStatus, { badge: string; dot: string }> = {
  [OrderStatus.CREATED]: {
    badge: 'bg-gray-50/70 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300',
    dot: 'bg-gray-400 dark:bg-gray-400',
  },
  [OrderStatus.ASSIGNED]: {
    badge:
      'bg-indigo-50/70 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    dot: 'bg-indigo-500 dark:bg-indigo-400',
  },
  [OrderStatus.PICKED_UP]: {
    badge: 'bg-blue-50/70 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
  [OrderStatus.IN_TRANSIT]: {
    badge: 'bg-sky-50/70 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
    dot: 'bg-sky-500 dark:bg-sky-400',
  },
  [OrderStatus.DELIVERED]: {
    badge:
      'bg-green-50/70 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    dot: 'bg-green-500 dark:bg-green-400',
  },
  [OrderStatus.CANCELLED]: {
    badge:
      'bg-yellow-50/70 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
    dot: 'bg-yellow-500 dark:bg-yellow-400',
  },
  [OrderStatus.FAILED]: {
    badge: 'bg-red-50/70 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400',
  },
}

type StatusBadgeProps = {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusText = status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const styles = STATUS_STYLES[status]

  // Define size mapping
  const sizeClasses = {
    sm: { padding: 'px-2 py-0.5', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
    md: { padding: 'px-3 py-1', text: 'text-xs', dot: 'w-1.5 h-1.5' },
    lg: { padding: 'px-4 py-2', text: 'text-sm', dot: 'w-2 h-2' },
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
