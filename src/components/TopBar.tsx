import { UserButton } from '@clerk/tanstack-react-start'
import { Separator } from '@/components/ui/separator'
import { Button } from './ui/button'
import { Bell, Menu } from 'lucide-react'
import { RoleBadge } from './RoleBadge'
import { Label } from './ui/label'
import { Dispatch, SetStateAction } from 'react'
import { ThemeDropdown } from './ThemeDropdown'

type TopBarProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
}
export default function TopBar({ setOpen }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between  px-4 border-b border-border/50 bg-background z-10 ">
      <div className="flex items-center gap-2">
        <RoleBadge role={'SUPER_ADMIN'} className="hidden lg:block" />

        {/** Logo */}
        <div className="flex items-center gap-2 px-2  shrink-0  lg:hidden">
          <img src="/assets/logo.svg" className="w-6 h-6" />
          <Label className="text-sm font-bold truncate">SmartTrack</Label>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        /> */}

        <ThemeDropdown />

        <Button
          variant={'ghost'}
          className="h-fit lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </div>
    </header>
  )
}
