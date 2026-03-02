import PageHeader from '../PageHeader'
import { Skeleton } from '../ui/skeleton'
import PageHeaderSkeleton from './PageHeaderSkeleton'

export default function DispatchSkeleton() {
  return (
    <div className="p-6 h-full flex flex-col gap-8">
      <PageHeaderSkeleton />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Skeleton key={n} className="h-40" />
        ))}
      </div>{' '}
    </div>
  )
}
