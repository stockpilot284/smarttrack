import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LocationCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden p-5 space-y-4 border border-muted/40 shadow-xs">
        {/* Accent bar placeholder */}
        <div className="absolute left-0 top-0 h-full w-1 bg-muted" />

        {/* Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />

          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Address */}
        <div className="rounded-md border border-border/30 bg-muted/30 px-3 py-2 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
