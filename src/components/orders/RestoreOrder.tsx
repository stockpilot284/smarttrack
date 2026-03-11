// components/orders/RestoreOrder.tsx
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

interface RestoreOrderProps {
  orderReference: string
}

export default function RestoreOrder({ orderReference }: RestoreOrderProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to restore order (set status to previous, e.g., CREATED or ASSIGNED)
    console.log('Restore order:', orderReference)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <RotateCcw size={14} />
          <span>Restore Order</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore order {orderReference}</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore the order and set its status back to "Created".
            The order will then need to be processed from the beginning. Are you
            sure?
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
