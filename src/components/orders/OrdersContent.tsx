import { useNavigate, useParams } from '@tanstack/react-router'
import React, { useState } from 'react'
import PageHeader from '../PageHeader'
import { motion } from 'framer-motion'
import ImportOrdersSheet from './ImportOrdersSheet'
import { motionPresets } from '@/lib/motion-presets'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import Orders from './Orders'
import { useAppStore } from '@/lib/store/zustand'

// Placeholder hook – replace with your actual data fetching logic
const useOrdersCount = () => {
  // This should return the current number of orders (e.g., from API or store)
  // For now, return a mock value (e.g., 20)
  return 10
}

export default function OrdersContent() {
  const navigate = useNavigate()
  const { companyId } = useParams({ from: '/apps/$companyId' })
  const plan = useAppStore((state) => state.plan)
  const openUpgradeModal = useAppStore((state) => state.openUpgradeModal)
  const ordersCount = useOrdersCount() // replace with real data

  const handleCreateOrder = () => {
    const maxOrders = plan.limits.maxOrdersPerMonth
    if (maxOrders !== undefined && ordersCount >= maxOrders) {
      openUpgradeModal({
        limitName: 'maxOrdersPerMonth',
        currentValue: ordersCount,
        maxValue: maxOrders,
      })
      return
    }
    navigate({
      to: '/apps/$companyId/orders/create',
      params: { companyId },
    })
  }

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
          {...motionPresets.slideUp}
        >
          <ImportOrdersSheet />
          <Button
            leftIcon={<Plus size={14} />}
            size={'sm'}
            onClick={handleCreateOrder}
          >
            Create Order
          </Button>
        </motion.div>
      </div>

      <Orders />
    </div>
  )
}
