import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'

import DesktopOnboarding from '@/components/onboarding/DesktopOnboarding'
import MobileOnboarding from '@/components/onboarding/MobileOnboarding'
import { Spinner } from '@/components/Spinner'

/* Server-side auth + onboarding check */

const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  // Not authenticated → redirect to sign-in
  if (!isAuthenticated || !userId) {
    throw redirect({
      to: '/auth/sign-in',
    })
  }

  // Fetch full user from Clerk backend SDK
  const clerk = await clerkClient() // get backend client
  const user = await clerk.users.getUser(userId)

  const onboardingCompleted = user.publicMetadata?.onboardingCompleted === true

  // If onboarding done → redirect to dashboard
  if (onboardingCompleted) {
    throw redirect({
      to: `/apps/$companyId/dashboard`,
      params: {
        companyId: user.publicMetadata?.companyId as string,
      },
    })
  }
})

/* Route */

export const Route = createFileRoute('/onboarding/')({
  // beforeLoad: async () => {
  //   await authStateFn()
  // },

  pendingComponent: () => <FullPageSpinner />,

  component: RouteComponent,
})

/* UI */

function RouteComponent() {
  return (
    <div className="min-h-screen">
      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopOnboarding />
      </div>

      {/* Mobile + Tablet */}
      <div className="block lg:hidden">
        <MobileOnboarding />
      </div>
    </div>
  )
}

function FullPageSpinner() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
