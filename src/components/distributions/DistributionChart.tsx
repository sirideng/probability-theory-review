import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import {
  calculateProbability,
  describeProbabilityMode,
  getDistributionModel,
  selectionContains,
  type DistributionCalculationState,
} from '../../utils/distributionMath'

type Params = Record<string, number>
export type DistributionSeries = 'density' | 'cdf'
type BoundaryKey = 'a' | 'b'

function gamma(z: number): number {
  const p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278019572, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7]
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  const zz = z - 1
  let x = p[0]
  for (let i = 1; i < p.length; i += 1) x += p[i] / (zz + i)
  const t = zz + p.length - 1.5
  return Math.sqrt(2 * Math.PI) * t ** (zz + 0.5) * Math.exp(-t) * x
}

function fallbackContinuousConfig(slug: string, params: Params) {
  if (slug === 'chi-square') return { min: 0.01, max: Math.max(12, params.nu + 5 * Math.sqrt(2 * params.nu)), fn: (x: number) => x ** (params.nu / 2 - 1) * Math.exp(-x / 2) / (2 ** (params.nu / 2) * gamma(params.nu / 2)) }
  if (slug === 'student-t') return { min: -5, max: 5, fn: (x: number) => gamma((params.nu + 1) / 2) / (Math.sqrt(params.nu * Math.PI) * gamma(params.nu / 2)) * (1 + x * x / params.nu) ** (-(params.nu + 1) / 2) }
  if (slug === 'f-distribution') return { min: 0.01, max: 6, fn: (x: number) => { const a = params.d1 / 2; const b = params.d2 / 2; return (params.d1 / params.d2) ** a * x ** (a - 1) / ((1 + params.d1 * x / params.d2) ** (a + b) * (gamma(a) * gamma(b) / gamma(a + b))) } }
  return { min: -4, max: 4, fn: () => 0 }
}

function cumulativeSamples(samples: { x: number; y: number }[]) {
  const cumulative = [0]
  for (let index = 1; index < samples.length; index += 1) {
    const width = samples[index].x - samples[index - 1].x
    cumulative.push(cumulative[index - 1] + width * (samples[index - 1].y + samples[index].y) / 2)
  }
  const total = cumulative.at(-1) || 1
  return samples.map((point, index) => ({ x: point.x, y: cumulative[index] / total }))
}

function splitSelectedSegments(samples: { x: number; y: number }[], selected: (x: number) => boolean) {
  const segments: { x: number; y: number }[][] = []
  let current: { x: number; y: number }[] = []
  samples.forEach((point) => {
    if (selected(point.x)) current.push(point)
    else if (current.length) {
      segments.push(current)
      current = []
    }
  })
  if (current.length) segments.push(current)
  return segments
}

function displayNumber(value: number) {
  if (!Number.isFinite(value)) return '—'
  const absolute = Math.abs(value)
  if (absolute > 0 && (absolute < 0.001 || absolute >= 10000)) return value.toExponential(2)
  return Number(value.toFixed(3)).toString()
}

