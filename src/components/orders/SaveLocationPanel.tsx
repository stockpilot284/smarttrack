// components/location/SaveLocationPanel.tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { LocationPickerValue } from '@/types/location.type'
import { Label } from '../ui/label'
import { motionPresets } from '@/lib/motion-presets'

type Props = {
  location: LocationPickerValue
  onBack: () => void
  onSave: (data: { label: string; note?: string }) => void
}

export default function SaveLocationPanel({ location, onBack, onSave }: Props) {
  const [label, setLabel] = useState('')
  const [note, setNote] = useState('')

  const canSave = label.trim().length > 0

  return (
    <motion.div {...motionPresets.slideRight} className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border/40">
        <h3 className="text-base font-semibold">Save location</h3>
        <p className="text-sm text-muted-foreground">
          Give this location a name for reuse
        </p>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium" required>
            Location name
          </Label>
          <Input
            placeholder="e.g. Main Warehouse"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Note</Label>
          <Input
            placeholder="e.g. Gate 2, security check"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-3 text-sm bg-muted/30">
          <p className="font-medium">{location?.address}</p>
          <p className="text-xs text-muted-foreground">
            {location?.coordinates.latitude}, {location?.coordinates.longitude}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 border-t flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onBack}>
          Back
        </Button>

        <Button
          size="sm"
          disabled={!canSave}
          onClick={() => onSave({ label, note })}
        >
          Save
        </Button>
      </div>
    </motion.div>
  )
}
