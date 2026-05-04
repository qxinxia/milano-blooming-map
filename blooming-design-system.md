# Blooming Milano — Map Design System

> **Style:** Botanical · Glassmorphic · Editorial  
> **Stack:** MapLibre GL JS · React · CSS custom properties

---

## Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
```

| Role | Family | Weights |
|---|---|---|
| Display / headings | Cormorant Garamond (serif) | 300, 400, 500 |
| Body / UI labels | DM Sans (sans-serif) | 300, 400, 500 |

---

## Color Tokens

```css
:root {
  /* Surfaces */
  --cream:          #f7f3ec;
  --cream-dark:     #ede6d9;
  --cream-glass:    rgba(247, 243, 236, 0.96);
  --cream-glass-lt: rgba(247, 243, 236, 0.92);

  /* Text */
  --ink:            #2a2218;
  --ink-light:      #6b5e4e;
  --ink-faint:      #9a8a78;

  /* Accent · Rose (cherry blossom) */
  --rose:           #d4847a;
  --rose-light:     #f0c4bc;
  --rose-dark:      #b86055;

  /* Accent · Sage (foliage / trees) */
  --sage:           #7a9e7e;
  --sage-light:     #b8d4bb;
  --sage-mid:       #9ab89e;   /* hex density fill */

  /* Accent · Lavender (wisteria / lilac) */
  --lavender:       #9b8ec4;
  --lavender-light: #d4cde8;

  /* Accent · Amber (acacia / linden) */
  --amber:          #c99a4e;
  --amber-light:    #f0d9a8;

  /* Accent · Peach (auxiliary) */
  --peach:          #e8a87c;

  /* Borders & shadows */
  --border:         rgba(42, 34, 24, 0.09);
  --border-strong:  rgba(42, 34, 24, 0.16);
  --shadow-sm:      0 2px 12px rgba(42, 34, 24, 0.08);
  --shadow-md:      0 4px 24px rgba(42, 34, 24, 0.11);
  --shadow-lg:      0 8px 40px rgba(42, 34, 24, 0.14);

  /* Radii */
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  20px;
  --radius-pill: 9999px;

  /* Spacing */
  --sp-1: 4px;  --sp-2: 8px;   --sp-3: 12px;
  --sp-4: 16px; --sp-5: 20px;  --sp-6: 24px;

  /* Transitions */
  --ease:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --dur-fast: 0.15s;
  --dur-base: 0.25s;
  --dur-slow: 0.4s;
}
```

### Palette at a glance

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#f7f3ec` | Page / panel background |
| `--cream-dark` | `#ede6d9` | Hover states, dividers |
| `--ink` | `#2a2218` | Primary text |
| `--ink-light` | `#6b5e4e` | Labels, secondary text |
| `--rose` | `#d4847a` | Cherry / active bloom |
| `--sage` | `#7a9e7e` | Foliage, non-blooming trees |
| `--sage-mid` | `#9ab89e` | Hex density fill |
| `--lavender` | `#9b8ec4` | Wisteria / lilac |
| `--amber` | `#c99a4e` | Acacia / linden |

---

## Typography Scale

```css
/* Display heading */
.t-display {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  color: var(--ink);
  line-height: 1.1;
}
.t-display em { font-style: italic; color: var(--rose); }

/* Section overline */
.t-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-light);
}

/* Body */
.t-body {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: var(--ink-light);
  line-height: 1.65;
}

/* Latin / italic subtitle */
.t-latin {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--ink-light);
}
```

---

## Glassmorphic Card

Base for all floating panels — popup, legend, timeline, chips.

```css
.glass-card {
  background:      rgba(247, 243, 236, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border:          1px solid rgba(42, 34, 24, 0.09);
  border-radius:   16px;
  box-shadow:      0 4px 24px rgba(42, 34, 24, 0.11);
}
```

---

## Components

### Header

