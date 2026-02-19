import { useState } from 'react'
import { LocationPickerValue } from '@/types/location.type'
import LocationPickerTrigger from './LocationPickerTrigger'
import LocationPickerModal from './LocationPickerModal'
import { Dialog, DialogContent } from '../ui/dialog'

type LocationPickerProps = {
  value: LocationPickerValue
  onChange: (location: LocationPickerValue) => void
  placeholder?: string
  label: string
  required?: boolean
  disabled?: boolean
}

export default function LocationPicker({
  value,
  onChange,
  placeholder = 'Select location',
  label,
  required,
  disabled = false,
}: LocationPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <LocationPickerTrigger
        value={value}
        placeholder={placeholder}
        label={label}
        required={required}
        onOpen={() => setOpen(true)}
        disabled={disabled}
      />

      <LocationPickerModal
        value={value}
        onApply={(location) => {
          onChange(location)
        }}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  )
}
