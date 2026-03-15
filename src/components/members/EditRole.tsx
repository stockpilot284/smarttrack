import { Button } from '@/components/ui/button'
import { UserCog } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'

type MemberRole = 'OWNER' | 'ADMIN' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'

interface EditRoleProps {
  memberId: string
  currentRole: MemberRole
}

export function EditRole({ memberId, currentRole }: EditRoleProps) {
  const [open, setOpen] = useState(false)
  const [newRole, setNewRole] = useState<MemberRole>(currentRole)

  const handleSave = () => {
    // TODO: API call to update role
    console.log('Updating role for member:', memberId, 'to', newRole)
    toast.success('Role updated successfully')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <UserCog size={14} />
          <span>Edit Role</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member Role</DialogTitle>
          <DialogDescription>
            Change the role for this member. This will update their permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="role">New Role</Label>
          <Select
            value={newRole}
            onValueChange={(value: MemberRole) => setNewRole(value)}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size={'sm'}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={newRole === currentRole}
            size={'sm'}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
