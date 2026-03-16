import { Skeleton } from '@/components/ui/skeleton'

export default function DriverDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <Skeleton className="h-10 w-10 rounded-md" />
          {/* Avatar */}
          <Skeleton className="h-14 w-14 md:h-20 md:w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            {/* Driver name */}
            <Skeleton className="h-8 w-48 md:h-9 md:w-64" />
            {/* Status badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4" />
                ))}
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex flex-nowrap overflow-x-auto gap-2 pb-2  md:overflow-visible">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 md:w-40  rounded-md" />
        ))}
      </div>

      {/* Content card skeleton */}
      <Skeleton className="w-full h-80 " />
    </div>
  )
}
