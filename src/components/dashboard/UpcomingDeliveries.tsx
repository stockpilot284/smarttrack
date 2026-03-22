import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns'
import {
  Clock,
  ArrowUpDown,
  Package,
  Zap,
  MapPin,
  CheckCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionHeader } from '../SectionHeader'
import { DeliveryTiming, OrderPriority, OrderStatus } from '@/types/order.type'
import { ScrollableWithFade } from '../ScrollableWithFade'
import AssignOrderSheet, {
  AssignmentPayload,
} from '@/components/AssignOrderSheet'
import { Label } from '../ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import EmptyState from '../EmptyState'
import { motion, AnimatePresence } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { MOCK_DELIVERIES } from '@/data/deliveries'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOption = 'time' | 'priority'

export type Delivery = {
  id: string
  customerName: string
  pickupAddress: string
  deliveryAddress: string
  pickupTime: string
  deliveryTiming: DeliveryTiming
  priority: OrderPriority
  assignedDriver?: { id: string; name: string } | null
  pickupCoordinates: {
    latitude: number
    longitude: number
  }
  dropoffCoordinates: {
    latitude: number
    longitude: number
  }
  status: OrderStatus
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<
  OrderPriority,
  { label: string; className: string; dot: string }
> = {
  HIGH: {
    label: 'HIGH',
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
    dot: 'bg-red-500',
  },
  MEDIUM: {
    label: 'MEDIUM',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    dot: 'bg-amber-500',
  },
  LOW: {
    label: 'LOW',
    className:
      'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800',
    dot: 'bg-slate-400',
  },
}

function formatPickupTime(pickupTime: string, deliveryTiming: DeliveryTiming) {
  const date = new Date(pickupTime)
  const diffMinutes = differenceInMinutes(date, new Date())

  if (deliveryTiming === 'SEND_NOW' || diffMinutes <= 0) return 'Now'
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (isToday(date)) return format(date, 'h:mm a')
  if (isTomorrow(date)) return `Tomorrow ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, h:mm a')
}

function isUrgent(delivery: Delivery) {
  if (delivery.deliveryTiming === 'SEND_NOW') return true
  const diffMinutes = differenceInMinutes(
    new Date(delivery.pickupTime),
    new Date(),
  )
  return diffMinutes <= 30
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DriverInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border/50">
      {initials}
    </span>
  )
}

function DeliveryRow({
  delivery,
  isSelected,
  isSelectable,
  onSelect,
  onAssign,
  onView,
  index,
}: {
  delivery: Delivery
  isSelected: boolean
  isSelectable: boolean
  onSelect: (id: string, checked: boolean) => void
  onAssign: (d: Delivery) => void
  onView: (id: string) => void
  index: number
}) {
  const urgent = isUrgent(delivery)
  const priority = PRIORITY_CONFIG[delivery.priority]
  const timeLabel = formatPickupTime(
    delivery.pickupTime,
    delivery.deliveryTiming,
  )
  const isAssigned = delivery.status === 'ASSIGNED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-all duration-150',
        isSelected
          ? 'border-primary/40 bg-primary/[0.03] dark:bg-primary/[0.06]'
          : 'border-border/40 bg-transparent hover:border-border/70 hover:bg-accent/50 dark:border-border',
        urgent && !isAssigned && 'border-l-2 border-l-red-500',
      )}
    >
      {/* Checkbox */}
      <Checkbox
        id={`select-${delivery.id}`}
        checked={isSelected}
        onCheckedChange={(checked) => onSelect(delivery.id, checked === true)}
        disabled={!isSelectable}
        className="shrink-0"
      />

      {/* Time pill */}
      <div
        className={cn(
          'flex w-14 shrink-0 flex-col items-center justify-center rounded-lg py-1.5 text-center',
          urgent && !isAssigned
            ? 'bg-red-50 dark:bg-red-950/40'
            : 'bg-muted/60',
        )}
      >
        {delivery.deliveryTiming === 'SEND_NOW' ? (
          <Zap
            className={cn(
              'h-3.5 w-3.5',
              urgent && !isAssigned ? 'text-red-500' : 'text-muted-foreground',
            )}
          />
        ) : (
          <Clock
            className={cn(
              'h-3 w-3',
              urgent && !isAssigned ? 'text-red-500' : 'text-muted-foreground',
            )}
          />
        )}
        <span
          className={cn(
            'mt-0.5 text-[11px] font-semibold tabular-nums leading-none',
            urgent && !isAssigned
              ? 'text-red-600 dark:text-red-400'
              : 'text-foreground',
          )}
        >
          {timeLabel}
        </span>
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Customer name + priority dot */}
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium leading-tight">
            {delivery.customerName}
          </span>
          <span
            className={cn('h-1.5 w-1.5 shrink-0 rounded-full', priority.dot)}
          />
        </div>

        {/* Pickup → Dropoff flow */}
        <div className="mt-1 flex flex-col">
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-emerald-500 mt-px" />
            <span className="truncate text-[11px] text-muted-foreground leading-tight">
              {delivery.pickupAddress}
            </span>
          </div>
          <div className="ml-[5px] w-px h-2 bg-border/50" />
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-rose-500 mt-px" />
            <span className="truncate text-[11px] text-muted-foreground leading-tight">
              {delivery.deliveryAddress}
            </span>
          </div>
        </div>

        {/* Assigned driver */}
        {delivery.assignedDriver && (
          <div className="mt-1.5 flex items-center gap-1">
            <DriverInitials name={delivery.assignedDriver.name} />
            <span className="text-[11px] text-muted-foreground">
              {delivery.assignedDriver.name}
            </span>
          </div>
        )}
      </div>

      {/* Right action */}
      <div className="shrink-0">
        {!isAssigned ? (
          <Button
            size="xs"
            variant="default"
            onClick={() => onAssign(delivery)}
            className="h-7 px-2.5 text-xs opacity-80 transition-opacity group-hover:opacity-100"
          >
            Assign
          </Button>
        ) : (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onView(delivery.id)}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            View
          </Button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

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

  const createdOrders = useMemo(
    () => deliveries.filter((d) => d.status === 'CREATED'),
    [deliveries],
  )

  const selectedDeliveries = useMemo(
    () => deliveries.filter((d) => selectedOrderIds.has(d.id)),
    [deliveries, selectedOrderIds],
  )

  const allSelectedHaveSameTiming = useMemo(() => {
    if (selectedDeliveries.length === 0) return true
    const first = selectedDeliveries[0].deliveryTiming
    return selectedDeliveries.every((d) => d.deliveryTiming === first)
  }, [selectedDeliveries])

  const allSelectableSelected =
    createdOrders.length > 0 &&
    createdOrders.every((o) => selectedOrderIds.has(o.id))

  const urgentUnassigned = useMemo(
    () => deliveries.filter((d) => isUrgent(d) && d.status === 'CREATED'),
    [deliveries],
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        await new Promise((r) => setTimeout(r, 800))

        const filtered = MOCK_DELIVERIES.filter(
          (d) => d.status === 'CREATED' || d.status === 'ASSIGNED',
        )

        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === 'priority') {
            const order = { HIGH: 1, MEDIUM: 2, LOW: 3 }
            const diff = order[a.priority] - order[b.priority]
            if (diff !== 0) return diff
          }
          return (
            new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime()
          )
        })

        setDeliveries(sorted)
        setError(null)
      } catch (err) {
        setError('Failed to load upcoming deliveries')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [companyId, sortBy])

  const handleSelectOrder = (id: string, checked: boolean) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrderIds(
      checked ? new Set(createdOrders.map((o) => o.id)) : new Set(),
    )
  }

  const handleAssignClick = (delivery?: Delivery) => {
    if (delivery) {
      setSelectedOrderIds(new Set([delivery.id]))
    } else {
      if (!allSelectedHaveSameTiming) return
    }
    setAssignModalOpen(true)
  }

  const handleAssignComplete = (payload: AssignmentPayload) => {
    console.log('[Assignment]', payload)
    // TODO: dispatch payload to your API / store
    setAssignModalOpen(false)
    setSelectedOrderIds(new Set())
  }

  const handleViewClick = (id: string) => {
    navigate({
      to: '/apps/$companyId/orders/$orderRef',
      params: { companyId, orderRef: id },
    })
  }

  // ── Skeleton ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <motion.div {...motionPresets.slideUp} className="h-auto">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <SectionHeader title="Upcoming Deliveries" icon={Clock} />
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border/30 px-3 py-3"
              >
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="h-12 w-14 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/5 rounded bg-muted" />
                  <div className="h-3 w-3/5 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
                <div className="h-7 w-14 rounded-md bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div {...motionPresets.slideUp}>
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div {...motionPresets.slideUp} className="h-auto">
      <Card className="h-full">
        {/* ── Header ── */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-3">
            <SectionHeader title="Upcoming Deliveries" icon={Clock} />
            {urgentUnassigned.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400">
                {urgentUnassigned.length} urgent
              </span>
            )}
          </div>
          {deliveries.length > 0 && (
            <Select
              value={sortBy}
              onValueChange={(v: SortOption) => setSortBy(v)}
            >
              <SelectTrigger className="w-full sm:w-fit text-xs h-8">
                <ArrowUpDown size={13} />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Pickup time</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {deliveries.length === 0 ? (
            <EmptyState
              title="No Upcoming Deliveries Scheduled"
              Icon={Package}
            />
          ) : (
            <>
              {/* ── Select-all row ── */}
              {createdOrders.length > 1 && (
                <div className="flex items-center gap-2 px-1">
                  <Checkbox
                    id="select-all-top"
                    checked={allSelectableSelected}
                    onCheckedChange={(c) => handleSelectAll(c === true)}
                  />
                  <Label
                    htmlFor="select-all-top"
                    className="text-xs text-muted-foreground cursor-pointer select-none"
                  >
                    Select all unassigned ({createdOrders.length})
                  </Label>
                </div>
              )}

              {/* ── Delivery list ── */}
              <ScrollableWithFade
                heightClass="h-[300px] lg:h-[400px]"
                gradientHeight="h-4"
              >
                <div className="space-y-2">
                  {deliveries.map((delivery, index) => (
                    <DeliveryRow
                      key={delivery.id}
                      delivery={delivery}
                      index={index}
                      isSelected={selectedOrderIds.has(delivery.id)}
                      isSelectable={delivery.status === 'CREATED'}
                      onSelect={handleSelectOrder}
                      onAssign={handleAssignClick}
                      onView={handleViewClick}
                    />
                  ))}
                </div>
              </ScrollableWithFade>

              {/* ── Bulk action bar ── */}
              <AnimatePresence>
                {selectedOrderIds.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-background px-3 py-2.5 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {selectedOrderIds.size} selected
                      </span>
                      {!allSelectedHaveSameTiming && (
                        <span className="text-xs text-destructive">
                          Mix of Send Now & Scheduled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-muted-foreground"
                        onClick={() => setSelectedOrderIds(new Set())}
                      >
                        Clear
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                size="sm"
                                onClick={() => handleAssignClick()}
                                disabled={!allSelectedHaveSameTiming}
                                className="h-7 text-xs"
                              >
                                Assign {selectedOrderIds.size}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!allSelectedHaveSameTiming && (
                            <TooltipContent side="top">
                              <p className="text-xs">
                                All selected orders must share the same delivery
                                timing
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </CardContent>
      </Card>

      <AssignOrderSheet
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        orders={deliveries.filter((d) => selectedOrderIds.has(d.id))}
        companyId={companyId}
        onAssign={handleAssignComplete}
      />
    </motion.div>
  )
}
