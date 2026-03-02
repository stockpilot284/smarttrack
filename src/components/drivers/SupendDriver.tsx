import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Pause, Trash2, Trash2Icon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function SuspendDriver({ driverId }: { driverId: string }) {
  const [suspensionReason, setSuspensionReason] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  function handleSuspensionSelected() {
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Pause size={14} />
          <span>Suspend</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Suspend driver</DialogTitle>
          <DialogDescription className="text-sm">
            You are about to suspend a driver, this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Reason input */}
        <div className="space-y-2 py-2">
          <Label
            className="text-sm font-medium flex gap-0.5 items-center"
            required
          >
            Reason for deletion
          </Label>
          <Input
            placeholder="e.g. Duplicate records, incorrect data…"
            size="sm"
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            required
            autoFocus
            autoComplete="on"
          />
          <p className="text-xs text-muted-foreground">
            This reason will be stored for audit purposes.
          </p>
        </div>

        <DialogFooter className="gap-2 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={suspensionReason.trim().length < 3}
            onClick={handleSuspensionSelected}
          >
            Confirm suspension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
