import { Stop, StopStatus } from '@/types/tracking.type'
import {
  User,
  Phone,
  MapPin,
  Hash,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  SkipForward,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderDetailsPanelProps {
  stop: Stop
}

// ─── Status config ────────────────────────────────────────────────────────────

const STOP_STATUS_CONFIG: Record<
  StopStatus,
  { label: string; icon: React.ElementType; classes: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    classes: 'bg-muted/60 text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Clock,
    classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500 animate-pulse',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    classes: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  FAILED: {
    label: 'Failed',
    icon: AlertTriangle,
    classes: 'bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
  },
  SKIPPED: {
    label: 'Skipped',
    icon: SkipForward,
    classes: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StopTypePill({ type }: { type: Stop['type'] }) {
  const isPickup = type === 'PICKUP'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide',
        isPickup
          ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20'
          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20',
      )}
    >
      {isPickup ? (
        <ArrowUpCircle className="h-3 w-3" />
      ) : (
        <ArrowDownCircle className="h-3 w-3" />
      )}
      {isPickup ? 'Pickup' : 'Dropoff'}
    </span>
  )
}

function StatusPill({ status }: { status: StopStatus }) {
  const cfg = STOP_STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold',
        cfg.classes,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
  href,
}: {
  icon: React.ElementType
  label: string
  value: string
  mono?: boolean
  href?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center mt-0.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className={cn(
              'text-sm text-foreground hover:text-primary transition-colors truncate block',
              mono && 'font-mono text-xs',
            )}
          >
            {value}
          </a>
        ) : (
          <p
            className={cn(
              'text-sm text-foreground leading-snug',
              mono && 'font-mono text-xs',
            )}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

function ItemCard({
  item,
  index,
}: {
  item: { id?: string; name: string; quantity: number; description?: string }
  index: number
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      {/* Quantity badge */}
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <span className="text-[11px] font-bold text-primary tabular-nums">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">
          {item.name}
        </p>
        {item.description && (
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Timestamps section ───────────────────────────────────────────────────────

function TimestampRow({
  label,
  iso,
  highlight = false,
}: {
  label: string
  iso: string
  highlight?: boolean
}) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return (
    <div className="flex items-center justify-between py-1">
      <span
        className={cn(
          'text-[11px] uppercase tracking-wider font-medium',
          highlight ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'text-xs tabular-nums font-medium',
          highlight ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {date} · {time}
      </span>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/40">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrderDetailsPanel({ stop }: OrderDetailsPanelProps) {
  const hasTimestamps =
    stop.estimatedArrival ||
    stop.actualArrival ||
    stop.completedAt ||
    stop.skippedAt

  return (
    <div className="divide-y divide-border/40">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Stop Details
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <StopTypePill type={stop.type} />
          <StatusPill status={stop.status} />
        </div>
      </div>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <Section title="Contact" icon={User}>
        <div className="space-y-3">
          <DetailRow icon={User} label="Name" value={stop.contactName} />
          <DetailRow
            icon={Phone}
            label="Phone"
            value={stop.contactPhone}
            href={`tel:${stop.contactPhone}`}
          />
          <DetailRow icon={MapPin} label="Address" value={stop.address} />
          {stop.orderId && (
            <DetailRow icon={Hash} label="Order ID" value={stop.orderId} mono />
          )}
        </div>
      </Section>

      {/* ── Failure reason (if failed) ─────────────────────────────────────── */}
      {stop.status === 'FAILED' && stop.failureReason && (
        <div className="px-4 py-3">
          <div className="rounded-lg bg-destructive/8 border border-destructive/15 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
                Failure Reason
              </span>
            </div>
            <p className="text-xs text-destructive/90 leading-relaxed">
              {stop.failureReason.message ?? stop.failureReason.code}
            </p>
          </div>
        </div>
      )}

      {/* ── Timestamps ─────────────────────────────────────────────────────── */}
      {hasTimestamps && (
        <Section title="Timeline" icon={Clock}>
          <div className="divide-y divide-border/30">
            {stop.estimatedArrival && (
              <TimestampRow
                label="Estimated arrival"
                iso={stop.estimatedArrival}
              />
            )}
            {stop.actualArrival && (
              <TimestampRow
                label="Actual arrival"
                iso={stop.actualArrival}
                highlight
              />
            )}
            {stop.completedAt && (
              <TimestampRow
                label="Completed"
                iso={stop.completedAt}
                highlight
              />
            )}
            {stop.skippedAt && (
              <TimestampRow label="Skipped at" iso={stop.skippedAt} />
            )}
          </div>
        </Section>
      )}

      {/* ── Items ──────────────────────────────────────────────────────────── */}
      {stop.items && stop.items.length > 0 && (
        <Section title={`Items · ${stop.items.length}`} icon={Package}>
          <div className="divide-y divide-border/30">
            {stop.items.map((item, idx) => (
              <ItemCard key={item.id ?? idx} item={item} index={idx} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
