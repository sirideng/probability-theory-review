export default function MiniBellCurve() {
  const points = Array.from({ length: 101 }, (_, i) => {
    const x = -3.5 + (i / 100) * 7
    const density = Math.exp(-(x * x) / 2)
    return `${(i / 100) * 240},${98 - density * 76}`
  }).join(' ')

  return (
    <svg viewBox="0 0 240 112" role="img" aria-label="正态分布钟形曲线" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="miniFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5856d6" stopOpacity=".28" />
          <stop offset="100%" stopColor="#5856d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0 98 L${points.replaceAll(' ', ' L')} L240 98 Z`} fill="url(#miniFill)" />
      <polyline points={points} fill="none" stroke="#5856d6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="0" y1="98" x2="240" y2="98" stroke="#1d1d1f" strokeOpacity=".12" />
    </svg>
  )
}
