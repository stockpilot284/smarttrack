// components/drivers/MarkActiveDriver.tsx
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
import { UserCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface MarkActiveVehicleProps {
  vehicleId: string
  companyId: string
}

export default function MarkActiveVehicle({
  vehicleId,
}: MarkActiveVehicleProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to mark driver as active
    console.log('Mark driver active:', vehicleId)
    toast.success('Vehicle activated')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserCheck size={14} />
          <span>Mark as Active</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activate vehicle</DialogTitle>
          <DialogDescription>
            This will make the vehicle available for assignments. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="default" size="sm" onClick={handleConfirm}>
            Confirm activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
