import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pause, UserX } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type MarkInactiveVehicleProps = {
  vehicleId: string
  companyId: string
}
export default function MarkInactiveVehicle({
  vehicleId,
  companyId,
}: MarkInactiveVehicleProps) {
  const [reason, setReason] = useState('')
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // Perform the inactivation logic (e.g., API call)
    console.log('Driver marked inactive with reason:', reason)
    setOpen(false)
    setReason('')
  }

  const isReasonValid = reason.trim().length >= 3

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserX size={14} />
          <span>Mark as Inactive</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark vehicle as inactive</DialogTitle>
          <DialogDescription>
            This will remove the vehicle from active assignments and prevent
            them from accepting new orders. You must provide a reason for this
            action.
          </DialogDescription>
        </DialogHeader>

        {/* Reason input */}
        <div className="space-y-2 py-4">
          <Label
            htmlFor="reason"
            className="text-sm font-medium flex gap-0.5 items-center"
            required
          >
            Reason
          </Label>
          <Input
            id="reason"
            placeholder="e.g. Leave of absence, termination, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            This reason will be stored for audit purposes.
          </p>
        </div>

        <DialogFooter className="gap-2 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={!isReasonValid}
            onClick={handleConfirm}
          >
            Confirm inactivation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
