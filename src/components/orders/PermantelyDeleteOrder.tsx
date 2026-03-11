// components/orders/PermanentDeleteOrder.tsx
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
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

interface PermanentDeleteOrderProps {
  orderReference: string
}

export default function PermanentDeleteOrder({
  orderReference,
}: PermanentDeleteOrderProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // API call to permanently delete order
    console.log('Permanently delete order:', orderReference)
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-destructive hover:text-destructive/90 transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Trash2 size={14} />
          <span>Permanently Delete</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Permanently delete order {orderReference}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The order and all associated data will
            be removed permanently.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>{' '}
          <Button variant="destructive" size="sm" onClick={handleConfirm}>
            Permenantely delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
