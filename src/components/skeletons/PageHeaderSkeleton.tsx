import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
import { Skeleton } from '../ui/skeleton'

export default function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-25 " />
      <Skeleton className="h-3 w-60 " />
    </div>
  )
}
