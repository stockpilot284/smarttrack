import { Order } from '@/types/order.type'
import { Card, CardContent } from '@/components/ui/card'
import StatusBadge from '../StatusBadge'
import { OrderStatus } from '@/types/order.type'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { ClipboardList, Package } from 'lucide-react'
import EmptyState from '../EmptyState'

type UnassignedOrdersListProps = {
  orders: Order[]
  onOrderClick: (order: Order) => void
}

export function UnassignedOrdersList({
  orders,
  onOrderClick,
}: UnassignedOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <EmptyState
          title="No Unassigned Orders"
          description="All orders are asign, we will notify you when some are unassigned"
          Icon={ClipboardList}
        />
      </div>
    )
  }
  return (
    <motion.ul
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      {...motionPresets.staggerContainer}
    >
      {orders.map((order) => {
        const pickup = order.pickupLocation?.address
        const dropoff = order.dropoffLocation?.address
        const timeAgo = formatDistanceToNow(
          new Date(order.createdAt as string),
          { addSuffix: true },
        )

        return (
          <motion.li key={order.id} {...motionPresets.staggerItem}>
            <Card
              className="cursor-pointer hover:drop-shadow-xl shadow-none transition-all p-0"
              onClick={() => onOrderClick(order)}
            >
              <CardContent className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package size={20} />
                    <span className=" text-base font-medium">
                      {order.orderReference ?? 'N/A'}
                    </span>
                  </div>

                  {/* <StatusBadge status={} size="sm" /> */}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  {/** Pickup */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Pickup:
                    </span>
                    <p
                      className="truncate text-foreground max-w-50"
                      title={pickup}
                    >
                      {pickup}
                    </p>
                  </div>
                  {/** Dropoff */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Dropoff:
                    </span>
                    <p
                      className="truncate text-foreground max-w-50"
                      title={dropoff}
                    >
                      {dropoff}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {timeAgo}
                </p>
              </CardContent>
            </Card>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
