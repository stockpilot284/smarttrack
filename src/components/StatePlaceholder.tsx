import { motion } from 'framer-motion'
import { LucideIcon, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motionPresets } from '@/lib/motion-presets'

interface StatePlaceholderProps {
  title: string
  description?: string
  buttonLabel?: string
  onAction?: () => void
  icon?: LucideIcon
}

export default function StatePlaceholder({
  title,
  description,
  buttonLabel = 'Go Back',
  onAction,
  icon: Icon = PackageSearch,
}: StatePlaceholderProps) {
  return (
    <motion.div
      {...motionPresets.inViewFadeUp}
      className="flex flex-col items-center justify-center text-center gap-4 
                 rounded-md bg-background p-10 shadow-xs"
    >
      {/* Icon */}
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-full 
                   bg-muted text-muted-foreground"
      >
        <Icon className="h-8 w-8" />
      </motion.div>

      {/* Text */}
      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Action */}
      {onAction && (
        <Button onClick={onAction} size="sm">
          {buttonLabel}
        </Button>
      )}
    </motion.div>
  )
}
