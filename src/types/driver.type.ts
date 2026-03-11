import { LucideIcon } from 'lucide-react'

export type DriverAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'BUSY'

export type DriverKpiItemProps = {
  label: string
  value: number | string
  Icon: LucideIcon
  styles: string
  helperText: string
}

export type DriverTable = {
  id: string
  name: string
  email: string
  phone: string
  status: DriverStatus
  availability: DriverAvailability
  createdAt: string
}

export type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'DELETED'

export type DriversTableProps = {
  data: DriverTable[]
  enableSearchAndFilter?: boolean
  enableRowSelection?: boolean
  enableActionsColumn?: boolean
  enablePagination?: boolean
}

export type Driver = {
  id: string
  name: string
  email?: string
  phone?: string
  availability: DriverAvailability
}

export const DriverStatuses: DriverStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'DELETED',
]

export const DriverAvailabilities: DriverAvailability[] = [
  'AVAILABLE',
  'BUSY',
  'UNAVAILABLE',
]
