import { Clock } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import OrdersTable from '@/components/orders/OrdersTable'
import { Order, OrderStatus, OrderTable } from '@/types/order.type'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
const mockRecentOrders: OrderTable[] = [
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
    pickupLocation: 'Kotoka International Airport, Accra',
  },
]

export default function RecentOrders() {
  return (
    <motion.section
      className="bg-card rounded-md p-4 w-full flex flex-col gap-8 dark:border dark:border-border"
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
