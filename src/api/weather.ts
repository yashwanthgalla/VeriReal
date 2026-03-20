import type { NearbyRainPlace, WeatherSnapshot } from '../types'

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast'

function mapWeatherCodeToLevel(code: number, precipitation: number): WeatherSnapshot['level'] {
  if (precipitation >= 7 || [95, 96, 99].includes(code)) {
    return 'red-alert'
  }
  if (precipitation >= 1 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return 'alert'
  }
  return 'normal'
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    throw new Error('Unable to resolve current location name')
  }

  const result = (await response.json()) as {
    address?: { city?: string; town?: string; suburb?: string; state?: string }
  }

  const place = result.address?.suburb ?? result.address?.city ?? result.address?.town ?? 'Current area'
  const state = result.address?.state ?? ''
  return state ? `${place}, ${state}` : place
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherSnapshot> {
  const response = await fetch(
    `${OPEN_METEO_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,precipitation,wind_speed_10m`,
  )

  if (!response.ok) {
    throw new Error('Failed to load current weather')
  }

  const data = (await response.json()) as {
    current: {
      temperature_2m: number
      weather_code: number
      precipitation: number
      wind_speed_10m: number
    }
  }

  return {
    temperatureC: data.current.temperature_2m,
    precipitationMm: data.current.precipitation,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    level: mapWeatherCodeToLevel(data.current.weather_code, data.current.precipitation),
    updatedAt: new Date().toISOString(),
  }
}

export async function getNearbyRainPlaces(lat: number, lon: number): Promise<NearbyRainPlace[]> {
  const offsets = [
    { label: 'North', dLat: 0.1, dLon: 0 },
    { label: 'South', dLat: -0.1, dLon: 0 },
    { label: 'West', dLat: 0, dLon: -0.1 },
    { label: 'East', dLat: 0, dLon: 0.1 },
    { label: 'Center', dLat: 0, dLon: 0 },
  ]

  const places = await Promise.all(
    offsets.map(async (offset, index) => {
      const nextLat = lat + offset.dLat
      const nextLon = lon + offset.dLon
      const response = await fetch(
        `${OPEN_METEO_BASE}?latitude=${nextLat}&longitude=${nextLon}&current=precipitation,temperature_2m`,
      )

      if (!response.ok) {
        throw new Error('Failed to load nearby rain places')
      }

      const data = (await response.json()) as {
        current: {
          precipitation: number
          temperature_2m: number
        }
      }

      return {
        id: `place-${index + 1}`,
        name: offset.label,
        lat: nextLat,
        lon: nextLon,
        precipitationMm: data.current.precipitation,
        temperatureC: data.current.temperature_2m,
        isRaining: data.current.precipitation > 0,
      }
    }),
  )

  return places
}
