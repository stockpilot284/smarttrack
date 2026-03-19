import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Smartphone, Plus } from 'lucide-react'
import { ScrollableWithFade } from '../ScrollableWithFade'
import { AddPaymentMethodSheet } from './AddPaymentMethodSheet'
import { AddMobileMoneySheet } from './AddMobileMoneyMethodSheet'
import { PaymentMethod } from '@/types/billing.type'

// Mock data – replace with real
const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card' as const,
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    default: true,
  },
  {
    id: '2',
    type: 'card' as const,
    brand: 'Mastercard',
    last4: '8888',
    expMonth: 8,
    expYear: 2024,
    default: false,
  },
]

export function PaymentMethods() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollableWithFade heightClass="h-40 space-y-4" gradientHeight="h-2">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {method.type === 'card' ? (
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  {method.type === 'card' ? (
                    <>
                      <p className="text-sm font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        {method.provider} Money
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.phoneNumber}{' '}
                        {method.name && ` • ${method.name}`}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {method.default && (
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </ScrollableWithFade>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <AddPaymentMethodSheet
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<CreditCard size={14} />}
              >
                Add Card
              </Button>
            }
            onSuccess={() => console.log('Card added, refresh list')}
          />
        </div>
      </CardContent>
    </Card>
  )
}
