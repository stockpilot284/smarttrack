import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import { OrderItemsSkeleton } from '../skeletons/OrderItemsSkeleton'

interface OrderItem {
  id: string
  name: string
  quantity: number
  description?: string
}

interface OrderItemsProps {
  items: OrderItem[]
  isLoading?: boolean
}

export default function OrderItems({ items, isLoading }: OrderItemsProps) {
  if (isLoading) return <OrderItemsSkeleton />
  return (
    <Card className="relative  p-6">
      <SectionHeader
        title="Order Items"
        description="Items included in this delivery"
        icon={Package}
      />

      {/* Items */}
      <motion.div className="space-y-3 grid grid-cols-1 grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2">
        {items.length === 0 && (
          <p className="text-sm italic text-muted-foreground">
            No items added to this order
          </p>
        )}

        {items.map((item, index) => (
          <motion.div
            key={item.id}
            {...motionPresets.inViewFadeUp}
            className="flex items-start justify-between gap-4 rounded-md border border-border/40  bg-background p-4"
          >
            {/* Left */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {item.name}
                </p>

                {item.description && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex h-8 min-w-[2.5rem] items-center justify-center rounded-full bg-muted text-sm font-medium">
              ×{item.quantity}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  )
}
