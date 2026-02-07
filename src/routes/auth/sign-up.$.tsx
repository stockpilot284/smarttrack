import { SignUp } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex w-full min-h-screen bg-primary/3 justify-center items-center">
      <SignUp signInUrl="/auth/sign-in" forceRedirectUrl="/onboarding" />
    </main>
  )
}
