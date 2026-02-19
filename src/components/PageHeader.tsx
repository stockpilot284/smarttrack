import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'

type PageHeaderProps = {
  title: string
  description: string
}
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div className="flex flex-col gap-1" {...motionPresets.inViewFadeUp}>
      <h1 className="text-2xl font-medium text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}
