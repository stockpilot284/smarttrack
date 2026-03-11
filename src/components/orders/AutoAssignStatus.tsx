// components/orders/AutoAssignStatus.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '../Spinner'

interface AutoAssignStatusProps {
  orderId: string
  companyId: string
  onComplete?: () => void
  onError?: () => void
}

export function AutoAssignStatus({
  orderId,
  companyId,
  onComplete,
  onError,
}: AutoAssignStatusProps) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [message, setMessage] = useState(
    'System is finding the best driver and vehicle...',
  )

  useEffect(() => {
    // Simulate auto‑assignment process
    // In a real app, you would poll an endpoint or listen via WebSocket
    const timer = setTimeout(() => {
      // 80% chance of success for demo
      const success = Math.random() > 0.2
      if (success) {
        setStatus('success')
        setMessage('Order assigned to John Doe (Van‑123)')
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate({ to: '/apps/$companyId/dashboard', params: { companyId } })
          onComplete?.()
        }, 2000)
      } else {
        setStatus('error')
        setMessage('Auto‑assignment failed. Please assign manually.')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [orderId, companyId, navigate, onComplete])

  const handleManualRedirect = () => {
    navigate({ to: '/apps/$companyId/dashboard', params: { companyId } })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <Spinner color="text-primary" />{' '}
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few seconds...
                </p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-lg font-medium">Success!</p>
                <p className="text-sm text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <XCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Assignment failed</p>
                <p className="text-sm text-muted-foreground">{message}</p>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={handleManualRedirect}
                    size={'sm'}
                  >
                    Go to Dashboard
                  </Button>
                  <Button onClick={() => window.location.reload()} size={'sm'}>
                    Retry
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
