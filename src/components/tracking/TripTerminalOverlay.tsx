/**
 * TripTerminalOverlay.tsx
 *
 * Handles all three terminal trip states:
 *   completed  → green success card with full summary
 *   failed     → red failure card with partial summary + reason
 *   cancelled  → neutral card with cancellation info
 *
 * Note: TerminalState uses 'completed' not 'delivered' — trips complete,
 * orders get delivered. These are separate lifecycles.
 */

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Clock,
  Route,
  Gauge,
  Calendar,
} from 'lucide-react'
import { TerminalState, TripSummary } from '@/hooks/use-trip-completion'
import {
  TripFailureReason,
  CancellationInfo,
  TripFailureReasonCode,
} from '@/types/tracking.type'
import { cn } from '@/lib/utils'

interface SummaryRowProps {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}

function SummaryRow({ icon, label, value, accent }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <span className="text-muted-foreground/60">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          accent && 'text-emerald-600 dark:text-emerald-400',
        )}
      >
        {value}
      </span>
    </div>
  )
}

function SummaryRows({ summary }: { summary: TripSummary }) {
  const completedAtFormatted = summary.completedAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const completedDateFormatted = summary.completedAt.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      <SummaryRow
        icon={<MapPin className="h-4 w-4" />}
        label="Stops completed"
        value={`${summary.stopsDelivered} / ${summary.totalStops}`}
        accent={summary.stopsDelivered === summary.totalStops}
      />
      <SummaryRow
        icon={<Clock className="h-4 w-4" />}
        label="Trip duration"
        value={summary.tripDuration}
      />
      <SummaryRow
        icon={<Route className="h-4 w-4" />}
        label="Distance covered"
        value={summary.totalDistanceKm}
      />
      <SummaryRow
        icon={<Gauge className="h-4 w-4" />}
        label="Average speed"
        value={summary.averageSpeedKmh}
      />
      <SummaryRow
        icon={<AlertTriangle className="h-4 w-4" />}
        label="Route deviations"
        value={
          summary.deviationCount === 0 ? 'None' : `${summary.deviationCount}`
        }
      />
      <SummaryRow
        icon={<Calendar className="h-4 w-4" />}
        label="Completed at"
        value={`${completedDateFormatted}, ${completedAtFormatted}`}
      />
    </>
  )
}

const FAILURE_REASON_LABELS: Record<TripFailureReasonCode, string> = {
  GPS_LOST: 'GPS signal permanently lost',
  VEHICLE_BREAKDOWN: 'Vehicle breakdown reported',
  MAX_ATTEMPTS_EXCEEDED: 'Maximum delivery attempts exceeded',
  TRIP_TIMEOUT: 'Trip exceeded maximum allowed duration',
  DRIVER_INCIDENT: 'Driver safety incident reported',
  OTHER: 'Unexpected failure',
}

function CompletedCard({
  summary,
  driverName,
}: {
  summary: TripSummary
  driverName?: string
}) {
  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-background border border-border animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-emerald-500 px-6 py-5 flex flex-col items-center gap-2 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Trip Complete</h2>
        {driverName && (
          <p className="text-sm text-white/80">Great work, {driverName}</p>
        )}
      </div>
      <div className="px-5 pt-1 pb-2">
        <SummaryRows summary={summary} />
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-center">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            All {summary.stopsDelivered} stops successfully completed
          </p>
        </div>
      </div>
    </div>
  )
}

function FailedCard({
  reason,
  partialSummary,
  driverName,
}: {
  reason?: TripFailureReason
  partialSummary: TripSummary
  driverName?: string
}) {
  const reasonLabel = reason
    ? FAILURE_REASON_LABELS[reason.code]
    : 'Trip could not be completed'

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-background border border-border animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-destructive px-6 py-5 flex flex-col items-center gap-2 text-destructive-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <XCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Trip Failed</h2>
        {driverName && <p className="text-sm text-white/80">{driverName}</p>}
      </div>
      <div className="px-5 pt-4 pb-2">
        <div className="rounded-lg bg-destructive/10 px-4 py-3 mb-3">
          <p className="text-xs font-medium text-destructive mb-0.5">Reason</p>
          <p className="text-sm text-foreground">{reasonLabel}</p>
          {reason?.message && (
            <p className="text-xs text-muted-foreground mt-1">
              {reason.message}
            </p>
          )}
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">
          Progress before failure
        </p>
        <SummaryRows summary={partialSummary} />
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-muted px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            {partialSummary.stopsDelivered} of {partialSummary.totalStops} stops
            completed
          </p>
        </div>
      </div>
    </div>
  )
}

function CancelledCard({ info }: { info?: CancellationInfo }) {
  const cancelledAtFormatted = info?.cancelledAt
    ? new Date(info.cancelledAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null
  const cancelledDateFormatted = info?.cancelledAt
    ? new Date(info.cancelledAt).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-background border border-border animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-muted px-6 py-5 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10">
          <XCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Trip Cancelled</h2>
        <p className="text-sm text-muted-foreground">Cancelled by dispatcher</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        {info?.reason && (
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              Reason
            </p>
            <p className="text-sm text-foreground">{info.reason}</p>
          </div>
        )}
        {cancelledAtFormatted && (
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground/60" />
              <span className="text-sm">Cancelled at</span>
            </div>
            <span className="text-sm font-semibold">
              {cancelledDateFormatted}, {cancelledAtFormatted}
            </span>
          </div>
        )}
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-lg bg-muted px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            This trip has been cancelled. No further action needed.
          </p>
        </div>
      </div>
    </div>
  )
}

interface TripTerminalOverlayProps {
  terminalState: TerminalState
  driverName?: string
}

export function TripTerminalOverlay({
  terminalState,
  driverName,
}: TripTerminalOverlayProps) {
  if (!terminalState) return null

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/60 backdrop-blur-sm p-6">
      {terminalState.type === 'completed' && (
        <CompletedCard
          summary={terminalState.summary}
          driverName={driverName}
        />
      )}
      {terminalState.type === 'failed' && (
        <FailedCard
          reason={terminalState.reason}
          partialSummary={terminalState.partialSummary}
          driverName={driverName}
        />
      )}
      {terminalState.type === 'cancelled' && (
        <CancelledCard info={terminalState.info} />
      )}
    </div>
  )
}
