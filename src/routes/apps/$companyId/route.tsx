import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import TopBar from '@/components/TopBar'
import { useState } from 'react'
import NotFound from '@/components/NotFound404'
import { mockTrackingOrders } from '@/data/tracking'

import UpgradeModal from '@/components/UpgradeModal'

export const Route = createFileRoute('/apps/$companyId')({
  component: CompanyDashboardLayout,
  notFoundComponent: () => <NotFound homeHref="/apps/$companyId/dashboard" />,
})

function CompanyDashboardLayout() {
  const { companyId } = Route.useParams()
  const [open, setOpen] = useState(false)

  const dispatchCount = mockTrackingOrders.filter(
    (order) => order.status === 'CREATED',
  ).length

  return (
    // Use h-screen to ensure full viewport height, and overflow-hidden to contain everything
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - width is handled by AppSidebar internally */}
      <AppSidebar
        companyId={companyId}
        open={open}
        setOpen={setOpen}
        badgeCounts={{ dispatch: dispatchCount }}
      />

      {/* Main content area - takes remaining width, no overflow */}
      <div className="flex flex-1 flex-col min-w-0 ">
        {/* Top bar - fixed height, no scrolling */}
        <TopBar setOpen={setOpen} />
        {/* Scrollable content area - takes remaining height */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto">
          {/* Outlet content will scroll inside this area */}
          <div className="h-full">
            {/* Add padding as needed */}
            <Outlet />
          </div>
        </div>
      </div>

      {/* Global upgrade modal */}
      <UpgradeModal />
    </div>
  )
}
