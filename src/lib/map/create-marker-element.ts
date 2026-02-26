import { MapMarkerType } from '@/types/tracking'
import { pickupSVG, dropoffSVG, truckSVG } from './map/map-markers'

export function createMarkerElement(
  type: MapMarkerType,
  theme: 'light' | 'dark',
  rotation = 0,
) {
  const el = document.createElement('div')

  el.style.width = '40px'
  el.style.height = '40px'
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'
  el.style.transform = `rotate(${rotation}deg)`
  el.style.willChange = 'transform'

  switch (type) {
    case 'pickup':
      el.innerHTML = pickupSVG(theme)
      break
    case 'dropoff':
      el.innerHTML = dropoffSVG(theme)
      break
    case 'truck':
      el.innerHTML = truckSVG(theme)
      break
  }

  return el
}
