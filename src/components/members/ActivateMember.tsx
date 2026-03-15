import { Button } from '@/components/ui/button'
import { UserCheck } from 'lucide-react'
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

interface ActivateMemberProps {
  memberId: string
}

export function ActivateMember({ memberId }: ActivateMemberProps) {
  const [open, setOpen] = useState(false)

  const handleActivate = () => {
    // TODO: API call to activate member
    console.log('Activating member:', memberId)
    toast.success('Member activated')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserCheck size={14} />
          <span>Activate</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activate Member</DialogTitle>
          <DialogDescription>
            This member will regain access to the platform.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button onClick={handleActivate} size={'sm'}>
            Activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
