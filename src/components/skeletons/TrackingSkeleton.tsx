import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function TrackingSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-8 lg:p-0 lg:gap-0 lg:flex-row lg:h-full bg-background">
      <Skeleton className="w-full lg:rounded-none lg:w-[320px]" darker />
      <Skeleton className="flex-1 rounded-none" />
    </div>
  )
}
