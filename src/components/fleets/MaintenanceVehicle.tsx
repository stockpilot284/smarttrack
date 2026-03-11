import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wrench } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'

interface MaintenanceVehicleProps {
  vehicleId: string
  companyId: string
}

export default function MaintenanceVehicle({
  vehicleId,
}: MaintenanceVehicleProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    // API call to mark vehicle as under maintenance
    console.log('Mark vehicle for maintenance:', vehicleId, 'Reason:', reason)
    setOpen(false)
    setReason('')
  }

  const isReasonValid = reason.trim().length >= 3

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Wrench size={14} />
          <span>Mark for Maintenance</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark vehicle for maintenance</DialogTitle>
          <DialogDescription>
            This will set the vehicle status to "Maintenance" and remove it from
            active assignments. Please provide a reason.
          </DialogDescription>
        </DialogHeader>

        {/* Reason input */}
        <div className="space-y-2 py-4">
          <Label
            htmlFor="reason"
            className="text-sm font-medium flex gap-0.5 items-center"
          >
            Reason <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reason"
            placeholder="e.g. Scheduled service, repair needed"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            This reason will be stored for audit purposes.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(false)
              setReason('')
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleConfirm}
            disabled={!isReasonValid}
          >
            Confirm Maintenance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
