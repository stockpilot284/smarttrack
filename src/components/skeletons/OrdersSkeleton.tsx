import React from 'react'
import PageHeaderSkeleton from './PageHeaderSkeleton'
import { ButtonSkeleton } from './ButtonSkeleton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Skeleton } from '../ui/skeleton'

export default function OrdersSkeleton() {
  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeaderSkeleton />

        {/** CTA Actions */}
        <ButtonSkeleton quantity={2} />
      </div>

      {/** Table Skeleton */}
      <motion.div {...motionPresets.fade} className="flex-1 mt-12">
        <Skeleton className="h-full w-full" />
      </motion.div>
    </div>
  )
}
