// import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import maplibregl from 'maplibre-gl'
// import 'maplibre-gl/dist/maplibre-gl.css'
// import { AnimatePresence, motion } from 'framer-motion'
// import { toast } from 'sonner'
// import { useResolvedTheme } from '@/hooks/use-resolved-theme'
// import { useTrackingCapabilities } from '@/hooks/use-tracking-capabilities'
// import { useMapInitialization } from '@/hooks/use-map-initialization'
// import { useRouteFetcher } from '@/hooks/use-route-fetcher'
// import { useMapMarkers } from '@/hooks/use-map-markers'
// import { useReplay } from '@/hooks/use-replay'
// import { useMapCameraController } from '@/hooks/use-map-camera-controller'
// import { useTruckMotion } from '@/hooks/use-truck-motion'
// import { useRouteEta } from '@/hooks/use-route-eta'
// import { useAppStore } from '@/lib/store/zustand'
// import { motionPresets } from '@/lib/motion-presets'
// import { deriveCameraIntent } from '@/lib/camera/derive-camera-intent'
// import { createCameraState } from '@/lib/camera/camera-state'
// import { CameraContext } from '@/lib/camera/camera.types'
// import { TrackingOrder } from '@/types/tracking.type'
// import DriverInformation from './DriverInformation'
// import Timeline from './Timeline'
// import VehicleInformation from './VehicleInformation'
// import { MapEtaBadge } from './MapEtaBadge'
// import { ReplaySlider } from './ReplaySlider'
// import StatePlaceholder from '../StatePlaceholder'
// import { Spinner } from '../Spinner'
// import { Button } from '@/components/ui/button'
// import { AlertTriangle, MapPin, Share2, Play } from 'lucide-react'
// import { Card, CardContent } from '../ui/card'

// const DARK_MAP_STYLE_ID = '8f2b1606-8dfc-497e-9827-58102e7519d9'
// const LIGHT_MAP_STYLE_ID = '86a406e5-eb60-4582-97c8-27df8b365e7d'

// type MapPanelProps = {
//   selectedOrder: TrackingOrder | null
// }

// export default function MapPanel({ selectedOrder }: MapPanelProps) {
//   const hasValidData = useMemo(() => {
//     return (
//       selectedOrder &&
//       selectedOrder.vehicle &&
//       typeof selectedOrder.vehicle.latitude === 'number' &&
//       typeof selectedOrder.vehicle.longitude === 'number'
//     )
//   }, [selectedOrder])

//   if (!hasValidData) {
//     return (
//       <motion.div
//         className="relative h-120 lg:h-full lg:flex-1 overflow-hidden bg-muted/50 dark:bg-background flex items-center justify-center"
//         {...motionPresets.fade}
//       >
//         <StatePlaceholder
//           icon={MapPin}
//           title="No Tracking Data"
//           description="No active tracking orders available."
//         />
//       </motion.div>
//     )
//   }

//   return (
//     <MapContent
//       selectedOrder={selectedOrder as TrackingOrder}
//       key={selectedOrder?.id}
//     />
//   )
// }

// function MapContent({ selectedOrder }: { selectedOrder: TrackingOrder }) {
//   const resolvedTheme = useResolvedTheme()
//   const capabilities = useTrackingCapabilities()
//   const openUpgradeModal = useAppStore((state) => state.openUpgradeModal)
//   const [currentTruckPosition, setCurrentTruckPosition] = useState<
//     [number, number] | null
//   >(null)

//   // Map style URL
//   const mapStyleUrl = useMemo(() => {
//     if (!resolvedTheme) return ''
//     const styleId =
//       resolvedTheme === 'dark' ? DARK_MAP_STYLE_ID : LIGHT_MAP_STYLE_ID
//     return `https://api.radar.io/maps/styles/${styleId}?publishableKey=${import.meta.env.VITE_RADAR_PUBLISHABLE_KEY}`
//   }, [resolvedTheme])

//   // Map initialization
//   const {
//     mapInstance,
//     mapContainerRef,
//     isMapLoaded,
//     isInitializing,
//     error,
//     setError,
//     initializeMap,
//   } = useMapInitialization({
//     mapStyleUrl,
//     selectedOrder,
//     onError: (err) => setError(err),
//   })

//   // Route fetching and geometry
//   const {
//     routeGeometryRef,
//     motionRef,
//     isLoadingRoutes,
//     updateSourcesForOrder,
//   } = useRouteFetcher({
//     mapInstance,
//     selectedOrder,
//     capabilities,
//     resolvedTheme,
//     onError: setError,
//     locationHistory: selectedOrder.locationHistory,
//   })

