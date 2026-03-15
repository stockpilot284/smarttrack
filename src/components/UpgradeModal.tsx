// components/UpgradeModal.tsx
import { useMemo } from 'react'
import { useAppStore } from '@/lib/store/zustand'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { PlanLimits, PlanFeatures } from '@/lib/store/zustand'

// Helper to get human‑readable labels for limits
const limitLabels: Record<keyof PlanLimits, string> = {
  maxDrivers: 'drivers',
  maxVehicles: 'vehicles',
  maxOrdersPerMonth: 'orders per month',
  maxAdmins: 'admins',
  maxTotalMembers: 'team members',
}

// Helper to get human‑readable labels for features
const featureLabels: Partial<Record<keyof PlanFeatures, string>> = {
  advancedLiveTracking: 'Advanced Live Tracking',
  etaCalculation: 'ETA Calculation',
  routeDisplay: 'Route Display',
  realTimeAlerts: 'Real‑time Alerts',
  driverPerformanceDashboard: 'Driver Performance Dashboard',
  trackingLinkSharing: 'Tracking Link Sharing',
  deliveryTimeline: 'Delivery Timeline',
  orderHistory: 'Order History',
  alertAcknowledgments: 'Alert Acknowledgments',
  archiveRecovery: 'Archive Recovery',
  routeOptimization: 'Route Optimization',
  driverAvailabilitySystem: 'Driver Availability System',
  vehicleManagement: 'Vehicle Management',
  orderScheduling: 'Order Scheduling',
  trackingSessionReplay: 'Tracking Session Replay',
  exportReports: 'Export Reports',
  webhookIntegrations: 'Webhook Integrations',
  apiAccess: 'API Access',
}

export default function UpgradeModal() {
  // Use individual selectors to avoid creating new objects on each render
  const upgradeModal = useAppStore((state) => state.upgradeModal)
  const closeUpgradeModal = useAppStore((state) => state.closeUpgradeModal)
  const plan = useAppStore((state) => state.plan)
  const companyId = useAppStore((state) => state.company.id)

  const navigate = useNavigate()

  // Memoize title and description to prevent unnecessary recalculations
  const { title, description } = useMemo(() => {
    if (!upgradeModal.isOpen) return { title: '', description: null }

    const { limitName, currentValue, maxValue, featureName } = upgradeModal

    let title = ''
    let description: React.ReactNode = null

    if (limitName) {
      title = 'Plan limit reached'
      const label = limitLabels[limitName] || limitName
      description = (
        <>
          <p>
            You've reached the limit of <strong>{maxValue}</strong> {label} on
            your <strong className="capitalize">{plan.name}</strong> plan.
          </p>
          {currentValue !== undefined && maxValue !== undefined && (
            <p className="mt-2 text-sm text-muted-foreground">
              Current usage: {currentValue} / {maxValue}
            </p>
          )}
        </>
      )
    } else if (featureName) {
      title = 'Upgrade to unlock feature'
      const label = featureLabels[featureName] || featureName
      description = (
        <p>
          The feature <strong>{label}</strong> is not available on your{' '}
          <strong className="capitalize">{plan.name}</strong> plan. Upgrade to
          unlock it and more.
        </p>
      )
    } else {
      title = 'Upgrade required'
      description = (
        <p>
          Your current plan does not support this action. Upgrade to continue.
        </p>
      )
    }

    return { title, description }
  }, [upgradeModal, plan])

  if (!upgradeModal.isOpen) return null

  const handleUpgrade = () => {
    navigate({
      to: '/apps/$companyId/billing',
      params: { companyId },
    })
    if (upgradeModal.onUpgrade) upgradeModal.onUpgrade()
    closeUpgradeModal()
  }

  return (
    <Dialog open={upgradeModal.isOpen} onOpenChange={closeUpgradeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">{description}</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={closeUpgradeModal}
            size={'sm'}
            className="w-full sm:w-auto"
          >
            Not now
          </Button>
          <Button
            onClick={handleUpgrade}
            className="w-full sm:w-auto"
            size={'sm'}
          >
            Upgrade plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
