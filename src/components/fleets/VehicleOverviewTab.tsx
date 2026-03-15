import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { Truck, User, Calendar, Settings, Tag, Hash, Bike } from 'lucide-react'
import { VehicleDetail } from '@/types/vehicle.type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { StatusBadge } from '../StatusBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { avatarClass } from '@/utils/avatar-styles'

interface VehicleOverviewTabProps {
  vehicle: VehicleDetail
}

export function VehicleOverviewTab({ vehicle }: VehicleOverviewTabProps) {
  const isOverdue =
    vehicle.nextServiceDue && new Date(vehicle.nextServiceDue) < new Date()

  const { companyId } = useParams({
    from: '/apps/$companyId/fleets/$vehicleId/',
  })

  const typeIcons = {
    VAN: <Truck className="h-4 w-4" />,
    TRUCK: <Truck className="h-4 w-4" />,
    PICKUP: <Truck className="h-4 w-4" />,
    BIKE: <Bike className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      {/* Identity & Status Card */}
      <Card className="overflow-hidden">
        <CardHeader>
          <SectionHeader title="Vehicle Details" icon={Truck} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground">Plate Number</p>
                <p className="font-medium">{vehicle.plateNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {typeIcons[vehicle.type] || (
                <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium capitalize">
                  {vehicle.type.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <StatusBadge status={vehicle.status} variant="vehicle" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground mb-1">
                  Availability
                </p>
                <StatusBadge status={vehicle.availability} variant="vehicle" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignment Card */}
      <Card>
        <CardHeader>
          <SectionHeader title="Current Assignment" icon={User} />
        </CardHeader>
        <CardContent>
          {vehicle.assignedDriver ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={vehicle.assignedDriver.imageUrl}
                    alt={vehicle.assignedDriver.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={avatarClass(vehicle.assignedDriver.name)}
                  >
                    {vehicle.assignedDriver.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{vehicle.assignedDriver.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Assigned driver
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Link
                  to="/apps/$companyId/drivers/$driverId"
                  params={{ driverId: vehicle.assignedDriver.id, companyId }}
                >
                  View Driver
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-5 w-5" />
              <p className="text-sm">Not assigned</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Snapshot Card */}
      <Card>
        <CardHeader className="border-b bg-muted/10 pb-3">
          <SectionHeader title="Maintenance" icon={Calendar} />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Last Service</p>
                <p className="font-medium">
                  {vehicle.lastServiceDate
                    ? format(new Date(vehicle.lastServiceDate), 'PP')
                    : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Next Service Due
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">
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

      {/* Actions Card */}
      <Card>
        <CardHeader className="border-b bg-muted/10 pb-3">
          <SectionHeader title="Actions" icon={Settings} />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Edit Details
            </Button>
            <Button variant="destructive" size="sm">
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
