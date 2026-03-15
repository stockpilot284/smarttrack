import { Skeleton } from '../ui/skeleton'

export default function EditOrderSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12" />
        <div className="space-y-2">
          <Skeleton className="w-40 h-6 " />
          <Skeleton className="w-30 h-4" />
        </div>
      </div>

      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
    </div>
  )
}
