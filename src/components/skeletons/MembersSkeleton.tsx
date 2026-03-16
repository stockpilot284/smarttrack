import KpiSkeleton from './KpiSkeleton'
import { Skeleton } from '../ui/skeleton'
import PageHeaderSkeleton from './PageHeaderSkeleton'
import { ButtonSkeleton } from './ButtonSkeleton'

export default function MembersSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 h-full">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeaderSkeleton />
        <ButtonSkeleton />
      </div>

      <KpiSkeleton />

      <Skeleton className="w-full flex-1" />
    </div>
  )
}
