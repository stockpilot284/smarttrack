import { Clock } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import OrdersTable from '../OrdersTable'
import { Order, OrderStatus } from '@/types/order.type'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
const mockRecentOrders: Order[] = [
  {
    orderRef: 'ORD-1001',
    customer: 'John Doe',
    driver: 'Alice Smith',
    createdAt: new Date('2026-02-01T09:24:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.DELIVERED,
    vehicle: 'Truck A1',
    dropOffLocation: 'Accra Mall, Accra',
  },
  {
    orderRef: '#ORD-1002',
    customer: 'Jane Williams',
    driver: 'Bob Johnson',
    createdAt: new Date('2026-02-02T11:15:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.ASSIGNED,
    vehicle: 'Van B2',
    dropOffLocation: 'Tema Port, Tema',
  },
  {
    orderRef: '#ORD-1003',
    customer: 'Michael Brown',
    driver: 'Charlie Davis',
    createdAt: new Date('2026-02-03T14:45:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.FAILED,
    vehicle: 'Truck C3',
    dropOffLocation: 'Kotoka Airport, Accra',
  },
  {
    orderRef: '#ORD-1004',
    customer: 'Emily Clark',
    driver: 'David Lee',
    createdAt: new Date('2026-02-04T08:30:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.IN_TRANSIT,
    vehicle: 'Van D4',
    dropOffLocation: 'Osu Castle, Accra',
  },
  {
    orderRef: '#ORD-1005',
    customer: 'Daniel Wilson',
    driver: 'Fiona Green',
    createdAt: new Date('2026-02-05T16:00:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.DELIVERED,
    vehicle: 'Truck E5',
    dropOffLocation: 'Tema Harbour, Tema',
  },
  {
    orderRef: '#ORD-1006',
    customer: 'Sophia Martinez',
    driver: 'George White',
    createdAt: new Date('2026-02-06T10:20:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.ASSIGNED,
    vehicle: 'Van F6',
    dropOffLocation: 'Labadi Beach, Accra',
  },
  {
    orderRef: '#ORD-1007',
    customer: 'William Johnson',
    driver: 'Hannah Black',
    createdAt: new Date('2026-02-07T12:50:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.DELIVERED,
    vehicle: 'Truck G7',
    dropOffLocation: 'Accra Central, Accra',
  },
]

export default function RecentOrders() {
  return (
    <motion.section
      className="bg-background rounded-md p-4 w-full flex flex-col gap-8"
      {...motionPresets.inViewFadeUp}
    >
      <SectionHeader title="Recent Orders" icon={Clock} />
      <OrdersTable
        data={mockRecentOrders}
        enableSearchAndFilter
        enablePagination
      />
    </motion.section>
  )
}
