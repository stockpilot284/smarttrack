import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  ChartBar,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  Users,
} from 'lucide-react'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type AppSidebarProps = {
  companyId: string
}

export default function AppSidebar({ companyId }: AppSidebarProps) {
  const { open } = useSidebar()
  const matchRoute = useMatchRoute()

  const links = [
    {
      name: 'Dashboard',
      to: '/apps/$companyId/dashboard',
      icon: LayoutDashboard,
    },
    { name: 'Orders', to: '/apps/$companyId/orders', icon: Package },
    { name: 'Drivers', to: '/apps/$companyId/drivers', icon: Users },
    { name: 'Fleets', to: '/apps/$companyId/fleets', icon: Truck },
    { name: 'Invites', to: '/apps/$companyId/invites', icon: Users },
    { name: 'Reports', to: '/apps/$companyId/reports', icon: ChartBar },
    { name: 'Settings', to: '/apps/$companyId/settings', icon: Settings },
  ]

  const horizontalPadding = open ? 'px-6' : 'px-2'

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader
        className={cn(
          'py-4 transition-[padding] duration-200',
          open ? 'px-8' : 'px-3.5',
        )}
      >
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo.svg"
            alt="SmartTrack Logo"
            className="h-5 w-5 shrink-0"
          />
          {open && (
            <span className="text-sm font-semibold tracking-tight">
              SmartTrack
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="mt-2">
        <SidebarMenu className="flex flex-col gap-1">
          {links.map(({ name, to, icon: Icon }) => {
            const isActive = !!matchRoute({
              to,
              params: { companyId },
              fuzzy: true,
            })

            return (
              <SidebarMenuItem key={name} className="px-2">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={!open ? name : undefined}
                  className={cn(
                    'h-10 w-full justify-start gap-3 rounded-md transition-colors',
                    horizontalPadding,
                  )}
                >
                  <Link to={to} params={{ companyId }}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {open && <span>{name}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter
        className={cn(
          'py-3 text-xs text-muted-foreground transition-[padding] duration-200',
          horizontalPadding,
        )}
      />
    </Sidebar>
  )
}
