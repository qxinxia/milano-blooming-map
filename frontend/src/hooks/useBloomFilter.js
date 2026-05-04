import { useMemo } from 'react'

export default function useBloomFilter(geojson, month) {
  return useMemo(() => {
    if (!geojson) return null
    const filtered = geojson.features.filter(f =>
      Array.isArray(f.properties.bloom_months) &&
      f.properties.bloom_months.includes(month)
    )
    return { type: 'FeatureCollection', features: filtered }
  }, [geojson, month])
}
