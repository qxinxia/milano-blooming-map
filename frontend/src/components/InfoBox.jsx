import { SPECIES_DATA, COMMON_NAME_TO_GENUS, getMonthSeason, getVisualState, SEASONS } from '../data/seasonality.js'
import { MONTHS } from '../data/spots.js'

const SEASON_BADGE = {
  [SEASONS.SPRING]: { label: 'Spring', bg: 'rgba(212,132,122,0.15)', color: '#b85a6c' },
  [SEASONS.SUMMER]: { label: 'Summer', bg: 'rgba(122,158,126,0.15)', color: '#4e7a54' },
  [SEASONS.AUTUMN]: { label: 'Autumn', bg: 'rgba(201,154,78,0.15)',  color: '#a47828' },
  [SEASONS.WINTER]: { label: 'Winter', bg: 'rgba(155,142,196,0.15)', color: '#7a6bab' },
}

function resolveSpecies(topSpecies) {
  if (!topSpecies) return null
  const list = typeof topSpecies === 'string' ? JSON.parse(topSpecies) : topSpecies
  for (const { name } of list) {
    const genus = COMMON_NAME_TO_GENUS[name]
    if (genus && SPECIES_DATA[genus]) return { name, genus, data: SPECIES_DATA[genus] }
  }
  // fallback: return first entry with no image data
  return list[0] ? { name: list[0].name, genus: null, data: null } : null
}

