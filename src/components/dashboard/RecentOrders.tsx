import { Clock } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import OrdersTable from '@/components/orders/OrdersTable'
import { Order, OrderStatus, OrderTable } from '@/types/order.type'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Card, CardContent, CardHeader } from '../ui/card'
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
    status: 'DELIVERED',
    vehicle: 'Truck A1',
    dropOffLocation: 'Accra Mall, Accra',
    pickupLocation: 'Kotoka International Airport, Accra',
  },
]

export default function RecentOrders() {
  return (
    <motion.section {...motionPresets.slideUp}>
      <Card>
        <CardHeader>
          <SectionHeader title="Recent Orders" icon={Clock} />
        </CardHeader>

        <CardContent>
          <OrdersTable
            data={mockRecentOrders}
            enableSearchAndFilter
            enableActionsColumn
            enablePagination
          />
        </CardContent>
      </Card>
    </motion.section>
  )
}
