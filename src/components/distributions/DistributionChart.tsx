type Params = Record<string, number>

export type DistributionSeries = 'density' | 'cdf'

function factorial(n: number) {
  let result = 1
  for (let i = 2; i <= n; i += 1) result *= i
  return result
}

function combination(n: number, k: number) {
  if (k < 0 || k > n) return 0
  let result = 1
  for (let i = 1; i <= Math.min(k, n - k); i += 1) result = result * (n - i + 1) / i
  return result
}

function gamma(z: number): number {
  const p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7]
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  const zz = z - 1
  let x = p[0]
  for (let i = 1; i < p.length; i += 1) x += p[i] / (zz + i)
  const t = zz + p.length - 1.5
  return Math.sqrt(2 * Math.PI) * t ** (zz + 0.5) * Math.exp(-t) * x
}

function standardNormalCdf(z: number) {
  const absolute = Math.abs(z)
  const t = 1 / (1 + 0.2316419 * absolute)
  const tail = 0.3989422804 * Math.exp(-absolute * absolute / 2) * t
    * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return z >= 0 ? 1 - tail : tail
}

function discretePoints(slug: string, params: Params) {
  if (slug === 'bernoulli') return [{ x: 0, y: 1 - params.p }, { x: 1, y: params.p }]
  if (slug === 'binomial') return Array.from({ length: params.n + 1 }, (_, k) => ({ x: k, y: combination(params.n, k) * params.p ** k * (1 - params.p) ** (params.n - k) }))
  if (slug === 'poisson') {
    const maxK = Math.max(12, Math.ceil(params.lambda + 4 * Math.sqrt(params.lambda)))
    return Array.from({ length: maxK + 1 }, (_, k) => ({ x: k, y: Math.exp(-params.lambda) * params.lambda ** k / factorial(k) }))
  }
  if (slug === 'geometric') return Array.from({ length: 18 }, (_, index) => ({ x: index + 1, y: (1 - params.p) ** index * params.p }))
  return []
}

function continuousConfig(slug: string, params: Params) {
  if (slug === 'uniform') return {
    min: params.a - 1.5,
    max: params.b + 1.5,
    fn: (x: number) => x >= params.a && x <= params.b ? 1 / (params.b - params.a) : 0,
    cdf: (x: number) => x < params.a ? 0 : x >= params.b ? 1 : (x - params.a) / (params.b - params.a),
  }
  if (slug === 'exponential') return {
    min: 0,
    max: Math.max(5, 6 / params.lambda),
    fn: (x: number) => params.lambda * Math.exp(-params.lambda * x),
    cdf: (x: number) => x < 0 ? 0 : 1 - Math.exp(-params.lambda * x),
  }
  if (slug === 'normal') return {
    min: params.mean - 4.2 * params.sigma,
    max: params.mean + 4.2 * params.sigma,
    fn: (x: number) => Math.exp(-0.5 * ((x - params.mean) / params.sigma) ** 2) / (params.sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x: number) => standardNormalCdf((x - params.mean) / params.sigma),
  }
  if (slug === 'chi-square') return { min: 0.01, max: Math.max(12, params.nu + 5 * Math.sqrt(2 * params.nu)), fn: (x: number) => x ** (params.nu / 2 - 1) * Math.exp(-x / 2) / (2 ** (params.nu / 2) * gamma(params.nu / 2)) }
  if (slug === 'student-t') return { min: -5, max: 5, fn: (x: number) => gamma((params.nu + 1) / 2) / (Math.sqrt(params.nu * Math.PI) * gamma(params.nu / 2)) * (1 + x * x / params.nu) ** (-(params.nu + 1) / 2) }
  if (slug === 'f-distribution') return { min: 0.01, max: 6, fn: (x: number) => { const a = params.d1 / 2; const b = params.d2 / 2; return (params.d1 / params.d2) ** a * x ** (a - 1) / ((1 + params.d1 * x / params.d2) ** (a + b) * (gamma(a) * gamma(b) / gamma(a + b))) } }
  return { min: -4, max: 4, fn: () => 0 }
}

function makeCumulativeSamples(samples: { x: number; y: number }[], cdf?: (x: number) => number) {
  if (cdf) return samples.map((point) => ({ x: point.x, y: cdf(point.x) }))
  const cumulative = [0]
  for (let index = 1; index < samples.length; index += 1) {
    const width = samples[index].x - samples[index - 1].x
    cumulative.push(cumulative[index - 1] + width * (samples[index - 1].y + samples[index].y) / 2)
  }
  const total = cumulative.at(-1) || 1
  return samples.map((point, index) => ({ x: point.x, y: cumulative[index] / total }))
}

