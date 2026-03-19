import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type EmptyStateProps = {
  title: string
  description?: string
  Icon: LucideIcon | null
  className?: string
}

export default function EmptyState({
  title,
  description,
  Icon,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        `flex flex-col items-center justify-center gap-3 py-10 text-center`,
        className,
      )}
      {...motionPresets.inViewFadeUp}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
        {Icon && <Icon />}
      </div>

      <div className="space-y-1">
        <p className="text-base font-medium text-foreground"> {title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}
