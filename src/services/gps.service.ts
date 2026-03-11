export function getCurrentPosition(
  options: PositionOptions = {},
  minAccuracyMeters: number = 100, // optional: reject if accuracy worse than this
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Check if the accuracy meets the minimum requirement
        if (position.coords.accuracy > minAccuracyMeters) {
          reject(
            new Error(
              `Location accuracy is too low (${Math.round(
                position.coords.accuracy,
              )}m). Please try again in an area with better GPS signal.`,
            ),
          )
        } else {
          resolve(position)
        }
      },
      (error) => {
        // On high‑accuracy failure, try low accuracy as fallback
        console.warn(
          'High accuracy failed, falling back to low accuracy.',
          error,
        )

        const lowAccuracyOptions: PositionOptions = {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000, // allow cached positions
          ...options,
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Even low accuracy might be enough for some use cases
            if (position.coords.accuracy > minAccuracyMeters) {
              reject(
                new Error(
                  `Low accuracy location is still too coarse (${Math.round(
                    position.coords.accuracy,
                  )}m). Cannot determine precise location.`,
                ),
              )
            } else {
              resolve(position)
            }
          },
          (fallbackError) => {
            reject(
              new Error(
                `Unable to retrieve your location. Please ensure location services are enabled and try again. (${fallbackError.message})`,
              ),
            )
          },
          lowAccuracyOptions,
        )
      },
      highAccuracyOptions,
    )
  })
}
