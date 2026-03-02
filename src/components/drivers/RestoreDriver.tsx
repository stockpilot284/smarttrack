import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'

interface RestoreDriverProps {
  driverId: string
}

export default function RestoreDriver({ driverId }: RestoreDriverProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to restore driver
    console.log('Restore driver:', driverId)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <RotateCcw size={14} />
          <span>Restore Driver</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore driver</AlertDialogTitle>
          <AlertDialogDescription>
            This will reactivate the driver and restore them to their previous
            state. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="default" size="sm" onClick={handleConfirm}>
            Restore
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
