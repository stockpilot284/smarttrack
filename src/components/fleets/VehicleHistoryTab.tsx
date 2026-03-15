// components/vehicles/VehicleHistoryTab.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { History } from 'lucide-react'
import { VehicleDetail } from '@/types/vehicle.type'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'

interface VehicleHistoryTabProps {
  vehicle: VehicleDetail
}

export function VehicleHistoryTab({ vehicle }: VehicleHistoryTabProps) {
  return (
    <Card>
      <CardHeader>
        <SectionHeader title="Recent Trips" icon={History} />
      </CardHeader>
      <CardContent>
        {vehicle.tripHistory && vehicle.tripHistory.length > 0 ? (
          <div className="space-y-3">
            {vehicle.tripHistory.slice(0, 10).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between border-b border-border/50 dark:border-border pb-2 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{trip.destination}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(trip.date), 'PP')} · {trip.driverName}
                  </p>
                </div>
                <Badge
                  variant={
                    trip.status === 'Delivered' ? 'softSuccess' : 'outline'
                  }
                  className="text-xs"
                >
                  {trip.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No trip history</p>
        )}
      </CardContent>
    </Card>
  )
}
