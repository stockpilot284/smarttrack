import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { BackgroundFloatingCircles } from './BackgroundFloatingCircles'
import OnboardingInfoPanel from './OnboardingInfoPanel'
import OnboardingFormPanel from './OnboardingFormPanel'

const STEPS = [
  { id: 1, title: 'Company Setup' },
  { id: 2, title: 'Delivery Basics' },
  { id: 3, title: 'Order Preferences' },
  { id: 4, title: 'Finish & Go' },
]

export default function DesktopOnboarding() {
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
    <BackgroundFloatingCircles count={8}>
      <Card className="h-[546px] w-[865px] border-0 p-0 shadow-2xl">
        <CardContent className="flex h-full w-full rounded-xl p-0">
          <OnboardingInfoPanel activeStep={activeStep} steps={STEPS} />
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
