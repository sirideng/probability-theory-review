import { useId } from 'react'

function density(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
}

export default function NormalCurveChart({ mean, sigma }: { mean: number; sigma: number }) {
  const gradientId = useId().replaceAll(':', '')
  const width = 720
  const height = 330
  const pad = { left: 42, right: 18, top: 22, bottom: 42 }
  const minX = -6
  const maxX = 6
  const maxY = 0.82
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const xScale = (x: number) => pad.left + ((x - minX) / (maxX - minX)) * chartW
  const yScale = (y: number) => pad.top + chartH - (y / maxY) * chartH
  const samples = Array.from({ length: 241 }, (_, index) => {
    const x = minX + (index / 240) * (maxX - minX)
    return [xScale(x), yScale(density(x, mean, sigma))]
  })
  const line = samples.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `${line} L${xScale(maxX)},${yScale(0)} L${xScale(minX)},${yScale(0)} Z`
  const ticks = [-6, -4, -2, 0, 2, 4, 6]
  const meanX = xScale(mean)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`均值 ${mean}、标准差 ${sigma} 的正态分布密度曲线`} className="h-auto w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5856d6" stopOpacity=".3" />
          <stop offset="100%" stopColor="#5856d6" stopOpacity=".015" />
        </linearGradient>
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map((tick) => (
        <line key={tick} x1={pad.left} x2={width - pad.right} y1={yScale(tick)} y2={yScale(tick)} stroke="#1d1d1f" strokeOpacity=".06" strokeDasharray="4 6" />
      ))}
      <line x1={pad.left} x2={width - pad.right} y1={yScale(0)} y2={yScale(0)} stroke="#1d1d1f" strokeOpacity=".16" />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={xScale(tick)} x2={xScale(tick)} y1={yScale(0)} y2={yScale(0) + 5} stroke="#1d1d1f" strokeOpacity=".2" />
          <text x={xScale(tick)} y={height - 13} textAnchor="middle" fill="#1d1d1f" fillOpacity=".42" fontSize="12">{tick}</text>
        </g>
      ))}
      <path d={area} fill={`url(#${gradientId})`} className="transition-all duration-300" />
      <line x1={meanX} x2={meanX} y1={yScale(0)} y2={yScale(density(mean, mean, sigma))} stroke="#5856d6" strokeOpacity=".3" strokeDasharray="5 5" />
      <path d={line} fill="none" stroke="#5856d6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />
      <circle cx={meanX} cy={yScale(density(mean, mean, sigma))} r="5" fill="#fff" stroke="#5856d6" strokeWidth="3" />
      <text x={Math.min(meanX + 10, width - 74)} y={Math.max(yScale(density(mean, mean, sigma)) - 12, 18)} fill="#5856d6" fontSize="12" fontWeight="600">μ = {mean.toFixed(1)}</text>
    </svg>
  )
}
