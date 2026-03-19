import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DriverAvatar } from './DriverAvatar'
import { ProgressIndicator } from './ProgressIndicator'
import { ETABadge } from './ETABadge'
import { TrackingItem } from '@/types/tracking.type'

interface RouteOverviewCardProps {
  item: TrackingItem
}

export function RouteOverviewCard({ item }: RouteOverviewCardProps) {
  const nextStop = item.stops.find((s) => s.status !== 'COMPLETED')
  const completedCount = item.stops.filter(
    (s) => s.status === 'COMPLETED',
  ).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <DriverAvatar driver={item.driver} showStatus size="md" />
          <div>
            <p className="font-medium">{item.driver.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.vehicle.model} ({item.vehicle.plateNumber})
            </p>
          </div>
        </div>
        <ETABadge eta={item.estimatedCompletion} />
      </CardHeader>

      <CardContent className="pb-1">
        <ProgressIndicator
          completed={completedCount}
          total={item.stops.length}
          showFraction
        />
      </CardContent>

      {nextStop && (
        <CardFooter className="pt-0">
          <div className="w-full rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-2">Next stop</p>
            <p className="font-medium mt-1 text-sm">
              {nextStop.type === 'PICKUP' ? 'Pick up from' : 'Deliver to'}{' '}
              {nextStop.contactName}
            </p>
            <p className="text-sm text-muted-foreground truncate mb-2">
              {nextStop.address}
            </p>
            {nextStop.estimatedArrival && (
              <p className="text-xs text-primary mt-1">
                ETA: {new Date(nextStop.estimatedArrival).toLocaleTimeString()}
              </p>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
