import { useNavigate, useParams } from '@tanstack/react-router'
import { TrackingItem, isStopResolved } from '@/types/tracking.type'
import { Truck, CheckCircle2, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { StatusBadge } from '@/components/StatusBadge'
import { DriverAvatar } from './DriverAvatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TrackingCardProps {
  item: TrackingItem
}

export function TrackingCard({ item }: TrackingCardProps) {
  const { companyId } = useParams({ from: '/apps/$companyId/tracking/' })
  const navigate = useNavigate()

  const total = item.stops.length
  const resolved = item.stops.filter((s) => isStopResolved(s.status)).length
  const pct = total > 0 ? Math.round((resolved / total) * 100) : 0

  const firstStop = item.stops[0]
  const lastStop = item.stops[total - 1]
  const isActive = item.status === 'IN_TRANSIT'

  function handleTrack() {
    navigate({
      to: '/apps/$companyId/tracking/$trackingId',
      params: { companyId, trackingId: item.id },
    })
  }

  return (
    <motion.div {...motionPresets.staggerItem} className="h-full">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
        className={cn(
          'group flex flex-col h-full rounded-xl cursor-pointer',
          'bg-card border border-border/60',
          'hover:border-border hover:shadow-sm transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center',
                isActive ? 'bg-blue-500/10' : 'bg-muted',
              )}
            >
              {item.status === 'COMPLETED' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Truck
                  className={cn(
                    'h-3.5 w-3.5',
                    isActive ? 'text-blue-500' : 'text-muted-foreground',
                  )}
                />
              )}
            </div>
            <span className="text-sm font-semibold truncate">
              {item.reference}
            </span>
          </div>
          <StatusBadge status={item.status} size="sm" variant="order" />
        </div>

        {/* ── Progress track ──────────────────────────────────────────────── */}
        <div className="px-4 pb-3 space-y-2">
          <Progress value={pct} className="h-1.5" />
          <div className="flex items-start justify-between gap-2 text-xs">
            <p
              className="text-muted-foreground truncate max-w-[48%]"
              title={firstStop?.address}
            >
              {firstStop?.address ?? '—'}
            </p>
            <p
              className="text-muted-foreground truncate max-w-[48%] text-right"
              title={lastStop?.address}
            >
              {lastStop?.address ?? '—'}
            </p>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div className="mx-4 border-t border-border/40" />

        {/* ── Driver + stops ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <DriverAvatar driver={item.driver} showStatus />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{item.driver.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {item.vehicle.plateNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
            <MapPin className="h-3 w-3" />
            <span className="text-xs tabular-nums">
              <span className="font-medium text-foreground">{resolved}</span>/
              {total}
            </span>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="px-4 pb-4 mt-auto">
          <Button
            size="sm"
            variant={isActive ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation()
              handleTrack()
            }}
            className="w-full"
            rightIcon={!isActive && <ArrowRight className="h-3.5 w-3.5" />}
          >
            {isActive ? 'Live Track' : 'View Details'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
