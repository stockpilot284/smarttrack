// components/drivers/MarkActiveDriver.tsx
import React, { useState } from 'react'
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
import { UserCheck } from 'lucide-react'
import { Button } from '../ui/button'

interface MarkActiveDriverProps {
  driverId: string
}

export default function MarkActiveDriver({ driverId }: MarkActiveDriverProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to mark driver as active
    console.log('Mark driver active:', driverId)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserCheck size={14} />
          <span>Mark as Active</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate driver</AlertDialogTitle>
          <AlertDialogDescription>
            This will make the driver available for assignments. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="default" size="sm" onClick={handleConfirm}>
            Confirm activation
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
