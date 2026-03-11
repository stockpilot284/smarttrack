import { useState } from 'react'
import { UnassignedOrdersList } from './UnassignedOrdersList'
import { AssignOrderModal } from './AssignOrderModal'
import { Order } from '@/types/order.type'
import { Driver, DriverAvailability } from '@/types/driver.type'
import {
  Vehicle,
  VehicleAvailability,
  VehicleStatus,
  VehicleType,
} from '@/types/vehicle.type'
import { orders } from '@/data/orders'
import { SectionHeader } from '../SectionHeader'
import { Package } from 'lucide-react'

// Mock data
const mockUnassignedOrders: Order[] = orders

const mockAvailableDrivers: Driver[] = [
  { id: 'd1', name: 'Ama Boateng', availability: 'AVAILABLE' },
  { id: 'd2', name: 'Yaw Asante', availability: 'AVAILABLE' },
  {
    id: 'd3',
    name: 'Hassan Abdul',
    availability: 'UNAVAILABLE',
  },
]

const mockAvailableVehicles: Vehicle[] = [
  {
    id: 'v1',
    model: 'Toyota Hiace',
    plateNumber: 'AS-7743-23',
    type: 'VAN',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
  },
  {
    id: 'v2',
    model: 'Mitsubishi Canter',
    plateNumber: 'WR-3391-24',
    type: 'TRUCK',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
  },
  {
    id: 'v3',
    model: 'Nissan Urvan',
    plateNumber: 'NR-5502-25',
    type: 'VAN',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
  },
]

export function DispatchPanel() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const handleAssign = (order: Order, driver: Driver, vehicle: Vehicle) => {
    console.log('Assigning', { order, driver, vehicle })
    // API call
    setModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <div className="h-full  flex flex-col gap-8">
      <div className="flex-1 flex">
        <UnassignedOrdersList
          orders={mockUnassignedOrders}
          onOrderClick={handleOrderClick}
        />
      </div>

      <AssignOrderModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
        availableDrivers={mockAvailableDrivers}
        availableVehicles={mockAvailableVehicles}
        onAssign={handleAssign}
      />
    </div>
  )
}
