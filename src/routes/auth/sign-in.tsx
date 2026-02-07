import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex w-full min-h-screen bg-primary/3 justify-center items-center">
      <SignIn signUpUrl="/auth/sign-up" forceRedirectUrl={'/onboarding'} />
    </main>
  )
}
