import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { InfoHighlight, InfoRow } from '@/components/InfoHighlights'
import { Truck, Settings } from 'lucide-react'
import { VehicleDetail } from '@/types/vehicle.type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { StatusBadge } from '../StatusBadge'
import { motionPresets } from '@/lib/motion-presets'

interface VehicleOverviewTabProps {
  vehicle: VehicleDetail
}

export function VehicleOverviewTab({ vehicle }: VehicleOverviewTabProps) {
  const isOverdue =
    vehicle.nextServiceDue && new Date(vehicle.nextServiceDue) < new Date()

  const { companyId } = useParams({
    from: '/apps/$companyId/fleets/$vehicleId/',
  })

  return (
    <motion.div {...motionPresets.slideUp}>
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Vehicle Overview" icon={Truck} />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* KPI / Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoHighlight
              label="Status"
              value={vehicle.status.toLowerCase()}
            />
            <InfoHighlight
              label="Availability"
              value={vehicle.availability.toLowerCase().replace('_', ' ')}
            />
            <InfoHighlight label="Type" value={vehicle.type.toLowerCase()} />
          </div>

          {/* Details list */}
          <div className="divide-y divide-gray-200/80 dark:divide-border border border-border/40 dark:border-border rounded-md">
            <InfoRow label="Model" value={vehicle.model} />
            <InfoRow label="Plate Number" value={vehicle.plateNumber} />
            {vehicle.assignedDriver && (
              <InfoRow
                label="Assigned Driver"
                value={vehicle.assignedDriver.name}
              />
            )}

            {/* Maintenance */}
            <div className="flex items-start gap-3 p-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Last Service</p>
                <p className="text-sm">
                  {vehicle.lastServiceDate
                    ? format(new Date(vehicle.lastServiceDate), 'PP')
                    : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Next Service Due
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    {vehicle.nextServiceDue
                      ? format(new Date(vehicle.nextServiceDue), 'PP')
                      : '—'}
                  </p>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-[10px]">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
