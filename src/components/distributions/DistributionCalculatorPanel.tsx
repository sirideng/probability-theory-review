import { Calculator, CheckCircle2, Crosshair, RotateCcw, TriangleAlert } from 'lucide-react'
import {
  calculateProbability,
  createDefaultCalculation,
  describeProbabilityMode,
  type DistributionCalculationState,
  type DistributionModel,
  type DistributionParameters,
  type ProbabilityMode,
  validateProbabilityRequest,
} from '../../utils/distributionMath'

type Props = {
  slug: string
  model: DistributionModel
  params: DistributionParameters
  color: string
  state: DistributionCalculationState
  onChange: (state: DistributionCalculationState) => void
}

const modeOptions: { value: ProbabilityMode; label: string; hint: string }[] = [
  { value: 'left', label: '左尾', hint: 'P(X ≤ b)' },
  { value: 'right', label: '右尾', hint: 'P(X ≥ a)' },
  { value: 'interval', label: '区间', hint: 'P(a ≤ X ≤ b)' },
  { value: 'two-tail', label: '双尾', hint: '两侧概率之和' },
]

function numberLabel(value: number, digits = 4) {
  if (!Number.isFinite(value)) return '—'
  return Number(value.toFixed(digits)).toString()
}

function readableForeground(background: string) {
  const hex = background.replace('#', '')
  if (hex.length !== 6) return '#ffffff'
  const channels = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  const whiteContrast = 1.05 / (luminance + 0.05)
  const inkContrast = (luminance + 0.05) / 0.062
  return whiteContrast >= inkContrast ? '#ffffff' : '#1d1d1f'
}

function BoundaryInput({ label, value, onChange, discrete }: { label: 'a' | 'b'; value: number; onChange: (value: number) => void; discrete: boolean }) {
  return <label className="block min-w-0">
    <span className="mb-2 block text-[13px] font-semibold leading-5 text-black/65">边界 {label}</span>
    <input
      type="number"
      inputMode="decimal"
      step={discrete ? 1 : 'any'}
      value={Number.isFinite(value) ? Number(value.toFixed(discrete ? 0 : 6)) : ''}
      onChange={(event) => onChange(event.currentTarget.value === '' ? Number.NaN : event.currentTarget.valueAsNumber)}
      className="w-full rounded-xl border border-black/[0.09] bg-white/75 px-3 py-2.5 font-mono text-base outline-none transition focus:border-blue/50 focus:ring-4 focus:ring-blue/10"
      aria-label={`概率计算边界 ${label}`}
    />
  </label>
}

