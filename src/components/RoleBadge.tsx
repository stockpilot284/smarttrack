import { cn } from '@/lib/utils'
import { MemberRole } from '@/types/member.type'

type RoleBadgeSize = 'sm' | 'md' | 'lg'

type RoleBadgeProps = {
  role: MemberRole
  size?: RoleBadgeSize
  className?: string
}

const roleStyles: Record<MemberRole, string> = {
  OWNER: 'bg-red-50/70 text-red-700 dark:bg-red-500/20 dark:text-red-300',
  ADMIN:
    'bg-purple-50/70 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  DISPATCHER:
    'bg-blue-50/70 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  DRIVER:
    'bg-green-50/70 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  CUSTOMER:
    'bg-gray-50/70 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
}

const roleLabels: Record<MemberRole, string> = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
}

const sizeClasses: Record<RoleBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-2 text-sm',
}

export function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium capitalize',
        sizeClasses[size],
        roleStyles[role],
        className,
      )}
    >
      {roleLabels[role].replace('_', ' ').toLowerCase()}
    </span>
  )
}
