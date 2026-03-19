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
import { CreditCard } from 'lucide-react'
import { toast } from 'sonner'

interface AddPaymentMethodSheetProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

// Helper to validate card number (Luhn algorithm)
function isValidCardNumber(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
  let sum = 0
  let alternate = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  return sum % 10 === 0
}

// Helper to validate expiry (MM/YY, not in past)
function isValidExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = parseInt(match[1], 10)
  const year = parseInt(match[2], 10) + 2000
  if (month < 1 || month > 12) return false
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

// Helper to validate CVC (3 or 4 digits)
function isValidCvc(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc)
}

export function AddPaymentMethodSheet({
  trigger,
  onSuccess,
}: AddPaymentMethodSheetProps) {
  const [open, setOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  })

  // Derived validity for button enable
  const isCardNumberValid =
    cardNumber.length > 0 && isValidCardNumber(cardNumber)
  const isExpiryValid = expiry.length > 0 && isValidExpiry(expiry)
  const isCvcValid = cvc.length > 0 && isValidCvc(cvc)
  const isValid = isCardNumberValid && isExpiryValid && isCvcValid

  const validateForm = (): boolean => {
    const newErrors = {
      cardNumber: '',
      expiry: '',
      cvc: '',
    }
    let valid = true

    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required'
      valid = false
    } else if (!isValidCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Enter a valid card number'
      valid = false
    }

    if (!expiry) {
      newErrors.expiry = 'Expiry date is required'
      valid = false
    } else if (!isValidExpiry(expiry)) {
      newErrors.expiry = 'Enter a valid future expiry (MM/YY)'
      valid = false
    }

    if (!cvc) {
      newErrors.cvc = 'CVC is required'
      valid = false
    } else if (!isValidCvc(cvc)) {
      newErrors.cvc = 'CVC must be 3 or 4 digits'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Payment method added successfully')
    setOpen(false)
    setCardNumber('')
    setExpiry('')
    setCvc('')
    setErrors({ cardNumber: '', expiry: '', cvc: '' })
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
            leftIcon={<CreditCard size={14} />}
          >
            Add Payment Method
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Payment Method</SheetTitle>
          <SheetDescription>
            Enter your card details. This information is securely stored.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber" required>
              Card Number
            </Label>
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value)
                if (errors.cardNumber)
                  setErrors((prev) => ({ ...prev, cardNumber: '' }))
              }}
              required
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-xs text-destructive mt-1">
                {errors.cardNumber}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" required>
                Expiry (MM/YY)
              </Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => {
                  setExpiry(e.target.value)
                  if (errors.expiry)
                    setErrors((prev) => ({ ...prev, expiry: '' }))
                }}
                required
                maxLength={5}
              />
              {errors.expiry && (
                <p className="text-xs text-destructive mt-1">{errors.expiry}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc" required>
                CVC
              </Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cvc}
                onChange={(e) => {
                  setCvc(e.target.value)
                  if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: '' }))
                }}
                required
                maxLength={4}
              />
              {errors.cvc && (
                <p className="text-xs text-destructive mt-1">{errors.cvc}</p>
              )}
            </div>
          </div>
        </form>

        <SheetFooter className="pt-4">
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={() => setOpen(false)}
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
            Add Card
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
