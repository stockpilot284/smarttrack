import { TrackingItem, isStopResolved } from '@/types/tracking.type'
import { DriverAvatar } from './DriverAvatar'
import { ETABadge } from './ETABadge'
import {
  MapPin,
  ArrowUpCircle,
  ArrowDownCircle,
  Gauge,
  Route,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface RouteOverviewCardProps {
  item: TrackingItem
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatETA(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  if (diffMs < 0) return 'Overdue'
  const diffMin = Math.round(diffMs / 60_000)
  if (diffMin < 60) return `${diffMin} min`
  const h = Math.floor(diffMin / 60)
  const m = diffMin % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function formatTime(iso?: string): string | null {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-muted/50">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function SegmentedProgress({ stops }: { stops: TrackingItem['stops'] }) {
  const total = stops.length
  if (total === 0) return null

  return (
    <div className="flex items-center gap-0.5">
      {stops.map((stop, i) => {
        const isCompleted = stop.status === 'COMPLETED'
        const isFailed = stop.status === 'FAILED'
        const isSkipped = stop.status === 'SKIPPED'
        const isActive = stop.status === 'IN_PROGRESS'

        return (
          <motion.div
            key={stop.id}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-colors duration-500',
              isCompleted && 'bg-emerald-500',
              isFailed && 'bg-destructive',
              isSkipped && 'bg-orange-400',
              isActive && 'bg-blue-500',
              !isCompleted &&
                !isFailed &&
                !isSkipped &&
                !isActive &&
                'bg-border',
            )}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

// ─── Next stop card ───────────────────────────────────────────────────────────

function NextStopCard({ stop }: { stop: TrackingItem['stops'][number] }) {
  const isPickup = stop.type === 'PICKUP'
  const eta = formatETA(stop.estimatedArrival)
  const time = formatTime(stop.estimatedArrival)

  return (
    <div
      className={cn(
        'rounded-xl p-3 border',
        'bg-gradient-to-br',
        isPickup
          ? 'from-violet-500/5 to-violet-500/[0.02] border-violet-500/15'
          : 'from-sky-500/5 to-sky-500/[0.02] border-sky-500/15',
      )}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {isPickup ? (
            <ArrowUpCircle className="h-3.5 w-3.5 text-violet-500" />
          ) : (
            <ArrowDownCircle className="h-3.5 w-3.5 text-sky-500" />
          )}
          <span
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              isPickup
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-sky-600 dark:text-sky-400',
            )}
          >
            Next · {isPickup ? 'Pickup' : 'Dropoff'}
          </span>
        </div>
        {eta && (
          <span className="text-[11px] font-semibold text-primary tabular-nums flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {eta}
            {time && (
              <span className="text-muted-foreground font-normal">
                · {time}
              </span>
            )}
          </span>
        )}
      </div>

      {/* Contact + address */}
      <p className="text-sm font-semibold text-foreground leading-tight">
        {stop.contactName}
      </p>
      <div className="flex items-start gap-1 mt-0.5">
        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {stop.address}
        </p>
      </div>

      {/* Items count */}
      {stop.items?.length > 0 && (
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {stop.items.length} item{stop.items.length !== 1 ? 's' : ''}
          {' · '}
          {stop.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
        </p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RouteOverviewCard({ item }: RouteOverviewCardProps) {
  const resolvedCount = item.stops.filter((s) =>
    isStopResolved(s.status),
  ).length
  const completedCount = item.stops.filter(
    (s) => s.status === 'COMPLETED',
  ).length
  const total = item.stops.length
  const pct = total > 0 ? Math.round((resolvedCount / total) * 100) : 0

  const nextStop = item.stops.find(
    (s) => s.status === 'PENDING' || s.status === 'IN_PROGRESS',
  )

  const speedKmh =
    item.vehicle.speed != null
      ? Math.round((item.vehicle.speed ?? 0) * 3.6)
      : null

  const etaLabel = formatETA(item.estimatedCompletion)

  return (
    <div className="divide-y divide-border/40">
      {/* ── Driver row ───────────────────────────────────────────────────── */}
      <div className="px-4 py-3 flex items-center gap-3">
        <DriverAvatar driver={item.driver} showStatus size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">
            {item.driver.name}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {item.vehicle.model}
            <span className="mx-1 opacity-40">·</span>
            <span className="font-mono">{item.vehicle.plateNumber}</span>
          </p>
        </div>
        {/* ETA to trip completion */}
        {item.estimatedCompletion && (
          <div className="flex-shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              ETA
            </p>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {etaLabel ?? <ETABadge eta={item.estimatedCompletion} />}
            </p>
          </div>
        )}
      </div>

      {/* ── Progress section ─────────────────────────────────────────────── */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Segmented bar — one segment per stop */}
        <SegmentedProgress stops={item.stops} />

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {completedCount}
            </span>
            {' / '}
            {total} stops completed
          </span>
          <span
            className={cn(
              'text-xs font-bold tabular-nums',
              pct === 100 ? 'text-emerald-500' : 'text-foreground',
            )}
          >
            {pct}%
          </span>
        </div>

        {/* Stat pills row */}
        {(speedKmh !== null || item.stops.length > 0) && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            <StatPill icon={Route} value={`${total}`} label="Stops" />
            <StatPill icon={MapPin} value={`${completedCount}`} label="Done" />
            <StatPill
              icon={Gauge}
              value={speedKmh !== null ? `${speedKmh}` : '—'}
              label="km/h"
            />
          </div>
        )}
      </div>

      {/* ── Next stop ────────────────────────────────────────────────────── */}
      {nextStop && (
        <div className="px-4 py-3">
          <NextStopCard stop={nextStop} />
        </div>
      )}

      {/* ── All done state ───────────────────────────────────────────────── */}
      {!nextStop && item.status !== 'ASSIGNED' && (
        <div className="px-4 py-3">
          <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              All stops resolved
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} of {total} delivered successfully
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
