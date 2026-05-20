import { useEffect, useRef, useState, useMemo } from 'react'
import maplibregl from 'maplibre-gl'
import { useHexGroups, useHexLayer, useBloomDots, useBloomHotspots, useMapleLayer } from '../hooks/useHexBins.js'
import { COMMON_NAME_TO_GENUS, SPECIES_DATA } from '../data/seasonality.js'
import FlowerIllustration from './FlowerIllustration.jsx'

const HEX_SOURCE     = 'hex-blooming'
const HEX_FILL       = 'hex-fill'
const HEX_STROKE     = 'hex-stroke'
const HEX_HOVER_SRC  = 'hex-hover'
const HEX_HOVER_FILL = 'hex-hover-fill'
const HEX_HOVER_LINE = 'hex-hover-line'
const DOTS_SOURCE    = 'bloom-dots'
const DOTS_LAYER     = 'bloom-dots-layer'
const MAPLE_SOURCE   = 'maple-autumn'
const MAPLE_LAYER    = 'maple-autumn-layer'
const HOTSPOT_SOURCE = 'bloom-hotspots'
const HOTSPOT_BASE   = 'hotspot-base'
const HOTSPOT_RIPPLE = 'hotspot-ripple'
const EXACT_SOURCE   = 'bloom-exact'
const EXACT_LAYER    = 'bloom-exact-layer'

const EMPTY_FC = { type: 'FeatureCollection', features: [] }
const HIGH_ZOOM = 14  // threshold: exact flowers appear, hex overview hides

// Maps raw GeoJSON colors → muted canonical colors for the exact bloom layer
const RAW_TO_CANONICAL = {
  '#FFB7C5': '#d4847a', '#F2A6C8': '#c49fcb', '#C2529E': '#c49fcb',
  '#FFAABB': '#d4847a', '#FFFFFF':  '#b8d4bb', '#FFEEAA': '#c99a4e',
  '#FFFFF0': '#c99a4e', '#E8F5A3':  '#7a9e7e', '#FFFDE7': '#c99a4e',
  '#FF6B9D': '#d47e8c', '#90EE90':  '#7a9e7e', '#FFCC88': '#c99a4e',
  '#F5F5DC': '#c99a4e', '#FF69B4':  '#d47e8c', '#9370DB': '#9b8ec4',
  '#C8A4DC': '#9b8ec4', '#FF5555':  '#d47e8c', '#B39DDB': '#9b8ec4',
  '#FFD700': '#c99a4e', '#FF6633':  '#d4847a', '#FFB6C1': '#d4847a',
  '#B57EDC': '#9b8ec4', '#FFDD44':  '#c99a4e', '#FFB0C8': '#d4847a',
}

function buildColorCircleExpr() {
  const pairs = Object.entries(RAW_TO_CANONICAL).flatMap(([raw, canon]) => [raw, canon])
  return ['match', ['get', 'color'], ...pairs, '#9ab89e']
}

// Returns the first genus in the list that is actually blooming this month.
// Maple (Acer) is only returned in autumn (months 8–10); all others are checked
// against their SPECIES_DATA bloom_months (0-indexed, matching the app).
function getTopGenus(topSpeciesStr, month) {
  if (!topSpeciesStr) return null
  try {
    const list = typeof topSpeciesStr === 'string' ? JSON.parse(topSpeciesStr) : topSpeciesStr
    for (const { name } of list) {
      const genus = COMMON_NAME_TO_GENUS[name]
      if (!genus) continue
      if (genus === 'Acer') {
        if (month >= 8 && month <= 10) return genus   // maple: autumn only
        continue
      }
      const sp = SPECIES_DATA[genus]
      if (sp && sp.bloom_months.includes(month)) return genus
    }
  } catch (e) {}
  return null
}

function HoverFlowerAnim({ info }) {
  if (!info) return null
  return (
    <div
      className="hover-flower-anim"
      style={{
        position: 'fixed',
        left: info.x - 32,
        top: info.y - 88,
        pointerEvents: 'none',
        zIndex: 900,
        width: 64,
        height: 64,
        filter: 'drop-shadow(0 6px 14px rgba(42,34,24,0.22))',
      }}
    >
      <FlowerIllustration genus={info.genus} size={64} />
    </div>
  )
}

