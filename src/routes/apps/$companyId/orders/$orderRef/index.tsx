import { createFileRoute, Link } from '@tanstack/react-router'
import { mockRecentOrders, orders } from '@/data/orders'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import OrderKpiOverview from '@/components/orders/OrderKpiOverview'
import {
  Clock,
  Timer,
  Activity,
  ArrowLeft,
  Package,
  PackageSearch,
} from 'lucide-react'
import { DeliveryTimeline } from '@/components/orders/DeliveryTimeline'
import { Order, OrderStatus } from '@/types/order.type'
import OrderInformation from '@/components/orders/OrderInformation'
import PickupDropoffDetails from '@/components/orders/PickupDropoffDetails'
import AssignmentScheduleCard from '@/components/orders/AssignmentSchedule'
import OrderItemsCard from '@/components/orders/OrderItems'
import { ButtonSkeleton } from '@/components/skeletons/ButtonSkeleton'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import StatePlaceholder from '@/components/StatePlaceholder'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orderRef, companyId } = Route.useParams()
  const order = orders.find((o) => o.orderReference === orderRef) as Order
  const [isLoading, setIsLoading] = useState(true)
  const navigate = Route.useNavigate()

  useEffect(() => {
    async function simulateFetch() {
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve('hello')
        }, 1000),
      )

      setIsLoading(false)
    }

    simulateFetch()
  }, [])

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

  return (
    <div className="py-6 flex flex-col gap-8">
      {/** */}
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row md:items-center md:justify-between">
        {/** Breadcrumb & OrderRef */}
        <motion.div {...motionPresets.inViewFadeUp}>
          {/** Breadccrumb */}
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

          {/** Order Reference */}
          <div className="text-xl font-medium flex items-center gap-2">
            <span>OrderRef:</span>
            <span>{orderRef}</span>
          </div>
        </motion.div>

        {/** CTA Buttons */}
        {!isLoading ? (
          <motion.div
            className="flex flex-col  md:flex-row md:items-center gap-2"
            {...motionPresets.inViewFadeUp}
          >
            {[OrderStatus.CREATED, OrderStatus.ASSIGNED].includes(
              order.status as OrderStatus,
            ) && (
              <Button variant={'destructive'} size={'sm'}>
                Cancel Order
              </Button>
            )}

            <Button variant={'default'} size={'sm'}>
              <Link
                to={'/apps/$companyId/orders/$orderRef/edit'}
                params={{
                  companyId,
                  orderRef,
                }}
              >
                Edit Order
              </Link>
            </Button>
          </motion.div>
        ) : (
          <ButtonSkeleton quantity={2} size="sm" fullWidth />
        )}
      </div>

      {/* <OrderKpiOverview kpis={kpis} /> */}

      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <OrderInformation
          customerName={order.customerName}
          customerEmail={order.customerEmail}
          customerPhone={order.customerPhone}
          orderLabel={order.orderLabel}
          externalReference={order.externalReference}
          status={order.status}
          deliveryTiming={order.deliveryTiming}
          packageWeight={order.packageWeight}
          deliveryNotes={order.deliveryNotes}
          createdAt={order.createdAt}
          scheduledPickupAt={order.scheduledPickupAt}
          estimatedArrival={order.estimatedArrival}
          isLoading={isLoading}
        />
        <PickupDropoffDetails
          pickupLocation={order.pickupLocation}
          pickupContactName={order.pickupContactName}
          pickupContactPhone={order.pickupContactPhone}
          dropoffLocation={order.dropoffLocation}
          recipientName={order.recipientName}
          recipientPhone={order.recipientPhone}
          isLoading={isLoading}
        />
      </section>

      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <AssignmentScheduleCard
          driverName="Kwame Mensah"
          driverPhone="+233 55 321 8890"
          scheduledPickupAt="2026-02-16T10:30:00Z"
          estimatedArrival="2026-02-16T13:15:00Z"
          isLoading={isLoading}
        />

        <DeliveryTimeline
          isLoading={isLoading}
          currentStatus={OrderStatus.IN_TRANSIT}
          events={[
            { status: OrderStatus.CREATED, timestamp: '2026-02-16 10:00 AM' },
            { status: OrderStatus.ASSIGNED, timestamp: '2026-02-16 10:30 AM' },
            { status: OrderStatus.PICKED_UP, timestamp: '2026-02-16 11:00 AM' },
            {
              status: OrderStatus.IN_TRANSIT,
              timestamp: '2026-02-16 11:45 AM',
            },
            { status: OrderStatus.DELIVERED, timestamp: '2026-02-16 12:30 PM' },
          ]}
        />
      </section>

      <section className="flex-1 ">
        <OrderItemsCard
          isLoading={isLoading}
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
    </div>
  )
}
