// components/billing/ChangePlanSheet.tsx
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plan, PlanName, PlanFeatures } from '@/lib/store/zustand'
import { toast } from 'sonner'

// Feature labels (same as used in PlanFeatures component)
const featureLabels: Record<keyof PlanFeatures, string> = {
  orderCreation: 'Order creation',
  orderAssignment: 'Order assignment',
  basicLiveTracking: 'Basic live tracking',
  basicAlerts: 'Basic alerts',
  deliveryStatusUpdates: 'Delivery status updates',
  basicDashboard: 'Basic dashboard',
  advancedLiveTracking: 'Advanced live tracking',
  etaCalculation: 'ETA calculation',
  routeDisplay: 'Route display',
  realTimeAlerts: 'Real‑time alerts',
  driverPerformanceDashboard: 'Driver performance dashboard',
  trackingLinkSharing: 'Tracking link sharing',
  deliveryTimeline: 'Delivery timeline',
  orderHistory: 'Order history',
  alertAcknowledgments: 'Alert acknowledgments',
  archiveRecovery: 'Archive recovery',
  routeOptimization: 'Route optimization',
  driverAvailabilitySystem: 'Driver availability system',
  vehicleManagement: 'Vehicle management',
  orderScheduling: 'Order scheduling',
  trackingSessionReplay: 'Tracking session replay',
  exportReports: 'Export reports',
  webhookIntegrations: 'Webhook integrations',
  apiAccess: 'API access',
  bulkImportOrders: 'Bulk import orders', // added
}

// Define which feature keys are enabled for each plan
const planFeatureKeys: Record<PlanName, Array<keyof PlanFeatures>> = {
  FREE: [
    'orderCreation',
    'orderAssignment',
    'basicLiveTracking',
    'basicAlerts',
    'deliveryStatusUpdates',
    'basicDashboard',
  ],
  GROWTH: [
    'orderCreation',
    'orderAssignment',
    'basicLiveTracking',
    'basicAlerts',
    'deliveryStatusUpdates',
    'basicDashboard',
    'advancedLiveTracking',
    'etaCalculation',
    'routeDisplay',
    'realTimeAlerts',
    'driverPerformanceDashboard',
    'trackingLinkSharing',
    'deliveryTimeline',
    'orderHistory',
    'alertAcknowledgments',
    'archiveRecovery',
    'bulkImportOrders', // added
  ],
  PRO: [
    'orderCreation',
    'orderAssignment',
    'basicLiveTracking',
    'basicAlerts',
    'deliveryStatusUpdates',
    'basicDashboard',
    'advancedLiveTracking',
    'etaCalculation',
    'routeDisplay',
    'realTimeAlerts',
    'driverPerformanceDashboard',
    'trackingLinkSharing',
    'deliveryTimeline',
    'orderHistory',
    'alertAcknowledgments',
    'archiveRecovery',
    'routeOptimization',
    'driverAvailabilitySystem',
    'vehicleManagement',
    'orderScheduling',
    'trackingSessionReplay',
    'exportReports',
    'webhookIntegrations',
    'apiAccess',
    'bulkImportOrders', // added
  ],
}

// Compute extra features for GROWTH and PRO
const growthExtra = planFeatureKeys.GROWTH.filter(
  (key) => !planFeatureKeys.FREE.includes(key),
)
const proExtra = planFeatureKeys.PRO.filter(
  (key) => !planFeatureKeys.GROWTH.includes(key),
)

const planPrices: Record<PlanName, string> = {
  FREE: '$0',
  GROWTH: '$29',
  PRO: '$99',
}

interface ChangePlanSheetProps {
  currentPlan: Plan
  onPlanChange: (newPlanName: PlanName) => void
}

