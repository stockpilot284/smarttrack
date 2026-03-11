// components/dashboard/UpcomingDeliveries.tsx
import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns'
import { Clock, ArrowUpDown, Calendar, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionHeader } from '../SectionHeader'
import { DeliveryTiming, OrderStatus } from '@/types/order.type'
import StatusBadge from '../StatusBadge'
import { ScrollableWithFade } from '../ScrollableWithFade'
import AssignOrderSheet from '@/components/AssignOrderSheet'
import { Label } from '../ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import EmptyState from '../EmptyState'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type Priority = 'high' | 'medium' | 'low'

type Delivery = {
  id: string
  customerName: string
  deliveryAddress: string
  pickupTime: string
  deliveryTiming: DeliveryTiming
  priority: Priority
  assignedDriver?: { id: string; name: string } | null
  status: OrderStatus
}

type SortOption = 'time' | 'priority'

// Mock data (unchanged)
const MOCK_DELIVERIES: Delivery[] = [
  {
    id: '1',
    customerName: 'Acme Corp',
    deliveryAddress: '123 Main St, Springfield',
    pickupTime: new Date().toISOString(),
    deliveryTiming: 'SEND_NOW',
    priority: 'high',
    assignedDriver: null,
    status: 'CREATED',
  },
  {
    id: '2',
    customerName: 'Globex Inc',
    deliveryAddress: '456 Oak Ave, Shelbyville',
    pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    deliveryTiming: 'SCHEDULED',
    priority: 'medium',
    assignedDriver: { id: 'd1', name: 'John Doe' },
    status: 'ASSIGNED',
  },
  {
    id: '3',
    customerName: 'Initech',
    deliveryAddress: '789 Pine Rd, Capital City',
    pickupTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    deliveryTiming: 'SCHEDULED',
    priority: 'low',
    assignedDriver: null,
    status: 'CREATED',
  },
  {
    id: '4',
    customerName: 'Umbrella Corp',
    deliveryAddress: '101 Raccoon St, Raccoon City',
    pickupTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    deliveryTiming: 'SCHEDULED',
    priority: 'high',
    assignedDriver: { id: 'd2', name: 'Jane Smith' },
    status: 'ASSIGNED',
  },
  {
    id: '5',
    customerName: 'Stark Industries',
    deliveryAddress: '10880 Malibu Point, Malibu',
    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    deliveryTiming: 'SCHEDULED',
    priority: 'medium',
    assignedDriver: null,
    status: 'CREATED',
  },
]

