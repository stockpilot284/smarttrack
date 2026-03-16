import MembersContent from '@/components/members/MembersContent'
import PageError from '@/components/PageError'
import MembersSkeleton from '@/components/skeletons/MembersSkeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/members/')({
  component: MembersRoute,
  loader: async () => {
    await new Promise((resolve) => setTimeout(() => resolve('hello'), 1000))
    return null
  },

  pendingComponent: () => <MembersSkeleton />,
  errorComponent: () => {
    return (
      <PageError
        title="Failed to load members"
        description="We couldn't load members. Please check your connection and try again."
        onRetry={() => window.location.reload()}
      />
    )
  },
})

function MembersRoute() {
  return <MembersContent />
}
