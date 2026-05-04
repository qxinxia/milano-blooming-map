import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { useHexGroups, useHexLayer, useBloomDots, useBloomHotspots, useMapleLayer } from '../hooks/useHexBins.js'
import { getMonthSeason } from '../data/seasonality.js'

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

const EMPTY_FC = { type: 'FeatureCollection', features: [] }

// Floating plant animation on hex hover — emoji + CSS class based on season
function HoverPlantAnim({ info, month }) {
  if (!info) return null
  const season = getMonthSeason(month)
  const icon  = season === 'spring' ? '🌸'
              : season === 'summer' ? '🌿'
              : season === 'autumn' ? '🍁'
              : '🌿'
  const cls   = season === 'spring' ? 'anim-flower'
              : season === 'summer' ? 'anim-leaf'
              : season === 'autumn' ? 'anim-autumn'
              : 'anim-bare'

  return (
    <div style={{
      position: 'fixed',
      left: info.x - 14,
      top:  info.y - 46,
      pointerEvents: 'none',
      zIndex: 900,
      fontSize: 22,
      lineHeight: 1,
    }} className={cls} key={`${info.x}-${info.y}-${month}`}>
      {icon}
    </div>
  )
}

export default function Map({ month, geojson, onInfoBox, infoBoxPinned }) {
  const mapContainer   = useRef(null)
  const map            = useRef(null)
  const animRef        = useRef(null)
  const transFactorRef = useRef(1)
  const hoverHexRef    = useRef(null)

  const [mapReady,  setMapReady]  = useState(false)
  const [hoverAnim, setHoverAnim] = useState(null)

  const hexGroups     = useHexGroups(geojson)
  const hexLayer      = useHexLayer(hexGroups)
  const bloomDots     = useBloomDots(hexGroups, month)
  const bloomHotspots = useBloomHotspots(hexGroups, month)
  const mapleLayer    = useMapleLayer(hexGroups, month)

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
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

    map.current.on('load', () => {

      // ── Hex density fill ──────────────────────────────────────────────
      map.current.addSource(HEX_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({ id: HEX_FILL, type: 'fill', source: HEX_SOURCE,
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': ['get', 'opacity'] } })
      map.current.addLayer({ id: HEX_STROKE, type: 'line', source: HEX_SOURCE,
        paint: { 'line-color': '#7a9e7e', 'line-opacity': 0.18, 'line-width': 0.5 } })

      // ── Hex hover highlight ───────────────────────────────────────────
      map.current.addSource(HEX_HOVER_SRC, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({ id: HEX_HOVER_FILL, type: 'fill', source: HEX_HOVER_SRC,
        paint: { 'fill-color': '#7a9e7e', 'fill-opacity': 0.22 } })
      map.current.addLayer({ id: HEX_HOVER_LINE, type: 'line', source: HEX_HOVER_SRC,
        paint: { 'line-color': '#5a8e5e', 'line-opacity': 0.55, 'line-width': 1.5 } })

      // Hex interaction
      map.current.on('click', HEX_FILL, e => {
        const hotspotHits = map.current.queryRenderedFeatures(e.point, { layers: [HOTSPOT_BASE] })
        if (hotspotHits.length > 0) return
        const feat = e.features?.[0]
        if (!feat) return
        const { count, topSpecies, monthCounts, color } = feat.properties
        onInfoBox?.({ x: e.point.x, y: e.point.y, count, topSpecies, monthCounts, color: color || '#9ab89e' })
      })

      map.current.on('mousemove', HEX_FILL, e => {
        map.current.getCanvas().style.cursor = 'pointer'
        const feat = e.features?.[0]
        if (!feat) return
        // Update hover highlight geometry
        const geomStr = JSON.stringify(feat.geometry)
        if (geomStr !== hoverHexRef.current) {
          hoverHexRef.current = geomStr
          map.current.getSource(HEX_HOVER_SRC)?.setData({ type: 'FeatureCollection', features: [feat] })
        }
        setHoverAnim({ x: e.point.x, y: e.point.y })
      })
      map.current.on('mouseleave', HEX_FILL, () => {
        map.current.getCanvas().style.cursor = ''
        map.current.getSource(HEX_HOVER_SRC)?.setData(EMPTY_FC)
        hoverHexRef.current = null
        setHoverAnim(null)
      })

      // ── Bloom dots ────────────────────────────────────────────────────
      map.current.addSource(DOTS_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: DOTS_LAYER, type: 'circle', source: DOTS_SOURCE,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 1, 2.5, 10, 3.5, 40, 4.5],
          'circle-color':   ['get', 'color'],
          'circle-opacity': 0.6,
          'circle-opacity-transition': { duration: 350, delay: 0 },
          'circle-radius-transition':  { duration: 380, delay: 0 },
          'circle-stroke-width': 0,
        },
      })

      // ── Maple autumn dots ─────────────────────────────────────────────
      map.current.addSource(MAPLE_SOURCE, { type: 'geojson', data: EMPTY_FC })
      map.current.addLayer({
        id: MAPLE_LAYER, type: 'circle', source: MAPLE_SOURCE,
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

      // Hotspot click → InfoBox
      map.current.on('click', HOTSPOT_BASE, e => {
        const feat = e.features?.[0]
        if (!feat) return
        const { count, topSpecies, monthCounts, color } = feat.properties
        onInfoBox?.({ x: e.point.x, y: e.point.y, count, topSpecies, monthCounts, color })
      })

      // Click on empty map → close InfoBox (unless pinned — use ref to avoid stale closure)
      map.current.on('click', e => {
        const hs = map.current.queryRenderedFeatures(e.point, { layers: [HOTSPOT_BASE] })
        const hx = map.current.queryRenderedFeatures(e.point, { layers: [HEX_FILL] })
        if (hs.length === 0 && hx.length === 0 && !infoBoxPinnedRef.current) {
          onInfoBox?.(null)
        }
      })

      map.current.on('mouseenter', HOTSPOT_BASE, () => { map.current.getCanvas().style.cursor = 'pointer' })
      map.current.on('mouseleave', HOTSPOT_BASE, () => { map.current.getCanvas().style.cursor = '' })

      setMapReady(true)
    })

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      map.current?.remove()
      map.current = null
      setMapReady(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep infoBoxPinned accessible in click handler without re-registering
  const infoBoxPinnedRef = useRef(infoBoxPinned)
  useEffect(() => { infoBoxPinnedRef.current = infoBoxPinned }, [infoBoxPinned])

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
      <HoverPlantAnim info={hoverAnim} month={month} />
    </>
  )
}
