import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pen, Truck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { mockVehicleDetails } from '@/data/fleets'
import { avatarClass } from '@/utils/avatar-styles'
import { VehicleOverviewTab } from '@/components/fleets/VehicleOverviewTab'
import { VehicleHistoryTab } from '@/components/fleets/VehicleHistoryTab'
import { cn } from '@/lib/utils'
import StatePlaceholder from '@/components/StatePlaceholder'
import { BackButton } from '../BackButton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { EditVehicleSheet } from './EditVehicleSheet'

export default function VehicleDetail() {
  const { vehicleId, companyId } = useParams({
    from: '/apps/$companyId/fleets/$vehicleId/',
  })
  const navigate = useNavigate()
  const vehicle = mockVehicleDetails.find((v) => v.id === vehicleId)

  if (!vehicle) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <StatePlaceholder
          icon={Truck}
          title="Vehicle not found"
          description="We couldn't find the vehicle you're looking for. It may have been removed or the link is incorrect."
          buttonLabel="Back to fleets"
          onAction={() =>
            navigate({ to: '/apps/$companyId/fleets', params: { companyId } })
          }
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button and basic info */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-0 items-start justify-between">
        <motion.div
          className="flex items-start justify-between mb-8"
          {...motionPresets.slideUp}
        >
          <div className="flex items-center gap-4">
            <BackButton
              fallbackTo="/apps/$companyId/fleets"
              params={{ companyId }}
            />
            <Avatar className="h-14 w-14 md:h-20 md:w-20">
              <AvatarImage src={vehicle.imageUrl} className="object-cover" />
              <AvatarFallback>
                <Truck />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                {vehicle.model}
              </h1>
              <p className="text-sm text-muted-foreground">
                {vehicle.plateNumber}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge
                  status={vehicle.status}
                  variant="vehicle"
                  size="sm"
                />
                <StatusBadge
                  status={vehicle.availability}
                  variant="vehicle"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div {...motionPresets.slideUp} className="w-full md:w-fit">
          <EditVehicleSheet vehicle={vehicle} />
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList
          className="w-full flex flex-nowrap overflow-x-auto md:grid md:grid-cols-2 md:overflow-visible gap-2 lg:w-fit"
          variant="line"
        >
          <TabsTrigger
            value="overview"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Trip History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <VehicleOverviewTab vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <VehicleHistoryTab vehicle={vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
