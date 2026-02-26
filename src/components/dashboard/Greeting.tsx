import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

function getTimeGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Good evening'
}

export default function Greeting() {
  const greeting = getTimeGreeting()

  return (
    <motion.div className="flex flex-col gap-0.5" {...motionPresets.fade}>
      <h1 className="text-xl font-bold text-foreground">{greeting} 👋</h1>

      <p className="text-xs md:text-sm text-muted-foreground">
        Here’s what’s happening with SwiftLine Logistics today.
      </p>
    </motion.div>
  )
}
