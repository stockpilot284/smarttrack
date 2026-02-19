import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'
import LocationCardSkeleton from './LocationCardSkeleton'

export default function PickupDropoffDetailsSkeleton() {
  return (
    <motion.div
      className="flex-1 flex flex-col gap-6 p-6 rounded-lg bg-background shadow-xs"
      {...motionPresets.fadeSlide}
    >
      {/* Header */}
      <SectionHeaderSkeleton />

      {/* Content */}
      <div className="grid grid-cols-1  gap-6 relative">
        {/* Pickup */}
        <LocationCardSkeleton />

        {/* Dropoff */}
        <LocationCardSkeleton />
      </div>
    </motion.div>
  )
}