export default function DistributionChart({ slug, params, color, activeSeries, onSeriesChange, calculation, onCalculationChange }: {
  slug: string
  params: Params
  color: string
  activeSeries: DistributionSeries
  onSeriesChange: (series: DistributionSeries) => void
  calculation?: DistributionCalculationState
  onCalculationChange?: (patch: Partial<DistributionCalculationState>) => void
}) {
  const width = 760
  const height = 350
  const pad = { left: 48, right: 20, top: 34, bottom: 52 }
  const chartWidth = width - pad.left - pad.right
  const chartHeight = height - pad.top - pad.bottom
  const model = getDistributionModel(slug)
  const fallback = useMemo(() => fallbackContinuousConfig(slug, params), [slug, params])
  const [dragging, setDragging] = useState<BoundaryKey | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const quantile = model && calculation?.tool === 'quantile' && calculation.probability > 0 && calculation.probability < 1
    ? model.quantile(calculation.probability, params)
    : Number.NaN
  const baseDomain: [number, number] = model ? model.chartDomain(params) : [fallback.min, fallback.max]
  const importantValues = calculation
    ? calculation.tool === 'quantile' ? [quantile] : !calculation.selectionEnabled ? [] : calculation.mode === 'left' ? [calculation.b] : calculation.mode === 'right' ? [calculation.a] : [calculation.a, calculation.b]
    : []
  const finiteImportantValues = importantValues.filter(Number.isFinite)
  const domainValues = model?.kind === 'discrete'
    ? finiteImportantValues.filter((value) => value >= baseDomain[0] - 50 && value <= baseDomain[1] + 100)
    : finiteImportantValues
  let xMin = Math.min(baseDomain[0], ...domainValues)
  let xMax = Math.max(baseDomain[1], ...domainValues)
  if (xMin === xMax) { xMin -= 1; xMax += 1 }
  const domainMargin = (xMax - xMin) * 0.035
  if (domainValues.some((value) => value <= baseDomain[0])) xMin -= domainMargin
  if (domainValues.some((value) => value >= baseDomain[1])) xMax += domainMargin

  const discrete = model?.kind === 'discrete'
  const discreteMin = discrete ? Math.max(model.support(params).min, Math.ceil(xMin)) : 0
  const discreteMax = discrete ? Math.min(Number.isFinite(model.support(params).max) ? model.support(params).max : Math.floor(xMax), Math.floor(xMax)) : -1
  const points = discrete && model ? Array.from({ length: Math.max(0, discreteMax - discreteMin + 1) }, (_, index) => {
    const x = discreteMin + index
    return { x, y: model.value(x, params) }
  }) : []

  const sampleXs = !discrete ? [
    ...Array.from({ length: 321 }, (_, index) => xMin + index / 320 * (xMax - xMin)),
    ...finiteImportantValues.filter((value) => value >= xMin && value <= xMax),
  ].sort((a, b) => a - b).filter((value, index, values) => index === 0 || Math.abs(value - values[index - 1]) > 1e-10) : []
  const samples = sampleXs.map((x) => ({ x, y: model ? model.value(x, params) : fallback.fn(x) }))
  const cdfSamples = model ? samples.map((point) => ({ x: point.x, y: model.cdf(point.x, params) })) : cumulativeSamples(samples)
  const maxY = Math.max(...(discrete ? points : samples).map((point) => Number.isFinite(point.y) ? point.y : 0), 1) * 1.08
  const xScale = (x: number) => pad.left + (x - xMin) / (xMax - xMin) * chartWidth
  const xInvert = (position: number) => xMin + (position - pad.left) / chartWidth * (xMax - xMin)
  const yScale = (y: number) => pad.top + chartHeight - y / maxY * chartHeight
  const baseline = pad.top + chartHeight
  const gradientId = `fill-${slug}`
  const hatchId = `selection-hatch-${slug}`
  const clipId = `chart-clip-${slug}`
  const linePath = (values: { x: number; y: number }[]) => values.map((point, index) => `${index === 0 ? 'M' : 'L'}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)}`).join(' ')
  const densityLine = linePath(samples)
  const cdfLine = linePath(cdfSamples)
  let discreteCdf = `M${xScale(xMin)},${yScale(0)}`
  let cumulative = model ? model.cdf(discreteMin - 1, params) : 0
  points.forEach((point) => {
    discreteCdf += ` L${xScale(point.x)},${yScale(cumulative)}`
    cumulative += point.y
    discreteCdf += ` L${xScale(point.x)},${yScale(cumulative)}`
  })
  discreteCdf += ` L${xScale(xMax)},${yScale(Math.min(1, cumulative))}`
  const tickValues = Array.from({ length: 5 }, (_, i) => xMin + i / 4 * (xMax - xMin))
  const barWidth = Math.min(34, chartWidth / Math.max(points.length, 2) * 0.68)
  const densityOpacity = activeSeries === 'density' ? 1 : 0.16
  const cdfOpacity = activeSeries === 'cdf' ? 1 : 0.16
  const densityLabel = discrete ? '概率质量' : '概率密度'

  const hasValidCalculation = Boolean(model && calculation && model.validateParameters(params).length === 0 && (
    calculation.tool === 'quantile'
      ? calculation.probability > 0 && calculation.probability < 1 && Number.isFinite(quantile)
      : calculation.selectionEnabled && Number.isFinite(calculation.a) && Number.isFinite(calculation.b) && (!(calculation.mode === 'interval' || calculation.mode === 'two-tail') || calculation.a <= calculation.b)
  ))
  const isSelected = (x: number) => {
    if (!hasValidCalculation || !calculation) return false
    if (calculation.tool === 'quantile') return x <= quantile
    return selectionContains(calculation.mode, x, calculation.a, calculation.b)
  }
  const selectedSegments = !discrete && hasValidCalculation ? splitSelectedSegments(samples, isSelected) : []
  const probabilityValue = model && calculation?.tool === 'probability' && hasValidCalculation ? calculateProbability(model, params, calculation) : Number.NaN
  const ariaDescription = model && calculation && hasValidCalculation
    ? calculation.tool === 'probability'
      ? `${slug} 分布图，${describeProbabilityMode(calculation.mode, calculation.a, calculation.b)} 等于 ${probabilityValue.toFixed(6)}。阴影和边界线标出所选区域。`
      : `${slug} 分布图，累计概率 ${calculation.probability} 的分位点是 ${displayNumber(quantile)}，左侧阴影面积为 ${calculation.probability}。`
    : `${slug} 分布的${densityLabel}与分布函数叠加图。`

  const boundaryValues: { key: BoundaryKey | 'q'; value: number; label: string }[] = !calculation || !hasValidCalculation ? []
    : calculation.tool === 'quantile' ? [{ key: 'q', value: quantile, label: `q=${displayNumber(quantile)}` }]
      : calculation.mode === 'left' ? [{ key: 'b', value: calculation.b, label: `b=${displayNumber(calculation.b)}` }]
        : calculation.mode === 'right' ? [{ key: 'a', value: calculation.a, label: `a=${displayNumber(calculation.a)}` }]
          : [{ key: 'a', value: calculation.a, label: `a=${displayNumber(calculation.a)}` }, { key: 'b', value: calculation.b, label: `b=${displayNumber(calculation.b)}` }]

  const setBoundary = (key: BoundaryKey, value: number) => {
    if (!onCalculationChange) return
    const next = discrete ? Math.round(value) : Number(value.toFixed(4))
    onCalculationChange({ [key]: next })
  }
  const moveFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const viewX = (event.clientX - rect.left) / rect.width * width
    setBoundary(dragging, Math.min(xMax, Math.max(xMin, xInvert(viewX))))
  }
  const boundaryKeyDown = (event: KeyboardEvent<SVGLineElement>, key: BoundaryKey, value: number) => {
    const step = discrete ? 1 : (xMax - xMin) / 100
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); setBoundary(key, value - step) }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); setBoundary(key, value + step) }
    if (event.key === 'Home') { event.preventDefault(); setBoundary(key, xMin) }
    if (event.key === 'End') { event.preventDefault(); setBoundary(key, xMax) }
  }

  return <div>
    <div className="mb-2 flex flex-wrap items-center justify-end gap-2" aria-label="图像索引">
      <button type="button" onClick={() => onSeriesChange('density')} aria-pressed={activeSeries === 'density'} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15 ${activeSeries === 'density' ? 'border-black/[0.08] bg-white shadow-sm text-black/75' : 'border-transparent text-black/65 hover:bg-white/60'}`}>
        <span className="h-[3px] w-5 rounded-full" style={{ backgroundColor: color, opacity: densityOpacity }} />{densityLabel}
      </button>
      <button type="button" onClick={() => onSeriesChange('cdf')} aria-pressed={activeSeries === 'cdf'} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15 ${activeSeries === 'cdf' ? 'border-black/[0.08] bg-white shadow-sm text-black/75' : 'border-transparent text-black/65 hover:bg-white/60'}`}>
        <span className="w-5 border-t-[3px] border-dashed border-black/70" style={{ opacity: cdfOpacity }} />分布函数
      </button>
    </div>
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaDescription} className="h-auto w-full touch-none" onPointerMove={moveFromPointer} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".28"/><stop offset="1" stopColor={color} stopOpacity=".02"/></linearGradient>
        <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="8" height="8" fill={color} fillOpacity=".2"/><line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeOpacity=".4" strokeWidth="2"/></pattern>
        <clipPath id={clipId}><rect x={pad.left} y={pad.top} width={chartWidth} height={chartHeight}/></clipPath>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((value) => <line key={value} x1={pad.left} x2={width-pad.right} y1={yScale(value)} y2={yScale(value)} stroke="#1d1d1f" strokeOpacity=".055" strokeDasharray="4 6"/>)}
      <line x1={pad.left} x2={width-pad.right} y1={baseline} y2={baseline} stroke="#1d1d1f" strokeOpacity=".16"/>
      <g data-series="density" className="transition-opacity duration-200" style={{ opacity: densityOpacity }} clipPath={`url(#${clipId})`}>
        {discrete ? points.map((point, index) => {
          const selected = isSelected(point.x)
          return <g key={point.x}>
            <rect x={xScale(point.x)-barWidth/2} y={yScale(point.y)} width={barWidth} height={baseline-yScale(point.y)} rx={Math.min(6,barWidth/4)} fill={selected ? `url(#${hatchId})` : color} fillOpacity={hasValidCalculation && !selected ? '.23' : '.72'} stroke={selected ? color : 'none'} strokeWidth={selected ? 2 : 0}/>
            <circle cx={xScale(point.x)} cy={yScale(point.y)} r={selected ? 4 : 2.5} fill={color} fillOpacity={hasValidCalculation && !selected ? '.3' : '1'}/>
            <text x={xScale(point.x)} y={baseline+19} textAnchor="middle" fontSize={points.length>18?'8':'10'} fill="#1d1d1f" fillOpacity={points.length>18 && index%2 ? 0 : .4}>{point.x}</text>
          </g>
        }) : <>
          <path d={`${densityLine} L${xScale(xMax)},${baseline} L${xScale(xMin)},${baseline} Z`} fill={`url(#${gradientId})`}/>
          {selectedSegments.map((segment, index) => segment.length > 1 && <path key={index} d={`${linePath(segment)} L${xScale(segment.at(-1)!.x)},${baseline} L${xScale(segment[0].x)},${baseline} Z`} fill={`url(#${hatchId})`} stroke={color} strokeOpacity=".15"/>)}
          <path d={densityLine} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </>}
      </g>
      <path data-series="cdf" d={discrete ? discreteCdf : cdfLine} fill="none" stroke="#1d1d1f" strokeWidth="3.25" strokeDasharray="8 6" strokeLinecap="round" strokeLinejoin="round" className="transition-opacity duration-200" style={{ opacity: cdfOpacity }}/>

      {model && boundaryValues.map((boundary, index) => {
        const x = xScale(boundary.value)
        const cdf = boundary.key === 'q' && calculation?.tool === 'quantile' ? calculation.probability : model.cdf(boundary.value, params)
        const interactive = boundary.key !== 'q' && calculation?.tool === 'probability'
        const markerLabel = activeSeries === 'cdf' ? `${boundary.key === 'q' ? 'p' : `F(${boundary.key})`}=${displayNumber(cdf)}` : boundary.label
        return <g key={boundary.key}>
          <line x1={x} x2={x} y1={pad.top} y2={baseline} stroke={color} strokeWidth="2" strokeDasharray="5 5" strokeOpacity=".85"/>
          <rect x={Math.min(width - 91, Math.max(pad.left, x - (index ? 70 : 0)))} y={pad.top + 2 + index * 24} width="82" height="20" rx="10" fill="white" fillOpacity=".92" stroke={color} strokeOpacity=".22"/>
          <text x={Math.min(width - 50, Math.max(pad.left + 41, x + 41 - (index ? 70 : 0)))} y={pad.top + 16 + index * 24} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{markerLabel}</text>
          <circle cx={x} cy={yScale(cdf)} r="5" fill="white" stroke="#1d1d1f" strokeWidth="2" opacity={cdfOpacity}/>
          {interactive && <line
            x1={x} x2={x} y1={pad.top} y2={baseline}
            stroke="transparent" strokeWidth="18" className="cursor-ew-resize outline-none"
            role="slider" tabIndex={0} aria-label={`拖动边界 ${boundary.key}`} aria-valuemin={xMin} aria-valuemax={xMax} aria-valuenow={boundary.value}
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(boundary.key as BoundaryKey) }}
            onKeyDown={(event) => boundaryKeyDown(event, boundary.key as BoundaryKey, boundary.value)}
          />}
        </g>
      })}

      {slug === 'normal' && <g data-guide="normal-mean" className="pointer-events-none">
        <line x1={xScale(params.mean)} x2={xScale(params.mean)} y1={pad.top} y2={baseline} stroke={color} strokeWidth="1.5" strokeOpacity=".3" strokeDasharray="5 6"/>
        <text x={xScale(params.mean) + 8} y={baseline - 10} fontSize="11" fontWeight="600" fill={color}>μ = {params.mean.toFixed(1)}</text>
      </g>}
      {!discrete && tickValues.map((tick) => <g key={tick}><line x1={xScale(tick)} x2={xScale(tick)} y1={baseline} y2={baseline+5} stroke="#1d1d1f" strokeOpacity=".18"/><text data-axis-tick x={xScale(tick)} y={baseline+22} textAnchor="middle" fontSize="10" fill="#1d1d1f" fillOpacity=".4">{displayNumber(tick)}</text></g>)}
      <text x={pad.left} y="15" fontSize="10" fill="#1d1d1f" fillOpacity=".34">{discrete ? '柱高为单点概率质量；高亮柱的概率由 PMF 累加' : '阴影为曲线下面积；密度高度本身不是概率'} · F(x) ∈ [0,1]</text>
    </svg>
  </div>
}
