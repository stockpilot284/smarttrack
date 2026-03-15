import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Trash2, Trash2Icon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { toast } from 'sonner'

type DeleteVehicleProps = {
  vehicleId: string
  companyId: string
}
export default function DeleteVehicle({
  vehicleId,
  companyId,
}: DeleteVehicleProps) {
  const [open, setOpen] = useState<boolean>(false)

  function handleDeleteSelected() {
    toast.success('Vehicle deleted')
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Trash2 size={14} />
          <span>Delete</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Delete vehicle</DialogTitle>
          <DialogDescription className="text-sm">
            You are about to delete a vehicle, this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            Confirm delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
