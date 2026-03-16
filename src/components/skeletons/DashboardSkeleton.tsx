import React from 'react'
import KpiSkeleton from './KpiSkeleton'
import { Skeleton } from '../ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/** Greeting & Today's Date */}
      <section className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-40 h-[28px]" />
          <Skeleton className="w-60 h-[15px]" />
        </div>

        <Skeleton className="w-30 h-[28px] hidden md:block" />
      </section>

      {/** KPI's */}
      <KpiSkeleton />

      {/** Alerts  & Delivery Performance */}
      <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
        <Skeleton className="w-full lg:w-1/2 h-90" />
        <Skeleton className="w-full lg:w-1/2 h-90" />
      </section>

      {/** Recent Orders */}
      <Skeleton className="w-full h-90" />
    </div>
  )
}
