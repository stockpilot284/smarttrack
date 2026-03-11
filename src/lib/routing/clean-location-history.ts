import { LocationPing } from '@/types/tracking'
import { haversine } from './calculateEta'
import { LngLat } from 'maplibre-gl'

export function cleanLocationHistory(history: LocationPing[]): LocationPing[] {
  if (history.length < 2) return history

  const cleaned: LocationPing[] = [history[0]]

  for (let i = 1; i < history.length - 1; i++) {
    const prev = cleaned[cleaned.length - 1]
    const curr = history[i]
    const next = history[i + 1]

    // Convert to LngLat format expected by haversine
    const a = { lat: prev.latitude, lng: prev.longitude }
    const b = { lat: curr.latitude, lng: curr.longitude }
    const c = { lat: next.latitude, lng: next.longitude }

    const distToPrev = haversine(a as LngLat, b as LngLat)
    const distToNext = haversine(b as LngLat, c as LngLat)

    // Skip if too close to both neighbours (duplicate cluster)
    if (distToPrev < 5 && distToNext < 5) continue

    // Calculate speed between prev and curr (meters per second)
    const timeDiff =
      (new Date(curr.timestamp).getTime() -
        new Date(prev.timestamp).getTime()) /
      1000
    if (timeDiff > 0) {
      const speed = distToPrev / timeDiff
      // Skip if speed > 30 m/s (~108 km/h) – unrealistic for most vehicles
      if (speed > 30) continue
    }

    cleaned.push(curr)
  }

  // Always include the last point
  cleaned.push(history[history.length - 1])
  return cleaned
}
