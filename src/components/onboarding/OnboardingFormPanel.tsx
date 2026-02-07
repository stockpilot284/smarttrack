import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/button'
import { useState, useCallback } from 'react'

import CompanySetup from './steps/CompanySetup'
import DeliveryBasics from './steps/DeliveryBasics'
import OrderPreferences from './steps/OrderPreferences'
import FinishAndGo from './steps/Finish&Go'
import { useUser } from '@clerk/tanstack-react-start'
import { useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth, clerkClient } from '@clerk/tanstack-react-start/server'

/* Types */

export type FormValues = {
  // Company Setup
  companyName: string
  companyEmail: string
  country: string
  industry: string
  companyPhone: string
  timezone: string

  // Delivery Basics
  defaultPickupLocation: string
  openingDays: string[]

  // Order Preferences
  defaultOrderLabel: string
  autoAssignDriver: boolean
  allowOrderCancellation: boolean
}

export type FormErrors = Partial<Record<keyof FormValues, string>>

/* ------------------------------------------------------------------ */
/* Validation */
/* ------------------------------------------------------------------ */

const validateCompanySetup = (
  form: FormValues,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {}

  if (!form.companyName.trim()) {
    errors.companyName = 'Company name is required'
  } else if (form.companyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters'
  }

  if (!form.companyEmail.trim()) {
    errors.companyEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail)) {
    errors.companyEmail = 'Enter a valid email'
  }

  if (!form.country.trim()) errors.country = 'Country is required'
  if (!form.industry.trim()) errors.industry = 'Industry is required'
  if (!form.timezone.trim()) errors.timezone = 'Timezone is required'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const validateDeliveryBasics = (
  form: FormValues,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {}

  if (!form.defaultPickupLocation.trim()) {
    errors.defaultPickupLocation = 'Pickup location is required'
  }

  if (form.openingDays.length === 0) {
    errors.openingDays = 'Select at least one opening day'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/* Server function */
export const updateOnboardingMetadata = createServerFn({ method: 'POST' })
  .inputValidator((d: { companyId: string }) => d)
  .handler(async ({ data }) => {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    // Merge old publicMetadata with new data
    const updatedMetadata = {
      ...user.publicMetadata,
      onboardingCompleted: true,
      companyId: data.companyId,
    }

    // Update user with merged metadata
    await clerk.users.updateUser(userId, {
      publicMetadata: updatedMetadata,
    })
  })

/* Component */

export default function OnboardingFormPanel({
  activeStep,
  direction,
  next,
  previous,
  isLast,
}: {
  activeStep: number
  direction: 1 | -1
  next: () => void
  previous: () => void
  isLast: boolean
}) {
  const [form, setForm] = useState<FormValues>({
    companyName: '',
    companyEmail: '',
    country: '',
    industry: '',
    companyPhone: '',
    timezone: '',

    defaultPickupLocation: '',
    openingDays: [],

    defaultOrderLabel: '',
    autoAssignDriver: false,
    allowOrderCancellation: true,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showErrors, setShowErrors] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [companyId, setcompanyId] = useState('')

  /* Helpers */

  const updateForm = useCallback((field: keyof FormValues, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validateCurrentStep = () => {
    if (activeStep === 1) return validateCompanySetup(form)
    if (activeStep === 2) return validateDeliveryBasics(form)
    return { isValid: true, errors: {} }
  }

  const isStepValid = () => validateCurrentStep().isValid

  /* Navigation */

  const handleNext = () => {
    setShowErrors(true)

    const { isValid, errors } = validateCurrentStep()

    if (!isValid) {
      setErrors(errors)
      return
    }

    setShowErrors(false)
    next()
  }

  /* Submit */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setShowErrors(true)

    const stepOne = validateCompanySetup(form)
    const stepTwo = validateDeliveryBasics(form)

    const allErrors = {
      ...stepOne.errors,
      ...stepTwo.errors,
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      return
    }

    try {
      setLoading(true)

      console.log('ONBOARDING DATA:', form)

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await updateOnboardingMetadata({ data: { companyId: 'app_2388588' } })
      setcompanyId('app_2388588')

      next()
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const stepProps = {
    form,
    errors: showErrors ? errors : {},
    updateForm,
  }

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-r-xl bg-background"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeStep}
          custom={direction}
          initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex flex-1 flex-col pt-8 lg:px-12"
        >
          {activeStep === 1 && <CompanySetup {...stepProps} />}
          {activeStep === 2 && <DeliveryBasics {...stepProps} />}
          {activeStep === 3 && <OrderPreferences {...stepProps} />}
          {activeStep === 4 && <FinishAndGo />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div
        className={`
    flex flex-col-reverse gap-3
    
     py-4 mt-10
    sm:flex-row sm:items-center ${[1, 4].includes(activeStep) ? 'lg:justify-end md:justify-center' : 'sm:justify-between'}
    lg:border-t-0 lg:px-10 lg:py-8 lg:mt-0
  `}
      >
        {/* Back */}
        {activeStep > 1 && activeStep < 4 && (
          <Button
            type="button"
            variant="outline"
            onClick={previous}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
        )}

        {/* Primary Actions */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-3">
          {activeStep < 3 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          )}

          {activeStep === 3 && (
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'Submitting...' : 'Finish'}
            </Button>
          )}

          {activeStep === 4 && (
            <Button
              type="button"
              onClick={() =>
                navigate({
                  to: '/apps/$companyId/dashboard',
                  params: {
                    companyId,
                  },
                })
              }
              className="w-full sm:w-auto"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
