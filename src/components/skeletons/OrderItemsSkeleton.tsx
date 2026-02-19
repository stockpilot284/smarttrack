import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'

export function OrderItemsSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <SectionHeaderSkeleton />

      <div className="space-y-3 grid grid-cols-1 grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2">
        {/* Items */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between gap-4 rounded-md border border-border/30 p-4 "
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-8 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  )
}
