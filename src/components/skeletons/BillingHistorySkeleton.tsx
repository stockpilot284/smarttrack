import { Skeleton } from '../ui/skeleton'

export default function BillingHistorySkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12" />
        <Skeleton className="w-60 h-8 " />
      </div>

      <Skeleton className="w-full h-100" />
    </div>
  )
}
