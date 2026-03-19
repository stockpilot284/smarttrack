import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stop } from '@/types/tracking.type'
import { User, Phone, MapPin, Hash, Package } from 'lucide-react'

interface OrderDetailsPanelProps {
  stop: Stop
}

export function OrderDetailsPanel({ stop }: OrderDetailsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="h-4 w-4" />
          Order Details
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-[10px]">Contact</p>
            <p className="text-sm">{stop.contactName}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-[10px]">Phone</p>
            <p className="text-sm">{stop.contactPhone}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-[10px]">Address</p>
            <p className="text-sm">{stop.address}</p>
          </div>
        </div>

        {stop.orderId && (
          <div className="flex items-start gap-2">
            <Hash className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-muted-foreground text-[10px]">Order ID</p>
              <p className="text-sm">{stop.orderId}</p>
            </div>
          </div>
        )}

        {stop.items && stop.items.length > 0 && (
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-muted-foreground text-[10px]">Items</p>
              <ul className="list-disc list-inside space-y-0.5 text-sm">
                {stop.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity}x {item.name}
                    {item.description && ` — ${item.description}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
