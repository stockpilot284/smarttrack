import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
import { Skeleton } from '../ui/skeleton'

export default function PageHeaderSkeleton() {
  return (
    <motion.div className="flex flex-col gap-3" {...motionPresets.fade}>
      <Skeleton className="h-8 w-25 " />
      <Skeleton className="h-3 w-60 " />
    </motion.div>
  )
}
