import { orders } from '@/data/orders'
import { Order, OrderStatus } from '@/types/order.type'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import React, { useState } from 'react'
import StatePlaceholder from '../StatePlaceholder'
import { PackageSearch, FileCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { Button } from '../ui/button'
import OrderInformation from './OrderInformation'
import PickupDropoffDetails from './PickupDropoffDetails'
import AssignmentScheduleCard from './AssignmentSchedule'
import { DeliveryTimeline } from './DeliveryTimeline'
import OrderItems from './OrderItems'
import { Card, CardContent } from '../ui/card'
import { useAppStore } from '@/lib/zustand/zustand'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

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

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <StatePlaceholder
          title="Order not found"
          description="We couldn’t find the order you’re looking for. It may have been deleted or the link is incorrect."
          buttonLabel="Back to orders"
          icon={PackageSearch}
          onAction={() =>
            navigate({
              to: '/apps/$companyId/orders',
              params: { companyId },
            })
          }
        />
      </div>
    )
  }

  // Mock proof data for demonstration
  const mockProof =
    order.status === 'DELIVERED' ? { type: 'signature', url: '#' } : null
  const proof = order.proofOfDelivery || mockProof

  // Check if cancellation is allowed
  const canCancel = (() => {
    if (!allowOrderCancellation) return false
    if (!['CREATED'].includes(order.status as string)) return false
    if (cancellationWindowMinutes && order.createdAt) {
      const createdAt = new Date(order.createdAt).getTime()
      const now = Date.now()
      const windowMs = cancellationWindowMinutes * 60 * 1000
      return now - createdAt <= windowMs
    }
    return true
  })()

  const handleCancel = () => {
    console.log('Cancelling order', orderRef)
    toast.success(`Order ${orderRef} has been cancelled.`, {
      description: 'The customer has been notified.',
    })
    setIsCancelDialogOpen(false)
  }

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Header with breadcrumb and actions */}
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row md:items-center md:justify-between">
        <motion.div {...motionPresets.inViewFadeUp}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/apps/$companyId/orders" params={{ companyId }}>
                    Orders
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/apps/$companyId/orders/$orderRef"
                    params={{ orderRef, companyId }}
                    className="text-foreground"
                  >
                    {orderRef}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="text-xl font-medium flex items-center gap-2 mt-2">
            <span>OrderRef:</span>
            <span>{orderRef}</span>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row md:items-center gap-2"
          {...motionPresets.inViewFadeUp}
        >
          {allowOrderCancellation &&
            ['CREATED'].includes(order.status as string) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-block">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsCancelDialogOpen(true)}
                        disabled={!canCancel}
                      >
                        Cancel Order
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!canCancel && cancellationWindowMinutes && (
                    <TooltipContent>
                      <p>
                        Cancellation window of {cancellationWindowMinutes}{' '}
                        minutes has expired
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          <Button variant="default" size="sm">
            <Link
              to={'/apps/$companyId/orders/$orderRef/edit'}
              params={{ companyId, orderRef }}
            >
              Edit Order
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* First row: Order info + pickup/dropoff */}
      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <OrderInformation
          customerName={order.customerName}
          customerEmail={order.customerEmail}
          customerPhone={order.customerPhone}
          priority={order.priority}
          orderLabel={order.orderLabel}
          externalReference={order.externalReference}
          status={order.status}
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

      {/* Second row: Assignment + Timeline */}
      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <AssignmentScheduleCard
          driverName="Kwame Mensah"
          driverPhone="+233 55 321 8890"
          scheduledPickupAt="2026-02-16T10:30:00Z"
          estimatedArrival="2026-02-16T13:15:00Z"
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
              id: '3',
              status: 'PICKED_UP',
              message: 'Package picked up',
              timestamp: '2026-02-16 11:00 AM',
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

      {/* Proof of Delivery Card */}
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

      {/* Items section */}
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

      {/* Cancellation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The order will be cancelled and the
              customer will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
