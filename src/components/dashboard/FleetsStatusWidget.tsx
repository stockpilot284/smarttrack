// components/dashboard/FleetStatusWidget.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Truck,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { SectionHeader } from '../SectionHeader'

interface VehicleCounts {
  available: number
  onRoute: number
  maintenance: number
  total: number
}

interface FleetStatusWidgetProps {
  counts: VehicleCounts

  className?: string
}

export function FleetStatusWidget({
  counts,

  className,
}: FleetStatusWidgetProps) {
  const { available, onRoute, maintenance } = counts

  const statusItems = [
    {
      label: 'Available',
      value: available,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'On Route',
      value: onRoute,
      icon: Truck,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Maintenance',
      value: maintenance,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ]

  return (
    <Card className={cn('h-fit lg:h-auto', className)}>
      <div className="px-4">
        <SectionHeader title="Fleets Status" icon={Truck} />
      </div>
      <CardContent className="space-y-4 px-4">
        {/* Status summary */}
        <div className="grid gap-3">
          {statusItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-md bg-muted/70"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-1.5 rounded-full', item.bg)}>
                    <Icon className={cn('h-4 w-4', item.color)} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-base font-bold">{item.value}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
