import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { MessageSquare, Clock, Plus, Info } from 'lucide-react'
import { DriverDetail } from '@/types/driver.type'
import { format } from 'date-fns'
import { motionPresets } from '@/lib/motion-presets'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAppStore } from '@/lib/store/zustand'

interface ActivityAndNotesTabProps {
  driver: DriverDetail
  onAddNote?: (content: string) => void
}

export function ActivityAndNotesTab({
  driver,
  onAddNote,
}: ActivityAndNotesTabProps) {
  const [newNote, setNewNote] = useState('')
  const currentUser = useAppStore((state) => state.user)

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim())
      setNewNote('')
    }
  }

  // Sort notes by date descending (newest first)
  const sortedNotes = driver.notes
    ? [...driver.notes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : []

  // Sort timeline by date descending (newest first)
  const sortedTimeline = driver.timeline
    ? [...driver.timeline].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
    : []

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        {/* Notes Card */}
        <motion.div {...motionPresets.slideUp} className="w-full">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <SectionHeader title="Notes" icon={MessageSquare} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Notes are internal comments visible only to your team. Use
                      them to record reminders, feedback, or any driver‑related
                      information.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {onAddNote && (
                <div className="flex flex-col gap-3">
                  <Textarea
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      leftIcon={<Plus size={14} />}
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              )}
              {sortedNotes.length > 0 ? (
                <div className="space-y-4">
                  {sortedNotes.map((note) => (
                    <div key={note.id} className="border-l-2 border-muted pl-3">
                      <p className="text-sm italic">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.author} · {format(new Date(note.createdAt), 'PP')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Timeline Card */}
        <motion.div {...motionPresets.slideUp} className="w-full">
          <Card>
            <CardHeader>
              <SectionHeader title="Activity Timeline" icon={Clock} />
            </CardHeader>
            <CardContent>
              {sortedTimeline.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-muted space-y-4">
                  {sortedTimeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[27px] h-4 w-4 rounded-full border-2 border-background bg-muted-foreground/50" />
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), 'PPp')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
