import { useParams, useNavigate } from '@tanstack/react-router'
import { UserX } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/StatusBadge'
import { mockDriverDetails } from '@/data/drivers'
import { avatarClass } from '@/utils/avatar-styles'
import { OverviewTab } from './OverviewTab'
import { VehicleTab } from './VehicleTab'
import { HistoryTab } from './HistoryTab'
import { cn } from '@/lib/utils'
import StatePlaceholder from '../StatePlaceholder'
import { BackButton } from '../BackButton'
import { Rating } from '../Rating'
import { ActivityAndNotesTab } from './Activity&NotesTab'
import { useAppStore } from '@/lib/store/zustand'
import { useState } from 'react'

export default function DriverDetail() {
  const { driverId, companyId } = useParams({
    from: '/apps/$companyId/drivers/$driverId/',
  })

  const navigate = useNavigate()
  const [driver, setDriver] = useState(
    mockDriverDetails.find((d) => d.id === driverId),
  )
  const currentUser = useAppStore((state) => state.user)

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

  const handleAddNote = (content: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author: currentUser?.fullName || 'Unknown',
    }
    setDriver((prev) => ({
      ...prev!,
      notes: [newNote, ...(prev?.notes || [])],
    }))
    // In a real app, you would also POST to an API here
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button and basic info */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <BackButton
            fallbackTo="/apps/$companyId/drivers"
            params={{ companyId }}
          />
          <Avatar className="h-14 w-14 md:h-20 md:w-20">
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
              <StatusBadge status={driver.status} variant="driver" size="sm" />
              <StatusBadge
                status={driver.availability}
                variant="default"
                size="sm"
              />
            </div>
            {driver.rating !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <Rating
                  value={driver.rating}
                  precision={0.5}
                  size={16}
                  readOnly // set to false if editing allowed
                  // onChange={(newRating) => handleRatingChange(newRating)}
                />
                <span className="text-xs text-muted-foreground">
                  {driver.rating.toFixed(1)}
                </span>
              </div>
            )}
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
            value="activity&notes"
            className="flex-shrink-0 text-xs sm:text-sm"
          >
            Notes & Activity
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

        <TabsContent value="activity&notes" className="space-y-4">
          <ActivityAndNotesTab driver={driver} onAddNote={handleAddNote} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
