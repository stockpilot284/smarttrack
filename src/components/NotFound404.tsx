import { SearchX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

interface NotFoundProps {
  title?: string
  description?: string
  backHref?: string
  homeHref?: string
  className?: string
}

export default function NotFound({
  title = 'Page not found',
  description = 'The page you are looking for doesn’t exist or may have been moved.',
  backHref,
  homeHref,
  className,
}: NotFoundProps) {
  return (
    <div
      className={cn('flex h-full items-center justify-center px-4', className)}
    >
      <motion.div {...motionPresets.inViewFadeUp}>
        <Card className="w-full max-w-md ">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-7 w-7 text-muted-foreground" />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              {backHref && (
                <Link to={backHref}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go back
                  </Button>
                </Link>
              )}

              {homeHref && (
                <Link to={homeHref}>
                  <Button size={'sm'}>Go to dashboard</Button>
                </Link>
              )}
            </div>

            {/* Footer hint */}
            <p className="text-xs text-muted-foreground">
              Error code: <span className="font-mono">404</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
