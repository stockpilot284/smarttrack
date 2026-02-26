import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type TodayDateProps = {
  className?: string
  showIcon?: boolean
}

export function TodayDate({ className, showIcon = true }: TodayDateProps) {
  const today = new Date()

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <motion.div
      {...motionPresets.fade}
      className={cn(
        'items-center gap-2 text-xs text-foreground  px-4 py-2 rounded-md shadow-xs hidden md:inline-flex bg-card',
        className,
      )}
      title="Today's date"
    >
      {showIcon && <Calendar className="h-4 w-4" />}
      <span>{formattedDate}</span>
    </motion.div>
  )
}
