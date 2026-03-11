import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { SectionHeader } from '@/components/SectionHeader'
import { Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DeliveryTiming } from '@/types/order.type'

export function ScheduleDeliverySection({
  form,
  setField,
  errors,
  disabled = false,
}: any) {
  const isDisabled = (fieldName: string) =>
    typeof disabled === 'function' ? disabled(fieldName) : disabled
  return (
    <Card>
      <CardHeader>
        <SectionHeader title="Schedule Delivery" icon={Timer} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <RadioGroup
            defaultValue={form.deliveryTiming}
            onValueChange={(value: DeliveryTiming) =>
              setField('deliveryTiming', value)
            }
            disabled={isDisabled('deliveryTiming')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SEND_NOW" id="SEND_NOW" />
              <Label htmlFor="SEND_NOW">Send now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SCHEDULED" id="SCHEDULED" />
              <Label htmlFor="SCHEDULED">Schedule for later</Label>
            </div>
          </RadioGroup>

          <AnimatePresence>
            {form.deliveryTiming === 'SCHEDULED' && (
              <motion.div
                className="mt-4 flex flex-col gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <Label required>Scheduled Pickup Date</Label>
                <Input
                  required
                  type="date"
                  value={form.scheduledPickupAt}
                  name="scheduledPickupAt"
                  onChange={(e) =>
                    setField('scheduledPickupAt', e.target.value)
                  }
                  disabled={isDisabled('scheduledPickupAt')}
                />
                {errors.scheduledPickupAt && (
                  <span className="text-xs text-destructive">
                    {errors.scheduledPickupAt}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
