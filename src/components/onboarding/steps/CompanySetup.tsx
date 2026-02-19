import { useMemo } from 'react'
import countryList from 'react-select-country-list'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormValues, FormErrors } from '../OnboardingFormPanel'

type CompanySetupProps = {
  form: FormValues
  errors: FormErrors
  updateForm: (field: keyof FormValues, value: any) => void
}

export default function CompanySetup({
  form,
  errors,
  updateForm,
}: CompanySetupProps) {
  const options = useMemo(() => countryList().getData(), [])
  const countryOptions = useMemo(
    () =>
      options.map((country) => (
        <SelectItem key={country.value} value={country.value}>
          {country.label}
        </SelectItem>
      )),
    [options],
  )

  return (
    <div className="text-lg font-medium flex flex-col gap-8 w-full ">
      <h2 className="text-2xl font-medium text-foreground">
        Setup your company
      </h2>

      <div className="w-full flex flex-col gap-6">
        {/* Company Name */}
        <div className="w-full">
          <Label htmlFor="companyName" className="mb-2">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            value={form.companyName}
            onChange={(e) => updateForm('companyName', e.target.value)}
            placeholder="Acme Logistics"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Company Email */}
        <div className="w-full">
          <Label htmlFor="companyEmail" className="mb-2">
            Company Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyEmail"
            type="email"
            value={form.companyEmail}
            onChange={(e) => updateForm('companyEmail', e.target.value)}
            placeholder="info@acme.com"
          />
          {errors.companyEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>
          )}
        </div>

        <div className="w-full flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Country */}
          <div className="w-full">
            <Label htmlFor="country" className="mb-2">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.country}
              onValueChange={(value) => updateForm('country', value)}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>{countryOptions}</SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          {/* Industry */}
          <div className="w-full">
            <Label htmlFor="industry" className="mb-2" required>
              Industry
            </Label>
            <Select
              value={form.industry}
              onValueChange={(value) => updateForm('industry', value)}
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logistics">Logistics</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="food-delivery">Food Delivery</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Company Phone */}
          <div className="w-full">
            <Label htmlFor="companyPhone" className="mb-2">
              Company Phone
            </Label>
            <Input
              id="companyPhone"
              type="tel"
              value={form.companyPhone}
              onChange={(e) => updateForm('companyPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full"
            />
          </div>

          {/* Timezone */}
          <div className="w-full">
            <Label htmlFor="timezone" className="mb-2">
              Timezone <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.timezone}
              onValueChange={(value) => updateForm('timezone', value)}
            >
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-5">Eastern Time (ET)</SelectItem>
                <SelectItem value="UTC-6">Central Time (CT)</SelectItem>
                <SelectItem value="UTC-7">Mountain Time (MT)</SelectItem>
                <SelectItem value="UTC-8">Pacific Time (PT)</SelectItem>
                <SelectItem value="UTC+0">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="UTC+1">
                  Central European Time (CET)
                </SelectItem>
                <SelectItem value="UTC+5.5">
                  Indian Standard Time (IST)
                </SelectItem>
                <SelectItem value="UTC+8">China Standard Time (CST)</SelectItem>
                <SelectItem value="UTC+9">Japan Standard Time (JST)</SelectItem>
                <SelectItem value="UTC+10">
                  Australian Eastern Time (AET)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.timezone && (
              <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
