import { useEffect, useState, useCallback, useRef } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Info,
  Clock,
  Route,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DeliveryTiming, OrderStatus } from '@/types/order.type'
import { MemberStatus } from '@/types/member.type'
import { DriverAvailability } from '@/types/driver.type'
import { VehicleAvailability, VehicleStatus } from '@/types/vehicle.type'
import { StatusBadge } from './StatusBadge'
import { fetchRouteForStops } from '@/lib/routing/fetch-route-for-stops'
import { cn } from '@/lib/utils'
import { Delivery } from './dashboard/UpcomingDeliveries'
import { RadarRouteResult } from '@/lib/routing/routing.types'

// ─── Types ────────────────────────────────────────────────────────────────────

type Driver = {
  id: string
  name: string
  accountStatus: MemberStatus
  availability: DriverAvailability
  currentVehicleId?: string
}

type Vehicle = {
  id: string
  plateNumber: string
  model: string
  type: string
  capacity?: string
  status: VehicleStatus
  availability: VehicleAvailability
}

type StopEta = {
  orderId: string
  distanceKm: number | null
  /** Cumulative duration from route start to this stop's dropoff, in minutes */
  durationMin: number | null
  /** Duration for just this leg, in minutes */
  legDurationMin: number | null
}

type RouteState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success'
      stops: StopEta[]
      totalDistanceKm: number
      totalDurationMin: number
    }
  | { status: 'error'; message: string }

// ─── Assignment payload ───────────────────────────────────────────────────────

export type StopOrderItem = {
  orderId: string
  customerName: string
  pickupAddress: string
  deliveryAddress: string
  pickupCoordinates: {
    latitude: number
    longitude: number
  }
  dropoffCoordinates: {
    latitude: number
    longitude: number
  }
  /** Duration from the previous stop to this stop's dropoff, in minutes */
  legDurationMin: number | null
  /** Cumulative duration from route start to this stop's dropoff, in minutes */
  cumulativeDurationMin: number | null
  /** Leg distance in km */
  legDistanceKm: number | null
}

export type AssignmentPayload = {
  driver: {
    id: string
    name: string
  }
  vehicle: {
    id: string
    plateNumber: string
    model: string
    type: string
  }
  stopOrders: StopOrderItem[]
  route: {
    totalDistanceKm: number
    totalDurationMin: number
    /** ISO timestamp of when the route was confirmed */
    confirmedAt: string
  } | null
}

interface AssignOrderSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orders: Delivery[]
  companyId: string
  onAssign?: (payload: AssignmentPayload) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

/**
 * Build the coordinate chain for fetchRouteForStops from the ordered stop list.
 * Shape: [pickup_1, dropoff_1, pickup_2, dropoff_2, ...]
 */
function buildCoordinateChain(
  orderedOrders: Delivery[],
): [number, number][] | null {
  const coords: [number, number][] = []

  for (const order of orderedOrders) {
    if (!order.pickupCoordinates || !order.dropoffCoordinates) return null
    coords.push([
      order.pickupCoordinates.longitude,
      order.pickupCoordinates.latitude,
    ])
    coords.push([
      order.dropoffCoordinates.longitude,
      order.dropoffCoordinates.latitude,
    ])
  }

  return coords.length >= 2 ? coords : null
}

// ─── ETA panel ───────────────────────────────────────────────────────────────

