// types/driver.type.ts
import { LucideIcon } from 'lucide-react'
import { MemberStatus } from './member.type'

export type DriverAvailability =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'BUSY'
  | 'ON_BREAK'

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
  imageUrl: string
  availability: DriverAvailability
  createdAt: string
  lastActiveAt?: string
  vehicle?: { model: string; plate: string }
  currentTrip?: { destination: string; status: string }
}

export type DriverStatus = MemberStatus

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
  'SUSPENDED',
  'DELETED',
  'INVITED',
]

export const DriverAvailabilities: DriverAvailability[] = [
  'AVAILABLE',
  'BUSY',
  'UNAVAILABLE',
  'ON_BREAK',
]

export interface DriverDetail extends DriverTable {
  // Personal
  rating: number
  address?: string

  // Vehicle history
  vehicleHistory?: { model: string; plate: string; assignedAt: string }[]

  // Notes
  notes?: { id: string; content: string; createdAt: string; author: string }[]
  // Timeline
  timeline?: {
    id: string
    event: string
    timestamp: string
    type: 'status' | 'note' | 'trip'
  }[]
  // Trip history
  tripHistory?: {
    id: string
    destination: string
    date: string
    status: string
  }[]
}
