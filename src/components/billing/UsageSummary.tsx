import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Users, Truck, Package } from 'lucide-react'

interface UsageSummaryProps {
  usage: {
    members: { current: number; limit: number }
    drivers: { current: number; limit: number }
    vehicles: { current: number; limit: number }
    orders: { current: number; limit: number }
  }
}

export function UsageSummary({ usage }: UsageSummaryProps) {
  const items = [
    {
      label: 'Members',
      icon: Users,
      current: usage.members.current,
      limit: usage.members.limit,
    },
    {
      label: 'Drivers',
      icon: Users,
      current: usage.drivers.current,
      limit: usage.drivers.limit,
    },
    {
      label: 'Vehicles',
      icon: Truck,
      current: usage.vehicles.current,
      limit: usage.vehicles.limit,
    },
    {
      label: 'Orders (month)',
      icon: Package,
      current: usage.orders.current,
      limit: usage.orders.limit,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage & Limits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(({ label, icon: Icon, current, limit }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{label}</span>
              </div>
              <span className="font-medium">
                {current} / {limit}
              </span>
            </div>
            <Progress value={(current / limit) * 100} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
