import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import TopBar from '@/components/TopBar'

const guardFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { params: Record<string, string> }) => d)
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      throw redirect({ to: '/auth/sign-in' })
    }

    const companyId = data.params.companyId

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    const allowedCompanyId = user.publicMetadata?.companyId as
      | string
      | undefined

    if (!allowedCompanyId) {
      throw redirect({ to: '/onboarding' })
    }

    // Validate access
    if (companyId !== allowedCompanyId) {
      throw redirect({
        to: '/apps/$companyId/dashboard',
        params: {
          companyId: allowedCompanyId,
        },
      })
    }

    return null
  })

export const Route = createFileRoute('/apps/$companyId')({
  beforeLoad: async ({ params }) => {
    await guardFn({ data: { params } })
  },
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  const { companyId } = Route.useParams()
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <AppSidebar companyId={companyId} />

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {/* Top navigation */}
          <TopBar />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