export default function DistributionChart({ slug, params, color, activeSeries, onSeriesChange }: {
  slug: string
  params: Params
  color: string
  activeSeries: DistributionSeries
  onSeriesChange: (series: DistributionSeries) => void
}) {
  const width = 760
  const height = 330
  const pad = { left: 48, right: 20, top: 24, bottom: 46 }
  const chartWidth = width - pad.left - pad.right
  const chartHeight = height - pad.top - pad.bottom
  const discrete = ['bernoulli', 'binomial', 'poisson', 'geometric'].includes(slug)
  const points = discrete ? discretePoints(slug, params) : []
  const config = continuousConfig(slug, params)
  const samples = discrete ? [] : Array.from({ length: 241 }, (_, index) => {
    const x = config.min + index / 240 * (config.max - config.min)
    return { x, y: config.fn(x) }
  })
  const cdfSamples = discrete ? [] : makeCumulativeSamples(samples, config.cdf)
  const maxY = Math.max(...(discrete ? points : samples).map((point) => Number.isFinite(point.y) ? point.y : 0), 1) * 1.08
  const xMin = discrete ? Math.min(...points.map((point) => point.x)) - 0.6 : config.min
  const xMax = discrete ? Math.max(...points.map((point) => point.x)) + 0.6 : config.max
  const xScale = (x: number) => pad.left + (x - xMin) / (xMax - xMin) * chartWidth
  const yScale = (y: number) => pad.top + chartHeight - y / maxY * chartHeight
  const baseline = pad.top + chartHeight
  const gradientId = `fill-${slug}`
  const densityLine = samples.map((point, index) => `${index === 0 ? 'M' : 'L'}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)}`).join(' ')
  const cdfLine = cdfSamples.map((point, index) => `${index === 0 ? 'M' : 'L'}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)}`).join(' ')
  let discreteCdf = `M${xScale(xMin)},${yScale(0)}`
  let cumulative = 0
  points.forEach((point) => {
    discreteCdf += ` L${xScale(point.x)},${yScale(cumulative)}`
    cumulative += point.y
    discreteCdf += ` L${xScale(point.x)},${yScale(cumulative)}`
  })
  discreteCdf += ` L${xScale(xMax)},${yScale(cumulative)}`
  const tickValues = Array.from({ length: 5 }, (_, i) => xMin + i / 4 * (xMax - xMin))
  const barWidth = Math.min(34, chartWidth / Math.max(points.length, 2) * 0.68)
  const densityOpacity = activeSeries === 'density' ? 1 : 0.16
  const cdfOpacity = activeSeries === 'cdf' ? 1 : 0.16
  const densityLabel = discrete ? '概率质量' : '概率密度'

  return <div>
    <div className="mb-2 flex flex-wrap items-center justify-end gap-2" aria-label="图像索引">
      <button type="button" onClick={() => onSeriesChange('density')} aria-pressed={activeSeries === 'density'} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${activeSeries === 'density' ? 'border-black/[0.08] bg-white shadow-sm text-black/75' : 'border-transparent text-black/35 hover:bg-white/60'}`}>
        <span className="h-[3px] w-5 rounded-full" style={{ backgroundColor: color, opacity: densityOpacity }} />{densityLabel}
      </button>
      <button type="button" onClick={() => onSeriesChange('cdf')} aria-pressed={activeSeries === 'cdf'} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${activeSeries === 'cdf' ? 'border-black/[0.08] bg-white shadow-sm text-black/75' : 'border-transparent text-black/35 hover:bg-white/60'}`}>
        <span className="w-5 border-t-[3px] border-dashed border-black/70" style={{ opacity: cdfOpacity }} />分布函数
      </button>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${densityLabel}与分布函数叠加图`} className="h-auto w-full">
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28"/><stop offset="1" stopColor={color} stopOpacity=".02"/></linearGradient></defs>
      {[0.25, 0.5, 0.75, 1].map((value) => <line key={value} x1={pad.left} x2={width-pad.right} y1={yScale(value)} y2={yScale(value)} stroke="#1d1d1f" strokeOpacity=".055" strokeDasharray="4 6"/>)}
      <line x1={pad.left} x2={width-pad.right} y1={baseline} y2={baseline} stroke="#1d1d1f" strokeOpacity=".16"/>
      <g data-series="density" className="transition-opacity duration-200" style={{ opacity: densityOpacity }}>
        {discrete ? points.map((point, index) => <g key={point.x}><rect x={xScale(point.x)-barWidth/2} y={yScale(point.y)} width={barWidth} height={baseline-yScale(point.y)} rx={Math.min(6,barWidth/4)} fill={color} fillOpacity=".72"/><text x={xScale(point.x)} y={baseline+19} textAnchor="middle" fontSize={points.length>18?'8':'10'} fill="#1d1d1f" fillOpacity={points.length>18 && index%2 ? 0 : .4}>{point.x}</text></g>) : <><path d={`${densityLine} L${xScale(config.max)},${baseline} L${xScale(config.min)},${baseline} Z`} fill={`url(#${gradientId})`}/><path d={densityLine} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></>}
      </g>
      <path data-series="cdf" d={discrete ? discreteCdf : cdfLine} fill="none" stroke="#1d1d1f" strokeWidth="3.25" strokeDasharray="8 6" strokeLinecap="round" strokeLinejoin="round" className="transition-opacity duration-200" style={{ opacity: cdfOpacity }}/>
      {!discrete && tickValues.map((tick) => <g key={tick}><line x1={xScale(tick)} x2={xScale(tick)} y1={baseline} y2={baseline+5} stroke="#1d1d1f" strokeOpacity=".18"/><text x={xScale(tick)} y={baseline+22} textAnchor="middle" fontSize="10" fill="#1d1d1f" fillOpacity=".4">{tick.toFixed(Math.abs(tick)<10?1:0)}</text></g>)}
      <text x={pad.left} y="15" fontSize="10" fill="#1d1d1f" fillOpacity=".34">纵轴统一刻度 · F(x) ∈ [0,1]</text>
    </svg>
  </div>
}
