import { AlertTriangle, RefreshCcw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
interface PageErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
  onBack?: () => void
  className?: string
}

export default function PageError({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this page. Please try again.',
  onRetry,
  onBack,
  className,
}: PageErrorProps) {
  return (
    <div
      className={cn('flex h-full items-center justify-center px-4', className)}
    >
      <motion.div {...motionPresets.inViewFadeUp}>
        <Card className="w-full max-w-md ">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {onBack && (
                <Button variant="outline" onClick={onBack} size={'sm'}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go back
                </Button>
              )}

              {onRetry && (
                <Button onClick={onRetry} size={'sm'}>
                  Retry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
