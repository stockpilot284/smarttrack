import { ChangeEvent, useCallback, useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RegisterCompanyForm } from '@/types/onboarding'
import { CountrySelect } from './CountrySelect'
import { Button } from '../ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { useNavigate, useParams } from '@tanstack/react-router'
import { axiosInstance } from '@/lib/axios/axios-instance'

type FormErrors = Partial<Record<keyof RegisterCompanyForm, string>>

export default function RegisterContent() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterCompanyForm>({
    companyName: '',
    emailAddress: '',
    contactPhone: '',
    country: '',
    city: '',
    address: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  //===============
  // VALIDATION RULES
  //===============
  const validateField = (
    name: keyof RegisterCompanyForm,
    value: string,
  ): string | undefined => {
    switch (name) {
      case 'companyName':
        return !value.trim() ? 'Company name is required' : undefined

      case 'emailAddress':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value)
          ? 'Enter a valid email address'
          : undefined

      case 'contactPhone':
        if (!value.trim()) return 'Phone number is required'
        // Basic check: allow +, spaces, parentheses, digits, dashes; at least 7 digits
        const phoneRegex = /^[+]?[\d\s\-()]{7,}$/
        return !phoneRegex.test(value.replace(/\s/g, ''))
          ? 'Enter a valid phone number'
          : undefined

      case 'country':
        return !value ? 'Country is required' : undefined

      case 'city':
        return !value.trim() ? 'City is required' : undefined

      case 'address':
        return !value.trim() ? 'Address is required' : undefined

      default:
        return undefined
    }
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    ;(Object.keys(form) as Array<keyof RegisterCompanyForm>).forEach((key) => {
      const error = validateField(key, form[key])
      if (error) newErrors[key] = error
    })
    return newErrors
  }

  //===============
  // HANDLERS
  //===============
  const handleFormOnChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const target = e.target
      const name = target.name as keyof RegisterCompanyForm

      if (!name) return

      let value: string = target.value

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }

      setForm((prev) => ({ ...prev, [name]: value }))
    },
    [errors],
  )

  const handleFieldBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const name = e.target.name as keyof RegisterCompanyForm
    const value = form[name]
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Handle CountrySelect separately (it doesn't fire our change/blur events)
  const handleCountryChange = (value: string) => {
    setForm((prev) => ({ ...prev, country: value }))
    // Validate on change (or clear error)
    const error = validateField('country', value)
    setErrors((prev) => ({ ...prev, country: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formErrors = validateForm()
    setErrors(formErrors)
    if (Object.keys(formErrors).length > 0) return

    // Proceed with registration
    console.log('Form submitted', form)

    const response = await axiosInstance.post('/')

    if (!response.data) {
      return
    }
    const companyId = response.data.companyId || '1234'

    navigate({
      to: '/apps/$companyId/dashboard',
      params: { companyId },
    })
  }

  //===============
  // COMPUTED
  //===============
  const isFormValid = useMemo(() => {
    return (Object.keys(form) as Array<keyof RegisterCompanyForm>).every(
      (key) => !validateField(key, form[key]),
    )
  }, [form])

  return (
    <div className="relative w-full min-h-screen bg-linear-to-b from-gray-100 to-gray-300 dark:from-background dark:to-background/50 flex items-center justify-center">
      <motion.div {...motionPresets.inViewFadeUp}>
        <Card className="max-w-140">
          <CardHeader className="w-full">
            <CardTitle className="text-center text-xl">
              Join SmartTrack
            </CardTitle>
            <CardDescription className="text-center">
              Register your company to start tracking deliveries in real‑time
              and optimise your fleet.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/** Company Name */}
              <div className="flex flex-col gap-2">
                <Label required htmlFor="company-name">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  size="md"
                  inputMode="text"
                  name="companyName"
                  placeholder="e.g. Alcostic logistics"
                  type="text"
                  value={form.companyName}
                  onChange={handleFormOnChange}
                  onBlur={handleFieldBlur}
                  required
                  aria-invalid={!!errors.companyName}
                />

                <AnimatePresence mode="wait">
                  {errors.companyName && (
                    <motion.span
                      className="text-xs text-destructive"
                      {...motionPresets.fade}
                    >
                      {errors.companyName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/** Email Address */}
              <div className="flex flex-col gap-2">
                <Label required htmlFor="email-address">
                  Email Address
                </Label>
                <Input
                  id="email-address"
                  size="md"
                  inputMode="email"
                  name="emailAddress"
                  placeholder="e.g. alcostic@example.com"
                  type="email"
                  value={form.emailAddress}
                  onChange={handleFormOnChange}
                  onBlur={handleFieldBlur}
                  required
                  aria-invalid={!!errors.emailAddress}
                />
                <AnimatePresence mode="wait">
                  {errors.emailAddress && (
                    <motion.span
                      className="text-xs text-destructive"
                      {...motionPresets.fade}
                    >
                      {errors.emailAddress}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/** Contact Phone */}
              <div className="flex flex-col gap-2">
                <Label required htmlFor="contact-phone">
                  Contact Phone
                </Label>
                <Input
                  id="contact-phone"
                  name="contactPhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="e.g. +1 555 123 4567"
                  value={form.contactPhone}
                  onChange={handleFormOnChange}
                  onBlur={handleFieldBlur}
                  required
                  aria-invalid={!!errors.contactPhone}
                />
                <AnimatePresence mode="wait">
                  {errors.contactPhone && (
                    <motion.span
                      className="text-xs text-destructive"
                      {...motionPresets.fade}
                    >
                      {errors.contactPhone}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/** Address */}
              <div className="flex flex-col gap-2">
                <Label required htmlFor="address">
                  Address
                </Label>
                <Input
                  id="address"
                  size="md"
                  inputMode="text"
                  name="address"
                  placeholder="e.g. 123 Main St"
                  type="text"
                  value={form.address}
                  onChange={handleFormOnChange}
                  onBlur={handleFieldBlur}
                  required
                  aria-invalid={!!errors.address}
                />
                <AnimatePresence mode="wait">
                  {errors.address && (
                    <motion.span
                      className="text-xs text-destructive"
                      {...motionPresets.fade}
                    >
                      {errors.address}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/** Country & City */}
              <div className="flex flex-col lg:flex-row items-start w-full gap-4">
                {/** Country */}
                <div className="flex flex-col gap-2 w-full">
                  <Label required htmlFor="country">
                    Country
                  </Label>
                  <CountrySelect
                    value={form.country}
                    onValueChange={handleCountryChange}
                    error={errors.country}
                    onBlur={() => {
                      const error = validateField('country', form.country)
                      setErrors((prev) => ({ ...prev, country: error }))
                    }}
                  />
                </div>

                {/** City */}
                <div className="flex flex-col gap-2 w-full">
                  <Label required htmlFor="city">
                    City
                  </Label>
                  <Input
                    id="city"
                    size="md"
                    inputMode="text"
                    name="city"
                    placeholder="e.g. New York"
                    type="text"
                    value={form.city}
                    onChange={handleFormOnChange}
                    onBlur={handleFieldBlur}
                    required
                    aria-invalid={!!errors.city}
                  />
                  <AnimatePresence mode="wait">
                    {errors.city && (
                      <motion.span
                        className="text-xs text-destructive"
                        {...motionPresets.fade}
                      >
                        {errors.city}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Button
                size="md"
                className="mt-4"
                disabled={!isFormValid}
                loading={!isFormValid && isLoading}
              >
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
