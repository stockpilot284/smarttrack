import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/tanstack-react-start'
import { Separator } from '@/components/ui/separator'
import { Button } from './ui/button'
import { Bell, Menu } from 'lucide-react'
import { RoleBadge } from './RoleBadge'
import { Label } from './ui/label'
import { Dispatch, SetStateAction } from 'react'
import { ThemeDropdown } from './ThemeDropdown'
import { NotificationBell, Alert } from './NotificationBell'

type TopBarProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function TopBar({ setOpen }: TopBarProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock alerts – simulate fetching after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockAlerts: Alert[] = [
        {
          id: '1',
          source: 'SYSTEM',
          category: 'SYSTEM',
          severity: 'INFO',
          status: 'OPEN',
          title: 'System update scheduled',
          message: 'The system will undergo maintenance at 2 AM.',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: '2',
          source: 'DRIVER',
          category: 'DRIVER',
          severity: 'WARNING',
          status: 'OPEN',
          title: 'Driver check-in overdue',
          message: 'Driver John Doe has not checked in for 2 hours.',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: '3',
          source: 'ADMIN',
          category: 'ORDER',
          severity: 'CRITICAL',
          status: 'ACKNOWLEDGED',
          title: 'Order #1234 delayed',
          message: 'Delivery delayed due to traffic. New ETA: 5:30 PM.',
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          acknowledgedBy: 'admin@example.com',
        },
        {
          id: '4',
          source: 'INTEGRATION',
          category: 'VEHICLE',
          severity: 'INFO',
          status: 'OPEN',
          title: 'New vehicle added',
          message: 'Vehicle Toyota Hiace (AS-7743-23) has been added to fleet.',
          createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
      ]
      setAlerts(mockAlerts)
      setIsLoading(false)
    }, 500) // simulate network delay

    return () => clearTimeout(timer)
  }, [])

  const handleAcknowledge = (alertId: string) => {
    // Update local state to mark as acknowledged
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'ACKNOWLEDGED',
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: 'current-user', // replace with actual user
            }
          : alert,
      ),
    )
    // In real app: call API to acknowledge
    console.log(`Acknowledged alert ${alertId}`)
  }

  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.status === 'OPEN'
          ? {
              ...alert,
              status: 'ACKNOWLEDGED',
              acknowledgedAt: new Date().toISOString(),
              acknowledgedBy: 'current-user',
            }
          : alert,
      ),
    )
    console.log('All alerts acknowledged')
  }

  const handleViewAll = () => {
    // Navigate to full alerts page (e.g., using router)
    console.log('Navigate to /alerts')
    // navigate('/apps/$companyId/alerts')
  }

  return (
    <header className="flex h-14 items-center justify-between px-4 border-b border-border/50 bg-card z-10">
      <div className="flex items-center gap-2">
        <RoleBadge role={'SUPER_ADMIN'} className="hidden lg:block" />

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 shrink-0 lg:hidden">
          <img src="/assets/logo.svg" className="w-6 h-6" alt="SmartTrack" />
          <Label className="text-sm font-bold truncate">SmartTrack</Label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Uncomment when Clerk is set up
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
        */}

        <NotificationBell
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          onAcknowledgeAll={handleAcknowledgeAll}
          onViewAll={handleViewAll}
          isLoading={isLoading}
        />
        <ThemeDropdown />

        <Button
          variant="ghost"
          className="h-fit lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </div>
    </header>
  )
}
