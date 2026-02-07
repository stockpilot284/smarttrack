import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormValues, FormErrors } from '../OnboardingFormPanel'

type DeliveryBasicsProps = {
  form: FormValues
  errors: FormErrors
  updateForm: (field: keyof FormValues, value: any) => void
}

export default function DeliveryBasics({
  form,
  errors,
  updateForm,
}: DeliveryBasicsProps) {
  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ]

  const toggleOpeningDay = (day: string) => {
    const newOpeningDays = form.openingDays.includes(day)
      ? form.openingDays.filter((d) => d !== day)
      : [...form.openingDays, day]
    updateForm('openingDays', newOpeningDays)
  }

  return (
    <div className="text-lg font-medium flex flex-col gap-8 w-full">
      <h2 className="text-2xl font-medium text-foreground">Delivery Basics</h2>

      <div className="w-full flex flex-col gap-6">
        {/* Default Pickup Location */}
        <div className="w-full">
          <Label htmlFor="defaultPickupLocation" className="mb-2">
            Default Pickup Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="defaultPickupLocation"
            value={form.defaultPickupLocation}
            onChange={(e) =>
              updateForm('defaultPickupLocation', e.target.value)
            }
            placeholder="123 Main St, City, State 12345"
          />
          {errors.defaultPickupLocation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.defaultPickupLocation}
            </p>
          )}
        </div>

        {/* Opening Days */}
        <div className="w-full">
          <Label className="mb-2">
            Opening Days <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={form.openingDays.includes(day.id)}
                  onCheckedChange={() => toggleOpeningDay(day.id)}
                />
                <Label
                  htmlFor={day.id}
                  className="text-sm font-normal cursor-pointer"
                >
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.openingDays && (
            <p className="text-red-500 text-sm mt-1">{errors.openingDays}</p>
          )}
        </div>
      </div>
    </div>
  )
}
