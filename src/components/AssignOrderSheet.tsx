// components/dashboard/AssignOrderSheet.tsx
import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown, Info } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DeliveryTiming, OrderStatus } from '@/types/order.type'
import { MemberStatus } from '@/types/member.type'
import { DriverAvailability } from '@/types/driver.type'
import { VehicleAvailability, VehicleStatus } from '@/types/vehicle.type'
import { StatusBadge } from './StatusBadge'

type Order = {
  id: string
  customerName: string
  deliveryAddress: string
  pickupTime: string
  priority: 'high' | 'medium' | 'low'
  deliveryTiming: DeliveryTiming
  status: OrderStatus
  requirements?: string
}

type Driver = {
  id: string
  name: string
  accountStatus: MemberStatus
  availability: DriverAvailability
  currentVehicleId?: string
}

type Vehicle = {
  id: string
  plateNumber: string
  model: string
  type: string
  capacity?: string
  status: VehicleStatus
  availability: VehicleAvailability
}

interface AssignOrderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orders: Order[]
  companyId: string
  onAssign?: (stopOrder?: string[]) => void
}

export default function AssignOrderSheet({
  open,
  onOpenChange,
  orders,
  companyId,
  onAssign,
}: AssignOrderSheetProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedDriverId, setSelectedDriverId] = useState<string>('')
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')

  const [driverSearch, setDriverSearch] = useState('')
  const [vehicleSearch, setVehicleSearch] = useState('')

  const [stopOrder, setStopOrder] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setStopOrder(orders.map((o) => o.id))
    }
  }, [open, orders])

  useEffect(() => {
    if (open) {
      setLoading(true)
      setTimeout(() => {
        setDrivers([
          {
            id: 'd1',
            name: 'John Doe',
            accountStatus: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'd2',
            name: 'Jane Smith',
            accountStatus: 'ACTIVE',
            availability: 'ON_BREAK',
          },
          {
            id: 'd3',
            name: 'Bob Wilson',
            accountStatus: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'd4',
            name: 'Alice Brown',
            accountStatus: 'ACTIVE',
            availability: 'BUSY',
          },
          {
            id: 'd5',
            name: 'Charlie Davis',
            accountStatus: 'SUSPENDED',
            availability: 'UNAVAILABLE',
          },
          {
            id: 'd6',
            name: 'Eva Green',
            accountStatus: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'd7',
            name: 'Frank Harris',
            accountStatus: 'ACTIVE',
            availability: 'ON_BREAK',
          },
          {
            id: 'd8',
            name: 'Grace Lee',
            accountStatus: 'ACTIVE',
            availability: 'AVAILABLE',
          },
        ])
        setVehicles([
          {
            id: 'v1',
            plateNumber: 'VAN-123',
            model: 'Sprinter',
            type: 'Van',
            status: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'v2',
            plateNumber: 'TRK-456',
            model: 'F-550',
            type: 'Truck',
            status: 'MAINTENANCE',
            availability: 'UNAVAILABLE',
          },
          {
            id: 'v3',
            plateNumber: 'VAN-789',
            model: 'Transit',
            type: 'Van',
            status: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'v4',
            plateNumber: 'VAN-101',
            model: 'Sprinter',
            type: 'Van',
            status: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'v5',
            plateNumber: 'TRK-202',
            model: 'F-650',
            type: 'Truck',
            status: 'ACTIVE',
            availability: 'AVAILABLE',
          },
          {
            id: 'v6',
            plateNumber: 'VAN-303',
            model: 'Promaster',
            type: 'Van',
            status: 'SUSPENDED',
            availability: 'UNAVAILABLE',
          },
        ])
        setLoading(false)
      }, 500)
    }
  }, [open])

  const requiresRefrigerated = orders.some((o) =>
    o.requirements?.includes('refrigerated'),
  )

  const filteredVehicles = vehicles.filter((v) => {
    if (v.status !== 'ACTIVE') return false
    if (v.availability !== 'AVAILABLE') return false
    if (
      vehicleSearch &&
      !v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase())
    )
      return false
    return true
  })

  const filteredDrivers = drivers.filter((d) => {
    if (d.accountStatus !== 'ACTIVE') return false
    if (d.availability !== 'AVAILABLE') return false
    if (
      driverSearch &&
      !d.name.toLowerCase().includes(driverSearch.toLowerCase())
    )
      return false
    return true
  })

  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...stopOrder]
    ;[newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ]
    setStopOrder(newOrder)
  }

  const moveDown = (index: number) => {
    if (index === stopOrder.length - 1) return
    const newOrder = [...stopOrder]
    ;[newOrder[index], newOrder[index + 1]] = [
      newOrder[index + 1],
      newOrder[index],
    ]
    setStopOrder(newOrder)
  }

  const handleConfirm = async () => {
    if (!selectedDriverId || !selectedVehicleId) return
    console.log(
      'Assigning orders in stop order:',
      stopOrder,
      'to driver',
      selectedDriverId,
      'vehicle',
      selectedVehicleId,
    )
    setTimeout(() => {
      onAssign?.(stopOrder)
      onOpenChange(false)
    }, 500)
  }

  const isValid = selectedDriverId && selectedVehicleId

  const getDriverAvailabilityVariant = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'softSuccess'
      case 'ON_BREAK':
        return 'softWarning'
      case 'BUSY':
        return 'softDestructive'
      default:
        return 'outline'
    }
  }

  const getVehicleAvailabilityVariant = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'softSuccess'
      case 'IN_USE':
        return 'softDestructive'
      default:
        return 'outline'
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-3xl lg:max-w-6xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Assign Orders to Driver & Vehicle</SheetTitle>
          <SheetDescription>
            {orders.length === 1
              ? `Assigning order #${orders[0].id}`
              : `Assigning ${orders.length} orders together – set the stop order below`}
          </SheetDescription>
        </SheetHeader>

        <TooltipProvider>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {/* Selected Orders with tooltip */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">
                    Selected Orders (stop order)
                  </h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="iconXs" className="h-5 w-5">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Arrange the stops in the order the driver should deliver
                        them. Use the up/down buttons to reorder. The driver
                        will see this sequence in their app.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="max-h-48 md:max-h-64 overflow-y-auto pr-2 space-y-2">
                  {stopOrder.map((orderId, index) => {
                    const order = orders.find((o) => o.id === orderId)
                    if (!order) return null
                    return (
                      <div
                        key={order.id}
                        className="flex items-start gap-2 text-xs p-2 bg-muted rounded"
                      >
                        <div className="flex items-center gap-1 min-w-[48px]">
                          <Badge
                            variant="outline"
                            size="sm"
                            className="w-6 justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="iconXs"
                              className="h-4 w-4"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="iconXs"
                              className="h-4 w-4"
                              onClick={() => moveDown(index)}
                              disabled={index === stopOrder.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="font-medium">
                            {order.customerName}
                          </div>
                          <div
                            className="text-muted-foreground truncate"
                            title={order.deliveryAddress}
                          >
                            {order.deliveryAddress}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge
                              variant={
                                order.priority === 'high'
                                  ? 'softDestructive'
                                  : order.priority === 'medium'
                                    ? 'soft'
                                    : 'softSecondary'
                              }
                              size="sm"
                            >
                              {order.priority}
                            </Badge>
                            <Badge variant="outline" size="sm">
                              {order.deliveryTiming === 'SEND_NOW'
                                ? 'Now'
                                : 'Scheduled'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Driver Selection */}
              <div className="flex flex-col h-full">
                <h4 className="text-sm font-medium mb-2">Select Driver</h4>
                <Input
                  placeholder="Search drivers..."
                  value={driverSearch}
                  size="sm"
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="mb-2 flex-shrink-0"
                />
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <RadioGroup
                    value={selectedDriverId}
                    onValueChange={setSelectedDriverId}
                  >
                    {filteredDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                      >
                        <RadioGroupItem
                          value={driver.id}
                          id={`driver-${driver.id}`}
                        />
                        <Label
                          htmlFor={`driver-${driver.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span className="text-xs">{driver.name}</span>
                            <StatusBadge
                              variant="driver"
                              size="sm"
                              status={driver.availability}
                            />
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="flex flex-col h-full">
                <h4 className="text-sm font-medium mb-2">Select Vehicle</h4>
                <Input
                  placeholder="Search vehicles..."
                  size="sm"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  className="mb-2 flex-shrink-0"
                />
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <RadioGroup
                    value={selectedVehicleId}
                    onValueChange={setSelectedVehicleId}
                  >
                    {filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                      >
                        <RadioGroupItem
                          value={vehicle.id}
                          id={`vehicle-${vehicle.id}`}
                        />
                        <Label
                          htmlFor={`vehicle-${vehicle.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-xs w-full">
                            <div className="flex items-center justify-between gap-6 w-full">
                              <span>
                                {vehicle.plateNumber} · {vehicle.model}
                              </span>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" size="sm">
                                  {vehicle.type}
                                </Badge>
                                <StatusBadge
                                  size="sm"
                                  variant="vehicle"
                                  status={vehicle.availability}
                                />
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        <SheetFooter className="px-6 py-4 border-t border-border/50 dark:border-border flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {loading
              ? 'Assigning...'
              : `Assign to ${orders.length} order${orders.length > 1 ? 's' : ''}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
