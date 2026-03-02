import React from 'react'
import PageHeaderSkeleton from './PageHeaderSkeleton'
import { ButtonSkeleton } from './ButtonSkeleton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Skeleton } from '../ui/skeleton'
import KpiSkeleton from './KpiSkeleton'

export default function DriversSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeaderSkeleton />

        {/** CTA Actions */}
        <ButtonSkeleton />
      </div>

      <KpiSkeleton />

      {/** Table Skeleton */}
      <div className="flex-1">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}
