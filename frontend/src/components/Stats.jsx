import { SPOTS, MONTH_HUE } from '../data/spots.js'

export default function Stats({ month }) {
  const hue = MONTH_HUE[month]
  const activeCount = SPOTS.filter(s => s.bloom.includes(month)).length
  const peakCount   = SPOTS.filter(s => s.peak.includes(month)).length

  return (
    <div className="stats">
      <div className="stat-chip">
        <span className="stat-dot" style={{ background: hue }} />
        <strong>{activeCount}</strong>&nbsp;blooming spots
      </div>
      {peakCount > 0 && (
        <div className="stat-chip">
          <span className="stat-dot" style={{ background: hue, boxShadow: `0 0 0 2px ${hue}44` }} />
          <strong>{peakCount}</strong>&nbsp;at peak bloom
        </div>
      )}
    </div>
  )
}
