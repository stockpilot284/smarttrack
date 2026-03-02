import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import TopBar from '@/components/TopBar'
import { useState } from 'react'
import NotFound from '@/components/NotFound404'
import { mockTrackingOrders } from '@/data/tracking'
import { OrderStatus } from '@/types/order.type'

// const guardFn = createServerFn({ method: 'POST' })
//   .inputValidator((d: { params: Record<string, string> }) => d)
//   .handler(async ({ data }) => {
//     const { userId } = await auth()

//     if (!userId) {
//       throw redirect({ to: '/auth/sign-in' })
//     }

//     const companyId = data.params.companyId

//     const clerk = await clerkClient()
//     const user = await clerk.users.getUser(userId)

//     const allowedCompanyId = user.publicMetadata?.companyId as
//       | string
//       | undefined

//     if (!allowedCompanyId) {
//       throw redirect({ to: '/onboarding' })
//     }

//     // Validate access
//     if (companyId !== allowedCompanyId) {
//       throw redirect({
//         to: '/apps/$companyId/dashboard',
//         params: {
//           companyId: allowedCompanyId,
//         },
//       })
//     }

//     return null
//   })

export const Route = createFileRoute('/apps/$companyId')({
  // beforeLoad: async ({ params }) => {
  //   await guardFn({ data: { params } })
  // },
  component: WorkspaceLayout,
  notFoundComponent: () => <NotFound homeHref="/apps/$companyId/dashboard" />,
})
function WorkspaceLayout() {
  const { companyId } = Route.useParams()
  const [open, setOpen] = useState(false)

  const dispatchCount = mockTrackingOrders.filter(
    (order) => order.status === OrderStatus.UNASSIGNED,
  ).length

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-50 dark:bg-background">
      {/* Sidebar */}
      <AppSidebar
        companyId={companyId}
        open={open}
        setOpen={setOpen}
        badgeCounts={{
          dispatch: dispatchCount,
        }}
      />

      {/* Main area */}
      <div className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden">
        {/* Top navigation */}
        <TopBar setOpen={setOpen} />

        {/* ONLY scroll container */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
