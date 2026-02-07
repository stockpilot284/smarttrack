import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { FormValues, FormErrors } from '../OnboardingFormPanel'

type OrderPreferencesProps = {
  form: FormValues
  errors: FormErrors
  updateForm: (field: keyof FormValues, value: any) => void
}

export default function OrderPreferences({
  form,
  errors,
  updateForm,
}: OrderPreferencesProps) {
  return (
    <div className="text-lg font-medium flex flex-col gap-8 w-full">
      <h2 className="text-2xl font-medium text-foreground">
        Order Preferences
      </h2>

      <div className="w-full flex flex-col gap-6">
        {/* Default Order Label */}
        <div className="w-full space-y-4">
          <div className="space-y-0.5">
            <Label htmlFor="defaultOrderLabel" className="text-sm">
              Default Order Label{' '}
            </Label>
            <p className="text-xs text-muted-foreground font-normal">
              This label is applied to new orders by default and helps your team
              identify them quickly.
            </p>
          </div>

          <div className="space-y-0.5">
            <Input
              id="defaultOrderLabel"
              value={form.defaultOrderLabel}
              onChange={(e) => updateForm('defaultOrderLabel', e.target.value)}
              placeholder="e.g. Express, Fragile, Local delivery"
              className="w-full"
            />

            {errors.defaultOrderLabel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.defaultOrderLabel}
              </p>
            )}
          </div>
        </div>

        {/* <Separator /> */}

        {/* Auto Assign Driver */}
        <div className="w-full ">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="autoAssignDriver"
              checked={form.autoAssignDriver}
              onCheckedChange={(checked) =>
                updateForm('autoAssignDriver', checked)
              }
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="autoAssignDriver"
                  className="text-sm font-medium cursor-pointer"
                >
                  Auto Assign Driver
                </Label>
              </div>
              <p className="text-xs text-muted-foreground font-normal">
                Automatically assign the nearest available driver to new orders
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Allow Order Cancellation */}
        <div className="w-full space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="allowOrderCancellation"
              checked={form.allowOrderCancellation}
              onCheckedChange={(checked) =>
                updateForm('allowOrderCancellation', checked)
              }
              className="mt-1"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="allowOrderCancellation"
                  className="text-sm font-medium cursor-pointer text-foreground"
                >
                  Allow Order Cancellation
                </Label>
              </div>
              <p className="text-xs text-muted-foreground font-normal">
                Allow cancel of orders before they are picked up by drivers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
