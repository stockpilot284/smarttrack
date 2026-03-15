import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'

interface PermanentDeleteMemberProps {
  memberId: string
}

export function PermanentDeleteMember({
  memberId,
}: PermanentDeleteMemberProps) {
  const [open, setOpen] = useState(false)

  const handlePermanentDelete = () => {
    // TODO: API call to permanently delete member
    console.log('Permanently deleting member:', memberId)
    toast.success('Member permanently deleted')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-destructive hover:text-destructive/90 transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Trash2 size={14} />
          <span>Permanently Delete</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanently Delete Member</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All data associated with this member
            will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePermanentDelete} variant="destructive">
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
