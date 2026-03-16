import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store/zustand'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type MemberRole = 'OWNER' | 'ADMIN' | 'DISPATCHER' | 'DRIVER' | 'CUSTOMER'

interface InviteMemberSheetProps {
  trigger?: React.ReactNode
  currentAdminCount?: number
  currentMemberCount?: number
  onInvite?: (data: {
    email: string
    role: MemberRole
    message?: string
  }) => void
}

export function InviteMemberSheet({
  trigger,
  currentAdminCount = 0,
  currentMemberCount = 0,
  onInvite,
}: InviteMemberSheetProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('DISPATCHER')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const maxAdmins = useAppStore((state) => state.plan.limits.maxAdmins)
  const maxTotalMembers = useAppStore(
    (state) => state.plan.limits.maxTotalMembers,
  )
  const openUpgradeModal = useAppStore((state) => state.openUpgradeModal)

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check limits
    if (role === 'ADMIN' && currentAdminCount >= maxAdmins) {
      openUpgradeModal({ limitName: 'maxAdmins' })
      return
    }
    if (currentMemberCount >= maxTotalMembers) {
      openUpgradeModal({ limitName: 'maxTotalMembers' })
      return
    }

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Invitation sent to ${email}`)
    setOpen(false)
    setEmail('')
    setRole('DISPATCHER')
    setMessage('')
    onInvite?.({ email, role, message })
    setLoading(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <motion.div {...motionPresets.slideUp}>
            <Button
              variant="default"
              size="sm"
              leftIcon={<UserPlus size={14} />}
            >
              Invite Member
            </Button>
          </motion.div>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg py-6">
        <SheetHeader>
          <SheetTitle>Invite a new member</SheetTitle>
          <SheetDescription>
            Send an invitation to join your company. They will receive an email
            with a link to set up their account.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value: MemberRole) => setRole(value)}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter className="pt-4 p-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              size={'sm'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              size={'sm'}
              loading={loading}
            >
              Send Invitation
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
