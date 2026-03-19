import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Plus } from 'lucide-react'
import { ScrollableWithFade } from '../ScrollableWithFade'

export function PaymentMethods() {
  // Mock data – replace with real
  const cards = [
    {
      id: '1',
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      default: true,
    },
    {
      id: '2',
      brand: 'Mastercard',
      last4: '8888',
      expMonth: 8,
      expYear: 2024,
      default: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollableWithFade heightClass="h-40 space-y-4" gradientHeight="h-2">
          {cards.map((card) => (
            <div key={card.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires {card.expMonth}/{card.expYear}
                  </p>
                </div>
              </div>
              {card.default && (
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </ScrollableWithFade>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          leftIcon={<Plus size={14} />}
        >
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  )
}
