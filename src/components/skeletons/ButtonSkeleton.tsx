import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type ButtonSkeletonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonSkeletonProps {
  size?: ButtonSkeletonSize
  fullWidth?: boolean
  quantity?: number // number of skeletons to render
  className?: string
  gap?: string // space between skeletons, e.g., 'gap-2'
}

const sizeMap: Record<ButtonSkeletonSize, string> = {
  xs: 'h-7 w-20',
  sm: 'h-9 w-28',
  md: 'h-10 w-32',
  lg: 'h-11 w-40',
}

export function ButtonSkeleton({
  size = 'sm',
  fullWidth = false,
  quantity = 1,
  className,
  gap = 'gap-2',
}: ButtonSkeletonProps) {
  const skeletons = Array.from({ length: quantity }, (_, i) => (
    <Skeleton
      key={i}
      className={cn(
        'rounded-md',
        fullWidth ? 'w-full' : sizeMap[size],
        sizeMap[size].split(' ')[0], // ensures height consistency
        className,
      )}
    />
  ))

  if (quantity === 1) return skeletons[0]

  return (
    <motion.div
      className={`flex ${gap} flex-col md:flex-row`}
      {...motionPresets.fade}
    >
      {skeletons}
    </motion.div>
  )
}
