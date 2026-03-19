import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DriverInfo } from '@/types/tracking.type'
import { cn } from '@/lib/utils'
import { avatarClass } from '@/utils/avatar-styles'

interface DriverAvatarProps {
  driver: DriverInfo
  showStatus?: boolean
  size?: 'sm' | 'md'
}

export function DriverAvatar({
  driver,
  showStatus = false,
  size = 'md',
}: DriverAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
  }
  return (
    <div className="relative inline-flex">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={driver.imageUrl} />
        <AvatarFallback className={avatarClass(driver.name)}>
          {driver.name[0]}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-1 ring-background',
            driver.availability === 'AVAILABLE'
              ? 'bg-green-500'
              : driver.availability === 'BUSY'
                ? 'bg-yellow-500'
                : 'bg-gray-400',
          )}
        />
      )}
    </div>
  )
}
