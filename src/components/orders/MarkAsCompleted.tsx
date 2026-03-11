// MarkAsCompleted.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function MarkAsCompleted({
  orderReference,
}: {
  orderReference: string
}) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // Call API to mark order as completed
    toast.success(`Order ${orderReference} marked as completed`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <CheckCircle size={14} />
          <span>Mark as Completed</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Completion</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this order as completed? This action
            overrides the normal driver flow.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
