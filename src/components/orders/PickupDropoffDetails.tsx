import { motion } from 'framer-motion'
import { MapPin, ArrowDown } from 'lucide-react'
import { motionPresets } from '@/lib/motion-presets'
import { SelectedLocation } from '@/types/location.type'
import LocationCard from './LocationCard'
import { SectionHeader } from '../SectionHeader'
import PickupDropoffDetailsSkeleton from '../skeletons/PickupDropoffDetailsSkeleton'

interface LocationSectionProps {
  pickupLocation: SelectedLocation | null
  pickupContactName: string
  pickupContactPhone: string

  dropoffLocation: SelectedLocation | null
  recipientName: string
  recipientPhone: string
}

export default function PickupDropoffDetails({
  pickupLocation,
  pickupContactName,
  pickupContactPhone,
  dropoffLocation,
  recipientName,
  recipientPhone,
}: LocationSectionProps) {
  return (
    <motion.div
      className="flex-1 flex flex-col gap-6 p-6 rounded-md bg-card shadow-xs dark:border dark:border-border"
      {...motionPresets.inViewFadeUp}
    >
      {/* Header */}
      <SectionHeader title="Pickup & Dropoff" icon={MapPin} />

      {/* Content */}
      <div className="grid grid-cols-1  gap-6 relative">
        {/* Pickup */}
        <LocationCard
          title="Pickup Location"
          address={pickupLocation?.address}
          contactName={pickupContactName}
          contactPhone={pickupContactPhone}
          accent="bg-purple-500"
        />

        {/* Dropoff */}
        <LocationCard
          title="Dropoff Location"
          address={dropoffLocation?.address}
          contactName={recipientName}
          contactPhone={recipientPhone}
          accent="bg-green-500"
        />
      </div>
    </motion.div>
  )
}
