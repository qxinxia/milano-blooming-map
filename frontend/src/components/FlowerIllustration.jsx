// Botanical SVG illustrations for each genus (80×80 viewBox)

const B = '#8b7a4e'   // branch / bark
const L = '#5c8a44'   // leaf green

// ── shared primitive components ─────────────────────────────────────────────

function P5({ cx = 0, cy = 0, r = 8, pw = 4, color, center = '#fff8e8', stamen = '#e8c050', opacity = 1 }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx={0} cy={-r * 0.58} rx={pw} ry={r * 0.62} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle cx={0} cy={0} r={pw * 0.72} fill={center} />
      <circle cx={0} cy={0} r={pw * 0.32} fill={stamen} opacity={0.85} />
    </g>
  )
}

function Star4({ cx = 0, cy = 0, r = 8, pw = 3, color }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <ellipse cx={0} cy={-r * 0.65} rx={pw} ry={r * 0.7} fill={color} />
      <ellipse cx={0} cy={r * 0.65} rx={pw} ry={r * 0.7} fill={color} />
      <ellipse cx={-r * 0.65} cy={0} rx={r * 0.7} ry={pw} fill={color} />
      <ellipse cx={r * 0.65} cy={0} rx={r * 0.7} ry={pw} fill={color} />
      <circle cx={0} cy={0} r={pw * 0.55} fill="#f0b060" />
    </g>
  )
}

function Pea({ cx = 0, cy = 0, size = 8, color, light }) {
  const cl = light || color
  return (
    <g transform={`translate(${cx},${cy})`}>
      <ellipse cx={0} cy={-size * 0.7} rx={size * 0.55} ry={size * 0.65} fill={cl} opacity={0.92} />
      <ellipse cx={-size * 0.5} cy={-size * 0.3} rx={size * 0.42} ry={size * 0.55}
        fill={color} transform={`rotate(-15, ${-size * 0.5}, ${-size * 0.3})`} opacity={0.88} />
      <ellipse cx={size * 0.5} cy={-size * 0.3} rx={size * 0.42} ry={size * 0.55}
        fill={color} transform={`rotate(15, ${size * 0.5}, ${-size * 0.3})`} opacity={0.88} />
    </g>
  )
}

function Trumpet({ cx = 0, cy = 0, size = 10, color, highlight }) {
  const ch = highlight || '#d0b0f0'
  return (
    <g transform={`translate(${cx},${cy})`}>
      <ellipse cx={0} cy={0} rx={size * 0.45} ry={size * 0.9} fill={color} opacity={0.85} />
      <ellipse cx={0} cy={-size * 0.6} rx={size * 0.65} ry={size * 0.4} fill={ch} opacity={0.7} />
      {[-40, 0, 40].map(a => (
        <ellipse key={a} cx={0} cy={-size * 0.7} rx={size * 0.3} ry={size * 0.25} fill={ch}
          transform={`rotate(${a}, 0, ${-size * 0.5})`} opacity={0.6} />
      ))}
    </g>
  )
}

function RuffledPetal({ a, r, ruffleAmount = 2, color }) {
  const rad = a * Math.PI / 180
  const px = -r * 0.6 * Math.sin(rad)
  const py = r * 0.6 * Math.cos(rad)
  const tipX = -r * Math.sin(rad)
  const tipY = r * Math.cos(rad)
  return (
    <path
      d={`M0 0 C${px - ruffleAmount} ${py - ruffleAmount} ${tipX - ruffleAmount} ${tipY + ruffleAmount} ${tipX} ${tipY} C${tipX + ruffleAmount} ${tipY - ruffleAmount} ${px + ruffleAmount} ${py + ruffleAmount} 0 0Z`}
      fill={color} opacity={0.82}
    />
  )
}

