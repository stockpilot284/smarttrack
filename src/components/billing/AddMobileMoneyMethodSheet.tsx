import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { MobileMoneyProvider } from '@/types/billing.type'

interface AddMobileMoneySheetProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const providers: { value: MobileMoneyProvider; label: string }[] = [
  { value: 'MTN', label: 'MTN Mobile Money' },
  { value: 'Telecel', label: 'Telecel Cash' },
  { value: 'AirtelTigo', label: 'AirtelTigo Money' },
]

export function AddMobileMoneySheet({
  trigger,
  onSuccess,
}: AddMobileMoneySheetProps) {
  const [open, setOpen] = useState(false)
  const [provider, setProvider] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    provider: '',
    phone: '',
    name: '',
  })

  // Basic validation for button enable/disable
  const isPhoneValid = /^0\d{9}$/.test(phoneNumber)
  const isNameValid = name === '' || name.trim().length >= 2
  const isValid = provider !== '' && isPhoneValid && isNameValid

  const validateForm = () => {
    const newErrors = {
      provider: '',
      phone: '',
      name: '',
    }
    let isValid = true

    if (!provider) {
      newErrors.provider = 'Please select a provider'
      isValid = false
    }

    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required'
      isValid = false
    } else {
      const phoneRegex = /^0\d{9}$/
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phone =
          'Enter a valid 10-digit Ghanaian number starting with 0'
        isValid = false
      }
    }

    if (name && name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Mobile money account added successfully')
    setOpen(false)
    setProvider('')
    setPhoneNumber('')
    setName('')
    setErrors({ provider: '', phone: '', name: '' })
    onSuccess?.()
    setLoading(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Smartphone size={14} />}
          >
            Add Mobile Money
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Mobile Money Account</SheetTitle>
          <SheetDescription>
            Enter your mobile money details. This information is securely
            stored.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="provider" required>
              Provider
            </Label>
            <Select value={provider} onValueChange={setProvider} required>
              <SelectTrigger id="provider" className="w-full">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provider && (
              <p className="text-xs text-destructive mt-1">{errors.provider}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="e.g., 0551234567"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
              }}
              required
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Account Name (optional)</Label>
            <Input
              id="name"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>
        </form>
        <SheetFooter className="pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !isValid}
            loading={loading}
            size="sm"
            onClick={handleSubmit}
          >
            Add Account
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
