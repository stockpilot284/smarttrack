// components/billing/CurrentPlanCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plan } from '@/lib/store/zustand'
import { ChangePlanSheet } from './ChangePlanSheet'
import { toast } from 'sonner'

interface CurrentPlanCardProps {
  plan: Plan
  onCancelSubscription?: () => void
}

export function CurrentPlanCard({
  plan,
  onCancelSubscription,
}: CurrentPlanCardProps) {
  const planName = plan.name
  const isPro = planName === 'PRO'
  const price = isPro ? '$99' : planName === 'GROWTH' ? '$29' : 'Free'
  const period = isPro ? '/month' : ''

  const handleCancel = () => {
    if (onCancelSubscription) {
      onCancelSubscription()
    } else {
      toast.success('Subscription cancelled (demo)')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Current Plan</CardTitle>
        <Badge variant="outline" className="capitalize">
          {planName}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {planName === 'PRO'
            ? 'All features included.'
            : 'Upgrade to unlock more features and higher limits.'}
        </p>
        <div className="flex gap-3">
          {!isPro && <Button size="sm">Upgrade Plan</Button>}
          {isPro && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center w-full">
              <ChangePlanSheet
                currentPlan={plan}
                onPlanChange={(newPlan) => console.log('Change to', newPlan)}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full md:w-fit">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your PRO subscription? You
                      will lose access to all PRO features at the end of your
                      current billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant={'outline'} size={'sm'}>
                        Keep subscription
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} asChild>
                      <Button variant={'destructive'} size={'sm'}>
                        Yes, cancel
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
