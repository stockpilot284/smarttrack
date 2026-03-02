import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Order } from '@/types/order.type'
import { Driver, DriverAvailability } from '@/types/driver.type'
import { Vehicle, VehicleAvailability } from '@/types/vehicle.type'
import { AssignmentSummary } from './AssignmentSummary'
import { Badge } from '@/components/ui/badge'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { avatarClass } from '@/utils/avatar-styles'
import { Truck } from 'lucide-react'

interface AssignOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  availableDrivers: Driver[]
  availableVehicles: Vehicle[]
  onAssign: (order: Order, driver: Driver, vehicle: Vehicle) => void
}

export function AssignOrderModal({
  open,
  onOpenChange,
  order,
  availableDrivers,
  availableVehicles,
  onAssign,
}: AssignOrderModalProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('')
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')

  // Find full objects from IDs
  const selectedDriver =
    availableDrivers.find((d) => d.id === selectedDriverId) || null
  const selectedVehicle =
    availableVehicles.find((v) => v.id === selectedVehicleId) || null

  // Reset selections when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedDriverId('')
      setSelectedVehicleId('')
    }
    onOpenChange(open)
  }

  const handleAssign = () => {
    if (order && selectedDriver && selectedVehicle) {
      onAssign(order, selectedDriver, selectedVehicle)
    }
  }

  if (!order) return null

  // Filter only available drivers and vehicles
  const availableDriversOnly = availableDrivers.filter(
    (d) => d.availability === DriverAvailability.AVAILABLE,
  )
  const availableVehiclesOnly = availableVehicles.filter(
    (v) => v.availability === VehicleAvailability.AVAILABLE,
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Order {order.orderReference}</DialogTitle>
        </DialogHeader>

        {/* Order summary */}
        <div className="bg-muted/50 p-3 rounded-md text-sm space-y-1 dark:border dark:border-border">
          <p>
            <span className="text-muted-foreground">Pickup:</span>{' '}
            {order.pickupLocation?.address}
          </p>
          <p>
            <span className="text-muted-foreground">Dropoff:</span>{' '}
            {order.dropoffLocation?.address}
          </p>
          <p>
            <span className="text-muted-foreground">Created:</span>{' '}
            {new Date(order.createdAt as string).toLocaleString()}
          </p>
        </div>

        <Separator />

        {/* Selection fields */}
        <div className="space-y-4 py-4">
          {/* Driver select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" required>
              Select Driver
            </Label>
            <Select
              value={selectedDriverId}
              onValueChange={setSelectedDriverId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDriversOnly.length === 0 ? (
                  <SelectItem value="no-drivers" disabled>
                    No available drivers
                  </SelectItem>
                ) : (
                  availableDriversOnly.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback
                              className={avatarClass(driver.name)}
                            >
                              {driver.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{driver.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium" required>
              Select Vehicle
            </Label>
            <Select
              value={selectedVehicleId}
              onValueChange={setSelectedVehicleId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {availableVehiclesOnly.length === 0 ? (
                  <SelectItem value="no-vehicles" disabled>
                    No available vehicles
                  </SelectItem>
                ) : (
                  availableVehiclesOnly.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-start justify-between w-full gap-10">
                        <div className="flex items-start gap-2 justify-between w-full">
                          <Avatar size="sm">
                            <AvatarFallback>
                              <Truck size={20} />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <p className="text-sm">{vehicle.model}</p>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Assignment summary & button */}
        <AssignmentSummary
          selectedOrder={order}
          selectedDriver={selectedDriver}
          selectedVehicle={selectedVehicle}
          onAssign={handleAssign}
        />
      </DialogContent>
    </Dialog>
  )
}
