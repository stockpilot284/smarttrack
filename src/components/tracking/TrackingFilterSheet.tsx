import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  SlidersHorizontalIcon,
  User,
  Truck,
  X,
  RotateCcw,
  ListFilter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrackingFilters {
  driver?: string
  vehicle?: string
}

const EMPTY_FILTERS: TrackingFilters = { driver: '', vehicle: '' }

interface TrackingFilterDialogProps {
  filters: TrackingFilters
  onApply: (filters: TrackingFilters) => void
  trigger?: React.ReactNode
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countActive(f: TrackingFilters) {
  return (f.driver ? 1 : 0) + (f.vehicle ? 1 : 0)
}

// ─── Clearable input ──────────────────────────────────────────────────────────

function FilterInput({
  id,
  icon: Icon,
  placeholder,
  value,
  onChange,
  onClear,
}: {
  id: string
  icon: React.ElementType
  placeholder: string
  value: string
  onChange: (v: string) => void
  onClear: () => void
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-8 text-xs h-9"
        size="sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrackingFilterSheet({
  filters,
  onApply,
  trigger,
}: TrackingFilterDialogProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<TrackingFilters>(filters)

  const activeCount = countActive(filters)
  const draftCount = countActive(draft)

  const handleOpen = (v: boolean) => {
    if (v) setDraft(filters) // sync draft to current applied filters on open
    setOpen(v)
  }

  const handleApply = () => {
    onApply(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(EMPTY_FILTERS)
    onApply(EMPTY_FILTERS)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button
            variant="outline"
            size="sm"
            className="relative"
            leftIcon={<SlidersHorizontalIcon size={14} />}
          >
            <span>Filter</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {activeCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <ListFilter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-sm font-medium leading-tight">
                  Filter Tracking
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {activeCount > 0
                    ? `${activeCount} filter${activeCount > 1 ? 's' : ''} active`
                    : 'No filters applied'}
                </p>
              </div>
            </div>
            {draftCount > 0 && (
              <button
                onClick={() => setDraft(EMPTY_FILTERS)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Driver */}
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Driver
              </span>
              {draft.driver && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[10px] ml-auto"
                >
                  1
                </Badge>
              )}
            </div>
            <FilterInput
              id="driver"
              icon={User}
              placeholder="e.g. Kwame Mensah"
              value={draft.driver ?? ''}
              onChange={(v) => setDraft((p) => ({ ...p, driver: v }))}
              onClear={() => setDraft((p) => ({ ...p, driver: '' }))}
            />
            {draft.driver && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Filtering by driver name containing{' '}
                <span className="font-medium text-foreground">
                  "{draft.driver}"
                </span>
              </p>
            )}
          </section>

          <div className="h-px bg-border/40" />

          {/* Vehicle */}
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <Truck className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vehicle
              </span>
              {draft.vehicle && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[10px] ml-auto"
                >
                  1
                </Badge>
              )}
            </div>
            <FilterInput
              id="vehicle"
              icon={Truck}
              placeholder="e.g. GR-4521-23"
              value={draft.vehicle ?? ''}
              onChange={(v) => setDraft((p) => ({ ...p, vehicle: v }))}
              onClear={() => setDraft((p) => ({ ...p, vehicle: '' }))}
            />
            {draft.vehicle && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Filtering by plate containing{' '}
                <span className="font-medium text-foreground">
                  "{draft.vehicle}"
                </span>
              </p>
            )}
          </section>

          {/* Empty state hint */}
          {draftCount === 0 && (
            <div className="rounded-lg border border-dashed border-border/60 px-4 py-5 text-center">
              <ListFilter className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                Enter a driver name or vehicle plate to filter the tracking
                view.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="px-5 py-4 border-t border-border/50 gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={draftCount === 0 && activeCount === 0}
          >
            Apply
            {draftCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1.5 h-4 px-1.5 text-[10px] bg-primary-foreground/20 text-primary-foreground"
              >
                {draftCount}
              </Badge>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
