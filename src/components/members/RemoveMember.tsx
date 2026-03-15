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

interface RemoveMemberProps {
  memberId: string
}

export function RemoveMember({ memberId }: RemoveMemberProps) {
  const [open, setOpen] = useState(false)

  const handleRemove = () => {
    // TODO: API call to remove (soft delete) member
    console.log('Removing member:', memberId)
    toast.success('Member removed')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Trash2 size={14} />
          <span>Remove</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
          <DialogDescription>
            This member will be deactivated and moved to deleted state. You can
            restore them later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button onClick={handleRemove} variant="destructive" size={'sm'}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
