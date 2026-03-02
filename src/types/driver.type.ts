import { LucideIcon } from 'lucide-react'

export enum DriverAvailability {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  BUSY = 'BUSY',
}

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

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

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
