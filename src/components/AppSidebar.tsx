import {
  ChartBar,
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

type AppSidebarProps = {
  companyId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const links = [
  {
    name: 'Dashboard',
    to: '/apps/$companyId/dashboard',
    Icon: LayoutDashboard,
  },
  { name: 'Orders', to: '/apps/$companyId/orders', Icon: Package },
  { name: 'Tracking', to: '/apps/$companyId/tracking', Icon: MapPin },
  { name: 'Drivers', to: '/apps/$companyId/drivers', Icon: Users },
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
}: AppSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-54 shrink-0 bg-background border-r border-border/40">
        <SidebarContent companyId={companyId} />
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
                delayLinks={0.25} // delay links animation until drawer finishes
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ================= Sidebar Content ================= */
function SidebarContent({
  companyId,
  onNavigate,
  delayLinks = 0,
}: {
  companyId: string
  onNavigate?: () => void
  delayLinks?: number
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
          transition={{ delayChildren: delayLinks }} // <-- links animate after delay
          className="flex flex-col gap-1 px-2 w-full"
        >
          {links.map(({ name, to, Icon }) => {
            const isActive = !!matchRoute({
              to,
              params: { companyId },
              fuzzy: true,
            })

            return (
              <motion.li key={name} variants={linkVariants} className="w-full">
                <Link
                  to={to}
                  params={{ companyId }}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors w-full hover:bg-gray-50',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground  hover:text-foreground/80',
                  )}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="truncate">{name}</span>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>
    </div>
  )
}
