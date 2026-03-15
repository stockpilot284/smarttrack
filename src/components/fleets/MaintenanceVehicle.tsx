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
import { toast } from 'sonner'

interface MaintenanceVehicleProps {
  vehicleId: string
  companyId: string
}

export default function MaintenanceVehicle({
  vehicleId,
}: MaintenanceVehicleProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to mark vehicle as under maintenance
    console.log('Mark vehicle for maintenance:', vehicleId)
    toast.success('Vehicle restored')
    setOpen(false)
  }

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

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleConfirm}>
            Confirm Maintenance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
