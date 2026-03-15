import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { InfoHighlight, InfoRow } from '@/components/InfoHighlights'
import { DriverDetail } from '@/types/driver.type'
import { format } from 'date-fns'
import { User } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

interface OverviewTabProps {
  driver: DriverDetail
}

export function OverviewTab({ driver }: OverviewTabProps) {
  return (
    <motion.div {...motionPresets.inViewFadeUp}>
      <Card className="h-full">
        <CardHeader>
          <SectionHeader title="Driver Overview" icon={User} />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* KPI / Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoHighlight
              label="Status"
              value={driver.status.replace('_', ' ').toLowerCase()}
            />
            <InfoHighlight
              label="Availability"
              value={driver.availability.replace('_', ' ').toLowerCase()}
            />
            {driver.vehicle && (
              <InfoHighlight
                label="Vehicle"
                value={`${driver.vehicle.model} (${driver.vehicle.plate})`}
              />
            )}
          </div>

          {/* Details list */}
          <div className="divide-y divide-gray-200/80 dark:divide-border border border-border/40 dark:border-border rounded-md">
            <InfoRow label="Email" value={driver.email} />
            <InfoRow label="Phone" value={driver.phone} />
            {driver.emergencyContact && (
              <InfoRow
                label="Emergency Contact"
                value={`${driver.emergencyContact.name} – ${driver.emergencyContact.phone}`}
              />
            )}

            {driver.address && (
              <InfoRow label="Address" value={driver.address} />
            )}
            {driver.licenseNumber && (
              <InfoRow
                label="License"
                value={
                  driver.licenseNumber +
                  (driver.licenseExpiry
                    ? ` (expires ${format(new Date(driver.licenseExpiry), 'PP')})`
                    : '')
                }
              />
            )}
            {/* You can add more fields if desired */}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
