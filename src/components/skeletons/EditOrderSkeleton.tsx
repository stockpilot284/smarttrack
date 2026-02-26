import PageHeaderSkeleton from './PageHeaderSkeleton'
import { Skeleton } from '../ui/skeleton'

export default function EditOrderSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <PageHeaderSkeleton />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
      <Skeleton className="w-full h-60" />
    </div>
  )
}