function RuffledFlower({ cx, cy, r = 9, color = '#FF69B4', dark = '#cc1070' }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {[0, 60, 120, 180, 240, 300].map(a => (
        <RuffledPetal key={a} a={a} r={r} ruffleAmount={2.5} color={color} />
      ))}
      <circle cx={0} cy={0} r={r * 0.28} fill="#fff0c0" opacity={0.95} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <line key={a} x1={0} y1={0}
          x2={r * 0.5 * Math.sin(a * Math.PI / 180)}
          y2={-r * 0.5 * Math.cos(a * Math.PI / 180)}
          stroke={dark} strokeWidth="0.8" opacity={0.6} />
      ))}
    </g>
  )
}

function PinnateLeaf({ cx = 0, cy = 0, scale = 1, angle = 0 }) {
  const w = 28 * scale
  const count = 6
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <path d={`M${-w / 2} 0 L${w / 2} 0`} stroke={B} strokeWidth={1.5 * scale} strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / count)
        const oy = i % 2 === 0 ? -1 : 0
        return <ellipse key={i} cx={x} cy={oy - 5 * scale} rx={3.5 * scale} ry={5.5 * scale} fill={L} opacity={0.88} />
      })}
    </g>
  )
}

function MapleLeaf({ cx = 0, cy = 0, size = 18, color = '#c4604e', angle = 0 }) {
  const s = size
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <path d={`M0 0 C${-s * 0.15} ${-s * 0.4} ${-s * 0.4} ${-s * 0.5} ${-s * 0.25} ${-s * 0.8} C${-s * 0.1} ${-s * 0.65} ${-s * 0.15} ${-s * 0.45} 0 ${-s * 0.55} C${s * 0.15} ${-s * 0.45} ${s * 0.1} ${-s * 0.65} ${s * 0.25} ${-s * 0.8} C${s * 0.4} ${-s * 0.5} ${s * 0.15} ${-s * 0.4} 0 0Z`}
        fill={color} opacity={0.92} />
      <path d={`M0 0 C${-s * 0.55} ${-s * 0.05} ${-s * 0.85} ${-s * 0.25} ${-s * 0.75} ${-s * 0.55} C${-s * 0.5} ${-s * 0.4} ${-s * 0.18} ${-s * 0.28} 0 0Z`}
        fill={color} opacity={0.9} />
      <path d={`M0 0 C${s * 0.55} ${-s * 0.05} ${s * 0.85} ${-s * 0.25} ${s * 0.75} ${-s * 0.55} C${s * 0.5} ${-s * 0.4} ${s * 0.18} ${-s * 0.28} 0 0Z`}
        fill={color} opacity={0.9} />
      <path d={`M0 0 L0 ${s * 0.35}`} stroke={B} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  )
}

// ── species illustrations ────────────────────────────────────────────────────

function Prunus() {
  const c = '#FFB7C5', ck = '#e898aa'
  return (
    <>
      <path d="M42 79 C40 64 36 52 32 42 C27 31 18 23 11 18" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M32 42 C40 29 53 20 62 14" stroke={B} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M20 32 C16 26 12 19 11 14" stroke={B} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <P5 cx={11} cy={18} r={9.5} pw={4.8} color={c} />
      <P5 cx={62} cy={14} r={9} pw={4.5} color={c} />
      <P5 cx={22} cy={28} r={8} pw={4} color={ck} opacity={0.85} />
      <P5 cx={47} cy={24} r={7} pw={3.5} color={c} opacity={0.8} />
      <ellipse cx="69" cy="9" rx="3.2" ry="5" fill={c} opacity="0.65" />
      <ellipse cx="7" cy="24" rx="3" ry="4.5" fill={c} opacity="0.6" />
      <path d="M29 50 C24 44 23 37 27 33 C31 39 31 45 29 50Z" fill={L} opacity="0.7" />
    </>
  )
}

