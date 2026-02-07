import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/apps/$companyId/dashboard',
      params: {
        companyId: params.companyId,
      },
    })
  },
})
