import React from 'react'
import PageHeaderSkeleton from './PageHeaderSkeleton'
import { Skeleton } from '../ui/skeleton'

export default function BillingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column – plan and usage */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="w-full h-60" />
          <Skeleton className="w-full h-50" />
          <Skeleton className="w-full h-50" />
        </div>
        {/* Right column – payment and history */}
        <div className="space-y-6 flex flex-col">
          <Skeleton className="w-full h-60" />
          <Skeleton className="w-full flex-1" />
          <Skeleton className="w-full flex-1" />
        </div>
      </div>
    </div>
  )
}
