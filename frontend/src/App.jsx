import { useState, useEffect, useRef, useCallback } from 'react'
import Map from './components/Map.jsx'
import Timeline from './components/Timeline.jsx'
import Legend from './components/Legend.jsx'
import Stats from './components/Stats.jsx'
import InfoBox from './components/InfoBox.jsx'
import './styles/animations.css'

export default function App() {
  const [month,   setMonth]   = useState(2)
  const [geojson, setGeojson] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [infoBox, setInfoBox] = useState(null)  // { data + pinned }
  const timerRef = useRef(null)

  useEffect(() => {
    fetch('/milan_blooming.geojson')
      .then(r => r.json())
      .then(setGeojson)
      .catch(err => console.error('Failed to load bloom data:', err))
  }, [])

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setMonth(m => (m + 1) % 12), 1800)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [playing])

  const handleMonthChange = useCallback((m) => setMonth(m), [])

  const handleInfoBox = useCallback((data) => {
    setInfoBox(prev => {
      // If same location clicked while pinned, close it
      if (prev?.pinned && prev?.x === data?.x && prev?.y === data?.y) return null
      return data ? { ...data, pinned: false } : null
    })
  }, [])

  const handleInfoBoxClose = useCallback(() => setInfoBox(null), [])

  const handleInfoBoxPin = useCallback(() => {
    setInfoBox(prev => prev ? { ...prev, pinned: !prev.pinned } : null)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Map
        month={month}
        geojson={geojson}
        onInfoBox={handleInfoBox}
        infoBoxPinned={infoBox?.pinned ?? false}
      />

      <div className="ui-layer">
        <div className="hd">
          <div className="hd-title">Blooming <em>Milano</em></div>
          <div className="hd-sub">Flowering trees &amp; gardens · 2026</div>
        </div>

        <Stats month={month} />
        <Legend />

        <Timeline
          month={month}
          onChange={handleMonthChange}
          playing={playing}
          onPlayPause={() => setPlaying(p => !p)}
        />
      </div>

      {/* InfoBox rendered above the UI layer so it's always on top */}
      {infoBox && (
        <InfoBox
          info={infoBox}
          month={month}
          onClose={handleInfoBoxClose}
          onPin={handleInfoBoxPin}
        />
      )}
    </div>
  )
}
