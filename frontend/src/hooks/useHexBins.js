import { useMemo } from 'react'
import { latLngToCell, cellToBoundary, cellToLatLng, cellToParent } from 'h3-js'

const RESOLUTION = 10 // ~65m hex diameter

const COLOR_REMAP = {
  '#FFB7C5': '#d4847a',
  '#F2A6C8': '#c49fcb',
  '#C2529E': '#c49fcb',
  '#FFAABB': '#d4847a',
  '#FFFFFF': '#b8d4bb',
  '#FFEEAA': '#c99a4e',
  '#FFFFF0': '#c99a4e',
  '#E8F5A3': '#7a9e7e',
  '#FFFDE7': '#c99a4e',
  '#FF6B9D': '#d47e8c',
  '#90EE90': '#7a9e7e',
  '#FFCC88': '#c99a4e',
  '#F5F5DC': '#c99a4e',
  '#FF69B4': '#d47e8c',
  '#9370DB': '#9b8ec4',
  '#C8A4DC': '#9b8ec4',
  '#FF5555': '#d47e8c',
  '#B39DDB': '#9b8ec4',
  '#FFD700': '#c99a4e',
  '#FF6633': '#d4847a',
  '#FFB6C1': '#d4847a',
  '#B57EDC': '#9b8ec4',
  '#FFDD44': '#c99a4e',
  '#FFB0C8': '#d4847a',
}

// Phase 1: bin all features by hex cell (runs once on data load)
export function useHexGroups(geojson) {
  return useMemo(() => {
    if (!geojson) return null
    const groups = {}
    for (const feat of geojson.features) {
      const [lng, lat] = feat.geometry.coordinates
      const cellId = latLngToCell(lat, lng, RESOLUTION)
      if (!groups[cellId]) groups[cellId] = []
      groups[cellId].push(feat.properties)
    }
    return groups
  }, [geojson])
}

// Phase 2a: static hex density layer — neutral sage, no month dependency
export function useHexLayer(hexGroups) {
  return useMemo(() => {
    if (!hexGroups) return null
    const maxCount = Math.max(...Object.values(hexGroups).map(g => g.length))

    const features = Object.entries(hexGroups).map(([cellId, props]) => {
      const opacity = 0.10 + (props.length / maxCount) * 0.28

      const speciesMap = {}
      for (const p of props) {
        const key = p.common_name || p.species || 'Unknown'
        speciesMap[key] = (speciesMap[key] || 0) + 1
      }
      const topSpecies = JSON.stringify(
        Object.entries(speciesMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
          .map(([name, count]) => ({ name, count }))
      )

      const monthCounts = JSON.stringify(
        Array.from({ length: 12 }, (_, m) =>
          props.filter(p => Array.isArray(p.bloom_months) && p.bloom_months.includes(m + 1)).length
        )
      )

      const boundary = cellToBoundary(cellId)
      const coords = boundary.map(([lat, lng]) => [lng, lat])
      coords.push(coords[0])
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: { count: props.length, opacity, color: '#9ab89e', topSpecies, monthCounts },
      }
    })
    return { type: 'FeatureCollection', features }
  }, [hexGroups])
}

function isMaple(props) {
  const name = (props.common_name || props.species || '').toLowerCase()
  return name.includes('maple') || name.includes('acer') || name === 'sycamore'
}

// Phase 2b: small static bloom dots at hex centroids (non-clickable background layer)
// Maples are excluded here — they are handled by useMapleLayer instead
export function useBloomDots(hexGroups, month) {
  return useMemo(() => {
    if (!hexGroups) return null
    const features = []
    for (const [cellId, props] of Object.entries(hexGroups)) {
      const blooming = props.filter(p =>
        !isMaple(p) &&
        Array.isArray(p.bloom_months) && p.bloom_months.includes(month + 1)
      )
      if (blooming.length === 0) continue

      const [lat, lng] = cellToLatLng(cellId)
      const colorCounts = {}
      for (const p of blooming) {
        const mapped = COLOR_REMAP[p.color] || p.color
        colorCounts[mapped] = (colorCounts[mapped] || 0) + 1
      }
      const color = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0]

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { count: blooming.length, color },
      })
    }
    return { type: 'FeatureCollection', features }
  }, [hexGroups, month])
}

// Maple-only autumn layer: only visible in Sep–Nov (months 8–10), red leaves, no flowers
export function useMapleLayer(hexGroups, month) {
  return useMemo(() => {
    if (!hexGroups || month < 8 || month > 10)
      return { type: 'FeatureCollection', features: [] }

    const features = []
    for (const [cellId, props] of Object.entries(hexGroups)) {
      const maples = props.filter(isMaple)
      if (maples.length === 0) continue

      const [lat, lng] = cellToLatLng(cellId)
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { count: maples.length, color: '#c4604e' },
      })
    }
    return { type: 'FeatureCollection', features }
  }, [hexGroups, month])
}

// Phase 2c: one pulsing hotspot per ~460m zone (res-8 parent cell)
// Each hotspot = the highest-bloom res-10 child cell in its parent
export function useBloomHotspots(hexGroups, month) {
  return useMemo(() => {
    if (!hexGroups) return null

    // Find best child cell per res-8 parent (maples excluded from bloom hotspots)
    const parentBest = {}
    for (const [cellId, props] of Object.entries(hexGroups)) {
      const blooming = props.filter(p =>
        !isMaple(p) &&
        Array.isArray(p.bloom_months) && p.bloom_months.includes(month + 1)
      )
      if (blooming.length === 0) continue

      const parentId = cellToParent(cellId, 8)
      const existing = parentBest[parentId]
      if (!existing || blooming.length > existing.bloomCount) {
        parentBest[parentId] = { cellId, props, bloomCount: blooming.length, blooming }
      }
    }

    const features = Object.values(parentBest).map(({ cellId, props, bloomCount, blooming }) => {
      const [lat, lng] = cellToLatLng(cellId)

      // Dominant bloom color
      const colorCounts = {}
      for (const p of blooming) {
        const mapped = COLOR_REMAP[p.color] || p.color
        colorCounts[mapped] = (colorCounts[mapped] || 0) + 1
      }
      const color = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0]

      // Top species for popup
      const speciesMap = {}
      for (const p of blooming) {
        const key = p.common_name || p.species || 'Unknown'
        speciesMap[key] = (speciesMap[key] || 0) + 1
      }
      const topSpecies = JSON.stringify(
        Object.entries(speciesMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([name, count]) => ({ name, count }))
      )

      // Month-by-month bloom counts for bloom bar (12 values, 0-indexed)
      const monthCounts = JSON.stringify(
        Array.from({ length: 12 }, (_, m) =>
          props.filter(p => Array.isArray(p.bloom_months) && p.bloom_months.includes(m + 1)).length
        )
      )

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { count: bloomCount, totalCount: props.length, color, topSpecies, monthCounts },
      }
    })

    // Keep only top 15 by bloom count to avoid overcrowding
    features.sort((a, b) => b.properties.count - a.properties.count)
    return { type: 'FeatureCollection', features: features.slice(0, 15) }
  }, [hexGroups, month])
}
