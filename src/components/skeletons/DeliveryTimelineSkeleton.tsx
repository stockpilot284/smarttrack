import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { motionPresets } from '@/lib/motion-presets'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'

export default function DeliveryTimelineSkeleton() {
  return (
    <motion.div
      className="flex flex-col gap-8 p-4 rounded-md bg-background shadow-xs flex-1"
      {...motionPresets.fadeSlide}
    >
      {/* Section Header Skeleton */}
      <SectionHeaderSkeleton />

      {/* Timeline Skeleton */}
      <ul className="relative flex flex-col gap-3 pl-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="flex gap-4 relative">
            {/* Circle + line */}
            <div className="flex flex-col items-center relative">
              <Skeleton className="w-6 h-6 rounded-full" />

              {i !== 5 && <Skeleton className="w-1 h-7 rounded-xs mt-0.5" />}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1 pt-0.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
