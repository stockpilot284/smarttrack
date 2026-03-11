import { cn } from '@/lib/utils'

export type Role = 'OWNER' | 'ADMIN' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'

type RoleBadgeProps = {
  role: Role
  className?: string
}

const roleStyles: Record<Role, string> = {
  OWNER:
    'bg-red-500/10 text-red-600 ring-red-500/20 dark:bg-red-500/20 dark:text-red-300',
  ADMIN:
    'bg-purple-500/10 text-purple-600 ring-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300',
  DISPATCHER:
    'bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300',
  DRIVER:
    'bg-green-500/10 text-green-600 ring-green-500/20 dark:bg-green-500/20 dark:text-green-300',
  CUSTOMER: 'bg-muted text-muted-foreground ring-border',
}

const roleLabels: Record<Role, string> = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize',
        roleStyles[role],
        className,
      )}
    >
      {roleLabels[role].replace('_', ' ').toLowerCase()}
    </span>
  )
}