```css
.hd { position: absolute; top: 24px; left: 24px; animation: fadeUp 0.4s ease both; }

.hd-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px; font-weight: 300;
  color: var(--ink); letter-spacing: -0.3px; line-height: 1;
}
.hd-title em { font-style: italic; color: var(--rose); }

.hd-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px; letter-spacing: 2.2px;
  text-transform: uppercase; color: var(--ink-light); margin-top: 5px;
}
```

```html
<div class="hd">
  <div class="hd-title">Blooming <em>Milano</em></div>
  <div class="hd-sub">Flowering trees &amp; gardens · 2026</div>
</div>
```

---

### Stat Chip

```css
.stats { position: absolute; top: 92px; left: 24px; display: flex; flex-direction: column; gap: 6px; }

.stat-chip {
  background: rgba(247,243,236,0.92); backdrop-filter: blur(8px);
  border-radius: 9px; padding: 5px 11px;
  border: 1px solid rgba(42,34,24,0.08);
  font-family: 'DM Sans', sans-serif; font-size: 11px; color: var(--ink);
  display: flex; align-items: center; gap: 6px;
}
.stat-chip strong { font-weight: 500; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
```

```html
<div class="stat-chip">
  <span class="stat-dot" style="background: #d4847a"></span>
  <strong>9</strong>&nbsp;blooming spots
</div>
```

---

### Legend

```css
.legend {
  position: absolute; top: 24px; right: 24px;
  background: rgba(247,243,236,0.95); backdrop-filter: blur(12px);
  border-radius: 14px; padding: 14px 16px;
  border: 1px solid rgba(42,34,24,0.07);
  box-shadow: 0 4px 24px rgba(42,34,24,0.08);
  min-width: 155px;
}
.legend-ttl {
  font-size: 9px; font-weight: 500; letter-spacing: 2px;
  text-transform: uppercase; color: var(--ink-light); margin-bottom: 9px;
}
.legend-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; font-size: 11.5px; font-weight: 300; }
.legend-swatch { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.legend-divider { height: 1px; background: rgba(42,34,24,0.07); margin: 7px 0; }
```

---

### Timeline

```css
.timeline {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: rgba(247,243,236,0.96); backdrop-filter: blur(14px);
  border-radius: 18px; padding: 16px 22px 14px;
  border: 1px solid rgba(42,34,24,0.08);
  box-shadow: 0 4px 32px rgba(42,34,24,0.10);
  display: flex; flex-direction: column; align-items: center; gap: 11px;
  min-width: 580px;
}

/* Prev / Next / Play buttons */
.tl-btn {
  background: none; border: 1px solid rgba(42,34,24,0.14);
  border-radius: 50%; width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink-light); font-size: 13px;
  transition: all 0.15s;
}
.tl-btn:hover { background: var(--cream-dark); color: var(--ink); }

/* Current month label */
.tl-month {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px; min-width: 110px; text-align: center;
  animation: monthSlide 0.25s ease both;
  /* color: set inline to accent hue for current month */
}

/* Month pip */
.tl-pip {
  font-size: 9.5px; letter-spacing: 0.4px; text-transform: uppercase;
  padding: 4px 7px 3px; border-radius: 8px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  border: 1px solid transparent; background: none; color: var(--ink-light);
  transition: all 0.15s;
}
.tl-pip:hover { color: var(--ink); background: var(--cream-dark); }
.tl-pip.on    { font-weight: 500; border-color: currentColor; }

/* Bloom intensity dot inside pip — size/color set inline per data */
.tl-pip-dot { display: block; border-radius: 50%; }
```

---

### Popup Card