export function UpcomingDeliveries() {
  const { companyId } = useParams({ from: '/apps/$companyId' })
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('time')
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  )
  const [assignModalOpen, setAssignModalOpen] = useState(false)

  // Filter only CREATED orders (selectable)
  const createdOrders = useMemo(
    () => deliveries.filter((d) => d.status === 'CREATED'),
    [deliveries],
  )

  // Selected deliveries (for validation)
  const selectedDeliveries = useMemo(
    () => deliveries.filter((d) => selectedOrderIds.has(d.id)),
    [deliveries, selectedOrderIds],
  )

  // Check if all selected orders have the same deliveryTiming
  const allSelectedHaveSameTiming = useMemo(() => {
    if (selectedDeliveries.length === 0) return true
    const firstTiming = selectedDeliveries[0].deliveryTiming
    return selectedDeliveries.every((d) => d.deliveryTiming === firstTiming)
  }, [selectedDeliveries])

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 800))

        let filtered = MOCK_DELIVERIES.filter(
          (d) => d.status === 'CREATED' || d.status === 'ASSIGNED',
        )

        let sorted = [...filtered]
        if (sortBy === 'time') {
          sorted.sort(
            (a, b) =>
              new Date(a.pickupTime).getTime() -
              new Date(b.pickupTime).getTime(),
          )
        } else {
          const priorityOrder = { high: 1, medium: 2, low: 3 }
          sorted.sort(
            (a, b) =>
              priorityOrder[a.priority] - priorityOrder[b.priority] ||
              new Date(a.pickupTime).getTime() -
                new Date(b.pickupTime).getTime(),
          )
        }

        setDeliveries(sorted)
        setError(null)
      } catch (err) {
        setError('Failed to load upcoming deliveries')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveries()
  }, [companyId, sortBy])

  const formatPickupTime = (
    pickupTime: string,
    deliveryTiming: DeliveryTiming,
  ) => {
    const date = new Date(pickupTime)
    const now = new Date()
    const diffMinutes = differenceInMinutes(date, now)

    if (deliveryTiming === 'SEND_NOW' || diffMinutes <= 0) return 'Now'
    if (diffMinutes < 60) return `in ${diffMinutes} min`
    if (isToday(date)) return format(date, 'h:mm a')
    if (isTomorrow(date)) return `tomorrow ${format(date, 'h:mm a')}`
    return format(date, 'MMM d, h:mm a')
  }

  const priorityVariant = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'softDestructive'
      case 'medium':
        return 'soft'
      case 'low':
        return 'softSecondary'
      default:
        return 'outline'
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev)
      if (checked) newSet.add(orderId)
      else newSet.delete(orderId)
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(new Set(createdOrders.map((o) => o.id)))
    } else {
      setSelectedOrderIds(new Set())
    }
  }

  const handleAssignClick = (delivery?: Delivery) => {
    if (delivery) {
      // Single order – always allowed
      if (delivery.status === 'CREATED') {
        setSelectedOrderIds(new Set([delivery.id]))
      }
    } else {
      // Batch assignment – only open if all selected have same timing
      if (!allSelectedHaveSameTiming) return
    }
    setAssignModalOpen(true)
  }

  const handleAssignComplete = () => {
    setAssignModalOpen(false)
    setSelectedOrderIds(new Set())
    // Optionally refetch deliveries
  }

  const handleViewClick = (deliveryId: string) => {
    navigate({
      to: '/apps/$companyId/orders/$orderRef',
      params: { companyId, orderRef: deliveryId },
    })
  }

  const allSelectableSelected =
    createdOrders.length > 0 &&
    createdOrders.every((order) => selectedOrderIds.has(order.id))

  const someSelectableSelected =
    createdOrders.some((order) => selectedOrderIds.has(order.id)) &&
    !allSelectableSelected

  if (loading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }

  return (
    <motion.div {...motionPresets.slideUp} className="h-auto">
      <Card className="h-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
          <SectionHeader title="Upcoming Deliveries" icon={Clock} />
          {deliveries.length > 0 && (
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-full sm:w-fit text-xs">
                <ArrowUpDown size={15} />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Pickup Time</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {deliveries.length === 0 ? (
            <EmptyState
              title="No Upcoming Deliveries Scheduled"
              Icon={Package}
            />
          ) : (
            <>
              <ScrollableWithFade
                heightClass="h-[300px] lg:h-[400px]"
                gradientHeight="h-4"
              >
                <div className="space-y-4 sm:space-y-3">
                  {deliveries.map((delivery) => {
                    const isSelectable = delivery.status === 'CREATED'
                    return (
                      <div
                        key={delivery.id}
                        className="flex flex-col sm:flex-row items-start justify-between gap-6 rounded-lg border border-border/30 dark:border-border p-3 transition-colors hover:bg-accent"
                      >
                        <div className="flex items-start gap-3 w-full sm:w-auto">
                          <Checkbox
                            id={`select-${delivery.id}`}
                            checked={selectedOrderIds.has(delivery.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(delivery.id, checked === true)
                            }
                            disabled={!isSelectable}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              {delivery.deliveryTiming === 'SEND_NOW' ? (
                                <Clock className="h-3.5 w-3.5 text-green-500 shrink-0" />
                              ) : (
                                <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                              )}
                              <span className="font-medium">
                                {formatPickupTime(
                                  delivery.pickupTime,
                                  delivery.deliveryTiming,
                                )}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="truncate max-w-[120px] sm:max-w-none">
                                {delivery.deliveryAddress}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground">
                                {delivery.customerName}
                              </span>
                              <Badge
                                variant={priorityVariant(delivery.priority)}
                                size="sm"
                                className="text-xs"
                              >
                                {delivery.priority}
                              </Badge>
                              {delivery.assignedDriver && (
                                <Badge
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  Driver: {delivery.assignedDriver.name}
                                </Badge>
                              )}
                              <StatusBadge status={delivery.status} />
                            </div>
                          </div>
                        </div>

                        {delivery.status === 'CREATED' ? (
                          <Button
                            size="xs"
                            variant="default"
                            onClick={() => handleAssignClick(delivery)}
                            className="w-full sm:w-auto self-end sm:self-auto ml-8 sm:ml-0"
                          >
                            Assign
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleViewClick(delivery.id)}
                            className="w-full sm:w-auto self-end sm:self-auto ml-8 sm:ml-0"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollableWithFade>

              {/* Selection bar with timing validation */}
              {selectedOrderIds.size > 0 && (
                <div className="flex items-center justify-between bg-background border border-border/40 rounded-md p-3 shadow">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={allSelectableSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAll(checked === true)
                      }
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      {selectedOrderIds.size} selected
                    </Label>
                    {!allSelectedHaveSameTiming && (
                      <span className="text-xs text-destructive ml-2">
                        Cannot mix Send Now and Scheduled orders
                      </span>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            size="sm"
                            onClick={() => handleAssignClick()}
                            disabled={!allSelectedHaveSameTiming}
                          >
                            Assign Selected
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!allSelectedHaveSameTiming && (
                        <TooltipContent>
                          <p className="text-xs">
                            All selected orders must have the same delivery
                            timing
                          </p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </>
          )}
        </CardContent>

        <AssignOrderSheet
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          orders={deliveries.filter((d) => selectedOrderIds.has(d.id))}
          companyId={companyId}
          onAssign={handleAssignComplete}
        />
      </Card>
    </motion.div>
  )
}