function Magnolia() {
  const outer = '#F2A6C8', inner = '#fce0ee', ctr = '#fff2dc'
  return (
    <>
      <path d="M40 79 C40 67 40 59 40 52" stroke={B} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M40 64 C27 58 22 46 27 36 C34 42 38 54 40 64Z" fill={L} />
      <path d="M40 64 C53 58 58 46 53 36 C46 42 42 54 40 64Z" fill={L} />
      <ellipse cx="21" cy="36" rx="9.5" ry="17" fill={outer} opacity="0.88" transform="rotate(-22, 21, 52)" />
      <ellipse cx="59" cy="36" rx="9.5" ry="17" fill={outer} opacity="0.88" transform="rotate(22, 59, 52)" />
      <ellipse cx="40" cy="26" rx="8.5" ry="17" fill={outer} opacity="0.85" />
      <ellipse cx="28" cy="30" rx="7.5" ry="15" fill={inner} transform="rotate(-12, 28, 50)" opacity="0.95" />
      <ellipse cx="52" cy="30" rx="7.5" ry="15" fill={inner} transform="rotate(12, 52, 50)" opacity="0.95" />
      <ellipse cx="40" cy="40" rx="6.5" ry="10" fill={ctr} />
      <ellipse cx="40" cy="37" rx="3.5" ry="5.5" fill="#c8a060" opacity="0.65" />
    </>
  )
}

function Cercis() {
  const c = '#C2529E', cl = '#e066b8'
  return (
    <>
      <path d="M8 72 C15 57 26 46 42 36 C54 28 64 21 70 14" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M42 36 C40 28 37 20 34 13" stroke={B} strokeWidth="2" fill="none" strokeLinecap="round" />
      <Pea cx={26} cy={46} size={8.5} color={c} light={cl} />
      <Pea cx={44} cy={34} size={8} color={c} light={cl} />
      <Pea cx={58} cy={25} size={7.5} color={c} light={cl} />
      <Pea cx={34} cy={18} size={7} color={c} light={cl} />
      <Pea cx={12} cy={60} size={7} color={c} light={cl} />
      <circle cx="70" cy="14" r="3.5" fill={c} opacity="0.7" />
      <circle cx="24" cy="54" r="3" fill={c} opacity="0.65" />
    </>
  )
}

function Malus() {
  const c = '#FFAABB', ck = '#f07892'
  return (
    <>
      <path d="M42 79 C40 65 38 53 34 43 C29 32 19 24 12 18" stroke={B} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M34 43 C42 29 55 20 63 13" stroke={B} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M27 39 C21 33 20 25 25 20 C29 26 29 33 27 39Z" fill={L} />
      <path d="M42 30 C38 22 40 14 45 11 C47 17 46 24 42 30Z" fill={L} />
      <P5 cx={12} cy={18} r={9.5} pw={4.8} color={c} />
      <P5 cx={63} cy={13} r={9} pw={4.5} color={c} />
      <P5 cx={24} cy={28} r={8} pw={4} color={ck} opacity={0.8} />
      <circle cx="52" cy="17" r="4.5" fill={c} opacity="0.7" />
      <circle cx="8" cy="25" r="4" fill={c} opacity="0.65" />
    </>
  )
}

function Aesculus() {
  const cf = '#fff8e0'
  // Candle positions: [x, y, r] pairs forming a pyramid spike
  const candle = [
    [32, 44, 5.5], [40, 44, 5.5], [48, 44, 5.5],
    [34, 37, 5],   [40, 37, 5],   [46, 37, 5],
    [36, 30, 4.5], [43, 30, 4.5],
    [38, 23, 4],   [43, 23, 4],
    [40, 17, 3.5],
    [40, 11, 3],
  ]
  return (
    <>
      <path d="M40 79 C40 66 40 58 40 50" stroke={B} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <g transform="translate(40,60)">
        <path d="M0 0 C-16 -4 -18 -18 -10 -24 C-4 -12 0 0 0 0Z" fill={L} />
        <path d="M0 0 C-8 -12 -6 -26 0 -30 C4 -16 2 -4 0 0Z" fill={L} />
        <path d="M0 0 C8 -12 6 -26 0 -30 C-4 -16 -2 -4 0 0Z" fill={L} />
        <path d="M0 0 C16 -4 18 -18 10 -24 C4 -12 0 0 0 0Z" fill={L} />
      </g>
      <path d="M40 50 L40 8" stroke={B} strokeWidth="1.5" fill="none" opacity="0.35" />
      {candle.map(([x, y, r], i) => (
        <P5 key={i} cx={x} cy={y} r={r} pw={r * 0.52} color={cf} center="#fff0c0" stamen="#f0a040" />
      ))}
    </>
  )
}

