import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type DeleteOrderProps = {
  orderReference: string
}
export default function DeleteOrder({ orderReference }: DeleteOrderProps) {
  const [deleteReason, setDeleteReason] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  function handleDeleteSelected() {
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer">
          <Trash2 size={14} />
          <span>Delete</span>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">
            Delete order
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            You are about to delete an order, this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

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
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            required
            autoFocus
            autoComplete="on"
          />
          <p className="text-xs text-muted-foreground">
            This reason will be stored for audit purposes.
          </p>
        </div>

        <AlertDialogFooter className="gap-2 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={deleteReason.trim().length < 3}
            onClick={handleDeleteSelected}
          >
            Confirm delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
