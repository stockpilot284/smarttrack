import { LocateFixed, Mail, Phone, Truck } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { StatusBadge } from '../StatusBadge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Input } from '../ui/input'
import EmptyState from '../EmptyState'
import { TrackingOrder } from '@/types/tracking'
import { motionPresets } from '@/lib/motion-presets'
import { OrderStatus, OrderStatuses } from '@/types/order.type'

// Shadcn Select imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TrackingOrdersPanelProps = {
  trackingOrders: TrackingOrder[]
  selectedOrder: TrackingOrder | null
  setSelectedOrder: Dispatch<SetStateAction<TrackingOrder>>
}

export default function TrackingOrdersPanel({
  trackingOrders,
  selectedOrder,
  setSelectedOrder,
}: TrackingOrdersPanelProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(searchInput)
    }, 500) // 500ms is more responsive than 1000ms
    return () => clearTimeout(timer)
  }, [searchInput])

  const filteredTrackingOrders = trackingOrders.filter((order) => {
    const matchesSearch = order.trackingNumber
      .toLowerCase()
      .includes(searchValue.toLowerCase())
    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <motion.div className="w-full border lg:border-t-0 lg:border-l-0 lg:border-r border-border/50 dark:border-border p-4 rounded-md lg:rounded-none lg:w-[320px] flex flex-col gap-6 bg-card">
      {/* ---------------- SEARCH & FILTER ---------------- */}
      <div className="flex items-center gap-2">
        <Input
          type="search"
          size="sm"
          value={searchInput}
          placeholder="Search tracking number"
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as OrderStatus | 'ALL')
          }
        >
          <SelectTrigger className="w-fit" size="sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            {Object.values(OrderStatuses).map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.replace('_', ' ').toLocaleLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ---------------- LIST ---------------- */}
      {filteredTrackingOrders.length > 0 && (
        <motion.ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 overflow-y-auto lg:pr-2 no-scrollbar flex-1">
          {filteredTrackingOrders.map((order) => {
            const isActive =
              selectedOrder?.trackingNumber === order.trackingNumber

            const clampedProgress = Math.min(Math.max(order.progress, 0), 100)

            return (
              <motion.li
                key={order.trackingNumber}
                {...motionPresets.fade}
                onClick={() => setSelectedOrder(order)}
                className={clsx(
                  'w-full px-3.5 py-4 flex flex-col gap-6 rounded-md border cursor-pointer transition h-fit',
                  isActive
                    ? 'border-primary shadow-md shadow-primary/20 '
                    : 'border-border/40 dark:border-border hover:border-border',
                )}
              >
                {/* ---------------- TOP ---------------- */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={clsx(
                        'w-[35px] h-[35px] rounded-md flex items-center justify-center',
                        isActive
                          ? 'bg-primary/10'
                          : 'bg-purple-50 dark:bg-accent',
                      )}
                    >
                      <Truck
                        size={16}
                        className={clsx(
                          isActive ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>

                    <span className="text-sm font-medium">
                      {order.trackingNumber}
                    </span>
                  </div>

                  <StatusBadge
                    status={order.status}
                    size="sm"
                    variant="order"
                  />
                </div>

                {/* ---------------- PROGRESS ---------------- */}
                <div className="flex flex-col gap-2.5">
                  <div className="relative flex items-center">
                    {/* Start */}
                    <div
                      className={clsx(
                        'w-[20px] h-[20px] rounded-full flex items-center justify-center transition',
                        clampedProgress > 0
                          ? isActive
                            ? 'bg-purple-100 dark:bg-accent text-primary'
                            : 'bg-gray-100 dark:bg-accent/10 text-muted-foreground'
                          : 'bg-gray-50 dark:bg-accent/10 text-muted-foreground',
                      )}
                    >
                      <LocateFixed size={14} />
                    </div>

                    {/* Track */}
                    <div className="relative flex-1 h-[2px] mx-1">
                      {/* Background dashed track */}
                      <div className="absolute inset-0 border-dashed border border-border/40" />

                      {/* Active progress */}
                      <motion.div
                        className={clsx(
                          'absolute inset-y-0 left-0 rounded-full border-dashed',
                          isActive ? 'bg-primary' : 'bg-muted-foreground/30',
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedProgress}%` }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      />
                    </div>

                    {/* End */}
                    <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center border border-border/40 opacity-50">
                      <LocateFixed size={14} />
                    </div>

                    {/* Moving dot */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-10 w-[20px] h-[20px] flex justify-center items-center bg-background shadow-md rounded-full"
                      animate={{
                        left: `calc(${clampedProgress}% - 6px)`,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 18,
                      }}
                    >
                      <div
                        className={clsx(
                          'w-[12px] h-[12px] rounded-full transition-colors',
                          isActive ? 'bg-primary' : 'bg-muted-foreground',
                        )}
                      />
                    </motion.div>
                  </div>

                  {/* Addresses */}
                  <div className="flex justify-between">
                    <div>
                      <p
                        className="text-[13px] max-w-22 truncate"
                        title={order.stops[0]?.address}
                      >
                        {order.stops[0]?.address}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        Pickup
                      </span>
                    </div>

                    <div className="text-right">
                      <p
                        className="text-[13px] max-w-22 truncate"
                        title={order.stops[1]?.address}
                      >
                        {order.stops[1]?.address}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        Drop-off
                      </span>
                    </div>
                  </div>
                </div>

                {/* ---------------- DRIVER ---------------- */}
                <div
                  className={clsx(
                    'flex items-center justify-between px-2.5 py-2 rounded-md border',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Avatar>
                      <AvatarFallback>
                        {order.driver.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-xs font-medium ">
                        {order.driver.availability === 'BUSY' && (
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        )}

                        <p
                          className="truncate max-w-22"
                          title={order.driver.name}
                        >
                          {order.driver.name}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Driver
                      </span>
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      )}
      {/* ---------------- EMPTY ---------------- */}
      {filteredTrackingOrders.length === 0 && (
        <EmptyState
          className="flex-1"
          title="No Tracking Orders Found"
          Icon={Truck}
        />
      )}
    </motion.div>
  )
}