```css
.popup {
  position: fixed;
  background: rgba(247,243,236,0.98); backdrop-filter: blur(16px);
  border-radius: 16px; padding: 18px 20px;
  border: 1px solid rgba(42,34,24,0.10);
  box-shadow: 0 8px 40px rgba(42,34,24,0.14);
  max-width: 270px; min-width: 230px;
  z-index: 2000; animation: fadeUp 0.25s ease both;
  overflow: hidden;
}
.popup-close {
  position: absolute; top: 10px; right: 10px;
  background: none; border: none; cursor: pointer;
  font-size: 14px; color: var(--ink-light); z-index: 2;
}
.popup-close:hover { color: var(--ink); }
.popup-type  { font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--ink-light); margin-bottom: 3px; }
.popup-name  { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: var(--ink); line-height: 1.1; margin-bottom: 1px; }
.popup-latin { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 12px; color: var(--ink-light); margin-bottom: 12px; }
.popup-section-lbl { font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ink-light); margin-bottom: 5px; }
.popup-desc  { font-size: 11px; color: var(--ink-light); line-height: 1.65; margin-top: 8px; }
.popup-loc   { font-size: 11px; color: var(--ink-light); margin-top: 10px; padding-top: 9px; border-top: 1px solid rgba(42,34,24,0.07); display: flex; align-items: center; gap: 4px; }
```

**With species photo at top** — use `padding: 0; overflow: hidden` on `.popup`, then:

```html
<div class="popup" style="padding:0; overflow:hidden">
  <img src="..." style="width:100%; height:110px; object-fit:cover; display:block" />
  <div style="padding: 14px 18px 16px">
    <!-- popup content -->
  </div>
</div>
```

---

### Bloom Season Bar

12 equal segments, one per month. Color the active/peak months inline.

```css
.bloom-bar  { display: flex; gap: 2px; margin-bottom: 10px; }
.bloom-seg  { height: 5px; flex: 1; border-radius: 3px; background: var(--cream-dark); transition: background 0.3s; }
```

```jsx
// React example
{MONTHS.map((m, i) => (
  <div key={m} className="bloom-seg" style={{
    background: isPeak(i)   ? color
              : isActive(i) ? `${color}88`
              : undefined,
    outline: i === currentMonth ? `1.5px solid ${color}` : 'none',
  }} />
))}
```

---

### Bloom Calendar Grid (alternate variant)

```css
.bloom-cal  { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; margin-bottom: 10px; }
.cal-cell   { border-radius: 5px; padding: 4px 3px; text-align: center; font-size: 8.5px; background: var(--cream-dark); color: var(--ink-light); transition: all 0.25s; }
```

---

## Animations

```css
/* Marker pulse */
@keyframes bloomPulse {
  0%   { transform: scale(0.85); opacity: 0.7; }
  50%  { transform: scale(1.14); opacity: 1;   }
  100% { transform: scale(0.85); opacity: 0.7; }
}

/* Expanding ripple ring */
@keyframes ripple {
  0%   { transform: scale(1);   opacity: 0.55; }
  100% { transform: scale(3.2); opacity: 0;    }
}

/* Panel entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* Month label swap */
@keyframes monthSlide {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0);    }
}
```

---

## Animated Bloom Markers (HTML Markers)

```css
.bloom-marker-wrap {
  position: relative; display: flex;
  align-items: center; justify-content: center;
}
.bloom-dot {
  border-radius: 50%; position: relative; z-index: 2;
  animation: bloomPulse 2.8s ease-in-out infinite;
  cursor: pointer; transition: transform 0.15s;
}
.bloom-dot:hover { transform: scale(1.35) !important; }
.bloom-ripple {
  position: absolute; border-radius: 50%;
  animation: ripple 2.4s ease-out infinite;
  z-index: 1; pointer-events: none;
}
```

```html
<!-- Peak bloom marker (18px dot) -->
<div class="bloom-marker-wrap" style="width:54px; height:54px">
  <div class="bloom-ripple" style="width:18px; height:18px; background:#f0c4bc"></div>
  <div class="bloom-dot"    style="width:18px; height:18px; background:#d4847a; box-shadow:0 0 0 2px #f0c4bc"></div>
</div>

<!-- Active bloom (13px) -->
<div class="bloom-marker-wrap" style="width:39px; height:39px">
  <div class="bloom-ripple" style="width:13px; height:13px; background:#f0c4bc"></div>
  <div class="bloom-dot"    style="width:13px; height:13px; background:#d4847a"></div>
</div>

<!-- Inactive (7px, no ripple, dimmed) -->
<div class="bloom-marker-wrap" style="width:21px; height:21px">
  <div class="bloom-dot" style="width:7px; height:7px; background:#d4847a; opacity:0.2; cursor:default"></div>
</div>
```

