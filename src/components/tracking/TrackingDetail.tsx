import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/BackButton'
import { ShareTrackingButton } from './ShareTrackingButton'
import { RouteOverviewCard } from './RouteOverviewCard'
import { StopList } from './StopList'
import { OrderDetailsPanel } from './OrderDetailsPanel'
import MapPanel from './MapPanel'
import { StatusBadge } from '@/components/StatusBadge'
import {
  TrackingItem,
  CancellationInfo,
  isTripTerminal,
  isTripCancellable,
} from '@/types/tracking.type'
import StatePlaceholder from '../StatePlaceholder'
import {
  Navigation2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Ban,
} from 'lucide-react'
import { mockTrackingItems } from '@/data/mock-tracking-items'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store/zustand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

// ─── Trip progress bar ────────────────────────────────────────────────────────

function TripProgressBar({ item }: { item: TrackingItem }) {
  const resolved = item.stops.filter(
    (s) =>
      s.status === 'COMPLETED' ||
      s.status === 'FAILED' ||
      s.status === 'SKIPPED',
  ).length
  const total = item.stops.length
  const pct = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground font-medium w-7 text-right">
        {pct}%
      </span>
    </div>
  )
}

// ─── Driver chip ──────────────────────────────────────────────────────────────

function DriverChip({ item }: { item: TrackingItem }) {
  const dotColor =
    item.driver.availability === 'AVAILABLE' ||
    item.driver.availability === 'BUSY'
      ? 'bg-emerald-500'
      : item.driver.availability === 'ON_BREAK'
        ? 'bg-amber-500'
        : 'bg-muted-foreground'

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative flex-shrink-0">
        {item.driver.imageUrl ? (
          <img
            src={item.driver.imageUrl}
            alt={item.driver.name}
            className="w-6 h-6 rounded-full ring-1 ring-border object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[10px] font-bold text-muted-foreground">
              {item.driver.name.charAt(0)}
            </span>
          </div>
        )}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-1 ring-background',
            dotColor,
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate leading-tight">
          {item.driver.name}
        </p>
        <p className="text-[10px] text-muted-foreground truncate leading-tight font-mono">
          {item.vehicle.plateNumber}
        </p>
      </div>
    </div>
  )
}

// ─── Terminal notice ──────────────────────────────────────────────────────────

