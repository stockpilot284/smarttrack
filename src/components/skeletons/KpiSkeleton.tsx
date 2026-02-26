import { Skeleton } from '../ui/skeleton'

export default function KpiSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <Skeleton className="w-full h-[132px] rounded-md bg-gray-200/80" />
      <Skeleton className="w-full h-[132px] rounded-md bg-gray-200/80" />
      <Skeleton className="w-full h-[132px] rounded-md bg-gray-200/80" />
      <Skeleton className="w-full h-[132px] rounded-md bg-gray-200/80" />
    </div>
  )
}
