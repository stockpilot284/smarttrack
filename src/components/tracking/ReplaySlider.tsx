import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Gauge } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReplaySliderProps {
  isPlaying: boolean
  currentTime: number // seconds
  totalDuration: number // seconds
  speed: number // multiplier (e.g., 1, 2, 3, 4)
  onPlayPause: () => void
  onSeek: (value: number) => void
  onSpeedChange: (speed: number) => void
  onSkip: (seconds: number) => void // negative for back, positive for forward
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const speedOptions = [1, 2, 3, 4]

export function ReplaySlider({
  isPlaying,
  currentTime,
  totalDuration,
  speed,
  onPlayPause,
  onSeek,
  onSpeedChange,
  onSkip,
}: ReplaySliderProps) {
  return (
    <motion.div
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-background/80 backdrop-blur-sm dark:border border-border rounded-lg p-3 flex flex-col sm:flex-row items-center gap-3 min-w-[300px] sm:min-w-[600px] drop-shadow-2xl"
      {...motionPresets.inViewFadeUp}
    >
      {/* Top row: play/pause, time, skip, speed on small screens */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
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

        {/* Skip buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => onSkip(-10)}
            title="Skip back 10 seconds"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => onSkip(10)}
            title="Skip forward 10 seconds"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed selector */}
        <Select
          value={String(speed)}
          onValueChange={(v) => onSpeedChange(Number(v))}
        >
          <SelectTrigger className="w-20 h-8">
            <Gauge className="h-3.5 w-3.5 mr-1" />
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            {speedOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Slider row – takes full width on mobile, flex‑1 on desktop */}
      <div className="flex items-center gap-2 w-full sm:flex-1">
        <span className="text-sm tabular-nums hidden sm:inline">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          max={totalDuration}
          step={1}
          onValueChange={(val) => onSeek(val[0])}
          className="flex-1"
        />
        <span className="text-sm tabular-nums hidden sm:inline">
          {formatTime(totalDuration)}
        </span>
      </div>

      {/* Total duration on mobile (right side) */}
      <span className="text-sm tabular-nums sm:hidden">
        {formatTime(totalDuration)}
      </span>
    </motion.div>
  )
}
