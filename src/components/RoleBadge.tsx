import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CompanyRole } from '@/lib/store/zustand'

type RoleBadgeSize = 'sm' | 'md' | 'lg'

type RoleBadgeProps = {
  role: CompanyRole
  size?: RoleBadgeSize
  className?: string
}

const roleStyles: Record<CompanyRole, string> = {
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

const roleLabels: Record<CompanyRole, string> = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
}

const roleDescriptions: Record<CompanyRole, string> = {
  OWNER:
    'Full access to all company settings and billing. Can manage all members and data.',
  ADMIN:
    'Can manage members, drivers, vehicles, and orders. Cannot access billing or delete company.',
  DISPATCHER:
    'Can create and assign orders, track deliveries, and manage drivers and vehicles.',
  DRIVER:
    'Can view assigned orders, update delivery status, and see their own schedule.',
  CUSTOMER: 'Can track their orders and view delivery history.',
}

const sizeClasses: Record<RoleBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-2 text-sm',
}

export function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-xs">{roleDescriptions[role]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
