import { Button } from '@/components/ui/button'
import { UserMinus } from 'lucide-react'
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

interface SuspendMemberProps {
  memberId: string
}

export function SuspendMember({ memberId }: SuspendMemberProps) {
  const [open, setOpen] = useState(false)

  const handleSuspend = () => {
    // TODO: API call to suspend member
    console.log('Suspending member:', memberId)
    toast.success('Member suspended')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserMinus size={14} />
          <span>Suspend</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend Member</DialogTitle>
          <DialogDescription>
            This member will lose access to the platform until reactivated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button onClick={handleSuspend} variant="destructive" size={'sm'}>
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