export default function DistributionCalculatorPanel({ slug, model, params, color, state, onChange }: Props) {
  const request = { mode: state.mode, a: state.a, b: state.b }
  const parameterErrors = model.validateParameters(params)
  const probabilitySelectionActive = state.tool === 'probability' && state.selectionEnabled
  const requestErrors = probabilitySelectionActive ? validateProbabilityRequest(model, request) : []
  const quantileErrors = state.tool === 'quantile' && !(state.probability > 0 && state.probability < 1) ? ['概率 p 必须满足 0 < p < 1。'] : []
  const errors = [...parameterErrors, ...requestErrors, ...quantileErrors]
  const probabilityResult = errors.length === 0 && probabilitySelectionActive ? Math.min(1, Math.max(0, calculateProbability(model, params, request))) : Number.NaN
  const quantileResult = errors.length === 0 && state.tool === 'quantile' ? model.quantile(state.probability, params) : Number.NaN
  const support = model.support(params)
  const relevantValues = state.mode === 'left' ? [state.b] : state.mode === 'right' ? [state.a] : [state.a, state.b]
  const outsideSupport = probabilitySelectionActive && relevantValues.some((value) => Number.isFinite(value) && (value < support.min || value > support.max))
  const digits = state.highPrecision ? 10 : 6
  const zValue = slug === 'normal' && Number.isFinite(quantileResult) ? (quantileResult - params.mean) / params.sigma : Number.NaN
  const activeModeForeground = readableForeground(color)

  const update = (patch: Partial<DistributionCalculationState>) => onChange({ ...state, ...patch })
  const reset = () => onChange(createDefaultCalculation(model, params))
  const setMiddle = (probability: number) => {
    const tail = (1 - probability) / 2
    update({ tool: 'probability', mode: 'interval', selectionEnabled: true, a: model.quantile(tail, params), b: model.quantile(1 - tail, params) })
  }
  const setRightTail = (probability: number) => update({ tool: 'probability', mode: 'right', selectionEnabled: true, a: model.quantile(1 - probability, params) })

  return <div className="border-t border-black/[0.06] bg-white/25 p-5 sm:p-7 lg:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2"><Calculator size={18} style={{ color }}/><h3 className="text-lg font-semibold">概率与分位点计算</h3></div>
        <p className="mt-1.5 text-sm leading-6 text-black/65">结果来自分布的 CDF/PMF 数学实现，不按图形像素估算。</p>
      </div>
      <button type="button" onClick={reset} className="liquid-control inline-flex self-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold text-black/65 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15"><RotateCcw size={13}/>重置计算</button>
    </div>

    <div className="mt-6 grid gap-5 xl:grid-cols-[1.12fr_.88fr]">
      <div className="min-w-0 rounded-[20px] border border-black/[0.06] bg-white/55 p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/[0.035] p-1" role="group" aria-label="计算工具">
          {[{ value: 'probability', label: '概率计算' }, { value: 'quantile', label: '分位点反查' }] .map((option) => <button key={option.value} type="button" aria-pressed={state.tool === option.value} onClick={() => update({ tool: option.value as DistributionCalculationState['tool'] })} className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15 ${state.tool === option.value ? 'bg-white text-black/80 shadow-sm' : 'text-black/65 hover:text-black/80'}`}>{option.label}</button>)}
        </div>

        {state.tool === 'probability' ? <>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="概率计算模式">
            {modeOptions.map((option) => {
              const selected = state.selectionEnabled && state.mode === option.value
              return <button key={option.value} type="button" aria-pressed={selected} onClick={() => selected ? update({ selectionEnabled: false }) : update({ tool: 'probability', mode: option.value, selectionEnabled: true })} className={`rounded-xl border px-2.5 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15 ${selected ? 'border-transparent shadow-sm' : 'border-black/[0.07] bg-white/55 text-black/65 hover:bg-white'}`} style={selected ? { backgroundColor: color, color: activeModeForeground } : undefined}><span className="block text-sm font-semibold leading-5">{option.label}</span><span className={`mt-0.5 block text-xs leading-[1.45] ${selected ? '' : 'text-black/65'}`} style={selected ? { color: activeModeForeground, opacity: 0.88 } : undefined}>{option.hint}</span></button>
            })}
          </div>
          {state.selectionEnabled ? <div className="mt-5 grid grid-cols-2 gap-3">
            {state.mode !== 'left' && <BoundaryInput
              label="a"
              value={state.a}
              onChange={(a) => update({ a })}
              discrete={model.kind === 'discrete'}
            />}
            {state.mode !== 'right' && <BoundaryInput
              label="b"
              value={state.b}
              onChange={(b) => update({ b })}
              discrete={model.kind === 'discrete'}
            />}
          </div> : <p className="mt-5 rounded-xl bg-black/[0.035] px-4 py-3 text-[13px] leading-6 text-black/65">当前未选择概率区域。点击上方任一模式后显示边界、阴影与概率结果。</p>}
        </> : <>
          <label className="mt-5 block">
            <span className="mb-2 block text-[13px] font-semibold leading-5 text-black/65">累计概率 p（0 &lt; p &lt; 1）</span>
            <input type="number" min="0.000001" max="0.999999" step="0.001" value={Number.isFinite(state.probability) ? state.probability : ''} onChange={(event) => update({ probability: event.currentTarget.value === '' ? Number.NaN : event.currentTarget.valueAsNumber })} className="w-full rounded-xl border border-black/[0.09] bg-white/75 px-3 py-2.5 font-mono text-base outline-none transition focus:border-blue/50 focus:ring-4 focus:ring-blue/10" aria-label="分位点累计概率 p"/>
          </label>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="常用累计概率">
            {[0.025, 0.05, 0.5, 0.95, 0.975].map((probability) => <button key={probability} type="button" onClick={() => update({ probability })} className="rounded-full border border-black/[0.07] bg-white/65 px-3 py-1.5 font-mono text-[13px] text-black/65 transition hover:border-black/[0.13] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15">{probability}</button>)}
          </div>
        </>}

        <div className="mt-5 border-t border-black/[0.06] pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/55">教学预设</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {slug === 'normal' && <button type="button" onClick={() => update({ tool: 'probability', mode: 'interval', selectionEnabled: true, a: params.mean - params.sigma, b: params.mean + params.sigma })} className="rounded-full bg-black/[0.045] px-3 py-1.5 text-[13px] font-medium text-black/65 hover:bg-black/[0.07] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15">μ ± σ</button>}
            <button type="button" onClick={() => setMiddle(0.95)} className="rounded-full bg-black/[0.045] px-3 py-1.5 text-[13px] font-medium text-black/65 hover:bg-black/[0.07] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15">中间 95%</button>
            <button type="button" onClick={() => setRightTail(0.05)} className="rounded-full bg-black/[0.045] px-3 py-1.5 text-[13px] font-medium text-black/65 hover:bg-black/[0.07] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15">右侧 5%</button>
          </div>
        </div>
      </div>

      <div className="min-w-0 rounded-[20px] p-5 text-white shadow-sm" style={{ background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 76%, #111))` }} aria-live="polite">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white/62">{state.tool === 'probability' ? 'Probability' : 'Quantile'}</p><p className="mt-2 text-sm leading-6 text-white/78">{state.tool === 'probability' ? state.selectionEnabled ? describeProbabilityMode(state.mode, state.a, state.b) : '尚未选择概率区域' : `q(${numberLabel(state.probability, 6)}) = min{x : F(x) ≥ p}`}</p></div>
          <Crosshair size={20} className="shrink-0 text-white/70"/>
        </div>
        {errors.length === 0 && state.tool === 'probability' && !state.selectionEnabled ? <div className="mt-6 rounded-2xl bg-white/12 p-4 text-sm leading-6 text-white/88">请选择左尾、右尾、区间或双尾模式；再次点击当前模式可取消选区。</div> : errors.length === 0 ? <>
          <p className="mt-6 break-all font-mono text-[34px] font-semibold tracking-[-0.04em] sm:text-[40px]">{state.tool === 'probability' ? probabilityResult.toFixed(digits) : numberLabel(quantileResult, digits)}</p>
          {state.tool === 'quantile' && slug === 'normal' && <p className="mt-2 font-mono text-sm text-white/75">标准化 z = {numberLabel(zValue, digits)}</p>}
          <div className="mt-5 flex items-center gap-2 text-[13px] leading-5 text-white/85"><CheckCircle2 size={15}/>{state.tool === 'probability' ? model.kind === 'continuous' ? '由 CDF 差值计算曲线下面积' : '按整数支持集精确累加 PMF' : model.kind === 'discrete' ? '采用最小满足 F(x) ≥ p 的整数' : '由解析反函数或稳定数值近似计算'}</div>
          <button type="button" aria-pressed={state.highPrecision} onClick={() => update({ highPrecision: !state.highPrecision })} className="mt-4 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25">{state.highPrecision ? '使用常规精度' : '查看更高精度'}</button>
        </> : <div role="alert" className="mt-6 rounded-2xl bg-white/12 p-4"><div className="flex gap-2"><TriangleAlert size={18} className="mt-0.5 shrink-0"/><div className="space-y-1 text-sm leading-6 text-white/88">{errors.map((error) => <p key={error}>{error}</p>)}</div></div></div>}
        {outsideSupport && errors.length === 0 && <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-5 text-white/74">边界超出该分布的支持集，超出部分的概率按 0 处理；图中会保留支持集边界。</p>}
        {support.convention && <p className="mt-4 border-t border-white/15 pt-4 text-xs leading-5 text-white/68">计数约定：{support.convention}</p>}
      </div>
    </div>
  </div>
}