function EtaPanel({
  route,
  stopOrder,
  orders,
}: {
  route: RouteState
  stopOrder: string[]
  orders: Delivery[]
}) {
  if (route.status === 'idle') return null

  if (route.status === 'loading') {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2.5 text-xs text-muted-foreground">
        <Route className="h-3.5 w-3.5 animate-pulse" />
        Calculating route…
      </div>
    )
  }

  if (route.status === 'error') {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {route.message}
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 space-y-2">
      {/* Summary row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Route className="h-3.5 w-3.5" />
          <span>Total route</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span>{formatDistance(route.totalDistanceKm)}</span>
          <span className="text-muted-foreground">·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {formatDuration(route.totalDurationMin)}
          </span>
        </div>
      </div>

      {/* Per-stop breakdown */}
      {route.stops.length > 1 && (
        <div className="space-y-1 border-t border-border/30 pt-2">
          {route.stops.map((stop, i) => {
            const order = orders.find((o) => o.id === stop.orderId)
            return (
              <div
                key={stop.orderId}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="text-muted-foreground truncate max-w-[140px]">
                  Stop {i + 1} · {order?.customerName ?? stop.orderId}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {stop.legDurationMin != null
                    ? `+${formatDuration(stop.legDurationMin)}`
                    : '—'}
                  {stop.distanceKm != null && (
                    <span className="ml-1.5 opacity-60">
                      ({formatDistance(stop.distanceKm)})
                    </span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AssignOrderSheet({
  open,
  onOpenChange,
  orders,
  companyId,
  onAssign,
}: AssignOrderSheetProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedDriverId, setSelectedDriverId] = useState<string>('')
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('')

  const [driverSearch, setDriverSearch] = useState('')
  const [vehicleSearch, setVehicleSearch] = useState('')

  const [stopOrder, setStopOrder] = useState<string[]>([])
  const [route, setRoute] = useState<RouteState>({ status: 'idle' })

  const routeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Initialise when sheet opens ────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setStopOrder(orders.map((o) => o.id))
      setRoute({ status: 'idle' })
      setSelectedDriverId('')
      setSelectedVehicleId('')
    }
  }, [open, orders])

  // ── Load drivers & vehicles ────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setTimeout(() => {
      setDrivers([
        {
          id: 'd1',
          name: 'John Doe',
          accountStatus: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'd2',
          name: 'Jane Smith',
          accountStatus: 'ACTIVE',
          availability: 'ON_BREAK',
        },
        {
          id: 'd3',
          name: 'Bob Wilson',
          accountStatus: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'd4',
          name: 'Alice Brown',
          accountStatus: 'ACTIVE',
          availability: 'BUSY',
        },
        {
          id: 'd5',
          name: 'Charlie Davis',
          accountStatus: 'SUSPENDED',
          availability: 'UNAVAILABLE',
        },
        {
          id: 'd6',
          name: 'Eva Green',
          accountStatus: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'd7',
          name: 'Frank Harris',
          accountStatus: 'ACTIVE',
          availability: 'ON_BREAK',
        },
        {
          id: 'd8',
          name: 'Grace Lee',
          accountStatus: 'ACTIVE',
          availability: 'AVAILABLE',
        },
      ])
      setVehicles([
        {
          id: 'v1',
          plateNumber: 'VAN-123',
          model: 'Sprinter',
          type: 'Van',
          status: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'v2',
          plateNumber: 'TRK-456',
          model: 'F-550',
          type: 'Truck',
          status: 'MAINTENANCE',
          availability: 'UNAVAILABLE',
        },
        {
          id: 'v3',
          plateNumber: 'VAN-789',
          model: 'Transit',
          type: 'Van',
          status: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'v4',
          plateNumber: 'VAN-101',
          model: 'Sprinter',
          type: 'Van',
          status: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'v5',
          plateNumber: 'TRK-202',
          model: 'F-650',
          type: 'Truck',
          status: 'ACTIVE',
          availability: 'AVAILABLE',
        },
        {
          id: 'v6',
          plateNumber: 'VAN-303',
          model: 'Promaster',
          type: 'Van',
          status: 'SUSPENDED',
          availability: 'UNAVAILABLE',
        },
      ])
      setLoading(false)
    }, 500)
  }, [open])

  // ── Route / ETA calculation ────────────────────────────────────────────────

  const calculateRoute = useCallback(
    async (orderedIds: string[]) => {
      const orderedOrders = orderedIds
        .map((id) => orders.find((o) => o.id === id))
        .filter(Boolean) as Delivery[]

      const coords = buildCoordinateChain(orderedOrders)

      if (!coords) {
        setRoute({ status: 'idle' })
        return
      }

      setRoute({ status: 'loading' })

      try {
        const result = (await fetchRouteForStops(coords)) as RadarRouteResult

        const totalDurationMin = (result.duration ?? 0) / 60
        const totalDistanceKm = (result.distance ?? 0) / 1000

        const stopEtas: StopEta[] = orderedOrders.map((order, i) => {
          const legDurationMin = totalDurationMin / orderedOrders.length
          const legDistanceKm = totalDistanceKm / orderedOrders.length
          return {
            orderId: order.id,
            distanceKm: legDistanceKm,
            durationMin: legDurationMin * (i + 1),
            legDurationMin,
          }
        })

        setRoute({
          status: 'success',
          stops: stopEtas,
          totalDistanceKm,
          totalDurationMin,
        })
      } catch {
        setRoute({
          status: 'error',
          message: 'Could not calculate route. ETA unavailable.',
        })
      }
    },
    [orders],
  )

  useEffect(() => {
    if (!open || stopOrder.length === 0) return
    if (routeDebounceRef.current) clearTimeout(routeDebounceRef.current)
    routeDebounceRef.current = setTimeout(() => calculateRoute(stopOrder), 600)
    return () => {
      if (routeDebounceRef.current) clearTimeout(routeDebounceRef.current)
    }
  }, [stopOrder, open, calculateRoute])

  // ── Filtered lists ─────────────────────────────────────────────────────────

  const filteredDrivers = drivers.filter(
    (d) =>
      d.accountStatus === 'ACTIVE' &&
      d.availability === 'AVAILABLE' &&
      (!driverSearch ||
        d.name.toLowerCase().includes(driverSearch.toLowerCase())),
  )

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.status === 'ACTIVE' &&
      v.availability === 'AVAILABLE' &&
      (!vehicleSearch ||
        v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase())),
  )

  // ── Stop order controls ────────────────────────────────────────────────────

  const moveUp = (index: number) => {
    if (index === 0) return
    const next = [...stopOrder]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setStopOrder(next)
  }

  const moveDown = (index: number) => {
    if (index === stopOrder.length - 1) return
    const next = [...stopOrder]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setStopOrder(next)
  }

  // ── Confirm — build grouped AssignmentPayload ──────────────────────────────

  const handleConfirm = async () => {
    if (!selectedDriverId || !selectedVehicleId) return

    const driver = drivers.find((d) => d.id === selectedDriverId)!
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId)!

    const stopOrders: StopOrderItem[] = stopOrder.map((orderId) => {
      const order = orders.find((o) => o.id === orderId)!
      const stopEta =
        route.status === 'success'
          ? route.stops.find((s) => s.orderId === orderId)
          : null

      return {
        orderId: order.id,
        customerName: order.customerName,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        pickupCoordinates: order.pickupCoordinates,
        dropoffCoordinates: order.dropoffCoordinates,
        legDurationMin: stopEta?.legDurationMin ?? null,
        cumulativeDurationMin: stopEta?.durationMin ?? null,
        legDistanceKm: stopEta?.distanceKm ?? null,
      }
    })

    const payload: AssignmentPayload = {
      driver: {
        id: driver.id,
        name: driver.name,
      },
      vehicle: {
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        model: vehicle.model,
        type: vehicle.type,
      },
      stopOrders,
      route:
        route.status === 'success'
          ? {
              totalDistanceKm: route.totalDistanceKm,
              totalDurationMin: route.totalDurationMin,
              confirmedAt: new Date().toISOString(),
            }
          : null,
    }

    setTimeout(() => {
      onAssign?.(payload)
      onOpenChange(false)
    }, 500)
  }

  const isValid = !!selectedDriverId && !!selectedVehicleId

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-3xl lg:max-w-6xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Assign Orders to Driver & Vehicle</SheetTitle>
          <SheetDescription>
            {orders.length === 1
              ? `Assigning order #${orders[0].id}`
              : `Assigning ${orders.length} orders together – set the stop order below`}
          </SheetDescription>
        </SheetHeader>

        <TooltipProvider>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {/* ── Stop order + ETA ── */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">
                    Selected Orders (stop order)
                  </h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="iconXs" className="h-5 w-5">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-xs">
                        Arrange the stops in the order the driver should deliver
                        them. The ETA updates automatically as you reorder.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="max-h-48 md:max-h-64 overflow-y-auto pr-2 space-y-2">
                  {stopOrder.map((orderId, index) => {
                    const order = orders.find((o) => o.id === orderId)
                    if (!order) return null

                    const stopEta =
                      route.status === 'success'
                        ? route.stops.find((s) => s.orderId === orderId)
                        : null

                    return (
                      <div
                        key={order.id}
                        className="flex items-start gap-2 text-xs p-2 bg-muted rounded-lg"
                      >
                        {/* Index + reorder controls */}
                        <div className="flex items-center gap-1 min-w-[48px]">
                          <Badge
                            variant="outline"
                            size="sm"
                            className="w-6 justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="iconXs"
                              className="h-4 w-4"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="iconXs"
                              className="h-4 w-4"
                              onClick={() => moveDown(index)}
                              disabled={index === stopOrder.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Order details */}
                        <div className="flex-1 flex flex-col gap-1.5">
                          {/* Customer + badges row */}
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <span className="font-medium leading-tight">
                              {order.customerName}
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                              <Badge
                                variant={
                                  order.priority === 'HIGH'
                                    ? 'softDestructive'
                                    : order.priority === 'MEDIUM'
                                      ? 'soft'
                                      : 'softSecondary'
                                }
                                size="sm"
                              >
                                {order.priority}
                              </Badge>
                              <Badge variant="outline" size="sm">
                                {order.deliveryTiming === 'SEND_NOW'
                                  ? 'Now'
                                  : 'Scheduled'}
                              </Badge>
                              {stopEta?.legDurationMin != null && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-background border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                  <Clock className="h-2.5 w-2.5" />+
                                  {formatDuration(stopEta.legDurationMin)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Pickup → Dropoff address flow */}
                          <div className="flex flex-col mt-0.5">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3 w-3 text-emerald-500 shrink-0 mt-px" />
                              <span
                                className="text-[11px] text-muted-foreground truncate leading-tight"
                                title={order.pickupAddress}
                              >
                                {order.pickupAddress}
                              </span>
                            </div>
                            <div className="ml-[5px] w-px h-2.5 bg-border/50" />
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3 w-3 text-rose-500 shrink-0 mt-px" />
                              <span
                                className="text-[11px] text-muted-foreground truncate leading-tight"
                                title={order.deliveryAddress}
                              >
                                {order.deliveryAddress}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <EtaPanel route={route} stopOrder={stopOrder} orders={orders} />
              </div>

              {/* ── Driver selection ── */}
              <div className="flex flex-col h-full">
                <h4 className="text-sm font-medium mb-2">Select Driver</h4>
                <Input
                  placeholder="Search drivers…"
                  value={driverSearch}
                  size="sm"
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="mb-2 flex-shrink-0"
                />
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <RadioGroup
                    value={selectedDriverId}
                    onValueChange={setSelectedDriverId}
                  >
                    {filteredDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className={cn(
                          'flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors',
                          selectedDriverId === driver.id && 'bg-accent',
                        )}
                      >
                        <RadioGroupItem
                          value={driver.id}
                          id={`driver-${driver.id}`}
                        />
                        <Label
                          htmlFor={`driver-${driver.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span className="text-xs">{driver.name}</span>
                            <StatusBadge
                              variant="driver"
                              size="sm"
                              status={driver.availability}
                            />
                          </div>
                        </Label>
                      </div>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <p className="text-xs text-muted-foreground px-2 py-3">
                        No available drivers found
                      </p>
                    )}
                  </RadioGroup>
                </div>
              </div>

              {/* ── Vehicle selection ── */}
              <div className="flex flex-col h-full">
                <h4 className="text-sm font-medium mb-2">Select Vehicle</h4>
                <Input
                  placeholder="Search vehicles…"
                  size="sm"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  className="mb-2 flex-shrink-0"
                />
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <RadioGroup
                    value={selectedVehicleId}
                    onValueChange={setSelectedVehicleId}
                  >
                    {filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={cn(
                          'flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors',
                          selectedVehicleId === vehicle.id && 'bg-accent',
                        )}
                      >
                        <RadioGroupItem
                          value={vehicle.id}
                          id={`vehicle-${vehicle.id}`}
                        />
                        <Label
                          htmlFor={`vehicle-${vehicle.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-xs w-full">
                            <div className="flex items-center justify-between gap-4 w-full">
                              <span>
                                {vehicle.plateNumber} · {vehicle.model}
                              </span>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" size="sm">
                                  {vehicle.type}
                                </Badge>
                                <StatusBadge
                                  size="sm"
                                  variant="vehicle"
                                  status={vehicle.availability}
                                />
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <p className="text-xs text-muted-foreground px-2 py-3">
                        No available vehicles found
                      </p>
                    )}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* ── Footer ── */}
        <SheetFooter className="px-6 py-4 border-t border-border/50 dark:border-border flex-col sm:flex-row gap-2 items-center">
          {route.status === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-auto">
              <Route className="h-3.5 w-3.5" />
              <span>
                {formatDistance(route.totalDistanceKm)} ·{' '}
                {formatDuration(route.totalDurationMin)} ETA
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {loading
              ? 'Assigning…'
              : `Assign ${orders.length} order${orders.length > 1 ? 's' : ''}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
