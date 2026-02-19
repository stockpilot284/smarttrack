enum OrderStatus {
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
    badge: 'bg-gray-50/70 text-gray-800',
    dot: 'bg-gray-500',
  },
  [OrderStatus.ASSIGNED]: {
    badge: 'bg-indigo-50/70 text-indigo-800',
    dot: 'bg-indigo-500',
  },
  [OrderStatus.PICKED_UP]: {
    badge: 'bg-blue-50/70 text-blue-800',
    dot: 'bg-blue-500',
  },
  [OrderStatus.IN_TRANSIT]: {
    badge: 'bg-blue-50/70 text-blue-800',
    dot: 'bg-blue-500',
  },
  [OrderStatus.DELIVERED]: {
    badge: 'bg-green-50/70 text-green-800',
    dot: 'bg-green-500',
  },
  [OrderStatus.CANCELLED]: {
    badge: 'bg-yellow-50/70 text-yellow-800',
    dot: 'bg-yellow-500',
  },
  [OrderStatus.FAILED]: {
    badge: 'bg-red-50/70 text-red-800',
    dot: 'bg-red-500',
  },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const statusText = status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const styles = STATUS_STYLES[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${styles.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {statusText}
    </span>
  )
}
