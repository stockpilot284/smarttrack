import { ScrollArea } from '@/components/ui/scroll-area'
import { StopListItem } from './StopListItem'
import { Stop } from '@/types/tracking.type'

interface StopListProps {
  stops: Stop[]
  selectedStopId?: string | null
  onStopClick?: (stopId: string) => void
}

export function StopList({
  stops,
  selectedStopId,
  onStopClick,
}: StopListProps) {
  return (
    <ScrollArea className="max-h-[400px]">
      <div className="space-y-2">
        {stops.map((stop, index) => (
          <StopListItem
            key={stop.id}
            stop={stop}
            index={index + 1}
            isSelected={stop.id === selectedStopId}
            onClick={() => onStopClick?.(stop.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
