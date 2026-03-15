import { KpiItemProps } from '@/components/KpiItem'
import { CheckCircle, Mail, Pause, Users } from 'lucide-react'

export const mockMemberKpis: KpiItemProps[] = [
  {
    label: 'Total Members',
    value: 5,
    Icon: Users,
    helperText: 'All members in company',
  },
  {
    label: 'Active Members',
    value: 2,
    Icon: CheckCircle,
    helperText: 'Currently active',
  },
  {
    label: 'Invited Members',
    value: 1,
    Icon: Mail,
    helperText: 'Pending invitations',
  },
  {
    label: 'Suspended Members',
    value: 2,
    Icon: Pause,
    helperText: 'Temporarily suspended',
  },
]
