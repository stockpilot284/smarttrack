let RadarInstance: any = null

export async function getRadar() {
  if (typeof window !== 'undefined' && !RadarInstance) {
    const radarModule = await import('radar-sdk-js')
    RadarInstance = radarModule.default || radarModule
    RadarInstance.initialize(
      import.meta.env.VITE_RADAR_PUBLISHABLE_KEY as string,
    )
  }
  return RadarInstance
}
