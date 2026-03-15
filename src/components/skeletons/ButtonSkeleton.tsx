import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type ButtonSkeletonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonSkeletonProps {
  size?: ButtonSkeletonSize
  quantity?: number
  className?: string
  gap?: string
}

const heightMap: Record<ButtonSkeletonSize, string> = {
  xs: 'h-7',
  sm: 'h-9',
  md: 'h-10',
  lg: 'h-11',
}

const widthMap: Record<ButtonSkeletonSize, string> = {
  xs: 'md:w-20',
  sm: 'md:w-28',
  md: 'md:w-32',
  lg: 'md:w-40',
}

export function ButtonSkeleton({
  size = 'sm',
  quantity = 1,
  className,
  gap = 'gap-2',
}: ButtonSkeletonProps) {
  const skeletons = Array.from({ length: quantity }, (_, i) => (
    <Skeleton
      key={i}
      className={cn(
        'rounded-md',
        heightMap[size],
        'w-full',
        widthMap[size],
        className,
      )}
    />
  ))

  if (quantity === 1) return skeletons[0]

  return (
    <motion.div
      className={cn('flex flex-col md:flex-row', gap, 'w-full md:w-fit')}
      {...motionPresets.fade}
    >
      {skeletons}
    </motion.div>
  )
}