export default function InfoBox({ info, month, onClose, onPin }) {
  if (!info) return null

  const { x, y, count, topSpecies, monthCounts, color, pinned } = info

  const species     = resolveSpecies(topSpecies)
  const spData      = species?.data
  const spList      = typeof topSpecies === 'string' ? JSON.parse(topSpecies) : (topSpecies || [])
  const mCounts     = monthCounts ? JSON.parse(monthCounts) : Array(12).fill(0)
  const maxMonth    = Math.max(...mCounts, 1)
  const maxSpecies  = spList[0]?.count || 1

  const season      = getMonthSeason(month)
  const badge       = SEASON_BADGE[season]
  const visualState = species ? getVisualState(species.name, month) : null
  const bloomNow    = visualState?.state === 'bloom'

  // Positioning: keep within viewport
  const left = x > window.innerWidth  - 320 ? x - 302 : x + 18
  const top  = y < 140                       ? y + 20  : Math.min(y - 80, window.innerHeight - 500)

  const topName  = spData?.common || species?.name || 'Mixed species'
  const topLatin = spData?.latin || ''
  const topImage = spData?.image || null
  const topDesc  = spData?.desc  || ''
  const bloomPeriod = spData?.bloomPeriod || ''

  return (
    <div
      className="infobox-enter"
      style={{
        position: 'fixed', left, top,
        width: 280,
        background: 'rgba(247,243,236,0.98)',
        backdropFilter: 'blur(18px)',
        borderRadius: 16,
        border: '1px solid rgba(42,34,24,0.10)',
        boxShadow: '0 8px 40px rgba(42,34,24,0.16)',
        zIndex: 2000,
        overflow: 'hidden',
        pointerEvents: 'all',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* ── Illustration header ───────────────────────────────────────── */}
      {topImage ? (
        <div style={{ width: '100%', height: 110, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <img src={topImage} alt={topName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{
            position: 'absolute', bottom: 8, left: 10,
            padding: '3px 9px', borderRadius: 20,
            background: bloomNow ? 'rgba(212,132,122,0.9)' : 'rgba(42,34,24,0.5)',
            color: '#fff',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.8px',
            backdropFilter: 'blur(6px)',
          }} className={bloomNow ? 'badge-bloom' : ''}>
            {bloomNow ? `🌸 In bloom` : `${badge.label}`}
          </div>
        </div>
      ) : (
        /* Fallback: coloured header strip */
        <div style={{
          width: '100%', height: 44, background: `${color}22`,
          borderBottom: `2px solid ${color}44`,
          display: 'flex', alignItems: 'center', padding: '0 16px',
        }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>{spData?.icon || '🌿'}</span>
          <div style={{
            padding: '3px 9px', borderRadius: 20,
            background: bloomNow ? badge.bg : 'rgba(42,34,24,0.06)',
            color: bloomNow ? badge.color : '#8a7a6a',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.8px',
          }}>
            {bloomNow ? '🌸 In bloom' : badge.label}
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 18px 16px' }}>

        {/* Pin + Close */}
        <div style={{ position: 'absolute', top: topImage ? 8 : 10, right: 10, display: 'flex', gap: 4, zIndex: 3 }}>
          <button
            onClick={onPin}
            title={pinned ? 'Unpin' : 'Pin open'}
            style={{
              background: pinned ? 'rgba(42,34,24,0.6)' : 'rgba(247,243,236,0.85)',
              border: 'none', borderRadius: '50%',
              width: 24, height: 24, cursor: 'pointer',
              fontSize: 11, color: pinned ? '#fff' : '#8a7a6a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)', transition: 'all 0.2s',
            }}
          >
            {pinned ? '📌' : '📍'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(247,243,236,0.85)', border: 'none',
              borderRadius: '50%', width: 24, height: 24, cursor: 'pointer',
              fontSize: 12, color: '#8a7a6a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(6px)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2a2218'}
            onMouseLeave={e => e.currentTarget.style.color = '#8a7a6a'}
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#8a7a6a', marginBottom: 2 }}>
          {count} blooming trees
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 400, color: '#2a2218', lineHeight: 1.1, marginBottom: 1 }}>
          {topName}
        </div>
        {topLatin && (
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 12, color: '#8a7a6a', marginBottom: 6 }}>
            {topLatin}
          </div>
        )}

        {/* Flowering period */}
        {bloomPeriod && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 20, marginBottom: 8,
            background: badge.bg, color: badge.color,
            fontSize: 10, fontWeight: 500,
          }}>
            🗓 {bloomPeriod}
          </div>
        )}

        {/* Description */}
        {topDesc && (
          <div style={{ fontSize: 11, color: '#6b5e4e', lineHeight: 1.65, marginBottom: 10 }}>
            {topDesc}
          </div>
        )}

        {/* ── 12-month bloom timeline ── */}
        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#8a7a6a', marginBottom: 5 }}>
          Bloom season
        </div>
        <div style={{ display: 'flex', gap: 2, marginBottom: 10, alignItems: 'flex-end' }}>
          {MONTHS.map((m, i) => {
            const ratio    = mCounts[i] / maxMonth
            const isActive = mCounts[i] > 0
            const isPeak   = isActive && ratio > 0.6
            const isCur    = i === month
            return (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: '100%', height: isPeak ? 10 : isActive ? 6 : 3,
                  borderRadius: 3, transition: 'all 0.3s',
                  background: isPeak   ? (color || '#d4847a')
                            : isActive ? `${color || '#d4847a'}88`
                            : 'rgba(42,34,24,0.07)',
                  outline: isCur ? `1.5px solid ${color || '#d4847a'}` : 'none',
                  outlineOffset: 1,
                }} />
                <div style={{
                  fontSize: 7, color: isCur ? '#2a2218' : '#9a8a78',
                  fontWeight: isCur ? 600 : 300, lineHeight: 1,
                }}>
                  {m}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Species breakdown ── */}
        {spList.length > 1 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#8a7a6a', marginBottom: 6 }}>
              Species in area
            </div>
            {spList.slice(0, 5).map(({ name, count: cnt }) => (
              <div key={name} style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                  <span style={{ color: '#4a3e30' }}>{name}</span>
                  <span style={{ color: '#7a9e7e', fontWeight: 500 }}>{cnt}</span>
                </div>
                <div style={{ height: 2, borderRadius: 2, background: 'rgba(122,158,126,0.12)' }}>
                  <div style={{
                    height: '100%', borderRadius: 2, opacity: 0.7, transition: 'width 0.3s',
                    width: `${(cnt / maxSpecies) * 100}%`,
                    background: color || '#9ab89e',
                  }} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
