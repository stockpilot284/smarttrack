import { cn } from '@/lib/utils'

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'CUSTOMER'

type RoleBadgeProps = {
  role: Role
  className?: string
}

const roleStyles: Record<Role, string> = {
  SUPER_ADMIN: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20',
  ADMIN:
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20',
  DISPATCHER:
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
  DRIVER:
    'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20',
  CUSTOMER: 'bg-muted text-muted-foreground ring-border',
}

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DISPATCHER: 'Dispatcher',
  DRIVER: 'Driver',
  CUSTOMER: 'Customer',
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        roleStyles[role],
        className,
      )}
    >
      {roleLabels[role]}
    </span>
  )
}
