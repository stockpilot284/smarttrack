import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/tanstack-react-start'
import { Separator } from '@/components/ui/separator'
import { Button } from './ui/button'
import { Bell } from 'lucide-react'
import { RoleBadge } from './RoleBadge'

export default function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <RoleBadge role={'SUPER_ADMIN'} />
      </div>

      <div className="flex items-center gap-2">
        <Button variant={'ghost'}>
          <Bell size={24} />
        </Button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      </div>
    </header>
  )
}
