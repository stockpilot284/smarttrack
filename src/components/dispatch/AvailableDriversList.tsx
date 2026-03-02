import { cn } from '@/lib/utils'
import { Driver } from '@/types/driver.type'
import { Card, CardContent } from '@/components/ui/card'
import { UserX, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { avatarClass } from '@/utils/avatar-styles'
import { Input } from '../ui/input'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import EmptyState from '../EmptyState'
import DriverStatusBadge from '../drivers/DriverStatusBadge'

interface AvailableDriversListProps {
  drivers: Driver[]
  selectedDriver: Driver | null
  onSelectDriver: (driver: Driver) => void
  embedded?: boolean // when true, hide search and use compact padding
}

export function AvailableDriversList({
  drivers,
  selectedDriver,
  onSelectDriver,
  embedded = false,
}: AvailableDriversListProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchValue, setSearchValue] = useState('')

  // Only available drivers are shown
  const availableDrivers = drivers.filter((d) => d.availability === 'AVAILABLE')
  const filteredDrivers = availableDrivers.filter((driver) =>
    driver.name?.toLowerCase().includes(searchValue.toLowerCase()),
  )

  useEffect(() => {
    const timer = setTimeout(() => setSearchValue(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const containerClasses = embedded
    ? 'flex-1 flex flex-col p-2 space-y-2'
    : 'flex-1 flex flex-col p-4 pt-0 space-y-3'

  return (
    <div className={containerClasses}>
      {/* Search - only if not embedded */}
      {!embedded && (
        <div className="sticky top-0  pt-4 pb-2">
          <Input
            placeholder="Search driver name..."
            size="sm"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* List */}
      {filteredDrivers.length > 0 ? (
        <motion.div
          className="space-y-2 overflow-y-auto no-scrollbar flex-1 pr-1"
          {...motionPresets.staggerContainer}
        >
          {filteredDrivers.map((driver) => {
            const isSelected = selectedDriver?.id === driver.id

            return (
              <motion.div key={driver.id} {...motionPresets.staggerItem}>
                <Card
                  className={cn(
                    'cursor-pointer transition-all p-0 border shadow-none',
                    isSelected
                      ? ' border-primary'
                      : 'hover:bg-accent/50 border-border/10',
                  )}
                  onClick={() => onSelectDriver(driver)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback className={avatarClass(driver.name)}>
                        {driver.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium truncate">
                          {driver.name}
                        </span>
                        {/* <DriverStatusBadge
                          status={driver.availability}
                          size="sm"
                        /> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title={searchValue ? 'No drivers found' : 'No available drivers'}
            description={
              searchValue
                ? 'Try a different name.'
                : 'All drivers are currently busy or offline.'
            }
            Icon={searchValue ? Search : UserX}
          />
        </div>
      )}
    </div>
  )
}
