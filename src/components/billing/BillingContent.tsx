import { useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import PageHeader from '@/components/PageHeader'
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard'
import { UsageSummary } from '@/components/billing/UsageSummary'
import { PlanFeatures } from '@/components/billing/PlanFeatures'
import { PaymentMethods } from '@/components/billing/PaymentMethods'
import { BillingHistory } from '@/components/billing/BillingHistory'
import { DangerZone } from '@/components/billing/DangerZone'
import { useAppStore } from '@/lib/store/zustand'

export default function BillingContent() {
  const { companyId } = useParams({ from: '/apps/$companyId/billing/' })
  const plan = useAppStore((state) => state.plan)
  // Mock usage data – replace with real API later
  const usage = {
    members: { current: 5, limit: plan.limits.maxTotalMembers },
    drivers: { current: 4, limit: plan.limits.maxDrivers },
    vehicles: { current: 3, limit: plan.limits.maxVehicles },
    orders: { current: 12, limit: plan.limits.maxOrdersPerMonth || 20 },
  }

  return (
    <motion.div {...motionPresets.inViewFadeUp} className="p-6 space-y-6">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your plan, payment methods, and billing history."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column – plan and usage */}
        <div className="lg:col-span-2 space-y-6">
          <CurrentPlanCard plan={plan} />
          <UsageSummary usage={usage} />
          <PlanFeatures plan={plan} />
        </div>
        {/* Right column – payment and history */}
        <div className="space-y-6 flex flex-col">
          <PaymentMethods />
          <BillingHistory />
          <DangerZone />
        </div>
      </div>
    </motion.div>
  )
}
