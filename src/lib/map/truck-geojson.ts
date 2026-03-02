export function createTruckFeature(
  longtitude: number,
  latitude: number,
  bearing = 0,
) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longtitude, latitude],
        },
        properties: {
          bearing,
        },
      },
    ],
  } as GeoJSON.FeatureCollection
}
