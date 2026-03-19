import { useState, useEffect, useRef, useCallback } from 'react'
import { RouteGeometry } from '@/lib/routing/routing.types'
import { buildRouteGeometry } from '@/lib/routing/build-route-geometry'
import { useTrackingCapabilities } from './use-tracking-capabilities'
import { PlanFeatures } from '@/lib/store/zustand'
import { LocationPing } from '@/types/tracking.type'

interface UseReplayProps {
  routeGeometry: RouteGeometry | null
  locationHistory?: LocationPing[]
  capabilities: ReturnType<typeof useTrackingCapabilities>
  openUpgradeModal: (params: { featureName: keyof PlanFeatures }) => void
}

export function useReplay({
  routeGeometry,
  locationHistory,
  capabilities,
  openUpgradeModal,
}: UseReplayProps) {
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayProgress, setReplayProgress] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isReplayPlaying, setIsReplayPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const speedRef = useRef(speed)
  const animationFrameRef = useRef<number | null>(null)

  const replayGeometryRef = useRef<RouteGeometry | null>(null)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    if (locationHistory && locationHistory.length > 1) {
      const points = locationHistory.map(
        (p) => [p.longitude, p.latitude] as [number, number],
      )
      replayGeometryRef.current = buildRouteGeometry(points)
      const first = new Date(locationHistory[0].timestamp).getTime()
      const last = new Date(
        locationHistory[locationHistory.length - 1].timestamp,
      ).getTime()
      setTotalDuration((last - first) / 1000)
    } else if (routeGeometry) {
      replayGeometryRef.current = routeGeometry
      const distanceKm = routeGeometry.totalLength / 1000
      setTotalDuration(distanceKm * 60) // fallback estimate
    } else {
      replayGeometryRef.current = null
      setTotalDuration(0)
    }
  }, [locationHistory, routeGeometry])

  useEffect(() => {
    if (isReplaying && isReplayPlaying && replayGeometryRef.current) {
      const startTime = performance.now()
      const startProgress = replayProgress

      const animate = () => {
        const now = performance.now()
        const elapsed = ((now - startTime) / 1000) * speedRef.current
        let newProgress = startProgress + elapsed
        if (newProgress >= totalDuration) {
          newProgress = totalDuration
          setIsReplayPlaying(false)
        }
        setReplayProgress(newProgress)

        if (newProgress < totalDuration) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    } else if (!isReplaying || !isReplayPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isReplaying, isReplayPlaying, totalDuration])

  const handleReplay = useCallback(() => {
    if (!capabilities.canShowTrackingSessionReplay) {
      openUpgradeModal({ featureName: 'trackingSessionReplay' })
      return
    }
    if (isReplaying) {
      setIsReplaying(false)
      setIsReplayPlaying(false)
      setReplayProgress(0)
    } else {
      setIsReplaying(true)
      setIsReplayPlaying(true)
      setReplayProgress(0)
    }
  }, [capabilities, openUpgradeModal, isReplaying])

  const handlePlayPause = useCallback(() => {
    setIsReplayPlaying((prev) => !prev)
  }, [])

  const handleSeek = useCallback(
    (value: number) => {
      setReplayProgress(value)
      if (isReplayPlaying) {
        setIsReplayPlaying(false)
      }
    },
    [isReplayPlaying],
  )

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
  }, [])

  const handleSkip = useCallback(
    (seconds: number) => {
      setReplayProgress((prev) => {
        const newValue = Math.max(0, Math.min(prev + seconds, totalDuration))
        if (isReplayPlaying) {
          setIsReplayPlaying(false)
        }
        return newValue
      })
    },
    [totalDuration, isReplayPlaying],
  )

  return {
    isReplaying,
    replayProgress,
    totalDuration,
    isReplayPlaying,
    speed,
    replayGeometry: replayGeometryRef.current,
    handleReplay,
    handlePlayPause,
    handleSeek,
    handleSpeedChange,
    handleSkip,
  }
}
