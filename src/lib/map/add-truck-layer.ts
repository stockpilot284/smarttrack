import maplibregl from 'maplibre-gl'
import { createTruckFeature } from './truck-geojson'

export async function addTruckLayer(
  map: maplibregl.Map,
  initial: [number, number],
) {
  if (map.getSource('truck-source')) return

  map.addSource('truck-source', {
    type: 'geojson',
    data: createTruckFeature(initial[0], initial[1], 0),
  })

  if (!map.hasImage('truck-icon')) {
    const image = await map.loadImage('/assets/images/box.png')
    map.addImage('truck-icon', image.data)
  }

  map.addLayer({
    id: 'truck-layer',
    type: 'symbol',
    source: 'truck-source',
    layout: {
      'icon-image': 'truck-icon',
      'icon-size': 0.9,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
      'icon-rotation-alignment': 'map',
      'icon-rotate': ['get', 'bearing'],
    },
  })
}