function FireworkBloom({ bloom }) {
  if (!bloom) return null
  const color = bloom.color || '#d4847a'
  const petalCount = 12
  const radius = 75
  return (
    <div
      key={`bloom-${bloom.id}`}
      style={{ position: 'fixed', left: bloom.x, top: bloom.y, pointerEvents: 'none', zIndex: 3000 }}
    >
      <div className="firework-center">
        <FlowerIllustration genus={bloom.genus} size={80} />
      </div>
      {Array.from({ length: petalCount }, (_, i) => {
        const angle = (i / petalCount) * 360
        const rad = (angle * Math.PI) / 180
        const dx = Math.round(radius * Math.sin(rad))
        const dy = Math.round(-radius * Math.cos(rad))
        return (
          <div
            key={i}
            className="firework-petal"
            style={{
              '--petal-dx': `${dx}px`,
              '--petal-dy': `${dy}px`,
              '--petal-delay': `${i * 0.022}s`,
              '--petal-rot': `${angle + 180}deg`,
              position: 'absolute',
              left: -6,
              top: -10,
            }}
          >
            <svg width="12" height="20" viewBox="0 0 12 20">
              <ellipse cx="6" cy="10" rx="5" ry="9" fill={color} opacity="0.9" />
              <ellipse cx="6" cy="10" rx="2.5" ry="4.5" fill="#fff" opacity="0.3" />
            </svg>
          </div>
        )
      })}
    </div>
  )
}

