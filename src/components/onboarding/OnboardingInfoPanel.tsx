import { Check, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OnboardingInfoPanel({
  activeStep,
  steps,
}: {
  activeStep: number
  steps: { id: number; title: string }[]
}) {
  return (
    <div className="flex w-[329px] flex-col justify-between rounded-l-xl bg-[#FCF8FD] p-8">
      <h2 className="text-sm text-muted-foreground">Sign-up · Company</h2>

      <ul className="flex flex-col gap-6">
        {steps.map((step) => {
          const isActive = step.id === activeStep
          const isCompleted = step.id < activeStep

          return (
            <li key={step.id} className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-[38px] w-[38px] items-center justify-center rounded-full text-sm transition-all duration-300',
                  {
                    'bg-background text-foreground shadow-sm': isActive,
                    ' text-green-600': isCompleted,
                    'bg-[#F2E9F6] text-muted-foreground':
                      !isActive && !isCompleted,
                  },
                )}
              >
                {isCompleted ? (
                  <Check size={18} className="stroke-[3]" />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={cn('text-sm font-medium transition-colors', {
                  'text-foreground': isActive, // Only active step gets foreground
                  'text-muted-foreground': !isActive, // All other steps (completed or not) get muted
                })}
              >
                {step.title}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-3">
        <Info size={22} className="text-[#C3BFC9]" />
        <span className="text-xs text-muted-foreground/80">
          We use this only to set up your delivery tracking workspace.
        </span>
      </div>
    </div>
  )
}
