/**
 * DeviationMockControls.tsx
 *
 * Development-only floating control panel that sits on top of the map.
 * Lets you manually trigger/clear deviation and skip the truck forward.
 *
 * Render this inside MapPanel when DEV mode is active:
 *   {import.meta.env.DEV && (
 *     <DeviationMockControls controls={mockControls} totalLength={routeGeometry?.totalLength} />
 *   )}
 */

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  FastForward,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MockControls } from '@/hooks/use-deviation-mock'

interface DeviationMockControlsProps {
  controls: MockControls
  totalLength?: number
}

const SKIP_AMOUNTS = [100, 500, 1000]

export function DeviationMockControls({
  controls,
  totalLength,
}: DeviationMockControlsProps) {
  const [isDeviating, setIsDeviating] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleTrigger = () => {
    controls.triggerDeviation()
    setIsDeviating(true)
  }

  const handleClear = () => {
    controls.clearDeviation()
    setIsDeviating(false)
  }

  const handleReset = () => {
    controls.resetRoute()
    setIsDeviating(false)
  }

  return (
    <div className="absolute bottom-16 left-3 z-30 w-56 rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-lg text-xs">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer select-none border-b border-border"
        onClick={() => setCollapsed((c) => !c)}
      >
        <span className="font-semibold text-muted-foreground uppercase tracking-wide">
          🧪 Deviation Mock
        </span>
        {collapsed ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
        )}
      </div>

      {!collapsed && (
        <div className="p-3 flex flex-col gap-3">
          {/* Deviation toggle */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground font-medium">Deviation</span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={isDeviating ? 'default' : 'destructive'}
                onClick={handleTrigger}
                disabled={isDeviating}
                leftIcon={<AlertTriangle className="h-3 w-3" />}
              >
                Trigger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                disabled={!isDeviating}
                leftIcon={<CheckCircle className="h-3 w-3" />}
              >
                Clear
              </Button>
            </div>
            <p className="text-muted-foreground/70 leading-tight">
              {isDeviating
                ? '🔴 Truck is off-route. Wait 8s for confirmation.'
                : '⚪ Truck is on-route.'}
            </p>
          </div>

          {/* Skip forward */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground font-medium">
              Skip Forward
              {totalLength
                ? ` (${(totalLength / 1000).toFixed(1)}km total)`
                : ''}
            </span>
            <div className="flex gap-1">
              {SKIP_AMOUNTS.map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant="outline"
                  onClick={() => controls.skipForward(m)}
                >
                  +{m >= 1000 ? `${m / 1000}k` : m}m
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground/70 leading-tight">
              Skips truck forward to test remaining stops logic.
            </p>
          </div>

          {/* Reset */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-3 w-3" />}
          >
            Reset to start
          </Button>
        </div>
      )}
    </div>
  )
}
