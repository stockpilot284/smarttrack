// Define member types (move to a shared types file later)
export type MemberRole =
  | 'OWNER'
  | 'ADMIN'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'CUSTOMER'
export type MemberStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'DELETED'

export interface Member {
  id: string
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
  joinedAt: string
  imageUrl?: string
  phone?: string
  lastActiveAt?: string
  invitedAt?: string
}

export interface MembersTableProps {
  data: Member[]
  enableSearchAndFilter?: boolean
  enableRowSelection?: boolean
  enableActionsColumn?: boolean
  enablePagination?: boolean
}
