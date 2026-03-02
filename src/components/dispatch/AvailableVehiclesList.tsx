import { cn } from '@/lib/utils'
import { Vehicle, VehicleAvailability } from '@/types/vehicle.type'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { Avatar, AvatarFallback } from '../ui/avatar'
import EmptyState from '../EmptyState'

interface AvailableVehiclesListProps {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  onSelectVehicle: (vehicle: Vehicle) => void
  embedded?: boolean
}

export function AvailableVehiclesList({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  embedded = false,
}: AvailableVehiclesListProps) {
  const [searchInput, setSearchInput] = useState('')
  const [searchValue, setSearchValue] = useState('')

  // Only available vehicles
  const availableVehicles = vehicles.filter(
    (v) => v.availability === VehicleAvailability.AVAILABLE,
  )
  const filteredVehicles = availableVehicles.filter((vehicle) =>
    vehicle.model?.toLowerCase().includes(searchValue.toLowerCase()),
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
        <div className="sticky top-0 bg-card pt-4 pb-2">
          <Input
            placeholder="Search vehicle model..."
            size="sm"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* List */}
      {filteredVehicles.length > 0 ? (
        <motion.div
          className="space-y-2 overflow-y-auto no-scrollbar flex-1 pr-1"
          {...motionPresets.staggerContainer}
        >
          {filteredVehicles.map((vehicle) => {
            const isSelected = selectedVehicle?.id === vehicle.id

            return (
              <motion.div key={vehicle.id} {...motionPresets.staggerItem}>
                <Card
                  className={cn(
                    'cursor-pointer transition-all shadow-none p-0 border',
                    isSelected
                      ? ' border-primary'
                      : 'hover:bg-accent/50 border-border/10',
                  )}
                  onClick={() => onSelectVehicle(vehicle)}
                >
                  <CardContent className="p-2 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        <Truck className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {vehicle.model}
                        </span>
                        <span className="text-xs capitalize text-muted-foreground shrink-0">
                          {vehicle.type.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {vehicle.plateNumber}
                      </p>
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
            title={searchValue ? 'No vehicles found' : 'No available vehicles'}
            description={
              searchValue
                ? 'Try a different model.'
                : 'All vehicles are currently in use or under maintenance.'
            }
            Icon={searchValue ? Search : Truck}
          />
        </div>
      )}
    </div>
  )
}
