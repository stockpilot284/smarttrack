import ImportOrdersModal from '@/components/orders/ImportOrdersModal'
import Orders from '@/components/orders/Orders'
import PageHeader from '@/components/PageHeader'
import { ButtonSkeleton } from '@/components/skeletons/ButtonSkeleton'
import OrdersTableSkeleton from '@/components/skeletons/OrdersTableSkeleton'
import { Button } from '@/components/ui/button'
import { motionPresets } from '@/lib/motion-presets'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/apps/$companyId/orders/')({
  component: OrdersRoute,
})

function OrdersRoute() {
  const navigate = useNavigate()
  const { companyId } = Route.useParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function simulateFetch() {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }

    simulateFetch()
  }, [])

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
          <PageHeader title="Orders" description={'Loading orders data...'} />

          {/** CTA Actions */}
          <ButtonSkeleton quantity={2} />
        </div>

        <OrdersTableSkeleton />
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Orders"
          description={'Manage and track all delivery orders.'}
        />

        {/** CTA Actions */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center gap-3"
          {...motionPresets.inViewFadeUp}
        >
          <ImportOrdersModal />
          <Button
            leftIcon={<Plus size={14} />}
            size={'sm'}
            onClick={() =>
              navigate({
                to: '/apps/$companyId/orders/create',
                params: { companyId },
              })
            }
          >
            Create Order
          </Button>
        </motion.div>
      </div>

      <Orders />
    </div>
  )
}
