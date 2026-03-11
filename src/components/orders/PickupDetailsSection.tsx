import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionHeader } from '@/components/SectionHeader'
import { MapPin } from 'lucide-react'
import { fields } from '@/data/form-fields'
import LocationPicker from '@/components/orders/LocationPicker'

export function PickupDetailsSection({
  form,
  setField,
  onChange,
  errors,
  disabled = false,
}: any) {
  const isDisabled = (fieldName: string) =>
    typeof disabled === 'function' ? disabled(fieldName) : disabled

  return (
    <Card>
      <CardHeader>
        <SectionHeader title="Pickup Details" icon={MapPin} />
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationPicker
            value={form.pickupLocation}
            label="Pickup Location"
            placeholder="Select pickup location"
            required
            onChange={(location) => setField('pickupLocation', location)}
            disabled={isDisabled('pickupLocation')}
          />
          {errors.pickupLocation && (
            <span className="text-xs text-destructive col-span-full">
              {errors.pickupLocation}
            </span>
          )}
          {fields.pickupDetails.map((field) => (
            <li
              key={field.name}
              className="flex flex-col gap-2 last:col-span-full"
            >
              <Label required={field.required}>{field.label}</Label>
              <Input
                size="md"
                name={field.name}
                placeholder={field.placeholder}
                onChange={onChange}
                required={field.required}
                disabled={isDisabled(field.name)}
                value={form[field.name]}
              />
              {errors[field.name] && (
                <span className="text-xs text-destructive">
                  {errors[field.name]}
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
