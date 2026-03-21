// StopList.tsx
import { useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StopListItem } from './StopListItem'
import { Stop } from '@/types/tracking.type'
import { sortTripStops, isStopOrderValid } from '@/lib/routing/sort-trip-stops'
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'

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
  // Enforce pickup-first ordering at the display layer too
  const sortedStops = useMemo(() => {
    if (!stops.length) return []
    try {
      return isStopOrderValid(stops) ? stops : sortTripStops(stops)
    } catch {
      return stops
    }
  }, [stops])

  // Split into pickup and dropoff groups for section headers
  const pickups = sortedStops.filter((s) => s.type === 'PICKUP')
  const dropoffs = sortedStops.filter((s) => s.type === 'DROPOFF')

  const totalStops = sortedStops.length
  const completedCount = sortedStops.filter(
    (s) =>
      s.status === 'COMPLETED' ||
      s.status === 'FAILED' ||
      s.status === 'SKIPPED',
  ).length

  return (
    <div className="flex flex-col gap-0 min-h-0">
      {/* Progress bar header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/50">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Stops
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {completedCount}/{totalStops}
          </span>
        </div>
        {/* Segmented progress dots */}
        <div className="flex gap-1">
          {sortedStops.map((stop) => (
            <div
              key={stop.id}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  stop.status === 'COMPLETED'
                    ? '#22c55e'
                    : stop.status === 'FAILED'
                      ? '#ef4444'
                      : stop.status === 'SKIPPED'
                        ? '#f97316'
                        : stop.status === 'IN_PROGRESS'
                          ? '#3b82f6'
                          : 'hsl(var(--border))',
              }}
            />
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 max-h-[420px] overflow-y-auto no-scrollbar">
        <div className="px-3 py-2 space-y-1">
          {/* ── PICKUPS ──────────────────────────────────────────────── */}
          {pickups.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-1 pt-1 pb-1.5">
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-500/15">
                  <ArrowUpFromLine className="w-2.5 h-2.5 text-sky-500" />
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-sky-500">
                  Pickups
                </span>
                <div className="flex-1 h-px bg-sky-500/15" />
                <span className="text-[10px] text-muted-foreground font-mono">
                  {pickups.filter((s) => s.status === 'COMPLETED').length}/
                  {pickups.length}
                </span>
              </div>
              <div className="space-y-1">
                {pickups.map((stop, idx) => (
                  <StopListItem
                    key={stop.id}
                    stop={stop}
                    index={sortedStops.indexOf(stop) + 1}
                    sequenceLabel={`P${idx + 1}`}
                    isSelected={stop.id === selectedStopId}
                    onClick={() => onStopClick?.(stop.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── DROPOFFS ─────────────────────────────────────────────── */}
          {dropoffs.length > 0 && (
            <div className={pickups.length > 0 ? 'mt-2' : ''}>
              <div className="flex items-center gap-1.5 px-1 pt-1 pb-1.5">
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-500/15">
                  <ArrowDownToLine className="w-2.5 h-2.5 text-violet-500" />
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-violet-500">
                  Dropoffs
                </span>
                <div className="flex-1 h-px bg-violet-500/15" />
                <span className="text-[10px] text-muted-foreground font-mono">
                  {dropoffs.filter((s) => s.status === 'COMPLETED').length}/
                  {dropoffs.length}
                </span>
              </div>
              <div className="space-y-1">
                {dropoffs.map((stop, idx) => (
                  <StopListItem
                    key={stop.id}
                    stop={stop}
                    index={sortedStops.indexOf(stop) + 1}
                    sequenceLabel={`D${idx + 1}`}
                    isSelected={stop.id === selectedStopId}
                    onClick={() => onStopClick?.(stop.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
