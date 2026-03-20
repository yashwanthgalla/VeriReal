import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { NearbyRainPlace } from '../types'

interface RainMapProps {
  center: { lat: number; lon: number }
  places: NearbyRainPlace[]
}

export function RainMap({ center, places }: RainMapProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([center.lat, center.lon], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [center.lat, center.lon])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    mapRef.current.setView([center.lat, center.lon], 12)

    const markers: L.CircleMarker[] = places.map((place) => {
      const marker = L.circleMarker([place.lat, place.lon], {
        radius: 8,
        color: place.isRaining ? '#e11d48' : '#10b981',
        fillColor: place.isRaining ? '#fb7185' : '#34d399',
        fillOpacity: 0.75,
      })

      marker.bindPopup(
        `<div style="font-size: 12px; line-height: 1.4;">
          <strong>${place.name}</strong><br/>
          Rain: ${place.precipitationMm.toFixed(1)} mm<br/>
          Temp: ${place.temperatureC.toFixed(1)} C
        </div>`,
      )

      marker.addTo(mapRef.current!)
      return marker
    })

    return () => {
      markers.forEach((marker) => marker.remove())
    }
  }, [center.lat, center.lon, places])

  return <div ref={mapNodeRef} className="h-72 w-full overflow-hidden rounded-xl" />
}
