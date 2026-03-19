// components/tracking/TrackingFilterDialog.tsx
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlidersHorizontalIcon } from 'lucide-react'

export interface TrackingFilters {
  driver?: string
  vehicle?: string
}

interface TrackingFilterDialogProps {
  filters: TrackingFilters
  onApply: (filters: TrackingFilters) => void
  trigger?: React.ReactNode
}

export function TrackingFilterDialog({
  filters,
  onApply,
  trigger,
}: TrackingFilterDialogProps) {
  const [open, setOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<TrackingFilters>(filters)

  const handleApply = () => {
    onApply(draftFilters)
    setOpen(false)
  }

  const handleReset = () => {
    const reset = { driver: '', vehicle: '' }
    setDraftFilters(reset)
    onApply(reset)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<SlidersHorizontalIcon size={14} />}
          >
            Filter
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Tracking</SheetTitle>
          <SheetDescription>
            Narrow down the list by driver or vehicle.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="driver">Driver name</Label>
            <Input
              id="driver"
              placeholder="e.g. Kwame"
              value={draftFilters.driver || ''}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, driver: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle plate</Label>
            <Input
              id="vehicle"
              placeholder="e.g. AS-1234"
              value={draftFilters.vehicle || ''}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  vehicle: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleReset} size="sm">
            Reset
          </Button>
          <Button onClick={handleApply} size="sm">
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
