import Radar from 'radar-sdk-js'

Radar.initialize(import.meta.env.VITE_RADAR_PUBLISHABLE_KEY as string)

export default Radar