function racemeFlowers(xBase, startY, count, spread, c, cd) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const y = startY + t * spread
    const fw = 4.5 - t * 2.2
    if (fw < 1.2) return null
    return (
      <Pea key={i}
        cx={xBase + (i % 2 === 0 ? -fw * 0.9 : fw * 0.9)} cy={y}
        size={fw * 1.1} color={i < 2 ? cd : c} light={c} />
    )
  })
}

function Wisteria() {
  const c = '#C8A4DC', cd = '#9b6ab8'
  return (
    <>
      <path d="M4 18 C18 14 34 12 50 12 C62 12 70 14 76 18" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {[14, 30, 46, 62].map(x => (
        <path key={x} d={`M${x} 18 C${x} 26 ${x} 36 ${x} ${x < 30 ? 50 : 46}`} stroke={B} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ))}
      {racemeFlowers(14, 18, 9, 48, c, cd)}
      {racemeFlowers(30, 14, 10, 52, c, cd)}
      {racemeFlowers(46, 12, 9, 50, c, cd)}
      {racemeFlowers(62, 16, 8, 44, c, cd)}
      <path d="M42 12 C40 7 44 4 48 6 C47 9 45 11 42 12Z" fill={L} />
      <path d="M20 14 C18 9 22 5 26 7 C25 10 23 13 20 14Z" fill={L} />
    </>
  )
}

function Syringa() {
  const c = '#B39DDB', cl = '#d0b8f0'
  const pts = [
    [40, 12],
    [34, 16], [46, 16],
    [28, 20], [40, 20], [52, 20],
    [22, 24], [32, 24], [40, 24], [48, 24], [58, 24],
    [20, 28], [28, 28], [36, 28], [44, 28], [52, 28], [60, 28],
    [22, 32], [30, 32], [38, 32], [46, 32], [54, 32],
    [26, 36], [34, 36], [42, 36], [50, 36],
    [28, 40], [36, 40], [44, 40], [52, 40],
    [30, 44], [38, 44], [46, 44],
    [32, 48], [40, 48], [48, 48],
    [34, 52], [42, 52],
  ]
  return (
    <>
      <path d="M40 79 C40 68 40 61 40 54" stroke={B} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M40 62 C28 58 24 48 28 40 C35 46 38 54 40 62Z" fill={L} />
      <path d="M40 62 C52 58 56 48 52 40 C45 46 42 54 40 62Z" fill={L} />
      {pts.map(([x, y], i) => (
        <Star4 key={i} cx={x} cy={y} r={4.5} pw={1.8} color={i % 4 === 0 ? cl : c} />
      ))}
    </>
  )
}

function Forsythia() {
  const c = '#FFD700', cd = '#e0a000'
  return (
    <>
      <path d="M42 79 C40 63 36 50 28 40 C22 32 14 24 9 18" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M28 40 C36 27 50 18 60 12" stroke={B} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M18 30 C14 23 11 15 10 10" stroke={B} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 56 C44 48 54 42 58 36" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Star4 cx={9} cy={18} r={8.5} pw={3.5} color={c} />
      <Star4 cx={60} cy={12} r={8} pw={3.2} color={c} />
      <Star4 cx={19} cy={28} r={7.5} pw={3} color={c} />
      <Star4 cx={44} cy={22} r={7} pw={2.8} color={c} />
      <Star4 cx={58} cy={36} r={7} pw={2.8} color={c} />
      <Star4 cx={10} cy={10} r={6.5} pw={2.6} color={cd} />
      <Star4 cx={67} cy={18} r={6} pw={2.4} color={c} />
    </>
  )
}

