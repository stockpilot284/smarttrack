import { motion } from 'framer-motion'
import { MapPin, Phone, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface LocationCardProps {
  title: string
  address?: string
  contactName: string
  contactPhone: string
  accent: string // e.g. "bg-emerald-500" | "bg-blue-500"
}

export default function LocationCard({
  title,
  address,
  contactName,
  contactPhone,
  accent,
}: LocationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden p-5 space-y-4 border border-muted/40 shadow-xs">
        {/* Accent glow */}
        <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${accent}/10`}
          >
            <MapPin className={`h-4 w-4 ${accent.replace('bg-', 'text-')}`} />
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold leading-none">{title}</p>
            <p className="text-xs text-muted-foreground">Location details</p>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-md bg-muted/30 border border-border/50 px-3 py-2 text-sm leading-relaxed text-foreground">
          {address ?? <span className="text-muted-foreground">—</span>}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{contactName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{contactPhone}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
