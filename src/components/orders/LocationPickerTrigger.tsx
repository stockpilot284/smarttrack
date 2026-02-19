import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LocationPickerValue } from '@/types/location.type'
import { Label } from '../ui/label'
import { DialogTrigger } from '../ui/dialog'

type Props = {
  value: LocationPickerValue
  placeholder: string
  onOpen: () => void
  label: string
  required?: boolean
  disabled?: boolean
}

export default function LocationPickerTrigger({
  value,
  placeholder,
  onOpen,
  label,
  required = false,
  disabled,
}: Props) {
  return (
    <DialogTrigger asChild disabled={disabled}>
      <div className="w-full flex flex-col gap-2 last:col-span-full">
        <Label required={required}>{label}</Label>
        <Input
          disabled={disabled}
          size="md"
          readOnly
          value={value?.address ?? ''}
          placeholder={placeholder}
          className="cursor-pointer"
          onClick={onOpen}
        />
      </div>
    </DialogTrigger>
  )
}
