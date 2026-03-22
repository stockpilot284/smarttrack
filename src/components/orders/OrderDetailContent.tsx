import { orders } from '@/data/orders'
import { Order, OrderStatus } from '@/types/order.type'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import StatePlaceholder from '../StatePlaceholder'
import { PackageSearch, FileCheck, Pen, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Button } from '../ui/button'
import OrderInformation from './OrderInformation'
import PickupDropoffDetails from './PickupDropoffDetails'
import AssignmentScheduleCard from './AssignmentSchedule'
import { DeliveryTimeline } from './DeliveryTimeline'
import OrderItems from './OrderItems'
import { Card, CardContent } from '../ui/card'
import { useAppStore } from '@/lib/store/zustand'
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
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { BackButton } from '../BackButton'

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Which dialog variant is currently open.
 *
 *  idle        — nothing open
 *  safe        — pickup not yet collected; straightforward cancel
 *  warn_pickup — order is IN_TRANSIT, driver already has the goods
 */
type CancelDialogVariant = 'idle' | 'safe' | 'warn_pickup'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PICKUP_COLLECTED_STATUSES: OrderStatus[] = ['IN_TRANSIT']
const CANCELLABLE_STATUSES: OrderStatus[] = [
  'CREATED',
  'ASSIGNED',
  'IN_TRANSIT',
]

// ─── Cancel reason input ──────────────────────────────────────────────────────

/**
 * Shared reason input rendered inside both cancel dialogs.
 * Lifted out so the same component handles both variants without duplication.
 */
function CancelReasonInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5 pt-1">
      <p className="text-xs font-medium text-foreground">
        Reason for cancellation <span className="text-destructive">*</span>
      </p>
      <Input
        placeholder="e.g. Customer requested cancellation, duplicate order…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm"
        autoFocus
      />
      <p className="text-[11px] text-muted-foreground">
        This will be recorded on the order for audit purposes.
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderDetailContent() {
  const { orderRef, companyId } = useParams({
    from: '/apps/$companyId/orders/$orderRef/',
  })

  const order = orders.find((o) => o.orderReference === orderRef) as Order & {
    proofOfDelivery?: { type: string; url: string }
  }

  const navigate = useNavigate()

  const {
    allowOrderCancellation,
    cancellationWindowMinutes,
    requireProofOfDelivery,
  } = useAppStore((state) => state.settings.orderSettings)

  const dispatcherId = useAppStore((state) => state.user.id)

  const [dialogVariant, setDialogVariant] =
    useState<CancelDialogVariant>('idle')
  const [cancelReason, setCancelReason] = useState('')

  // Reset reason whenever the dialog closes
  useEffect(() => {
    if (dialogVariant === 'idle') setCancelReason('')
  }, [dialogVariant])

  // ── Guard ──────────────────────────────────────────────────────────────────

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center w-full">
        <StatePlaceholder
          title="Order not found"
          description="We couldn't find the order you're looking for. It may have been deleted or the link is incorrect."
          buttonLabel="Back to orders"
          icon={PackageSearch}
          onAction={() =>
            navigate({ to: '/apps/$companyId/orders', params: { companyId } })
          }
        />
      </div>
    )
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const mockProof =
    order.status === 'DELIVERED' ? { type: 'signature', url: '#' } : null
  const proof = order.proofOfDelivery ?? mockProof

  const isEditable = order.status === 'CREATED'
  const isTrackable = order.tripId && order.status === 'ASSIGNED'

  const withinCancellationWindow = (() => {
    if (!cancellationWindowMinutes || !order.createdAt) return true
    const elapsed = Date.now() - new Date(order.createdAt).getTime()
    return elapsed <= cancellationWindowMinutes * 60 * 1000
  })()

  const canCancel =
    allowOrderCancellation &&
    CANCELLABLE_STATUSES.includes(order.status as OrderStatus) &&
    withinCancellationWindow

  const pickupAlreadyCollected = PICKUP_COLLECTED_STATUSES.includes(
    order.status as OrderStatus,
  )

  const isReasonValid = cancelReason.trim().length >= 3

  // ── Cancellation state machine ─────────────────────────────────────────────

  function handleCancelClick() {
    setDialogVariant(pickupAlreadyCollected ? 'warn_pickup' : 'safe')
  }

  /**
   * Shared commit path for both dialog variants.
   * `reason` is required — the input enforces at least 3 chars before the
   * action button is enabled.
   */
  function commitCancellation(hadActivePickup: boolean) {
    const cancellation = {
      cancelledBy: dispatcherId,
      cancelledAt: new Date().toISOString(),
      reason: cancelReason.trim(),
      hadActivePickup,
    }

    // TODO: await patchOrder(orderRef, { status: 'CANCELLED', orderCancellation: cancellation })

    toast.success(`Order ${orderRef} cancelled.`, {
      description: hadActivePickup
        ? 'Driver still has the goods — arrange a manual depot return.'
        : 'The customer has been notified.',
    })

    setDialogVariant('idle')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row md:items-center md:justify-between">
        <motion.div
          {...motionPresets.slideUp}
          className="flex items-center gap-4"
        >
          <BackButton
            fallbackTo="/apps/$companyId/orders"
            params={{ companyId }}
          />
          <div className="text-xl font-medium flex items-center gap-2">
            <span>OrderRef:</span>
            <span>{orderRef}</span>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row md:items-center gap-2"
          {...motionPresets.slideUp}
        >
          {canCancel && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-block">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancelClick}
                      className="w-full"
                    >
                      Cancel Order
                    </Button>
                  </span>
                </TooltipTrigger>
                {!withinCancellationWindow && cancellationWindowMinutes && (
                  <TooltipContent>
                    <p>
                      Cancellation window of {cancellationWindowMinutes} minutes
                      has expired
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
          {isEditable && (
            <Button variant="outline" size="sm" leftIcon={<Pen size={14} />}>
              <Link
                to={'/apps/$companyId/orders/$orderRef/edit'}
                params={{ companyId, orderRef }}
              >
                Edit Order
              </Link>
            </Button>
          )}
          {isTrackable && (
            <Button variant="default" size="sm" leftIcon={<MapPin size={14} />}>
              <Link
                to={'/apps/$companyId/tracking/$trackingId'}
                params={{ companyId, trackingId: order.tripId as string }}
              >
                Track
              </Link>
            </Button>
          )}
        </motion.div>
      </div>

      {/* Row 1: order info + pickup/dropoff */}
      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <OrderInformation
          customerName={order.customerName}
          customerEmail={order.customerEmail}
          customerPhone={order.customerPhone}
          priority={order.priority}
          orderLabel={order.orderLabel}
          status={order.status}
          tripId={order.tripId}
          deliveryTiming={order.deliveryTiming}
          packageWeight={order.packageWeight}
          deliveryNotes={order.deliveryNotes}
          createdAt={order.createdAt}
          scheduledPickupAt={order.scheduledPickupAt}
          estimatedArrival={order.estimatedArrival}
        />
        <PickupDropoffDetails
          pickupLocation={order.pickupLocation}
          pickupContactName={order.pickupContactName}
          pickupContactPhone={order.pickupContactPhone}
          dropoffLocation={order.dropoffLocation}
          recipientName={order.recipientName}
          recipientPhone={order.recipientPhone}
        />
      </section>

      {/* Row 2: assignment + timeline */}
      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <AssignmentScheduleCard
          driver={order.driver}
          vehicle={order.vehicle}
          scheduledPickupAt={order.scheduledPickupAt}
          estimatedArrival={order.estimatedArrival}
        />
        <DeliveryTimeline
          events={[
            {
              id: '1',
              status: 'CREATED',
              message: 'Order created',
              timestamp: '2026-02-16 10:00 AM',
            },
            {
              id: '2',
              status: 'ASSIGNED',
              message: 'Assigned to John Doe',
              timestamp: '2026-02-16 10:30 AM',
            },
            {
              id: '4',
              status: 'IN_TRANSIT',
              message: 'En route to destination',
              timestamp: '2026-02-16 11:45 AM',
            },
          ]}
        />
      </section>

      {/* Proof of delivery */}
      {requireProofOfDelivery && (
        <section className="flex-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 dark:bg-accent/40 dark:border dark:border-border">
                  <FileCheck className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium">Proof of Delivery</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.status === 'DELIVERED' ? (
                      proof ? (
                        <>
                          Proof captured ({proof.type})
                          <Button
                            variant="link"
                            size="sm"
                            className="px-0 ml-2 h-auto text-xs"
                            onClick={() => window.open(proof.url, '_blank')}
                          >
                            View
                          </Button>
                        </>
                      ) : (
                        <span className="text-destructive">
                          Required but not provided
                        </span>
                      )
                    ) : (
                      'Proof of delivery will be required upon completion.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Items */}
      <section className="flex-1">
        <OrderItems
          items={[
            {
              id: '1',
              name: 'MacBook Pro',
              quantity: 1,
              description: '16-inch, space gray, fragile',
            },
            {
              id: '2',
              name: 'Legal Documents',
              quantity: 3,
              description: 'Confidential paperwork in envelope',
            },
            {
              id: '3',
              name: 'Clothing Package',
              quantity: 2,
              description: 'Confidential paperwork in envelope',
            },
            {
              id: '4',
              name: 'Clothing Package',
              quantity: 2,
              description: 'Confidential paperwork in envelope',
            },
          ]}
        />
      </section>

      {/* ── Dialog: safe cancel (CREATED / ASSIGNED) ── */}
      <AlertDialog
        open={dialogVariant === 'safe'}
        onOpenChange={(open) => !open && setDialogVariant('idle')}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The order will be cancelled and the
              customer will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <CancelReasonInput value={cancelReason} onChange={setCancelReason} />

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button size="sm" variant="outline">
                Keep order
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!isReasonValid}
              onClick={() => commitCancellation(false)}
              asChild
            >
              <Button size="sm" variant="destructive" disabled={!isReasonValid}>
                Yes, cancel order
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Dialog: warn — driver already has the goods (IN_TRANSIT) ── */}
      <AlertDialog
        open={dialogVariant === 'warn_pickup'}
        onOpenChange={(open) => !open && setDialogVariant('idle')}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Driver already has this order</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  This order is <strong>in transit</strong> — the driver has
                  already collected the goods.
                </p>
                <p>
                  Cancelling now will mark the order as{' '}
                  <strong>CANCELLED</strong>, but the driver must manually
                  return the goods to the depot. No automatic reroute will be
                  triggered.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <CancelReasonInput value={cancelReason} onChange={setCancelReason} />

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button size="sm" variant="outline">
                No, keep order
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={!isReasonValid}
              onClick={() => commitCancellation(true)}
              asChild
            >
              <Button size="sm" variant="destructive" disabled={!isReasonValid}>
                Cancel anyway
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
