import PageHeader from '../PageHeader'
import { InviteMemberSheet } from './InviteMemberSheet'
import { mockMemberKpis } from '@/data/member-kpis'
import KpiOverview from '../KpiOverview'
import { Card, CardContent } from '../ui/card'
import MembersTable from './MembersTable'
import { mockMembers } from '@/data/members'

export default function MembersContent() {
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
