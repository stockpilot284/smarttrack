import { motionPresets } from '@/lib/motion-presets'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { ImageIcon, Car, Shrink, Truck } from 'lucide-react'
import { Button } from '../ui/button'

type VehicleInformationProps = {
  model: string
  plateNumber: string
  imageUrl?: string
  vehicleType?: string
}

export default function VehicleInformation({
  model,
  plateNumber,
  imageUrl,
  vehicleType = 'Delivery Vehicle',
}: VehicleInformationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {isExpanded ? (
        <motion.div
          key="expanded"
          {...motionPresets.inViewFadeUp}
          className="bg-background p-2.5 drop-shadow-2xl rounded-md w-60"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {imageUrl && !imgError ? (
                  <img
                    src={imageUrl}
                    loading="lazy"
                    alt={model}
                    className="h-12 w-12 rounded-md object-cover border border-border/40"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted border border-border/40">
                    <Truck size={18} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium leading-tight">{model}</div>
                <span className="text-[10px] text-muted-foreground">
                  {vehicleType}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="iconXs"
              onClick={() => setIsExpanded(false)}
              title="Collapse vehicle info"
            >
              <Shrink size={16} />
            </Button>
          </div>

          {/* Details */}
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 p-2 rounded-md border border-border/40">
              <Car size={16} className="text-muted-foreground" />
              <span className="text-xs font-medium tracking-wide">
                {plateNumber}
              </span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="collapsed"
          {...motionPresets.inViewFadeUp}
          className="drop-shadow-2xl rounded-md flex items-center justify-end"
        >
          <Button
            variant="ghost"
            size="sm"
            className="bg-card  drop-shadow"
            onClick={() => setIsExpanded(true)}
            leftIcon={<Car size={16} />}
          >
            Vehicle
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
