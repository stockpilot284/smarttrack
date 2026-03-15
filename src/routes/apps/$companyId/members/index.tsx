import KpiOverview from '@/components/KpiOverview'
import { InviteMemberSheet } from '@/components/members/InviteMemberSheet'
import MembersTable from '@/components/members/MembersTable'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { mockMemberKpis } from '@/data/member-kpis'
import { mockMembers } from '@/data/members'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/apps/$companyId/members/')({
  component: MembersRoute,
})

function MembersRoute() {
  return (
    <div className="p-6 flex flex-col gap-8 h-full">
      <div className="w-full flex flex-col gap-4  md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Members"
          description="View, add, and manage team members. Control access levels and send invitations."
        />

        <InviteMemberSheet />
      </div>

      <KpiOverview kpis={mockMemberKpis} />

      <Card>
        <CardContent>
          <MembersTable
            data={mockMembers}
            enableActionsColumn
            enableRowSelection
            enableSearchAndFilter
            enablePagination
          />
        </CardContent>
      </Card>
    </div>
  )
}
