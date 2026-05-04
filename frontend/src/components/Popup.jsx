import { COLORS, MONTHS } from '../data/spots.js'

function LocationRow({ loc, color }) {
  return (
    <div className="popup-loc">
      <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
        <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5 1.5 1.5 0 0 1 5 6.5z" fill={color}/>
      </svg>
      {loc}
    </div>
  )
}

export default function Popup({ spot, month, variant, pos, onClose }) {
  if (!spot) return null
  const c = COLORS[spot.type]

  const style = { left: pos.x + 18, top: pos.y - 80 }
  if (pos.x > window.innerWidth - 310) style.left = pos.x - 290
  if (pos.y < 130) style.top = pos.y + 20

  if (variant === 'calendar') {
    return (
      <div className="popup" style={style}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-type">{spot.type}</div>
        <div className="popup-name">{spot.name}</div>
        <div className="popup-latin">{spot.latin}</div>
        <div className="popup-section-lbl">Bloom calendar</div>
        <div className="bloom-cal">
          {MONTHS.map((m, i) => {
            const blooming = spot.bloom.includes(i)
            const peak = spot.peak.includes(i)
            const cur = i === month
            return (
              <div key={m} className="cal-cell" style={{
                background: blooming ? (peak ? c.dot : c.ripple) : undefined,
                color: blooming ? (peak ? '#fff' : c.text) : undefined,
                outline: cur ? `2px solid ${c.dot}` : 'none',
                outlineOffset: '1px',
                fontWeight: cur ? 600 : 400,
              }}>{m}</div>
            )
          })}
        </div>
        <LocationRow loc={spot.loc} color={c.text} />
      </div>
    )
  }

  if (variant === 'botanical') {
    const petals = 8
    return (
      <div className="popup" style={style}>
        <button className="popup-close" onClick={onClose}>✕</button>
        <div className="popup-illus" style={{ background: `linear-gradient(135deg, ${c.ripple}, ${c.dot}28)` }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            {Array.from({ length: petals }, (_, i) => (
              <ellipse key={i} cx="40" cy="22" rx="7" ry="16"
                fill={c.dot} opacity="0.72"
                transform={`rotate(${i * (360/petals)} 40 40)`} />
            ))}
            <circle cx="40" cy="40" r="9" fill={c.ripple} />
            <circle cx="40" cy="40" r="4.5" fill={c.dot} opacity="0.9" />
          </svg>
          <div style={{ position:'absolute', bottom:6, right:9,
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:10, color:c.text, opacity:0.65 }}>{spot.latin}</div>
        </div>
        <div className="popup-name">{spot.name}</div>
        <div className="popup-desc">{spot.desc}</div>
        <LocationRow loc={spot.loc} color={c.text} />
      </div>
    )
  }

  // Default: species info + bloom bar
  return (
    <div className="popup" style={style}>
      <button className="popup-close" onClick={onClose}>✕</button>
      <div className="popup-type">{spot.type}</div>
      <div className="popup-name">{spot.name}</div>
      <div className="popup-latin">{spot.latin}</div>
      <div className="popup-section-lbl">Bloom season</div>
      <div className="bloom-bar">
        {MONTHS.map((m, i) => (
          <div key={m} className="bloom-seg" style={{
            background: spot.peak.includes(i) ? c.dot
                      : spot.bloom.includes(i) ? c.ripple
                      : undefined,
            outline: i === month ? `1.5px solid ${c.dot}` : 'none',
          }} />
        ))}
      </div>
      <div className="popup-desc">{spot.desc}</div>
      <LocationRow loc={spot.loc} color={c.text} />
    </div>
  )
}
