import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeader } from '@/components/SectionHeader'
import { NotebookPenIcon } from 'lucide-react'
import { fields } from '@/data/form-fields'

export function NotesSection({
  form,
  onChange,
  setField,
  errors,
  disabled,
}: any) {
  const isDisabled = (fieldName: string) =>
    typeof disabled === 'function' ? disabled(fieldName) : disabled

  return (
    <Card>
      <CardHeader>
        <SectionHeader title="Notes" icon={NotebookPenIcon} />
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {fields.notes.map((field) => (
            <li key={field.name} className="flex flex-col gap-2">
              <Label required={field.required}>{field.label}</Label>
              {field.name === 'deliveryNotes' && (
                <Textarea
                  name={field.name}
                  value={form.deliveryNotes}
                  onChange={(e) => setField('deliveryNotes', e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={isDisabled('deliveryNotes')}
                />
              )}
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