function Robinia() {
  const c = '#f5f5e0', cs = '#c0c0a0'
  return (
    <>
      <path d="M8 22 C22 18 38 16 54 16 C64 16 72 18 74 22" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <PinnateLeaf cx={18} cy={18} scale={0.9} angle={-8} />
      <PinnateLeaf cx={56} cy={16} scale={0.85} angle={5} />
      {[22, 40, 58].map(x => (
        <g key={x}>
          <path d={`M${x} 22 C${x} 34 ${x} 46 ${x} 60`} stroke={B} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {Array.from({ length: 8 }, (_, i) => {
            const y = 24 + i * 5
            const fw = 5.5 - i * 0.4
            return (
              <ellipse key={i} cx={x + (i % 2 === 0 ? -fw : fw)} cy={y}
                rx={fw * 0.65} ry={fw} fill={c} stroke={cs} strokeWidth={0.5} opacity={0.92} />
            )
          })}
        </g>
      ))}
    </>
  )
}

function Rosa() {
  const co = '#FF5555', cm = '#cc1a1a', ci = '#ff9090'
  return (
    <>
      <path d="M40 79 C39 67 38 57 38 47 C37 39 35 32 35 23" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M37 60 L31 55" stroke={B} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 50 L44 45" stroke={B} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M37 52 C28 48 24 38 29 31 C35 37 37 46 37 52Z" fill={L} />
      <path d="M39 43 C48 39 52 29 48 22 C41 28 39 37 39 43Z" fill={L} />
      {[0, 51, 103, 154, 206, 257, 309].map(a => {
        const rad = a * Math.PI / 180
        const px = 40 + 13 * Math.sin(rad), py = 22 - 7 * Math.cos(rad)
        return <ellipse key={a} cx={px} cy={py} rx={8} ry={10} fill={co} opacity={0.72}
          transform={`rotate(${a + 20}, ${px}, ${py})`} />
      })}
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = a * Math.PI / 180
        const px = 40 + 8 * Math.sin(rad), py = 22 - 4 * Math.cos(rad)
        return <ellipse key={a} cx={px} cy={py} rx={6} ry={8} fill={cm} opacity={0.8}
          transform={`rotate(${a + 30}, ${px}, ${py})`} />
      })}
      {[0, 72, 144, 216, 288].map(a => {
        const rad = a * Math.PI / 180
        const px = 40 + 4 * Math.sin(rad), py = 22 - 2 * Math.cos(rad)
        return <ellipse key={a} cx={px} cy={py} rx={4.5} ry={6} fill={co} opacity={0.88}
          transform={`rotate(${a}, ${px}, ${py})`} />
      })}
      <circle cx="40" cy="22" r="4" fill={ci} />
      <circle cx="40" cy="22" r="2" fill="#fff0a0" opacity="0.9" />
    </>
  )
}

