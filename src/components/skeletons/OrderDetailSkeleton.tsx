import { Skeleton } from '../ui/skeleton'
import { ButtonSkeleton } from './ButtonSkeleton'

export default function OrderDetailSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-8">
      {/** Header */}
      <div className="flex flex-col gap-8 md:gap-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12" />
          <Skeleton className="w-60 h-8 " />
        </div>

        <ButtonSkeleton quantity={2} />
      </div>

      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <Skeleton className="w-full h-48 md:h-100" />
        <Skeleton className="w-full h-48 lg:h-100" />
      </section>

      <section className="flex gap-8 xl:gap-4 flex-1 flex-col xl:flex-row">
        <Skeleton className="w-full h-48 md:h-80" />
        <Skeleton className="w-full h-48 lg:h-80" />
      </section>

      <Skeleton className="w-full h-48 lg:h-55" />
    </div>
  )
}
