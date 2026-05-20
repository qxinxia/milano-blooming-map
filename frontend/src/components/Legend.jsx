import { useState, useMemo } from 'react'
import { SPECIES_DATA, SEASONS } from '../data/seasonality.js'
import { MONTHS } from '../data/spots.js'

const TYPE_LABELS = { tree: 'Tree', shrub: 'Shrub', vine: 'Vine' }
const SEASON_LABELS = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' }
const SEASON_ICONS  = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' }

// Mini 12-seg bloom bar for a species
function BloomBar({ bloomMonths, color }) {
  return (
    <div style={{ display: 'flex', gap: 1.5, marginTop: 5 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: bloomMonths.includes(i) ? color : 'rgba(42,34,24,0.08)',
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  )
}

// Expanded detail card for a species
function SpeciesDetail({ genus, onClose }) {
  const sp = SPECIES_DATA[genus]
  if (!sp) return null
  return (
    <div className="species-detail legend-panel-enter" style={{ marginTop: 8 }}>
      {sp.image && (
        <div style={{ width: '100%', height: 80, borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          <img src={sp.image} alt={sp.common}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      )}
      <div style={{ fontSize: 11, color: '#4a3e30', lineHeight: 1.55 }}>{sp.desc}</div>
      <div style={{ marginTop: 6, fontSize: 10, color: '#8a7a6a' }}>
        <span style={{ fontStyle: 'italic' }}>{sp.latin}</span>
        {' · '}
        <span>{TYPE_LABELS[sp.type]}</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 10, color: '#8a7a6a' }}>
        Bloom period: <strong style={{ color: '#4a3e30' }}>{sp.bloomPeriod}</strong>
      </div>
      <BloomBar bloomMonths={sp.bloom_months} color={sp.color} />
    </div>
  )
}

// A single species row
function SpeciesRow({ genus, isExpanded, onToggle }) {
  const sp = SPECIES_DATA[genus]
  if (!sp) return null
  return (
    <div>
      <button
        onClick={() => onToggle(genus)}
        style={{
          width: '100%', background: isExpanded ? 'rgba(122,158,126,0.08)' : 'none',
          border: 'none', borderRadius: 7, padding: '5px 7px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
          textAlign: 'left', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'rgba(42,34,24,0.04)' }}
        onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'none' }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: sp.color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#2a2218', flex: 1, fontWeight: 300 }}>{sp.common}</span>
        <span style={{ fontSize: 11 }}>{sp.icon}</span>
        <span style={{ fontSize: 9, color: '#8a7a6a', marginLeft: 2 }}>{TYPE_LABELS[sp.type]}</span>
      </button>
      {isExpanded && <SpeciesDetail genus={genus} />}
    </div>
  )
}

export default function Legend() {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('plants')   // 'plants' | 'seasons'
  const [query, setQuery]   = useState('')
  const [openGenus, setOpenGenus] = useState(null)

  const allGenera = Object.keys(SPECIES_DATA)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return allGenera
    return allGenera.filter(g => {
      const sp = SPECIES_DATA[g]
      return (
        sp.common.toLowerCase().includes(q) ||
        sp.latin.toLowerCase().includes(q) ||
        g.toLowerCase().includes(q) ||
        sp.type.toLowerCase().includes(q)
      )
    })
  }, [query, allGenera])

  const byCategory = useMemo(() => {
    const cats = { spring: [], summer: [], autumn: [], winter: [] }
    for (const g of allGenera) {
      const cat = SPECIES_DATA[g].category
      if (cats[cat]) cats[cat].push(g)
    }
    return cats
  }, [allGenera])

  function toggleGenus(g) {
    setOpenGenus(prev => (prev === g ? null : g))
  }

  if (!expanded) {
    // ── Compact view ──────────────────────────────────────────────────────────
    return (
      <div className="legend">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
          <div className="legend-ttl" style={{ marginBottom: 0 }}>Bloom guide</div>
          <button
            onClick={() => setExpanded(true)}
            title="Expand species guide"
            style={{
              background: 'none', border: '1px solid rgba(42,34,24,0.12)',
              borderRadius: 6, padding: '2px 7px', cursor: 'pointer',
              fontSize: 10, color: '#8a7a6a', letterSpacing: '0.5px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(42,34,24,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
          >
            All species ↗
          </button>
        </div>

        {/* Spring bloomers compact */}
        <div className="legend-ttl" style={{ marginBottom: 6 }}>Spring</div>
        {['Prunus','Magnolia','Cercis','Wisteria'].map(g => (
          <div key={g} className="legend-row">
            <div className="legend-swatch" style={{ background: SPECIES_DATA[g].color }} />
            {SPECIES_DATA[g].common}
          </div>
        ))}

        <div className="legend-divider" />

        {/* Summer compact */}
        <div className="legend-ttl" style={{ marginBottom: 6 }}>Summer</div>
        {['Rosa','Tilia','Jacaranda'].map(g => (
          <div key={g} className="legend-row">
            <div className="legend-swatch" style={{ background: SPECIES_DATA[g].color }} />
            {SPECIES_DATA[g].common}
          </div>
        ))}

        <div className="legend-divider" />

        {/* Autumn / Maple */}
        <div className="legend-row">
          <div className="legend-swatch" style={{ background: SPECIES_DATA.Acer.color }} />
          Maple (autumn) 🍁
        </div>

        <div className="legend-divider" />

        {/* Density */}
        <div className="legend-ttl" style={{ marginBottom: 5 }}>Density</div>
        <div className="legend-hex-row">
          <svg className="legend-hex" viewBox="0 0 14 14" fill="#d4847a" opacity={0.75}>
            <polygon points="7,0.5 13.1,3.75 13.1,10.25 7,13.5 0.9,10.25 0.9,3.75" />
          </svg>
          Blooming trees
        </div>
        <div className="legend-hex-row">
          <svg className="legend-hex" viewBox="0 0 14 14" fill="#9ab89e" opacity={0.4}>
            <polygon points="7,0.5 13.1,3.75 13.1,10.25 7,13.5 0.9,10.25 0.9,3.75" />
          </svg>
          Trees (not in bloom)
        </div>
      </div>
    )
  }

  // ── Expanded view ───────────────────────────────────────────────────────────
  return (
    <div className="legend legend-expanded legend-panel-enter" style={{ width: 240, maxHeight: '80vh', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 400, color: '#2a2218',
        }}>
          Species Guide
        </div>
        <button
          onClick={() => { setExpanded(false); setQuery(''); setOpenGenus(null) }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, color: '#8a7a6a', padding: '1px 4px', borderRadius: 4,
          }}
          title="Close"
        >✕</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <span style={{
          position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
          fontSize: 11, color: '#8a7a6a', pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search species..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpenGenus(null) }}
          style={{
            width: '100%', padding: '6px 8px 6px 26px',
            border: '1px solid rgba(42,34,24,0.12)', borderRadius: 8,
            fontFamily: 'DM Sans, sans-serif', fontSize: 11,
            color: '#2a2218', background: 'rgba(247,243,236,0.9)',
            outline: 'none',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: '#8a7a6a',
            }}
          >✕</button>
        )}
      </div>

      {/* Tabs */}
      {!query && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['plants', 'seasons'].map(t => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); setOpenGenus(null) }}
              style={{
                flex: 1, padding: '4px 0', border: 'none', borderRadius: 7, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 500,
                letterSpacing: '1px', textTransform: 'uppercase',
                background: activeTab === t ? 'rgba(122,158,126,0.18)' : 'none',
                color: activeTab === t ? '#4e7a54' : '#8a7a6a',
                transition: 'all 0.15s',
              }}
            >
              {t === 'plants' ? '🌿 Plants' : '📅 Seasons'}
            </button>
          ))}
        </div>
      )}

      {/* Search results */}
      {query && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ fontSize: 11, color: '#8a7a6a', textAlign: 'center', padding: '12px 0' }}>
              No species found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filtered.map(g => (
                <SpeciesRow key={g} genus={g} isExpanded={openGenus === g} onToggle={toggleGenus} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plants tab: flat alphabetical list */}
      {!query && activeTab === 'plants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {allGenera.map(g => (
            <SpeciesRow key={g} genus={g} isExpanded={openGenus === g} onToggle={toggleGenus} />
          ))}
        </div>
      )}

      {/* Seasons tab: grouped by flowering season */}
      {!query && activeTab === 'seasons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(byCategory).map(([cat, genera]) => {
            if (genera.length === 0) return null
            return (
              <div key={cat}>
                <div style={{
                  fontSize: 9, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase',
                  color: '#8a7a6a', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span>{SEASON_ICONS[cat]}</span> {SEASON_LABELS[cat]}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {genera.map(g => (
                    <SpeciesRow key={g} genus={g} isExpanded={openGenus === g} onToggle={toggleGenus} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Density key at bottom */}
      <div className="legend-divider" style={{ marginTop: 10 }} />
      <div className="legend-ttl" style={{ marginBottom: 5 }}>Density</div>
      <div className="legend-hex-row">
        <svg className="legend-hex" viewBox="0 0 14 14" fill="#d4847a" opacity={0.75}>
          <polygon points="7,0.5 13.1,3.75 13.1,10.25 7,13.5 0.9,10.25 0.9,3.75" />
        </svg>
        Blooming trees
      </div>
      <div className="legend-hex-row">
        <svg className="legend-hex" viewBox="0 0 14 14" fill="#9ab89e" opacity={0.4}>
          <polygon points="7,0.5 13.1,3.75 13.1,10.25 7,13.5 0.9,10.25 0.9,3.75" />
        </svg>
        Trees (not in bloom)
      </div>
    </div>
  )
}
