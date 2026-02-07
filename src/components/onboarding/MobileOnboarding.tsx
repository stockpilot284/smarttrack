import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { BackgroundFloatingCircles } from './BackgroundFloatingCircles'
import OnboardingFormPanel from './OnboardingFormPanel'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, title: 'Company Setup' },
  { id: 2, title: 'Delivery Basics' },
  { id: 3, title: 'Order Preferences' },
  { id: 4, title: 'Finish & Go' },
]

export default function MobileOnboarding() {
  const [activeStep, setActiveStep] = useState(1)
  const [direction, setDirection] = useState<1 | -1>(1)

  const next = () => {
    if (activeStep < STEPS.length) {
      setDirection(1)
      setActiveStep((s) => s + 1)
    }
  }

  const previous = () => {
    if (activeStep > 1) {
      setDirection(-1)
      setActiveStep((s) => s - 1)
    }
  }

  return (
    <BackgroundFloatingCircles count={6}>
      <Card className="w-full h-screen md:h-auto rounded-none  md:rounded-2xl border-0 md:shadow-xl md:max-w-xl md:mx-auto">
        <CardContent className="flex flex-col gap-6 p-6 ">
          {/* Step Indicator */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Step {activeStep} of {STEPS.length}
            </p>

            <div className="flex gap-2">
              {STEPS.map((step) => (
                <span
                  key={step.id}
                  className={cn(
                    'h-1 flex-1 rounded-full bg-muted transition-colors',
                    step.id <= activeStep && 'bg-primary',
                  )}
                />
              ))}
            </div>

            <h2 className="text-lg font-semibold">
              {STEPS[activeStep - 1].title}
            </h2>
          </div>

          {/* Form Panel */}
          <OnboardingFormPanel
            activeStep={activeStep}
            direction={direction}
            next={next}
            previous={previous}
            isLast={activeStep === STEPS.length}
          />
        </CardContent>
      </Card>
    </BackgroundFloatingCircles>
  )
}
