import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionHeader } from '@/components/SectionHeader'
import { File, Info } from 'lucide-react'
import { fields } from '@/data/form-fields'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function OrderDetailsSection({
  form,
  onChange,
  errors,
  setForm,
  disabled = false,
}: any) {
  const isDisabled = (fieldName: string) =>
    typeof disabled === 'function' ? disabled(fieldName) : disabled

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <SectionHeader title="Order Details" icon={File} />
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.orderDetails.map((field) => (
              <li key={field.name} className="flex flex-col gap-2">
                <Label required={field.required}>{field.label}</Label>
                <Input
                  size="md"
                  name={field.name}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={onChange}
                  required={field.required}
                  disabled={isDisabled(field.name)}
                />
                {errors[field.name] && (
                  <span className="text-xs text-destructive">
                    {errors[field.name]}
                  </span>
                )}
              </li>
            ))}

            <li className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label>Priority</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      className="text-muted-foreground cursor-help"
                      size={12}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      <span className="font-semibold">High:</span> Urgent –
                      should be delivered as soon as possible.
                      <br />
                      <span className="font-semibold">Medium:</span> Standard
                      priority.
                      <br />
                      <span className="font-semibold">Low:</span> Can be
                      delivered flexibly.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={form.priority?.toLowerCase()}
                onValueChange={(value) =>
                  setForm((prev: any) => ({ ...prev, priority: value }))
                }
                disabled={isDisabled('priority')}
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <span className="text-xs text-destructive">
                  {errors.priority}
                </span>
              )}
            </li>
          </ul>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
