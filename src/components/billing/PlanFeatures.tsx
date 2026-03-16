import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { Plan } from '@/lib/store/zustand'

const featureLabels: Record<string, string> = {
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
}

interface PlanFeaturesProps {
  plan: Plan
}

export function PlanFeatures({ plan }: PlanFeaturesProps) {
  const features = Object.entries(plan.features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => featureLabels[key] || key)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Included Features</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              {feat}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
