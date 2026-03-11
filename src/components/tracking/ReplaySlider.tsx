import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

interface ReplaySliderProps {
  isPlaying: boolean
  currentTime: number // seconds
  totalDuration: number // seconds
  onPlayPause: () => void
  onSeek: (value: number) => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function ReplaySlider({
  isPlaying,
  currentTime,
  totalDuration,
  onPlayPause,
  onSeek,
}: ReplaySliderProps) {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-background/80 backdrop-blur-sm dark:border border-border rounded-lg p-3 flex items-center gap-4 min-w-[300px] drop-shadow-2xl"
      {...motionPresets.inViewFadeUp}
    >
      <Button
        variant="ghost"
        size="iconMd"
        onClick={onPlayPause}
        className="shadow-none"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm tabular-nums w-16 text-center">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        max={totalDuration}
        step={1}
        onValueChange={(val) => onSeek(val[0])}
        className="flex-1"
      />
      <span className="text-sm tabular-nums w-16 text-center">
        {formatTime(totalDuration)}
      </span>
    </motion.div>
  )
}
