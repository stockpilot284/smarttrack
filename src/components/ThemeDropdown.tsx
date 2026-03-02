import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Check, Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="iconMd"
          aria-label="Toggle theme"
          className="border border-border/40 dark:border-border"
        >
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'system' && <Laptop className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <ThemeItem
          label="Light"
          value="light"
          icon={<Sun className="h-4 w-4" />}
          active={theme === 'light'}
          onSelect={() => setTheme('light')}
        />

        <ThemeItem
          label="Dark"
          value="dark"
          icon={<Moon className="h-4 w-4" />}
          active={theme === 'dark'}
          onSelect={() => setTheme('dark')}
        />

        <ThemeItem
          label="System"
          value="system"
          icon={<Laptop className="h-4 w-4" />}
          active={theme === 'system'}
          onSelect={() => setTheme('system')}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ThemeItemProps {
  label: string
  value: 'light' | 'dark' | 'system'
  icon: React.ReactNode
  active: boolean
  onSelect: () => void
}

function ThemeItem({ label, icon, active, onSelect }: ThemeItemProps) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(
        'flex items-center justify-between',
        active && 'font-medium',
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>

      {active && <Check className="h-4 w-4 text-primary" />}
    </DropdownMenuItem>
  )
}
