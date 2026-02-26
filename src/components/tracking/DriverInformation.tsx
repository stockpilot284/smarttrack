import { motionPresets } from '@/lib/motion-presets'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Mail, Phone, Shrink, User } from 'lucide-react'
import { DriverAvailability } from '@/types/driver.type'
import { Button } from '../ui/button'

type DriverInformationProps = {
  name: string
  phone: string
  email: string
  availability: DriverAvailability
}
export default function DriverInformation({
  name,
  phone,
  email,
  availability,
}: DriverInformationProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  return (
    <AnimatePresence mode="wait">
      {isExpanded ? (
        <motion.div
          className="bg-background p-2.5 drop-shadow-2xl rounded-md"
          {...motionPresets.inViewFadeUp}
          key={'expanded'}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {name}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Driver
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="iconXs"
              onClick={() => setIsExpanded(false)}
              title="collapse"
            >
              <Shrink size={16} />
            </Button>
          </div>

          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex gap-2 items-center p-2 rounded-md border border-border/40">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-xs font-medium">{phone}</span>
            </div>
            <div className="flex gap-2 items-center p-2 rounded-md border border-border/40">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-xs font-medium">{email}</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="w-full drop-shadow-2xl rounded-md flex items-center justify-end"
          {...motionPresets.inViewFadeUp}
          title="Driver Info"
          key={'collapse'}
        >
          <Button
            variant="secondary"
            size="iconMd"
            className="rounded-full bg-background hover:bg-background/80 drop-shadow-lg"
            onClick={() => setIsExpanded(true)}
          >
            <User size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
