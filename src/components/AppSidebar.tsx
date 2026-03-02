import {
  ChartBar,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { useMatchRoute, Link } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button'
import { AnimatePresence, motion, easeInOut } from 'framer-motion'
import { RoleBadge } from './RoleBadge'
import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip' // Add tooltip imports

type AppSidebarProps = {
  companyId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  badgeCounts?: {
    dispatch?: number
    orders?: number
    drivers?: number
  }
}

const links = [
  {
    name: 'Dashboard',
    to: '/apps/$companyId/dashboard',
    Icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    to: '/apps/$companyId/orders',
    Icon: Package,
    badgeKey: 'orders',
    badgeTooltip: (count: number) =>
      `${count} pending order${count > 1 ? 's' : ''} requiring attention`,
  },
  {
    name: 'Dispatch',
    to: '/apps/$companyId/dispatch',
    Icon: ClipboardList,
    badgeKey: 'dispatch',
    badgeTooltip: (count: number) =>
      `${count} unassigned order${count > 1 ? 's' : ''} waiting for driver assignment`,
  },
  {
    name: 'Tracking',
    to: '/apps/$companyId/tracking',
    Icon: MapPin,
  },
  {
    name: 'Drivers',
    to: '/apps/$companyId/drivers',
    Icon: Users,
    badgeKey: 'drivers',
    badgeTooltip: (count: number) =>
      `${count} driver${count > 1 ? 's' : ''} need${count > 1 ? '' : 's'} attention (documents, approvals)`,
  },
  { name: 'Fleets', to: '/apps/$companyId/fleets', Icon: Truck },
  { name: 'Invites', to: '/apps/$companyId/invites', Icon: Users },
  { name: 'Reports', to: '/apps/$companyId/reports', Icon: ChartBar },
  { name: 'Settings', to: '/apps/$companyId/settings', Icon: Settings },
]

// Variants for staggered link animation
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeInOut } },
}

export default function AppSidebar({
  companyId,
  open,
  setOpen,
  badgeCounts = {},
}: AppSidebarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-50 shrink-0 bg-card border-r border-border/40">
        <SidebarContent companyId={companyId} badgeCounts={badgeCounts} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="mobile-sidebar"
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="absolute left-0 top-0 h-full w-64 bg-background shadow-lg"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Close Button */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
                <RoleBadge role="SUPER_ADMIN" />
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="h-fit text-foreground"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Sidebar Content */}
              <SidebarContent
                companyId={companyId}
                onNavigate={() => setOpen(false)}
                delayLinks={0.25}
                badgeCounts={badgeCounts}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}

/* ================= Sidebar Content ================= */
function SidebarContent({
  companyId,
  onNavigate,
  delayLinks = 0,
  badgeCounts = {},
}: {
  companyId: string
  onNavigate?: () => void
  delayLinks?: number
  badgeCounts?: Record<string, number>
}) {
  const matchRoute = useMatchRoute()

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div className="hidden lg:flex items-center gap-2 px-6 py-4 shrink-0">
        <img src="/assets/logo.svg" className="w-6 h-6" />
        <Label className="text-base font-bold truncate">SmartTrack</Label>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 min-h-0 overflow-y-auto mt-5">
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="show"
          transition={{ delayChildren: delayLinks }}
          className="flex flex-col gap-1 px-2 w-full"
        >
          {links.map(({ name, to, Icon, badgeKey, badgeTooltip }) => {
            const isActive = !!matchRoute({
              to,
              params: { companyId },
              fuzzy: true,
            })

            const count = badgeKey ? badgeCounts[badgeKey] : undefined
            const showBadge = count !== undefined && count > 0

            return (
              <motion.li key={name} variants={linkVariants} className="w-full">
                <Link
                  to={to}
                  params={{ companyId }}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors w-full hover:bg-accent',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground/80',
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="truncate flex-1">{name}</span>

                  {showBadge && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant={isActive ? 'default' : 'secondary'}
                          className="ml-auto text-xs h-5 min-w-5 px-1 flex items-center justify-center cursor-help"
                        >
                          {count > 99 ? '99+' : count}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px]">
                        <p className="text-xs">
                          {badgeTooltip
                            ? badgeTooltip(count)
                            : `${count} item${count > 1 ? 's' : ''}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>
    </div>
  )
}