function Tilia() {
  const cf = '#d8e880', cb = '#b0c858'
  return (
    <>
      <path d="M40 79 C39 65 38 54 36 44 C33 35 29 27 22 21" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M36 44 C43 32 54 24 62 18" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M28 34 C18 30 15 20 21 14 C26 20 27 28 28 34Z" fill={L} />
      <path d="M46 28 C40 20 42 10 48 8 C50 14 49 22 46 28Z" fill={L} />
      <g transform="translate(22,21)">
        <ellipse cx="0" cy="0" rx="14" ry="3.5" fill={cb} transform="rotate(-8)" />
        <path d="M2 2 L3 20" stroke={B} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {[[-5, 22], [0, 26], [5, 22], [0, 18]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={4.5} fill={cf} />
            <circle cx={x} cy={y} r={2.5} fill="#fffff0" />
            <circle cx={x} cy={y} r={1.2} fill="#d0c040" opacity="0.85" />
          </g>
        ))}
      </g>
      <g transform="translate(62,18)">
        <ellipse cx="0" cy="0" rx="12" ry="3" fill={cb} transform="rotate(10)" />
        <path d="M-1 2 L-1 18" stroke={B} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {[[-5, 20], [0, 24], [5, 20]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill={cf} />
            <circle cx={x} cy={y} r={2.2} fill="#fffff0" />
          </g>
        ))}
      </g>
    </>
  )
}

function Jacaranda() {
  const c = '#9370DB', cl = '#b898f0'
  const positions = [
    [18, 32, 10], [32, 22, 9.5], [48, 20, 9], [60, 28, 8.5],
    [26, 36, 8],  [52, 32, 7.5], [38, 14, 8], [66, 20, 7],
  ]
  return (
    <>
      <path d="M40 79 C40 66 40 57 40 47" stroke={B} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <g transform="translate(40,53)">
        <path d="M0 0 C-18 -4 -22 -18 -15 -26 C-7 -14 0 0 0 0Z" fill={L} opacity="0.75" />
        <path d="M0 0 C18 -4 22 -18 15 -26 C7 -14 0 0 0 0Z" fill={L} opacity="0.7" />
        {[-14, -8, -2, 4, 10].map((x, i) => (
          <path key={i} d={`M${x * 0.4} -2 C${x} -10 ${x} -20 ${x * 0.8} -26`}
            stroke={L} strokeWidth="1.2" fill="none" opacity="0.5" />
        ))}
      </g>
      {positions.map(([x, y, s], i) => (
        <Trumpet key={i} cx={x} cy={y} size={s} color={c} highlight={cl} />
      ))}
      <ellipse cx="12" cy="36" rx="3.5" ry="5" fill={c} opacity="0.6" />
      <ellipse cx="72" cy="24" rx="3" ry="4.5" fill={c} opacity="0.55" />
    </>
  )
}

function Lagerstroemia() {
  const c = '#FF69B4', cd = '#cc1070'
  return (
    <>
      <path d="M40 79 C40 66 40 57 40 48" stroke={B} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M40 52 C30 44 18 36 12 26" stroke={B} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M40 52 C50 44 62 36 68 26" stroke={B} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M36 56 C24 52 20 42 26 36 C30 42 33 50 36 56Z" fill={L} />
      <path d="M44 56 C56 52 60 42 54 36 C50 42 47 50 44 56Z" fill={L} />
      <RuffledFlower cx={12} cy={26} r={10} color={c} dark={cd} />
      <RuffledFlower cx={68} cy={26} r={10} color={c} dark={cd} />
      <RuffledFlower cx={26} cy={36} r={9} color={c} dark={cd} />
      <RuffledFlower cx={54} cy={36} r={9} color={c} dark={cd} />
      <RuffledFlower cx={40} cy={30} r={8.5} color={c} dark={cd} />
    </>
  )
}

