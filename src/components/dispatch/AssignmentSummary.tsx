import { TrackingOrder } from '@/types/tracking.type'
import { Driver } from '@/types/driver.type'
import { Vehicle } from '@/types/vehicle.type'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Order } from '@/types/order.type'

type AssignmentSummaryProps = {
  selectedOrder: Order | null
  selectedDriver: Driver | null
  selectedVehicle: Vehicle | null
  onAssign: () => void
}

export function AssignmentSummary({
  selectedOrder,
  selectedDriver,
  selectedVehicle,
  onAssign,
}: AssignmentSummaryProps) {
  const isComplete = selectedOrder && selectedDriver && selectedVehicle

  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium">Assignment Summary</h3>
      <Card>
        <CardContent className="p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order:</span>
            <span className="font-medium">
              {selectedOrder?.orderReference || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Driver:</span>
            <span className="font-medium">{selectedDriver?.name || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle:</span>
            <span className="font-medium">
              {selectedVehicle?.plateNumber || '—'}
            </span>
          </div>
        </CardContent>
      </Card>
      <Button className="w-full" disabled={!isComplete} onClick={onAssign}>
        Assign to Order
      </Button>
    </div>
  )
}