//   // Truck motion (disabled during replay)
//   const {
//     isReplaying,
//     replayProgress,
//     totalDuration,
//     isReplayPlaying,
//     speed,
//     replayGeometry,
//     handleReplay,
//     handlePlayPause,
//     handleSeek,
//     handleSpeedChange,
//     handleSkip,
//   } = useReplay({
//     routeGeometry: routeGeometryRef.current,
//     locationHistory: selectedOrder.locationHistory,
//     capabilities,
//     openUpgradeModal,
//   })

//   // Markers
//   const { markersRef, updateMarkers } = useMapMarkers({
//     isReplaying,
//     mapInstance,
//     resolvedTheme,
//   })

//   // Update markers and fetch routes when map loads or order changes
//   useEffect(() => {
//     if (!isMapLoaded) return

//     // First update markers synchronously
//     updateMarkers(selectedOrder)

//     // Then defer route fetching to the next animation frame
//     // This ensures markers are rendered before routes are drawn
//     const rafId = requestAnimationFrame(() => {
//       updateSourcesForOrder(selectedOrder)
//     })

//     return () => cancelAnimationFrame(rafId)
//   }, [selectedOrder.id, updateMarkers, updateSourcesForOrder, isMapLoaded])

//   const handleTruckUpdate = useCallback(
//     (lngLat: any, bearing: any) => {
//       const truckMarker = markersRef.current.truck
//       if (truckMarker) {
//         truckMarker.setLngLat(lngLat)
//         const el = truckMarker.getElement()
//         const svg = el.querySelector('svg')
//         if (svg) svg.style.transform = `rotate(${bearing}deg)`
//       }
//     },
//     [markersRef],
//   )

//   useTruckMotion({
//     route: isReplaying
//       ? replayGeometry
//       : capabilities.canShowRoute
//         ? routeGeometryRef.current
//         : null,
//     motionRef,
//     onUpdate: handleTruckUpdate,
//   })

//   useEffect(() => {
//     if (!isReplaying || !replayGeometry || !markersRef.current.truck) return

//     const fraction = replayProgress / totalDuration
//     const targetDistance = fraction * replayGeometry.totalLength

//     for (const segment of replayGeometry.segments) {
//       if (
//         targetDistance >= segment.cumulativeStart &&
//         targetDistance <= segment.cumulativeEnd
//       ) {
//         const segmentFraction =
//           (targetDistance - segment.cumulativeStart) / segment.length
//         const lng =
//           segment.start[0] +
//           segmentFraction * (segment.end[0] - segment.start[0])
//         const lat =
//           segment.start[1] +
//           segmentFraction * (segment.end[1] - segment.start[1])

//         markersRef.current.truck.setLngLat([lng, lat])
//         setCurrentTruckPosition([lng, lat]) // Store for camera

//         // Optional bearing calculation
//         const dx = segment.end[0] - segment.start[0]
//         const dy = segment.end[1] - segment.start[1]
//         const bearing = (Math.atan2(dx, dy) * 180) / Math.PI
//         const svg = markersRef.current.truck.getElement().querySelector('svg')
//         if (svg) svg.style.transform = `rotate(${bearing}deg)`
//         break
//       }
//     }
//   }, [isReplaying, replayProgress, replayGeometry, totalDuration, markersRef])

//   // Update map style on theme change
//   useEffect(() => {
//     const map = mapInstance.current
//     if (!map || !mapStyleUrl) return

//     // Store current view to restore after style change
//     const center = map.getCenter()
//     const zoom = map.getZoom()
//     const bearing = map.getBearing()
//     const pitch = map.getPitch()

//     const onStyleLoad = () => {
//       map.jumpTo({ center, zoom, bearing, pitch })
//       // Re‑fetch routes and markers because the map style changed and sources/layers are lost
//       if (isMapLoaded) {
//         updateSourcesForOrder(selectedOrder)
//         updateMarkers(selectedOrder)
//       }
//     }

//     map.once('styledata', onStyleLoad)
//     map.setStyle(mapStyleUrl)

//     return () => {
//       map.off('styledata', onStyleLoad)
//     }
//   }, [
//     resolvedTheme,
//     mapInstance,
//     mapStyleUrl,
//     isMapLoaded,
//     selectedOrder,
//     updateSourcesForOrder,
//     updateMarkers,
//   ])

//   // Camera controller

//   const cameraStateRef = useRef(createCameraState())
//   const baseCameraIntent = useMemo(
//     () => deriveCameraIntent(selectedOrder),
//     [selectedOrder],
//   )
//   const cameraIntent = isReplaying ? 'FOLLOW_TRUCK' : baseCameraIntent

//   const pickup = selectedOrder.stops.find((s) => s.type === 'PICKUP')
//   const dropoff = selectedOrder.stops.find((s) => s.type === 'DROPOFF')