**Sizing guide:**

| State | Dot | Wrap | Ripple |
|---|---|---|---|
| Peak bloom | 18px | 54px | yes |
| Active | 13px | 39px | yes |
| Inactive | 7px | 21px | no, opacity 0.2 |

---

## MapLibre Map Style Recipe

Paste into your `new maplibregl.Map({ style: … })`:

```js
{
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
      attribution: '© CartoDB · © OpenStreetMap contributors',
    },
  },
  layers: [{
    id: 'carto-tiles',
    type: 'raster',
    source: 'carto',
    paint: {
      'raster-saturation':     -0.4,  // desaturate for botanical look
      'raster-brightness-max':  1.0,
    },
  }],
}
```

---

## Hex Density Layer Recipe

```js
// Fill (sage, opacity driven by tree count)
{
  id: 'hex-fill', type: 'fill', source: 'hex-source',
  paint: {
    'fill-color':   '#9ab89e',                         // --sage-mid
    'fill-opacity': ['get', 'opacity'],                // 0.10–0.38 per feature
  }
}

// Stroke
{
  id: 'hex-stroke', type: 'line', source: 'hex-source',
  paint: {
    'line-color':   '#7a9e7e',                         // --sage
    'line-opacity':  0.20,
    'line-width':    0.5,
  }
}
```

**Computing `opacity` per hex feature:**
```js
const opacity = 0.10 + (cell.count / maxCount) * 0.28
```

---

## Bloom Dot + Hotspot Layer Recipe

```js
// Small static bloom dots (all blooming cells)
{
  id: 'bloom-dots', type: 'circle', source: 'dots-source',
  paint: {
    'circle-radius':  ['interpolate', ['linear'], ['get', 'count'], 1, 2.5, 10, 3.5, 40, 4.5],
    'circle-color':   ['get', 'color'],
    'circle-opacity':  0.6,
    'circle-opacity-transition': { duration: 350, delay: 0 },  // smooth month fade
  }
}

// Pulsing ripple halo (high-density only — animated via rAF)
{
  id: 'hotspot-ripple', type: 'circle', source: 'hotspot-source',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'count'], 5, 10, 40, 16],
    'circle-color':  ['get', 'color'],
    'circle-opacity': 0.18,   // animated: 0.06–0.28 via requestAnimationFrame
  }
}

// Solid clickable hotspot dot
{
  id: 'hotspot-base', type: 'circle', source: 'hotspot-source',
  paint: {
    'circle-radius':        ['interpolate', ['linear'], ['get', 'count'], 5, 5, 40, 9],
    'circle-color':         ['get', 'color'],
    'circle-opacity':        0.9,
    'circle-opacity-transition': { duration: 350, delay: 0 },
    'circle-stroke-width':   0.8,
    'circle-stroke-color':  '#fff',
    'circle-stroke-opacity': 0.8,
  }
}
```

**Ripple animation loop:**
```js
let t = 0
const tick = () => {
  t += 0.022
  const pulse = (Math.sin(t * 3.2) + 1) / 2        // 0 → 1 oscillating
  map.setPaintProperty('hotspot-ripple', 'circle-opacity', 0.06 + pulse * 0.22)
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
```

**Smooth month fade:**
```js
// On month change: fade out → swap data → fade in
map.setPaintProperty('bloom-dots',   'circle-opacity', 0)
map.setPaintProperty('hotspot-base', 'circle-opacity', 0)

setTimeout(() => {
  dotsSource.setData(newBloomDots)
  hotspotSource.setData(newHotspots)
  requestAnimationFrame(() => {
    map.setPaintProperty('bloom-dots',   'circle-opacity', 0.6)
    map.setPaintProperty('hotspot-base', 'circle-opacity', 0.9)
  })
}, 300)
```

---

## MapLibre Overrides

```css
.maplibregl-ctrl-attrib { font-family: 'DM Sans', sans-serif; font-size: 10px; }
.maplibregl-ctrl-bottom-right { bottom: 90px !important; } /* above timeline */
```
