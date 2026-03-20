export type WeatherLevel = 'normal' | 'alert' | 'red-alert'
export type ClaimStatus = 'approved' | 'pending' | 'flagged'

export interface WorkerProfile {
  id: string
  name: string
  status: 'active' | 'inactive'
  currentLocation: string
  insuranceEligible: boolean
  trustScore: number
  weatherLevel: WeatherLevel
  signals: {
    gpsStability: number
    movementActivity: number
    networkConsistency: number
  }
}

export interface ClaimItem {
  id: string
  submittedAt: string
  amount: string
  status: ClaimStatus
  reason?: string
}

export interface WorkerMapPoint {
  id: string
  name: string
  x: number
  y: number
  isSuspicious: boolean
}

export interface WeatherSnapshot {
  temperatureC: number
  precipitationMm: number
  windSpeed: number
  weatherCode: number
  level: WeatherLevel
  updatedAt: string
}

export interface NearbyRainPlace {
  id: string
  name: string
  lat: number
  lon: number
  precipitationMm: number
  temperatureC: number
  isRaining: boolean
}
