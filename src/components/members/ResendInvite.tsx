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

interface ResendInviteProps {
  memberId: string
}

export function ResendInvite({ memberId }: ResendInviteProps) {
  const [open, setOpen] = useState(false)

  const handleResend = () => {
    // TODO: API call to resend invitation
    console.log('Resending invite for member:', memberId)
    toast.success('Invitation resent')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <RefreshCw size={14} />
          <span>Resend Invite</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Invitation</DialogTitle>
          <DialogDescription>
            This will send another invitation email to this member.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button onClick={handleResend} size={'sm'}>
            Resend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