//   const cameraContext: CameraContext = useMemo(
//     () => ({
//       map: mapInstance.current as maplibregl.Map,
//       truck:
//         isReplaying && currentTruckPosition
//           ? currentTruckPosition
//           : [selectedOrder.vehicle.longitude, selectedOrder.vehicle.latitude],
//       pickup: pickup ? [pickup.longitude, pickup.latitude] : undefined,
//       dropoff: dropoff ? [dropoff.longitude, dropoff.latitude] : undefined,
//       routeBounds: mapInstance.current?.getBounds(),
//     }),
//     [
//       selectedOrder,
//       mapInstance.current,
//       isReplaying,
//       currentTruckPosition,
//       pickup,
//       dropoff,
//     ],
//   )

//   useMapCameraController({
//     mapRef: mapInstance,
//     cameraStateRef,
//     cameraIntent,
//     cameraContext,
//   })

//   // ETA
//   const etaSeconds = useRouteEta({
//     status: selectedOrder.status,
//     route: capabilities.canShowETA ? routeGeometryRef.current : null,
//     distanceTraveledMeters: motionRef.current?.distanceAlongRoute ?? 0,
//     selectedOrder,
//   })

//   console.log(etaSeconds)

//   // Share handler
//   const handleShare = useCallback(async () => {
//     if (!capabilities.canShareLink) {
//       openUpgradeModal({ featureName: 'trackingLinkSharing' })
//       return
//     }
//     const trackingLink = `https://yourapp.com/track/${selectedOrder.id}`
//     try {
//       await navigator.clipboard.writeText(trackingLink)
//       toast.success('Tracking link copied to clipboard')
//     } catch {
//       toast.error('Failed to copy link')
//     }
//   }, [capabilities.canShareLink, openUpgradeModal, selectedOrder.id])

//   const { name, phone, email, availability } = selectedOrder.driver

//   return (
//     <motion.div
//       className="relative h-120 lg:h-full lg:flex-1 overflow-hidden"
//       {...motionPresets.fade}
//     >
//       <div className="absolute  md:right-4 top-4 z-10  max-w-[calc(100vw-2rem)] overflow-x-auto lg:overflow-x-visible flex gap-4 items-start justify-start pb-2.5 ">
//         {selectedOrder.status === 'DELIVERED' && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleReplay}
//             leftIcon={<Play className="h-4 w-4" />}
//             className="bg-card drop-shadow-2xl"
//           >
//             {isReplaying ? 'Stop Replay' : 'Replay Trip'}
//           </Button>
//         )}
//         <AnimatePresence mode="wait">
//           {capabilities.canShowETA && etaSeconds && (
//             <MapEtaBadge etaSeconds={etaSeconds} />
//           )}
//         </AnimatePresence>

//         <motion.div {...motionPresets.slideUp}>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleShare}
//             leftIcon={<Share2 className="h-4 w-4" />}
//             className="bg-card drop-shadow"
//           >
//             Share
//           </Button>
//         </motion.div>

//         <Timeline
//           events={selectedOrder.timeline}
//           canShowTimeLine={capabilities.canShowTimeline}
//         />
//         <DriverInformation
//           name={name}
//           phone={phone}
//           email={email}
//           availability={availability}
//         />

//         <VehicleInformation
//           model={selectedOrder.vehicle.model}
//           plateNumber={selectedOrder.vehicle.plateNumber}
//           imageUrl={selectedOrder.vehicle.imageUrl}
//           vehicleType={selectedOrder.vehicle.type}
//         />
//       </div>

//       {/* Map container */}
//       <div className="relative h-full w-full">
//         <div
//           ref={mapContainerRef}
//           className={`h-full w-full ${!mapStyleUrl || !isMapLoaded ? 'invisible' : ''}`}
//         />

//         {/* Error overlay */}
//         {/* {error && (
//           <div className="absolute inset-0 bg-muted/50 dark:bg-background backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center">
//             <motion.div {...motionPresets.inViewFadeUp}>
//               <Card className="w-full md:w-80">
//                 <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
//                   <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
//                     <AlertTriangle className="h-7 w-7 text-destructive" />
//                   </div>
//                   <h2 className="text-lg font-semibold">
//                     Something went wrong
//                   </h2>
//                   <p className="text-sm text-muted-foreground">{error}</p>
//                   <Button variant="default" size="sm" onClick={initializeMap}>
//                     Retry
//                   </Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         )} */}

//         {/* Loading spinner */}
//         {!error && (isInitializing || isLoadingRoutes) && (
//           <div className="absolute inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center pointer-events-none">
//             <Spinner />
//           </div>
//         )}

//         {/* Replay slider */}
//         <AnimatePresence>
//           {isReplaying && (
//             <ReplaySlider
//               isPlaying={isReplayPlaying}
//               currentTime={replayProgress}
//               totalDuration={totalDuration}
//               speed={speed}
//               onPlayPause={handlePlayPause}
//               onSeek={handleSeek}
//               onSpeedChange={handleSpeedChange}
//               onSkip={handleSkip}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.div>
//   )
// }
