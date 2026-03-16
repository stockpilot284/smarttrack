import { motionPresets } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'

interface MapEtaBadgeProps {
  etaSeconds: number | null
}

export function MapEtaBadge({ etaSeconds }: MapEtaBadgeProps) {
  if (!etaSeconds) return null

  const minutes = Math.max(1, Math.round(etaSeconds / 60))

  return (
    <motion.div
      {...motionPresets.slideUp}
      className={cn(
        'w-fit items-center gap-2 text-xs font-medium text-foreground  px-4 py-2 rounded-md drop-shadow hidden md:inline-flex bg-card',
      )}
    >
      <Timer className="h-4 w-4" />
      <span>Arriving in {minutes} min</span>
    </motion.div>
  )
}