function Catalpa() {
  const cpetal = '#f8f8ff', cmark = '#7050c8', cthroat = '#f0d840'
  return (
    <>
      <path d="M40 79 C40 64 40 54 40 45" stroke={B} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M40 62 C18 54 10 34 20 22 C32 32 38 50 40 62Z" fill={L} />
      <path d="M40 62 C62 54 70 34 60 22 C48 32 42 50 40 62Z" fill={L} opacity="0.9" />
      <ellipse cx="24" cy="34" rx="13" ry="9" fill={cpetal} opacity="0.92" transform="rotate(-25, 24, 34)" />
      <ellipse cx="56" cy="34" rx="13" ry="9" fill={cpetal} opacity="0.92" transform="rotate(25, 56, 34)" />
      <ellipse cx="40" cy="20" rx="10.5" ry="13" fill={cpetal} opacity="0.9" />
      <ellipse cx="22" cy="22" rx="9" ry="8.5" fill={cpetal} opacity="0.85" transform="rotate(-55, 22, 28)" />
      <ellipse cx="58" cy="22" rx="9" ry="8.5" fill={cpetal} opacity="0.85" transform="rotate(55, 58, 28)" />
      <ellipse cx="40" cy="30" rx="9" ry="7" fill={cthroat} opacity="0.4" />
      {[-3, -1, 1, 3].map(x => (
        <path key={x} d={`M${40 + x * 2} 26 C${40 + x * 2} 30 ${40 + x * 2} 34 ${40 + x * 2} 38`}
          stroke={cmark} strokeWidth="1.2" fill="none" opacity="0.5" />
      ))}
      <circle cx="36" cy="22" r="2.5" fill="#e8d050" opacity="0.9" />
      <circle cx="44" cy="22" r="2.5" fill="#e8d050" opacity="0.9" />
    </>
  )
}

function Crataegus() {
  const c = '#f8f8f2', ca = '#e0e0d0'
  return (
    <>
      <path d="M40 79 C38 65 36 54 32 44 C28 34 20 26 13 20" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M32 44 C40 30 54 21 63 15" stroke={B} strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M22 36 L16 31" stroke={B} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 48 L41 44" stroke={B} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 34 C14 30 12 20 18 14 C22 20 23 28 23 34Z" fill={L} />
      <path d="M44 27 C38 19 40 11 46 8 C48 14 47 21 44 27Z" fill={L} />
      <P5 cx={13} cy={20} r={8} pw={4} color={c} center="#f5f5ec" stamen="#d4c050" />
      <P5 cx={63} cy={15} r={7.5} pw={3.8} color={c} center="#f5f5ec" stamen="#d4c050" />
      <P5 cx={26} cy={26} r={7} pw={3.5} color={ca} center="#f5f5ec" stamen="#d4c050" opacity={0.9} />
      <P5 cx={48} cy={21} r={7} pw={3.5} color={c} center="#f5f5ec" stamen="#d4c050" />
      <P5 cx={38} cy={18} r={6.5} pw={3.2} color={c} center="#f5f5ec" stamen="#d4c050" opacity={0.85} />
    </>
  )
}

function Acer() {
  const cr = '#c4604e', co = '#e8841e', cy = '#e8c038'
  return (
    <>
      <path d="M40 79 C40 65 40 57 40 48 C39 40 36 33 34 24" stroke={B} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 48 C44 38 52 30 56 21" stroke={B} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <MapleLeaf cx={18} cy={50} size={21} color={co} angle={-18} />
      <MapleLeaf cx={58} cy={46} size={20} color={cr} angle={14} />
      <MapleLeaf cx={34} cy={24} size={18} color={cy} angle={-8} />
      <MapleLeaf cx={56} cy={21} size={17} color={cr} angle={24} />
      <MapleLeaf cx={40} cy={63} size={16} color={co} angle={4} />
    </>
  )
}

// ── lookup map ───────────────────────────────────────────────────────────────

const illustrations = {
  Prunus, Magnolia, Cercis, Malus, Aesculus,
  Wisteria, Syringa, Forsythia, Robinia, Rosa,
  Tilia, Jacaranda, Lagerstroemia, Catalpa, Crataegus, Acer,
}

// ── main export ──────────────────────────────────────────────────────────────

export default function FlowerIllustration({ genus, size, style }) {
  const Comp = illustrations[genus]
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={style}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg">
      {Comp
        ? <Comp />
        : <P5 cx={40} cy={40} r={18} pw={8} color="#d4a0b0" />}
    </svg>
  )
}
