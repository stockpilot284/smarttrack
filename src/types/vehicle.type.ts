import { LucideIcon } from 'lucide-react'

export type VehicleType = 'VAN' | 'TRUCK' | 'PICKUP' | 'BIKE'

export type VehicleStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'DELETED'
  | 'MAINTENANCE'

export type VehicleAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'IN_USE'

export type Vehicle = {
  id: string
  model: string
  plateNumber: string
  imageUrl?: string
  type: VehicleType
  status: VehicleStatus
  availability: VehicleAvailability
}

export type FleetKpiItemProps = {
  label: string
  value: number | string
  Icon: LucideIcon
  styles: string
  helperText: string
}

export type FleetTable = {
  id: string
  model: string
  vehicleType: VehicleType
  plateNumber: string
  status: VehicleStatus
  availability: VehicleAvailability
  createdAt: string
  imageUrl?: string
  assignedOrder?: string
}

export type FleetsTableProps = {
  data: FleetTable[]
  enableSearchAndFilter?: boolean
  enableRowSelection?: boolean
  enableActionsColumn?: boolean
  enablePagination?: boolean
}
