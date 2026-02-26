import { useNavigate, useParams } from '@tanstack/react-router'
import React, { useState } from 'react'
import PageHeader from '../PageHeader'
import { motion } from 'framer-motion'
import ImportOrdersModal from './ImportOrdersModal'
import { motionPresets } from '@/lib/motion-presets'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import Orders from './Orders'

export default function OrdersContent() {
  const navigate = useNavigate()
  const { companyId } = useParams({ from: '/apps/$companyId' })

  return (
    <div className="p-6 h-full flex flex-col">
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