export default function Map({ month, geojson, onInfoBox, infoBoxPinned }) {
  const mapContainer   = useRef(null)
  const map            = useRef(null)
  const animRef        = useRef(null)
  const transFactorRef = useRef(1)
  const hoverHexRef    = useRef(null)
  const isZoomingRef   = useRef(false)
  const monthRef       = useRef(month)
  const highZoomRef    = useRef(false)

  const [mapReady,   setMapReady]   = useState(false)
  const [hoverAnim,  setHoverAnim]  = useState(null)
  const [clickBloom, setClickBloom] = useState(null)
  const [highZoom,   setHighZoom]   = useState(false)
  const clickBloomIdRef = useRef(0)

  const hexGroups     = useHexGroups(geojson)
  const hexLayer      = useHexLayer(hexGroups)
  const bloomDots     = useBloomDots(hexGroups, month)
  const bloomHotspots = useBloomHotspots(hexGroups, month)
  const mapleLayer    = useMapleLayer(hexGroups, month)

  // Individual tree points for the exact-location bloom layer (zoom ≥ 14).
  // Maples are excluded here — they are shown by useMapleLayer (autumn only).
  const exactBloom = useMemo(() => {
    if (!geojson) return null
    const features = geojson.features.filter(f => {
      const name = (f.properties.common_name || f.properties.species || '').toLowerCase()
      const isMaple = name.includes('maple') || name.includes('acer') || name === 'sycamore'
      if (isMaple) return false
      return Array.isArray(f.properties.bloom_months) &&
        f.properties.bloom_months.includes(month + 1)
    })
    return { type: 'FeatureCollection', features }
  }, [geojson, month])

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors © CARTO',
          },
        },
        layers: [{ id: 'carto-tiles', type: 'raster', source: 'carto',
          paint: { 'raster-opacity': 1.0 } }],
      },
      center: [9.19, 45.464],
      zoom: 12,
    })

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.current.addControl(new maplibregl.AttributionControl({ compact: true, prefix: '' }), 'bottom-left')
    map.current.on('error', e => console.error('MapLibre error:', e.error?.message || e))

    const doMapSetup = () => { try {

      // ── Hex density fill (overview only — hidden at zoom ≥ HIGH_ZOOM) ──
      map.current.addSource(HEX_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({ id: HEX_FILL, type: 'fill', source: HEX_SOURCE, maxzoom: HIGH_ZOOM,
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': ['get', 'opacity'] } })
      map.current.addLayer({ id: HEX_STROKE, type: 'line', source: HEX_SOURCE, maxzoom: HIGH_ZOOM,
        paint: { 'line-color': '#7a9e7e', 'line-opacity': 0.18, 'line-width': 0.5 } })

      // ── Hex hover highlight ───────────────────────────────────────────
      map.current.addSource(HEX_HOVER_SRC, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({ id: HEX_HOVER_FILL, type: 'fill', source: HEX_HOVER_SRC, maxzoom: HIGH_ZOOM,
        paint: { 'fill-color': '#7a9e7e', 'fill-opacity': 0.22 } })
      map.current.addLayer({ id: HEX_HOVER_LINE, type: 'line', source: HEX_HOVER_SRC, maxzoom: HIGH_ZOOM,
        paint: { 'line-color': '#5a8e5e', 'line-opacity': 0.55, 'line-width': 1.5 } })

      // Hex interaction
      map.current.on('click', HEX_FILL, e => {
        const hotspotHits = map.current.queryRenderedFeatures(e.point, { layers: [HOTSPOT_BASE] })
        if (hotspotHits.length > 0) return
        const feat = e.features?.[0]
        if (!feat) return
        const { count, topSpecies, monthCounts, color } = feat.properties
        const genus = getTopGenus(topSpecies, monthRef.current)
        const id = ++clickBloomIdRef.current
        if (genus) {
          setClickBloom({ x: e.point.x, y: e.point.y, genus, color: color || '#d4847a', id })
          setTimeout(() => setClickBloom(c => c?.id === id ? null : c), 1100)
        }
        onInfoBox?.({ x: e.point.x, y: e.point.y, count, topSpecies, monthCounts, color: color || '#9ab89e' })
      })

      map.current.on('mousemove', HEX_FILL, e => {
        if (isZoomingRef.current) return
        map.current.getCanvas().style.cursor = 'pointer'
        const feat = e.features?.[0]
        if (!feat) return
        const geomStr = JSON.stringify(feat.geometry)
        if (geomStr !== hoverHexRef.current) {
          hoverHexRef.current = geomStr
          map.current.getSource(HEX_HOVER_SRC)?.setData({ type: 'FeatureCollection', features: [feat] })
        }
        const genus = getTopGenus(feat.properties.topSpecies, monthRef.current)
        setHoverAnim(prev => {
          if (prev?.genus === genus && Math.abs(prev.x - e.point.x) < 4 && Math.abs(prev.y - e.point.y) < 4) return prev
          return { x: e.point.x, y: e.point.y, genus }
        })
      })
      map.current.on('mouseleave', HEX_FILL, () => {
        map.current.getCanvas().style.cursor = ''
        map.current.getSource(HEX_HOVER_SRC)?.setData(EMPTY_FC)
        hoverHexRef.current = null
        setHoverAnim(null)
      })

      // ── Bloom dots (overview — hidden at zoom ≥ HIGH_ZOOM) ───────────
      map.current.addSource(DOTS_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: DOTS_LAYER, type: 'circle', source: DOTS_SOURCE, maxzoom: HIGH_ZOOM,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 2.5, 10, 3.5, 40, 4.5],
          'circle-color':   ['get', 'color'],
          'circle-opacity': 0.6,
          'circle-opacity-transition': { duration: 350, delay: 0 },
          'circle-radius-transition':  { duration: 380, delay: 0 },
          'circle-stroke-width': 0,
        },
      })

      // ── Maple autumn dots (overview — hidden at zoom ≥ HIGH_ZOOM) ────
      map.current.addSource(MAPLE_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: MAPLE_LAYER, type: 'circle', source: MAPLE_SOURCE, maxzoom: HIGH_ZOOM,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 2.5, 10, 3.5, 40, 4.5],
          'circle-color':   '#c4604e',
          'circle-opacity': 0.7,
          'circle-opacity-transition': { duration: 350, delay: 0 },
          'circle-radius-transition':  { duration: 380, delay: 0 },
          'circle-stroke-width': 0,
        },
      })

      // ── Hotspot ripple halo ───────────────────────────────────────────
      map.current.addSource(HOTSPOT_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: HOTSPOT_RIPPLE, type: 'circle', source: HOTSPOT_SOURCE,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 5, 12, 40, 18],
          'circle-color':  ['get', 'color'],
          'circle-opacity': 0.18,
          'circle-stroke-width': 0,
        },
      })

      // ── Hotspot base ──────────────────────────────────────────────────
      map.current.addLayer({
        id: HOTSPOT_BASE, type: 'circle', source: HOTSPOT_SOURCE,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 5, 5, 40, 9],
          'circle-color':  ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-opacity-transition': { duration: 350, delay: 0 },
          'circle-radius-transition':  { duration: 380, delay: 0 },
          'circle-stroke-width': 0.8,
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 0.8,
        },
      })

      // Hotspot click → InfoBox + bloom
      map.current.on('click', HOTSPOT_BASE, e => {
        const feat = e.features?.[0]
        if (!feat) return
        const { count, topSpecies, monthCounts, color } = feat.properties
        const genus = getTopGenus(topSpecies, monthRef.current)
        const id = ++clickBloomIdRef.current
        if (genus) {
          setClickBloom({ x: e.point.x, y: e.point.y, genus, color: color || '#d4847a', id })
          setTimeout(() => setClickBloom(c => c?.id === id ? null : c), 1100)
        }
        onInfoBox?.({ x: e.point.x, y: e.point.y, count, topSpecies, monthCounts, color })
      })

      // Click on empty map → close InfoBox (unless pinned — use ref to avoid stale closure)
      map.current.on('click', e => {
        const hs = map.current.queryRenderedFeatures(e.point, { layers: [HOTSPOT_BASE] })
        const hx = map.current.queryRenderedFeatures(e.point, { layers: [HEX_FILL] })
        const ex = map.current.queryRenderedFeatures(e.point, { layers: [EXACT_LAYER] })
        if (hs.length === 0 && hx.length === 0 && ex.length === 0 && !infoBoxPinnedRef.current) {
          onInfoBox?.(null)
        }
      })

      map.current.on('mouseenter', HOTSPOT_BASE, () => { map.current.getCanvas().style.cursor = 'pointer' })
      map.current.on('mouseleave', HOTSPOT_BASE, () => { map.current.getCanvas().style.cursor = '' })

      // ── Exact bloom layer (individual trees, zoom ≥ HIGH_ZOOM) ───────
      map.current.addSource(EXACT_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: EXACT_LAYER,
        type: 'circle',
        source: EXACT_SOURCE,
        minzoom: HIGH_ZOOM,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'],
            HIGH_ZOOM, 2.5,
            16, 4,
            18, 6,
          ],
          'circle-color': buildColorCircleExpr(),
          'circle-opacity': ['interpolate', ['linear'], ['zoom'],
            HIGH_ZOOM, 0,
            HIGH_ZOOM + 0.5, 0.82,
          ],
          'circle-stroke-width': 0.8,
          'circle-stroke-color': '#fff',
          'circle-stroke-opacity': 0.7,
        },
      })

      // ── Exact-dot interactions (zoom ≥ HIGH_ZOOM individual trees) ───────
      map.current.on('mousemove', EXACT_LAYER, e => {
        if (isZoomingRef.current) return
        map.current.getCanvas().style.cursor = 'pointer'
        const feat = e.features?.[0]
        if (!feat) return
        // Genus direct from the feature — layer is already filtered to bloomers
        const name = feat.properties.common_name || feat.properties.species || ''
        const genus = COMMON_NAME_TO_GENUS[name] || null
        setHoverAnim(prev => {
          if (prev?.genus === genus && Math.abs(prev.x - e.point.x) < 4 && Math.abs(prev.y - e.point.y) < 4) return prev
          return { x: e.point.x, y: e.point.y, genus }
        })
      })
      map.current.on('mouseleave', EXACT_LAYER, () => {
        map.current.getCanvas().style.cursor = ''
        setHoverAnim(null)
      })
      map.current.on('click', EXACT_LAYER, e => {
        // Avoid double-firing if a hotspot is also under the cursor
        const hs = map.current.queryRenderedFeatures(e.point, { layers: [HOTSPOT_BASE] })
        if (hs.length > 0) return
        const feat = e.features?.[0]
        if (!feat) return
        const name = feat.properties.common_name || feat.properties.species || ''
        const genus = COMMON_NAME_TO_GENUS[name] || null
        if (!genus) return
        const color = feat.properties.color || '#d4847a'
        const id = ++clickBloomIdRef.current
        setClickBloom({ x: e.point.x, y: e.point.y, genus, color, id })
        setTimeout(() => setClickBloom(c => c?.id === id ? null : c), 1100)
      })

      // ── Zoom state tracking ────────────────────────────────────────────
      map.current.on('zoom', () => { isZoomingRef.current = true })
      map.current.on('zoomend', () => {
        isZoomingRef.current = false
        const hz = map.current.getZoom() >= HIGH_ZOOM
        highZoomRef.current = hz
        setHighZoom(hz)
      })

      setMapReady(true)
    } catch(e) {
      console.error('MapLibre setup error:', e.message)
      setMapReady(true)
    }}

    // Poll isStyleLoaded() each animation frame — avoids the race where 'load'
    // fires synchronously during Map construction (before the listener attaches)
    // or fires very slowly due to network conditions in the preview environment.
    let setupCalled = false
    const waitForStyle = () => {
      if (!map.current) return          // cleanup ran; stop polling
      if (setupCalled) return           // already set up
      if (map.current.isStyleLoaded()) {
        setupCalled = true
        doMapSetup()
      } else {
        requestAnimationFrame(waitForStyle)
      }
    }
    requestAnimationFrame(waitForStyle)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      map.current?.remove()
      map.current = null
      setMapReady(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep props accessible in map event handlers without re-registering
  const infoBoxPinnedRef = useRef(infoBoxPinned)
  useEffect(() => { infoBoxPinnedRef.current = infoBoxPinned }, [infoBoxPinned])
  useEffect(() => { monthRef.current = month }, [month])

  // ── Update hex layer (static) ────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !hexLayer) return
    map.current?.getSource(HEX_SOURCE)?.setData(hexLayer)
  }, [mapReady, hexLayer])

  // ── Smooth scale + fade on month change ─────────────────────────────────
  useEffect(() => {
    if (!mapReady || !bloomDots || !bloomHotspots) return

    // Scale down + fade out
    const smallRadius = ['interpolate', ['linear'], ['get', 'count'], 1, 1.4, 10, 2.0, 40, 2.8]
    const normRadius  = ['interpolate', ['linear'], ['get', 'count'], 1, 2.5, 10, 3.5, 40, 4.5]

    map.current?.setPaintProperty(DOTS_LAYER,    'circle-radius',  smallRadius)
    map.current?.setPaintProperty(DOTS_LAYER,    'circle-opacity', 0)
    map.current?.setPaintProperty(MAPLE_LAYER,   'circle-radius',  smallRadius)
    map.current?.setPaintProperty(MAPLE_LAYER,   'circle-opacity', 0)
    map.current?.setPaintProperty(HOTSPOT_BASE,  'circle-opacity', 0)
    transFactorRef.current = 0

    const tid = setTimeout(() => {
      // Update data sources
      map.current?.getSource(DOTS_SOURCE)?.setData(bloomDots)
      map.current?.getSource(HOTSPOT_SOURCE)?.setData(bloomHotspots)
      map.current?.getSource(MAPLE_SOURCE)?.setData(mapleLayer || EMPTY_FC)

      // Scale up + fade in
      requestAnimationFrame(() => {
        map.current?.setPaintProperty(DOTS_LAYER,   'circle-radius',  normRadius)
        map.current?.setPaintProperty(DOTS_LAYER,   'circle-opacity', 0.6)
        map.current?.setPaintProperty(MAPLE_LAYER,  'circle-radius',  normRadius)
        map.current?.setPaintProperty(MAPLE_LAYER,  'circle-opacity', 0.7)
        map.current?.setPaintProperty(HOTSPOT_BASE, 'circle-opacity', 0.85)
        transFactorRef.current = 1
      })
    }, 260)

    return () => clearTimeout(tid)
  }, [mapReady, bloomDots, bloomHotspots, mapleLayer])

  // ── Feed exact bloom points to the high-zoom layer ──────────────────────
  useEffect(() => {
    if (!mapReady || !exactBloom) return
    map.current?.getSource(EXACT_SOURCE)?.setData(exactBloom)
  }, [mapReady, exactBloom])

  // ── Animate ripple pulse ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady) return
    let t = 0
    const tick = () => {
      t += 0.022
      const pulse = (Math.sin(t * 3.2) + 1) / 2
      map.current?.setPaintProperty(HOTSPOT_RIPPLE, 'circle-opacity', (0.06 + pulse * 0.22) * transFactorRef.current)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [mapReady])

  return (
    <>
      <div ref={mapContainer} className="map" />
      <HoverFlowerAnim key={hoverAnim?.genus || 'none'} info={hoverAnim} />
      <FireworkBloom bloom={clickBloom} />
    </>
  )
}
