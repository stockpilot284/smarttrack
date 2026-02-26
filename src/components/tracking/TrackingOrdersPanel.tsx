import { DriverAvailability } from '@/types/driver.type'
import { LocateFixed, Mail, Phone, Truck } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import StatusBadge from '../StatusBadge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Input } from '../ui/input'
import EmptyState from '../EmptyState'
import { TrackingOrder } from '@/types/tracking'

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
  const [searchValue, setSearchValue] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setSearchValue(searchInput)
    }, 1000)
  }, [searchInput])

  const filteredTrackingOrders = trackingOrders.filter((order) =>
    order.trackingNumber.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <div className="w-full lg:w-[320px] lg:p-4 flex flex-col gap-6">
      {/* ---------------- SEARCH ---------------- */}
      <Input
        type="search"
        size="sm"
        value={searchInput}
        placeholder="Search tracking number"
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {/* ---------------- LIST ---------------- */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 overflow-y-auto lg:pr-2 no-scrollbar">
        {filteredTrackingOrders.map((order) => {
          const isActive =
            selectedOrder?.trackingNumber === order.trackingNumber

          const clampedProgress = Math.min(Math.max(order.progress, 0), 100)

          return (
            <motion.li
              key={order.trackingNumber}
              layout
              onClick={() => setSelectedOrder(order)}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={clsx(
                'w-full px-3.5 py-4 flex flex-col gap-6 rounded-md border cursor-pointer transition',
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

                <StatusBadge status={order.status} size="sm" />
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
                        : 'bg-gray-50 text-muted-foreground',
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
                      left: `calc(${clampedProgress}% - 6px)`, // -6px to center the 12px dot
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
                      {order.driver.availability ===
                        DriverAvailability.BUSY && (
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

                <div className="flex items-center gap-1.5">
                  <Button size="iconXs" variant="outline">
                    <Phone size={16} />
                  </Button>
                  <Button size="iconXs" variant="outline">
                    <Mail size={16} />
                  </Button>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>

      {/* ---------------- EMPTY ---------------- */}
      {filteredTrackingOrders.length === 0 && (
        <EmptyState
          className="flex-1"
          title="No Tracking Orders Found"
          Icon={Truck}
          description="Enter a valid tracking number to view order details and delivery status"
        />
      )}
    </div>
  )
}
