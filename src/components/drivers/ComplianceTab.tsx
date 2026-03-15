import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SectionHeader } from '@/components/SectionHeader'
import { FileText, MessageSquare, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DriverDetail } from '@/types/driver.type'
import { format } from 'date-fns'
import { motionPresets } from '@/lib/motion-presets'

interface ComplianceTabProps {
  driver: DriverDetail
}

export function ComplianceTab({ driver }: ComplianceTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Documents Card */}
      <motion.div {...motionPresets.inViewSlideUp} className="h-full">
        <Card className="h-full">
          <CardHeader>
            <SectionHeader title="Documents" icon={FileText} />
          </CardHeader>
          <CardContent>
            {driver.documents && driver.documents.length > 0 ? (
              <div className="space-y-3">
                {driver.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-border/50 dark:border-border pb-2 last:border-0"
                  >
                    <span className="text-sm font-medium">{doc.type}</span>
                    <div className="flex items-center gap-2">
                      {doc.verified && (
                        <Badge variant="softSuccess" className="text-[10px]">
                          Verified
                        </Badge>
                      )}
                      {doc.expiry && (
                        <span className="text-xs text-muted-foreground">
                          exp {format(new Date(doc.expiry), 'PP')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notes Card */}
      <motion.div {...motionPresets.inViewSlideUp} className="h-full">
        <Card className="h-full">
          <CardHeader>
            <SectionHeader title="Notes" icon={MessageSquare} />
          </CardHeader>
          <CardContent>
            {driver.notes && driver.notes.length > 0 ? (
              <div className="space-y-4">
                {driver.notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-muted pl-3">
                    <p className="text-sm">{note.content}</p>
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

      {/* Activity Timeline Card – spans full width on desktop */}
      <motion.div {...motionPresets.inViewSlideUp} className="md:col-span-2">
        <Card>
          <CardHeader>
            <SectionHeader title="Activity Timeline" icon={Clock} />
          </CardHeader>
          <CardContent>
            {driver.timeline && driver.timeline.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-muted space-y-4">
                {driver.timeline.map((event) => (
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
  )
}
