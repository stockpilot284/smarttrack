import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'

export default function AssignmentScheduleSkeleton() {
  return (
    <motion.div {...motionPresets.fadeSlide} className="flex-1 ">
      <Card className="relative overflow-hidden  h-full p-6 shadow-xs ">
        {/* Section Header Skeleton */}
        <SectionHeaderSkeleton />

        {/* Content */}
        <div className="grid grid-cols-1 gap-4">
          {/* Assignment Skeleton */}
          <div className="relative rounded-md border border-border/40 bg-background p-5 space-y-4">
            <Skeleton className="absolute right-3 top-3 h-5 w-16 rounded-full" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Schedule Skeleton */}
          <div className="relative rounded-md border border-border/40 bg-background p-5 space-y-4">
            <Skeleton className="absolute right-3 top-3 h-5 w-16 rounded-full" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="space-y-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
