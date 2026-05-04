import { MONTHS, MONTHS_FULL, MONTH_HUE, SPOTS } from '../data/spots.js'

export default function Timeline({ month, onChange, playing, onPlayPause }) {
  const hue = MONTH_HUE[month]

  return (
    <div className="timeline">
      <div className="tl-controls">
        <button className="tl-btn" onClick={() => onChange((month + 11) % 12)}>‹</button>
        <div className="tl-month" key={month} style={{ color: hue }}>
          {MONTHS_FULL[month]}
        </div>
        <button className="tl-btn" onClick={() => onChange((month + 1) % 12)}>›</button>
        <button
          className={`tl-btn ${playing ? 'active' : ''}`}
          style={{ marginLeft: 4 }}
          onClick={onPlayPause}
          title={playing ? 'Pause' : 'Play all months'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      <div className="tl-pips">
        {MONTHS.map((m, i) => {
          const cnt = SPOTS.filter(s => s.bloom.includes(i)).length
          const dotSize = 3 + (cnt / SPOTS.length) * 4.5
          return (
            <button
              key={m}
              className={`tl-pip ${i === month ? 'on' : ''}`}
              style={{
                color: i === month ? MONTH_HUE[i] : undefined,
                background: i === month ? `${MONTH_HUE[i]}18` : undefined,
              }}
              onClick={() => onChange(i)}
            >
              {m}
              <span className="tl-pip-dot" style={{
                width: dotSize,
                height: dotSize,
                background: MONTH_HUE[i],
                opacity: i === month ? 1 : 0.35 + (cnt / SPOTS.length) * 0.55,
              }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
