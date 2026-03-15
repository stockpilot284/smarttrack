import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
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

interface RestoreMemberProps {
  memberId: string
}

export function RestoreMember({ memberId }: RestoreMemberProps) {
  const [open, setOpen] = useState(false)

  const handleRestore = () => {
    // TODO: API call to restore soft-deleted member
    console.log('Restoring member:', memberId)
    toast.success('Member restored')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <RefreshCw size={14} />
          <span>Restore</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore Member</DialogTitle>
          <DialogDescription>
            This will reactivate the member and restore their access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button onClick={handleRestore} size={'sm'}>
            Restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
