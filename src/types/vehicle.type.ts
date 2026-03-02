export enum VehicleType {
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  PICKUP = 'PICKUP',
  BIKE = 'BIKE',
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum VehicleAvailability {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  IN_USE = 'IN_USE',
  MAINTAINACE = 'MAINTAINACE',
}

export type Vehicle = {
  id: string
  model: string
  plateNumber: string
  imageUrl?: string
  type: VehicleType
  status: VehicleStatus
  availability: VehicleAvailability
}