export function ChangePlanSheet({
  currentPlan,
  onPlanChange,
}: ChangePlanSheetProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanName | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const handleConfirm = () => {
    if (selectedPlan) {
      onPlanChange(selectedPlan)
      toast.success(`Plan changed to ${selectedPlan}`)
      setSelectedPlan(null)
      setConfirmOpen(false)
      setOpen(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full md:w-fit">
          Change Plan
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Change your plan</SheetTitle>
          <SheetDescription>
            Select a new plan that fits your needs. You can change or cancel at
            any time.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* FREE Plan */}
          <Card
            className={`p-4 cursor-pointer transition-colors ${
              selectedPlan === 'FREE'
                ? 'ring-2 ring-primary'
                : currentPlan.name === 'FREE'
                  ? 'border-2 border-muted'
                  : 'border border-border'
            }`}
            onClick={() => setSelectedPlan('FREE')}
          >
            <div className="flex justify-between items-start">
              <Badge
                variant={currentPlan.name === 'FREE' ? 'secondary' : 'outline'}
                className="mb-2"
              >
                FREE
              </Badge>
              {currentPlan.name === 'FREE' && (
                <span className="text-xs text-muted-foreground">Current</span>
              )}
            </div>
            <p className="text-2xl font-bold">{planPrices.FREE}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {planFeatureKeys.FREE.map((key) => (
                <li key={key} className="flex items-start gap-1">
                  <span className="text-green-500">✓</span>
                  {featureLabels[key]}
                </li>
              ))}
            </ul>
          </Card>

          {/* GROWTH Plan */}
          <Card
            className={`p-4 cursor-pointer transition-colors ${
              selectedPlan === 'GROWTH'
                ? 'ring-2 ring-primary'
                : currentPlan.name === 'GROWTH'
                  ? 'border-2 border-muted'
                  : 'border border-border'
            }`}
            onClick={() => setSelectedPlan('GROWTH')}
          >
            <div className="flex justify-between items-start">
              <Badge
                variant={
                  currentPlan.name === 'GROWTH' ? 'secondary' : 'outline'
                }
                className="mb-2"
              >
                GROWTH
              </Badge>
              {currentPlan.name === 'GROWTH' && (
                <span className="text-xs text-muted-foreground">Current</span>
              )}
            </div>
            <p className="text-2xl font-bold">{planPrices.GROWTH}</p>
            <div className="mt-4 text-sm">
              <p className="font-medium">Everything in FREE, plus:</p>
              <ul className="mt-2 space-y-1">
                {growthExtra.map((key) => (
                  <li key={key} className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    {featureLabels[key]}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* PRO Plan */}
          <Card
            className={`p-4 cursor-pointer transition-colors ${
              selectedPlan === 'PRO'
                ? 'ring-2 ring-primary'
                : currentPlan.name === 'PRO'
                  ? 'border-2 border-muted'
                  : 'border border-border'
            }`}
            onClick={() => setSelectedPlan('PRO')}
          >
            <div className="flex justify-between items-start">
              <Badge
                variant={currentPlan.name === 'PRO' ? 'secondary' : 'outline'}
                className="mb-2"
              >
                PRO
              </Badge>
              {currentPlan.name === 'PRO' && (
                <span className="text-xs text-muted-foreground">Current</span>
              )}
            </div>
            <p className="text-2xl font-bold">{planPrices.PRO}</p>
            <div className="mt-4 text-sm">
              <p className="font-medium">Everything in GROWTH, plus:</p>
              <ul className="mt-2 space-y-1">
                {proExtra.map((key) => (
                  <li key={key} className="flex items-start gap-1">
                    <span className="text-green-500">✓</span>
                    {featureLabels[key]}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedPlan(null)
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!selectedPlan || selectedPlan === currentPlan.name}
          >
            Continue
          </Button>
        </SheetFooter>

        {/* Confirmation dialog */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm plan change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change to the {selectedPlan} plan? Your
                next invoice will reflect the new price. This action can be
                changed later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} asChild>
                <Button variant="default" size="sm">
                  Confirm
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  )
}