function TerminalNotice({ item }: { item: TrackingItem }) {
  if (!isTripTerminal(item.status)) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-xl p-3 text-xs',
        item.status === 'COMPLETED'
          ? 'bg-emerald-500/8 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          : item.status === 'FAILED'
            ? 'bg-destructive/8 border border-destructive/20 text-destructive'
            : 'bg-muted border border-border text-muted-foreground',
      )}
    >
      {item.status === 'COMPLETED' && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Trip completed
            {item.completedAt
              ? ` · ${new Date(item.completedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : ''}
          </span>
        </div>
      )}
      {item.status === 'FAILED' && item.failureReason && (
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Trip failed</p>
            <p className="opacity-80 mt-0.5">{item.failureReason.message}</p>
          </div>
        </div>
      )}
      {item.status === 'CANCELLED' && item.cancellationInfo && (
        <div className="flex items-start gap-2">
          <XCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Trip cancelled</p>
            <p className="opacity-80 mt-0.5">{item.cancellationInfo.reason}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Cancel trip dialog ───────────────────────────────────────────────────────

function CancelTripDialog({
  open,
  onOpenChange,
  onConfirm,
  orderCount,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: (reason: string) => void
  orderCount: number
}) {
  const [reason, setReason] = useState('')
  const isValid = reason.trim().length >= 3

  // Reset reason when dialog closes
  useEffect(() => {
    if (!open) setReason('')
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this trip?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                This will cancel the entire trip.{' '}
                {orderCount > 0 && (
                  <>
                    <strong className="text-foreground">
                      {orderCount} order{orderCount > 1 ? 's' : ''}
                    </strong>{' '}
                    will return to the unassigned pool and can be re-dispatched.
                  </>
                )}
              </p>
              <p>
                This action is only available because the driver has not yet
                started moving. Once in transit, individual orders must be
                cancelled separately.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Required reason field */}
        <div className="space-y-1.5 py-1">
          <p className="text-xs font-medium text-foreground">
            Reason for cancellation <span className="text-destructive">*</span>
          </p>
          <Input
            placeholder="e.g. Vehicle breakdown, wrong driver assigned…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="text-sm"
            autoFocus
          />
          <p className="text-[11px] text-muted-foreground">
            This will be recorded on the trip for audit purposes.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size={'sm'} variant={'outline'}>
              Keep trip
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!isValid}
            onClick={() => onConfirm(reason.trim())}
            asChild
          >
            <Button size={'sm'} variant={'destructive'}>
              Yes, cancel trip
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Side panel content ───────────────────────────────────────────────────────

function SidePanelContent({
  item,
  selectedStopId,
  onStopClick,
}: {
  item: TrackingItem
  selectedStopId: string | null
  onStopClick: (id: string) => void
}) {
  const selectedStop = item.stops.find((s) => s.id === selectedStopId)

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      <div className="px-3 py-3 space-y-3">
        {/* Route overview */}
        <div className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
          <RouteOverviewCard item={item} />
        </div>

        {/* Stop list */}
        <div className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
          <StopList
            stops={item.stops}
            selectedStopId={selectedStopId}
            onStopClick={onStopClick}
          />
        </div>

        {/* Order details for selected stop */}
        <AnimatePresence mode="wait">
          {selectedStop && (
            <motion.div
              key={selectedStop.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border border-border/60 bg-background/60 overflow-hidden"
            >
              <OrderDetailsPanel stop={selectedStop} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal notice */}
        <TerminalNotice item={item} />

        <div className="h-2" />
      </div>
    </div>
  )
}

// ─── Mobile bottom sheet ──────────────────────────────────────────────────────

function MobileBottomSheet({
  item,
  selectedStopId,
  onStopClick,
  open,
  onToggle,
}: {
  item: TrackingItem
  selectedStopId: string | null
  onStopClick: (id: string) => void
  open: boolean
  onToggle: () => void
}) {
  const resolved = item.stops.filter(
    (s) =>
      s.status === 'COMPLETED' ||
      s.status === 'FAILED' ||
      s.status === 'SKIPPED',
  ).length

  const nextStop = item.stops.find(
    (s) => s.status === 'PENDING' || s.status === 'IN_PROGRESS',
  )

  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 z-20 flex flex-col',
        'bg-card border-t border-border/60',
        'rounded-t-2xl shadow-2xl',
        'transition-all duration-300 ease-in-out',
        open ? 'max-h-[75dvh]' : 'max-h-[5.5rem]',
      )}
    >
      <button
        onClick={onToggle}
        className="flex flex-col items-center pt-2 pb-0 w-full"
        aria-label={open ? 'Collapse details' : 'Expand details'}
      >
        <div className="w-8 h-1 rounded-full bg-border mb-2" />
        <div className="flex items-center justify-between w-full px-4 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <StatusBadge status={item.status} variant="order" />
            <span className="text-xs text-muted-foreground tabular-nums">
              {resolved}/{item.stops.length} stops
            </span>
            {nextStop && !open && (
              <span className="text-xs text-foreground truncate hidden xs:block">
                · {nextStop.type === 'PICKUP' ? '↑' : '↓'}{' '}
                {nextStop.contactName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0 ml-2">
            <Layers className="h-3.5 w-3.5" />
            <span className="text-xs">{open ? 'Hide' : 'Details'}</span>
            {open ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 min-h-0 overflow-hidden flex flex-col"
          >
            <SidePanelContent
              item={item}
              selectedStopId={selectedStopId}
              onStopClick={(id) => {
                onStopClick(id)
                onToggle()
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TrackingDetail() {
  const { trackingId, companyId } = useParams({
    from: '/apps/$companyId/tracking/$trackingId/',
  })
  const navigate = useNavigate()

  const dispatcherId = useAppStore((state) => state.user.id)

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const item = mockTrackingItems.find((i) => i.id === trackingId) as
    | TrackingItem
    | undefined

  // ── Derived cancellation state ─────────────────────────────────────────────

  /**
   * isTripCancellable: only true when status === 'ASSIGNED'
   * (IN_TRANSIT trips cannot be cancelled — use order-level cancel instead)
   */
  const canCancel = item ? isTripCancellable(item.status) : false

  /**
   * Count of orders that will return to the pool on cancellation.
   * All orders on an ASSIGNED trip are safe to requeue — no goods collected.
   */
  const cancellableOrderCount =
    item?.orderIds?.length ?? (item?.orderId ? 1 : 0)

  // ── Initialise selected stop ───────────────────────────────────────────────

  useEffect(() => {
    if (!item) return
    const firstActive = item.stops.find(
      (s) => s.status === 'PENDING' || s.status === 'IN_PROGRESS',
    )
    setSelectedStopId(firstActive?.id ?? item.stops[0]?.id ?? null)
  }, [item])

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMobilePanelOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Cancel handler ─────────────────────────────────────────────────────────

  const handleCancelTrip = (reason: string) => {
    if (!item || !canCancel) return

    const cancellationInfo: CancellationInfo = {
      cancelledBy: dispatcherId as string,
      cancelledAt: new Date().toISOString(),
      reason,
    }

    // TODO: PATCH /trips/:tripId/cancel { cancellationInfo }
    // Server cascade:
    //   trip.status           → CANCELLED
    //   trip.cancellationInfo → cancellationInfo
    //   each order on trip    → PENDING (back to unassigned pool)
    //   each stop on trip     → SKIPPED { code: 'DISPATCHER_SKIP' }

    console.log('[CancelTrip]', cancellationInfo)

    toast.success(`Trip ${item.reference} cancelled.`, {
      description: `${cancellableOrderCount} order${cancellableOrderCount > 1 ? 's' : ''} returned to the pool.`,
    })

    setCancelDialogOpen(false)
  }

  // ── Guard ──────────────────────────────────────────────────────────────────

  if (!item) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <StatePlaceholder
          icon={Navigation2}
          title="Tracking not found"
          description="The tracking item you're looking for doesn't exist or has been removed."
          buttonLabel="Back to tracking"
          onAction={() =>
            navigate({
              to: '/apps/$companyId/tracking',
              params: { companyId },
            })
          }
        />
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col w-full overflow-hidden bg-background">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'flex items-center gap-4 px-3 shrink-0 z-30',
          'bg-card/95 backdrop-blur-sm border-b border-border/60',
          'h-12 md:h-11',
        )}
      >
        {/* Back + reference */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <BackButton
            fallbackTo="/apps/$companyId/tracking"
            params={{ companyId }}
          />
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-semibold tracking-tight truncate">
              {item.reference}
            </h1>
            <span className="hidden xs:block">
              <StatusBadge status={item.status} variant="trip" />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center w-32 md:w-44">
          <TripProgressBar item={item} />
        </div>

        {/* Driver chip */}
        <div className="hidden md:flex items-center">
          <DriverChip item={item} />
        </div>

        {/* Cancel button — only rendered when status === ASSIGNED */}
        {canCancel && (
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<Ban size={14} />}
            className="hidden sm:flex"
            onClick={() => setCancelDialogOpen(true)}
          >
            Cancel trip
          </Button>
        )}

        {/* Share */}
        <div className="flex-shrink-0">
          <ShareTrackingButton trackingId={trackingId} />
        </div>
      </motion.header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className={cn(
            'hidden lg:flex flex-col',
            'w-80 xl:w-96 shrink-0',
            'border-r border-border/50 bg-card',
            'h-full',
          )}
        >
          {/* Cancel button in sidebar for desktop when header is too narrow */}
          {canCancel && (
            <div className="px-3 pt-3">
              <Button
                variant="destructive"
                size="sm"
                leftIcon={<Ban size={14} />}
                className="w-full lg:hidden"
                onClick={() => setCancelDialogOpen(true)}
              >
                Cancel trip
              </Button>
            </div>
          )}

          <SidePanelContent
            item={item}
            selectedStopId={selectedStopId}
            onStopClick={setSelectedStopId}
          />
        </motion.aside>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className={cn('flex-1 min-h-0 relative', 'pb-[5.5rem] lg:pb-0')}
        >
          <MapPanel
            trackingItem={item}
            authToken=""
            highlightedStopId={selectedStopId}
          />
        </motion.div>

        {/* Mobile bottom sheet */}
        <div className="lg:hidden">
          <MobileBottomSheet
            item={item}
            selectedStopId={selectedStopId}
            onStopClick={setSelectedStopId}
            open={mobilePanelOpen}
            onToggle={() => setMobilePanelOpen((v) => !v)}
          />
        </div>
      </div>

      {/* ── Cancel dialog ── */}
      <CancelTripDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelTrip}
        orderCount={cancellableOrderCount}
      />
    </div>
  )
}
