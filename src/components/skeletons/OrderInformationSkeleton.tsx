import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Skeleton } from '@/components/ui/skeleton'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'

export function OrderInformationSkeleton() {
  return (
    <motion.div
      className="flex flex-col gap-6 p-6 rounded-lg bg-background shadow-xs"
      {...motionPresets.fadeSlide}
    >
      {/* Header */}
      <SectionHeaderSkeleton />

      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-md border border-border/40 p-4 space-y-2"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>

      {/* Info Rows Skeleton */}
      <div className="border border-border/40 rounded-md divide-y divide-gray-200/80">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 py-3"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full sm:col-span-2" />
          </div>
        ))}

        {/* Notes row (spanning) */}
        <div className="px-4 py-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </motion.div>
  )
}
