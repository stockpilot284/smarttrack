import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, UserX } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { mockDriverDetails } from '@/data/drivers'
import { avatarClass } from '@/utils/avatar-styles'
import { OverviewTab } from './OverviewTab'
import { VehicleTab } from './VehicleTab'
import { HistoryTab } from './HistoryTab'
import { ComplianceTab } from './ComplianceTab'
import { cn } from '@/lib/utils'
import StatePlaceholder from '../StatePlaceholder'

export default function DriverDetail() {
  const { driverId, companyId } = useParams({
    from: '/apps/$companyId/drivers/$driverId/',
  })

  const navigate = useNavigate()
  const driver = mockDriverDetails.find((d) => d.id === driverId)

  if (!driver) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <StatePlaceholder
          icon={UserX}
          title="Driver not found"
          description="We couldn't find the driver you're looking for. They may have been removed or the link is incorrect."
          buttonLabel="Back to drivers"
          onAction={() =>
            navigate({ to: '/apps/$companyId/drivers', params: { companyId } })
          }
        />
      </div>
    )
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header with back button and basic info */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="iconMd" asChild className="group">
            <Link to="/apps/$companyId/drivers" params={{ companyId }}>
              <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          </Button>
          <Avatar className="h-14 w-14 md:h-16 md:w-16">
            <AvatarImage src={driver.imageUrl} className="object-cover" />
            <AvatarFallback
              className={cn(avatarClass(driver.name), 'md:text-2xl')}
            >
              {driver.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{driver.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={driver.status} variant="driver" />
              <StatusBadge status={driver.availability} variant="default" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList
          className="w-full flex flex-nowrap overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible gap-2 lg:w-fit"
          variant="line"
        >
          <TabsTrigger
            value="overview"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="vehicle"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Vehicle & Trip
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            History & Performance
          </TabsTrigger>
          <TabsTrigger
            value="compliance"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Compliance & Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab driver={driver} />
        </TabsContent>

        <TabsContent value="vehicle" className="space-y-4">
          <VehicleTab driver={driver} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistoryTab driver={driver} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceTab driver={driver} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
