import { useMemo } from 'react'
import { useAppStore } from '@/lib/store/zustand'
import { useShallow } from 'zustand/react/shallow'

export function useTrackingCapabilities() {
  const { plan, trackingSettings } = useAppStore(
    useShallow((state) => ({
      plan: state.plan,
      trackingSettings: state.settings.trackingSettings,
    })),
  )

  return useMemo(() => {
    const hasBasicLiveTracking = plan.features.basicLiveTracking
    const hasAdvancedLiveTracking = plan.features.advancedLiveTracking
    const liveTrackingLevel = hasAdvancedLiveTracking
      ? 'advanced'
      : hasBasicLiveTracking
        ? 'basic'
        : 'none'

    const canShowRoute = plan.features.routeDisplay
    const canShowETA = plan.features.etaCalculation
    const canShareLink = plan.features.trackingLinkSharing
    // const canShowDriverDetails = trackingSettings.showDriverDetailsOnTracking
    // const canShowVehicleDetails = true
    const canShowTimeline = plan.features.deliveryTimeline
    const canShowRealTimeUpdates = hasAdvancedLiveTracking
    const canShowTrackingSessionReplay = plan.features.trackingSessionReplay

    let effectiveRefreshInterval =
      trackingSettings.trackingRefreshInterval as number
    if (liveTrackingLevel === 'basic') {
      effectiveRefreshInterval = Math.max(effectiveRefreshInterval, 30)
    }

    return {
      liveTrackingLevel,
      hasBasicLiveTracking,
      hasAdvancedLiveTracking,
      canShowRoute,
      canShowETA,
      canShareLink,
      canShowTimeline,
      canShowRealTimeUpdates,
      canShowTrackingSessionReplay,
      effectiveRefreshInterval,
      planFeatures: plan.features,
    }
  }, [plan, trackingSettings])
}
