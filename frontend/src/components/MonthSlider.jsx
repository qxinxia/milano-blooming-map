const MONTHS = [
  { n: 1, short: 'Jan' }, { n: 2, short: 'Feb' }, { n: 3, short: 'Mar' },
  { n: 4, short: 'Apr' }, { n: 5, short: 'May' }, { n: 6, short: 'Jun' },
  { n: 7, short: 'Jul' }, { n: 8, short: 'Aug' }, { n: 9, short: 'Sep' },
  { n: 10, short: 'Oct' }, { n: 11, short: 'Nov' }, { n: 12, short: 'Dec' },
]

export default function MonthSlider({ month, onChange }) {
  return (
    <div className="month-slider-panel">
      <div className="month-bar">
        {MONTHS.map(({ n, short }) => (
          <button
            key={n}
            className={`month-btn ${month === n ? 'active' : ''}`}
            onClick={() => onChange(n)}
          >
            {short}
          </button>
        ))}
      </div>
      <input
        type="range"
        min={1}
        max={12}
        value={month}
        onChange={e => onChange(Number(e.target.value))}
        className="month-range"
      />
    </div>
  )
}
