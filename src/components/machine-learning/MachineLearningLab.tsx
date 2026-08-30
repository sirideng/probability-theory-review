import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  gradientStep,
  fitPolynomialRegression,
  binaryCrossEntropy,
  linearCost,
  linearGradients,
  linearPrediction,
  multiGradientPath,
  polynomialFeatures,
  polynomialMeanSquaredError,
  polynomialPrediction,
  quadraticContour2D,
  scaleColumn,
  sigmoid,
  type FeatureScalingMode,
  type LinearSample,
} from '../../utils/machineLearningMath'

const houseSamples: LinearSample[] = [
  { x: 0.5, y: 90 }, { x: 1, y: 145 }, { x: 1.5, y: 190 }, { x: 2, y: 235 },
]

const scalingAreas = [300, 900, 1650, 2400, 3000]
const scalingRooms = [1, 3, 2, 4, 5]
const scalingTargets = [-0.42, -0.18, -0.06, 0.24, 0.42]

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const progress = ((value - min) / (max - min)) * 100
  return <label className="block min-w-0 text-[14px] font-semibold text-black/65">
    <span className="flex items-center justify-between gap-3"><span>{label}</span><output className="rounded-lg bg-blue/[0.07] px-2.5 py-1 font-mono text-[13px] text-blue">{Number.isInteger(step) ? value : value.toFixed(3)}</output></span>
    <input className="range-slider mt-3 w-full" style={{ '--progress': `${progress}%`, '--range-color': '#0071e3' } as React.CSSProperties} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </label>
}

function Plot({ w, b, showErrors = true }: { w: number; b: number; showErrors?: boolean }) {
  const sx = (x: number) => 42 + (x / 2.4) * 470
  const sy = (y: number) => 275 - (y / 280) * 230
  return <svg role="img" aria-label={`房价训练点与预测直线，当前 w=${w.toFixed(1)}，b=${b.toFixed(1)}`} viewBox="0 0 540 310" className="h-auto w-full min-w-[500px]">
    <g stroke="rgba(29,29,31,.08)">{[0, 70, 140, 210, 280].map((y) => <line key={y} x1="42" x2="512" y1={sy(y)} y2={sy(y)} />)}</g>
    <line x1="42" x2="512" y1="275" y2="275" stroke="rgba(29,29,31,.24)" />
    <line x1="42" x2="42" y1="45" y2="275" stroke="rgba(29,29,31,.24)" />
    {showErrors && houseSamples.map((sample) => <line key={`e-${sample.x}`} x1={sx(sample.x)} x2={sx(sample.x)} y1={sy(sample.y)} y2={sy(linearPrediction(sample.x, w, b))} stroke="#ff7a45" strokeWidth="2" strokeDasharray="5 5" />)}
    <line x1={sx(0)} y1={sy(b)} x2={sx(2.35)} y2={sy(linearPrediction(2.35, w, b))} stroke="#0071e3" strokeWidth="4" strokeLinecap="round" />
    {houseSamples.map((sample) => <circle key={sample.x} cx={sx(sample.x)} cy={sy(sample.y)} r="6" fill="white" stroke="#1d1d1f" strokeWidth="2.5" />)}
    <text x="277" y="302" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">面积（百平方米）</text>
    <text x="14" y="30" fill="rgba(29,29,31,.55)" fontSize="13">价格（万元）</text>
  </svg>
}

function LabShell({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return <section className="liquid-content-card overflow-hidden rounded-[26px] border">
    <div className="border-b border-black/[0.06] px-5 py-5 sm:px-7"><p className="text-[18px] font-semibold tracking-[-0.02em]">{title}</p><p className="mt-1 text-[13px] leading-6 text-black/55">{note}</p></div>
    <div className="p-4 sm:p-6">{children}</div>
  </section>
}

function SupervisedToggleLab() {
  const [labeled, setLabeled] = useState(true)
  const rows = [[60, 2, 120], [90, 3, 180], [130, 4, 260]]
  return <LabShell title="有监督目标 / 无目标标签" note="切换同一批数据，观察监督学习与无监督学习研究的问题怎样改变。">
    <div className="flex flex-wrap gap-2" role="group" aria-label="监督目标状态">
      {[true, false].map((value) => <button key={String(value)} type="button" aria-pressed={labeled === value} onClick={() => setLabeled(value)} className={`min-h-11 rounded-full px-4 text-[14px] font-semibold ${labeled === value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{value ? '有目标值' : '无目标标签'}</button>)}
    </div>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[420px] border-collapse text-left text-[14px]"><thead><tr className="border-b border-black/10 text-black/50"><th className="px-3 py-3">面积</th><th className="px-3 py-3">卧室数</th>{labeled && <th className="px-3 py-3 text-blue">房价（目标值）</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-b border-black/[0.06]"><td className="px-3 py-3">{row[0]}</td><td className="px-3 py-3">{row[1]}</td>{labeled && <td className="px-3 py-3 font-medium text-blue">{row[2]}</td>}</tr>)}</tbody></table></div>
    <p className="mt-5 rounded-[16px] bg-blue/[0.055] p-4 text-[15px] leading-7 text-black/60">{labeled ? '任务：学习面积、卧室数到连续房价目标值的映射，属于监督回归。' : '任务：研究面积和卧室数中的数据结构，例如以聚类寻找相似房屋群；没有目标值时不能直接训练房价预测器。'}</p>
  </LabShell>
}

function LinearRegressionLab() {
  const [w, setW] = useState(80)
  const [b, setB] = useState(40)
  const reset = () => { setW(80); setB(40) }
  return <LabShell title="线性回归实验台" note="拖动 w 与 b，观察直线、误差线和代价函数怎样同步变化。">
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0 overflow-x-auto"><Plot w={w} b={b} /></div>
      <div className="space-y-6"><Slider label="斜率 w" value={w} min={20} max={140} step={1} onChange={setW} /><Slider label="截距 b" value={b} min={0} max={100} step={1} onChange={setB} /><div className="rounded-[18px] bg-blue/[0.055] p-4"><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-blue/70">当前代价值</p><p className="mt-2 font-mono text-[26px] font-semibold text-blue">{linearCost(houseSamples, w, b).toFixed(2)}</p></div><button type="button" onClick={reset} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-black/[0.055] text-[14px] font-semibold text-black/60"><RotateCcw size={15} />重置参数</button></div>
    </div>
  </LabShell>
}

function CostCurve({ w }: { w: number }) {
  const values = Array.from({ length: 81 }, (_, index) => index * 2.5)
  const costs = values.map((value) => linearCost(houseSamples, value, 40))
  const maxCost = Math.max(...costs)
  const x = (value: number) => 36 + (value / 200) * 460
  const y = (value: number) => 270 - Math.min(value / maxCost, 1) * 220
  const d = values.map((value, index) => `${index ? 'L' : 'M'}${x(value)},${y(costs[index])}`).join(' ')
  return <svg role="img" aria-label={`代价函数曲线，当前 w=${w.toFixed(2)}`} viewBox="0 0 530 305" className="h-auto w-full min-w-[470px]">
    <line x1="36" x2="500" y1="270" y2="270" stroke="rgba(29,29,31,.22)" /><line x1="36" x2="36" y1="45" y2="270" stroke="rgba(29,29,31,.22)" />
    <path d={d} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
    <circle cx={x(Math.max(0, Math.min(200, w)))} cy={y(linearCost(houseSamples, w, 40))} r="7" fill="white" stroke="#0071e3" strokeWidth="4" />
    <text x="270" y="299" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">参数 w</text><text x="12" y="30" fill="rgba(29,29,31,.55)" fontSize="13">J(w,40)</text>
  </svg>
}

function CostFunctionLab() {
  const [w, setW] = useState(80)
  return <LabShell title="模型空间 ↔ 代价函数空间" note="同一个 w 同时决定左侧直线和右侧代价函数曲线上的位置。">
    <div className="grid min-w-0 gap-5 xl:grid-cols-2"><div className="min-w-0 overflow-x-auto"><Plot w={w} b={40} /></div><div className="min-w-0 overflow-x-auto"><CostCurve w={w} /></div></div>
    <div className="mt-5 grid items-center gap-5 md:grid-cols-[1fr_180px]"><Slider label="参数 w" value={w} min={0} max={200} step={1} onChange={setW} /><div className="rounded-[17px] bg-violet-500/[0.06] p-4"><p className="text-[12px] text-violet-700">J(w,40)</p><p className="mt-1 font-mono text-xl font-semibold">{linearCost(houseSamples, w, 40).toFixed(2)}</p></div></div>
  </LabShell>
}

function GradientDescentLab() {
  const samples = useMemo<LinearSample[]>(() => [{ x: -1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 3 }], [])
  const [w, setW] = useState(-2)
  const [b, setB] = useState(-1)
  const [running, setRunning] = useState(false)
  const [iteration, setIteration] = useState(0)
  const [costHistory, setCostHistory] = useState<number[]>([linearCost(samples, -2, -1)])
  const alpha = 0.15
  const advance = () => {
    const next = gradientStep(samples, w, b, alpha)
    setW(next.w); setB(next.b); setIteration((value) => value + 1); setCostHistory((values) => [...values, linearCost(samples, next.w, next.b)])
  }
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      const gradients = linearGradients(samples, w, b)
      if (Math.abs(gradients.dw) + Math.abs(gradients.db) < 0.002 || iteration >= 40) { setRunning(false); return }
      advance()
    }, 420)
    return () => window.clearInterval(timer)
  })
  const reset = () => { setRunning(false); setW(-2); setB(-1); setIteration(0); setCostHistory([linearCost(samples, -2, -1)]) }
  const gradients = linearGradients(samples, w, b)
  return <LabShell title="一步一步执行梯度下降" note="路径和数值都由当前样本、参数与梯度实时计算。">
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="min-w-0 overflow-x-auto"><CostHistory values={costHistory} /></div><div className="space-y-3"><Metric label="迭代" value={String(iteration)} /><Metric label="w / b" value={`${w.toFixed(3)} / ${b.toFixed(3)}`} /><Metric label="dw / db" value={`${gradients.dw.toFixed(3)} / ${gradients.db.toFixed(3)}`} /><Metric label="代价值" value={linearCost(samples, w, b).toFixed(5)} /><div className="grid grid-cols-2 gap-2 pt-2"><button type="button" onClick={advance} disabled={running} className="min-h-11 rounded-full bg-blue text-[13px] font-semibold text-white disabled:opacity-40"><StepForward size={15} className="mx-auto" /><span className="sr-only">执行一步</span></button><button type="button" onClick={() => setRunning((value) => !value)} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-600 text-[13px] font-semibold text-white">{running ? <Pause size={15} /> : <Play size={15} />}{running ? '暂停' : '连续运行'}</button><button type="button" onClick={reset} className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-full bg-black/[0.055] text-[13px] font-semibold text-black/60"><RotateCcw size={15} />重置</button></div></div></div>
  </LabShell>
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-[14px] bg-black/[0.035] px-3.5 py-3 text-[13px]"><span className="text-black/50">{label}</span><span className="font-mono font-semibold text-black/72">{value}</span></div> }

function LearningRateLab() {
  const samples = useMemo<LinearSample[]>(() => [{ x: -1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 3 }], [])
  const [alpha, setAlpha] = useState(0.15)
  const [history, setHistory] = useState<{ w: number; b: number; cost: number }[]>([{ w: -2, b: -1, cost: linearCost(samples, -2, -1) }])
  const run = () => {
    let w = -2; let b = -1
    const nextHistory = [{ w, b, cost: linearCost(samples, w, b) }]
    for (let index = 0; index < 18; index += 1) {
      const next = gradientStep(samples, w, b, alpha); w = next.w; b = next.b
      nextHistory.push({ w, b, cost: linearCost(samples, w, b) })
      if (!Number.isFinite(nextHistory.at(-1)!.cost) || nextHistory.at(-1)!.cost > 1e7) break
    }
    setHistory(nextHistory)
  }
  const last = history.at(-1)!
  const status = last.cost > history[0].cost * 2 ? '代价值上升：步长过大，更新跨过低点。' : alpha < 0.05 ? '代价值稳定下降，但移动较慢。' : '代价值下降较快，路径保持稳定。'
  return <LabShell title="学习率对比" note="选择预设或手动调整 α，再运行相同的 18 次真实梯度更新。">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0 overflow-x-auto"><CostHistory values={history.map((item) => item.cost)} /></div><div className="space-y-4"><div className="grid grid-cols-3 gap-2">{[{ label: '小', value: 0.02 }, { label: '合适', value: 0.15 }, { label: '大', value: 2.4 }].map((item) => <button type="button" key={item.label} aria-pressed={alpha === item.value} onClick={() => setAlpha(item.value)} className={`min-h-11 rounded-full text-[13px] font-semibold ${alpha === item.value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{item.label}</button>)}</div><Slider label="学习率 α" value={alpha} min={0.01} max={3} step={0.01} onChange={setAlpha} /><button type="button" onClick={run} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-blue text-[14px] font-semibold text-white"><Play size={15} />运行 18 步</button><button type="button" onClick={() => setHistory([{ w: -2, b: -1, cost: linearCost(samples, -2, -1) }])} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-black/[0.055] text-[14px] font-semibold text-black/60"><RotateCcw size={15} />重置</button><p className={`rounded-[15px] p-4 text-[13px] leading-6 ${last.cost > history[0].cost * 2 ? 'bg-rose-500/[0.08] text-rose-700' : 'bg-green-500/[0.08] text-green-800'}`}>{status}</p><Metric label="最终 w / b" value={`${last.w.toFixed(3)} / ${last.b.toFixed(3)}`} /></div></div>
  </LabShell>
}

function CostHistory({ values }: { values: number[] }) {
  const finite = values.map((value) => Math.min(value, 1e4))
  const max = Math.max(...finite, 1)
  const points = finite.map((value, index) => `${44 + index * (450 / Math.max(values.length - 1, 1))},${265 - (value / max) * 210}`).join(' ')
  return <svg role="img" aria-label="梯度下降代价函数历史" viewBox="0 0 530 305" className="h-auto w-full min-w-[470px]"><line x1="44" x2="500" y1="265" y2="265" stroke="rgba(29,29,31,.22)" /><line x1="44" x2="44" y1="50" y2="265" stroke="rgba(29,29,31,.22)" /><polyline points={points} fill="none" stroke="#0071e3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{finite.map((value, index) => <circle key={index} cx={44 + index * (450 / Math.max(values.length - 1, 1))} cy={265 - (value / max) * 210} r="3.5" fill="#0071e3" />)}<text x="270" y="297" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">迭代次数</text><text x="13" y="34" fill="rgba(29,29,31,.55)" fontSize="13">代价</text></svg>
}

function VectorizationLab() {
  const [area, setArea] = useState(120)
  const [rooms, setRooms] = useState(3)
  const [age, setAge] = useState(10)
  const contributions = [1.2 * area, 8 * rooms, -0.5 * age]
  const prediction = contributions.reduce((sum, value) => sum + value, 20)
  return <LabShell title="点积拆解" note="调整一个样本的三个特征，观察每项乘积怎样组成标量预测。"><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div className="space-y-5"><Slider label="面积 x₁" value={area} min={50} max={200} step={1} onChange={setArea} /><Slider label="卧室数 x₂" value={rooms} min={1} max={6} step={1} onChange={setRooms} /><Slider label="楼龄 x₃" value={age} min={0} max={30} step={1} onChange={setAge} /></div><div className="rounded-[20px] bg-blue/[0.055] p-5"><p className="text-[13px] font-semibold text-blue">w·x+b</p><div className="mt-4 space-y-2 font-mono text-[13px] text-black/65"><p>1.2×{area} = {contributions[0].toFixed(1)}</p><p>8×{rooms} = {contributions[1].toFixed(1)}</p><p>-0.5×{age} = {contributions[2].toFixed(1)}</p><p>偏置 b = 20</p></div><p className="mt-5 border-t border-blue/10 pt-4 text-[13px] text-black/50">prediction = scalar</p><p className="mt-1 font-mono text-[28px] font-semibold text-blue">{prediction.toFixed(1)}</p></div></div></LabShell>
}

function FeatureScalingLab() {
  const [mode, setMode] = useState<FeatureScalingMode>('raw')
  const [playing, setPlaying] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState(8)
  const scaledAreas = scaleColumn(scalingAreas, mode)
  const scaledRooms = scaleColumn(scalingRooms, mode)
  const sampleIndex = 4
  const formulas = { raw: '保持原始数值', mean: '(x-μ)/(max-min)', zscore: '(x-μ)/σ' }
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setVisibleSteps((value) => {
      if (value >= 8) { setPlaying(false); return value }
      return value + 1
    }), 420)
    return () => window.clearInterval(timer)
  }, [playing])
  const chooseMode = (nextMode: FeatureScalingMode) => { setMode(nextMode); setPlaying(false); setVisibleSteps(8) }
  const replay = () => { setVisibleSteps(1); setPlaying(true) }
  return <LabShell title="缩放前后与梯度路径" note="切换缩放方式；表格、代价函数等高线与路径根据当前数据尺度实时更新。"><div className="flex flex-wrap items-center gap-2" role="group" aria-label="特征缩放方式">{([{ id: 'raw', label: '原始数据' }, { id: 'mean', label: '均值归一化' }, { id: 'zscore', label: 'Z-score标准化' }] as const).map((item) => <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => chooseMode(item.id)} className={`min-h-11 rounded-full px-4 text-[13px] font-semibold ${mode === item.id ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{item.label}</button>)}<span className="mx-1 hidden h-6 w-px bg-black/10 sm:block" /><button type="button" onClick={() => visibleSteps >= 8 ? replay() : setPlaying((value) => !value)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-4 text-[13px] font-semibold text-white">{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '暂停' : '播放路径'}</button><button type="button" onClick={() => { setPlaying(false); setVisibleSteps(1) }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black/[0.045] px-4 text-[13px] font-semibold text-black/60"><RotateCcw size={15} />重置</button></div><div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[0.82fr_1.18fr]"><div className="rounded-[20px] bg-black/[0.025] p-5"><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">当前公式</p><p className="mt-2 font-mono text-[15px] text-blue">{formulas[mode]}</p><div className="mt-5 grid grid-cols-2 gap-3"><Metric label="面积 3000 →" value={scaledAreas[sampleIndex].toFixed(3)} /><Metric label="卧室 5 →" value={scaledRooms[sampleIndex].toFixed(3)} /></div><p className="mt-5 text-[13px] leading-6 text-black/50">原始范围：面积 300—3000，卧室数 1—5。缩放后两个特征更接近相同数量级，通常能改善梯度法的优化条件，但不保证预测精度提高。</p></div><div className="min-w-0 overflow-x-auto"><ScalingContours mode={mode} visibleSteps={visibleSteps} /></div></div></LabShell>
}

function ScalingContours({ mode, visibleSteps }: { mode: 'raw' | 'mean' | 'zscore'; visibleSteps: number }) {
  const raw = mode === 'raw'
  const areas = scaleColumn(scalingAreas, mode)
  const rooms = scaleColumn(scalingRooms, mode)
  const features = areas.map((area, index) => [area, rooms[index]])
  const contour = quadraticContour2D(features, scalingTargets)
  if (!contour) return null
  const initialWeights = [contour.center[0] - 0.7, contour.center[1] - 0.7]
  const path = multiGradientPath(features, scalingTargets, initialWeights, 0.05, 7)
  const plotPoints = path.map(({ weights }) => {
    const x = 290 + (weights[0] - contour.center[0]) * 115
    const y = 180 - (weights[1] - contour.center[1]) * 82
    return [Math.max(72, Math.min(500, x)), Math.max(38, Math.min(258, y))] as const
  })
  const shownPoints = plotPoints.slice(0, Math.max(1, visibleSteps))
  const pathString = shownPoints.map(([x, y]) => `${x},${y}`).join(' ')
  const majorRadius = 150
  const minorRadius = Math.max(4, majorRadius / contour.axisRatio)
  const ratioLabel = contour.axisRatio >= 100 ? contour.axisRatio.toExponential(1) : contour.axisRatio.toFixed(1)
  return <svg role="img" aria-label={`${mode === 'raw' ? '缩放前条件较差' : '缩放后条件得到改善'}的真实代价函数等高线，轴比约 ${ratioLabel}，并显示学习率为 0.05 的梯度下降路径`} viewBox="0 0 520 300" className="h-auto w-full min-w-[470px]"><rect x="1" y="1" width="518" height="298" rx="22" fill="rgba(0,113,227,.025)" />{[1, 0.78, 0.56, 0.34].map((factor) => <ellipse key={factor} cx="290" cy="180" rx={majorRadius * factor} ry={minorRadius * factor} transform={`rotate(${contour.majorAxisAngleDegrees} 290 180)`} fill="none" stroke="rgba(88,86,214,.28)" strokeWidth="2" />)}<polyline points={pathString} fill="none" stroke="#ff7a45" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{shownPoints.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="5" fill="white" stroke="#ff7a45" strokeWidth="3" />)}<circle cx="290" cy="180" r="6" fill="#0071e3" /><text x="260" y="285" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">w₁</text><text x="18" y="30" fill="rgba(29,29,31,.55)" fontSize="13">w₂</text><text x="26" y="257" fill="rgba(29,29,31,.55)" fontSize="12">等高线轴比 ≈ {ratioLabel}（由 XᵀX/m 计算）</text><text x="26" y="277" fill="rgba(29,29,31,.55)" fontSize="12">{raw ? '相同 α=0.05：第一步即越出当前参数视图' : '相同 α=0.05：路径由缩放后数据的真实梯度计算'}</text></svg>
}

function ConvergenceLearningRateLab() {
  const samples = useMemo<LinearSample[]>(() => [{ x: -1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 3 }], [])
  const [alpha, setAlpha] = useState(0.15)
  const epsilon = 0.0001
  const history = useMemo(() => {
    let w = -2
    let b = -1
    const values = [linearCost(samples, w, b)]
    for (let iteration = 0; iteration < 80; iteration += 1) {
      const next = gradientStep(samples, w, b, alpha)
      w = next.w
      b = next.b
      const cost = linearCost(samples, w, b)
      values.push(cost)
      if (!Number.isFinite(cost) || cost > 1e8) break
    }
    return values
  }, [alpha, samples])
  const firstConverged = history.slice(1).findIndex((cost, index) => Math.abs(history[index] - cost) <= epsilon)
  const last = history.at(-1) ?? 0
  const delta = history.length > 1 ? Math.abs(history.at(-2)! - last) : 0
  const diverged = !Number.isFinite(last) || last > history[0] * 10
  const status = diverged
    ? '代价值快速上升：当前学习率过大。'
    : firstConverged >= 0
      ? `第 ${firstConverged + 1} 次更新后首次满足启发式条件 |ΔJ|≤ε；这并不单独证明已到达最优解。`
      : '80 次更新内尚未达到阈值；结合曲线判断是下降缓慢还是步长不合适。'

  return <LabShell title="收敛曲线与学习率诊断" note="同一数据、同一起点运行 80 次更新；曲线和停止条件全部基于真实代价值。">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 overflow-x-auto"><CostHistory values={history} /></div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">{[{ label: '过小', value: 0.02 }, { label: '合适', value: 0.15 }, { label: '过大', value: 2.4 }].map((item) => <button type="button" key={item.label} aria-pressed={alpha === item.value} onClick={() => setAlpha(item.value)} className={`min-h-11 rounded-full text-[13px] font-semibold ${alpha === item.value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{item.label}</button>)}</div>
        <Slider label="学习率 α" value={alpha} min={0.01} max={3} step={0.01} onChange={setAlpha} />
        <Metric label="停止阈值 ε" value={epsilon.toExponential(0)} />
        <Metric label="最后一次 |ΔJ|" value={Number.isFinite(delta) ? delta.toExponential(2) : '∞'} />
        <p className={`rounded-[15px] p-4 text-[13px] leading-6 ${diverged ? 'bg-rose-500/[0.08] text-rose-700' : 'bg-green-500/[0.08] text-green-800'}`}>{status}</p>
      </div>
    </div>
  </LabShell>
}

const polynomialSamples: LinearSample[] = [
  { x: 0, y: 2.1 }, { x: 1, y: 3.2 }, { x: 2, y: 5.8 }, { x: 3, y: 11.4 },
  { x: 4, y: 17.6 }, { x: 5, y: 27.2 }, { x: 6, y: 37.9 },
]

function PolynomialPlot({ degree, coefficients }: { degree: number; coefficients: number[] }) {
  const sx = (x: number) => 42 + (x / 6) * 470
  const sy = (y: number) => 270 - (y / 42) * 220
  const curve = Array.from({ length: 81 }, (_, index) => index * (6 / 80))
    .map((x, index) => `${index ? 'L' : 'M'}${sx(x)},${sy(polynomialPrediction(x, coefficients))}`)
    .join(' ')
  return <svg role="img" aria-label={`${degree} 次多项式回归拟合图`} viewBox="0 0 540 310" className="h-auto w-full">
    <g stroke="rgba(29,29,31,.08)">{[0, 10, 20, 30, 40].map((y) => <line key={y} x1="42" x2="512" y1={sy(y)} y2={sy(y)} />)}</g>
    <line x1="42" x2="512" y1="270" y2="270" stroke="rgba(29,29,31,.24)" />
    <line x1="42" x2="42" y1="50" y2="270" stroke="rgba(29,29,31,.24)" />
    <path d={curve} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
    {polynomialSamples.map((sample) => <circle key={sample.x} cx={sx(sample.x)} cy={sy(sample.y)} r="6" fill="white" stroke="#0071e3" strokeWidth="2.5" />)}
    <text x="277" y="301" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">原始特征 x</text>
    <text x="13" y="34" fill="rgba(29,29,31,.55)" fontSize="13">y</text>
  </svg>
}

function PolynomialRegressionLab() {
  const [degree, setDegree] = useState(2)
  const coefficients = fitPolynomialRegression(polynomialSamples, degree) ?? [0]
  const transformed = polynomialFeatures(5, degree)
  const mse = polynomialMeanSquaredError(polynomialSamples, coefficients)
  return <LabShell title="从原始特征到多项式特征" note="切换次数，观察特征数量、拟合曲线和训练误差如何变化。">
    <div className="flex flex-wrap gap-2" role="group" aria-label="多项式次数">{[1, 2, 3].map((value) => <button key={value} type="button" aria-pressed={degree === value} onClick={() => setDegree(value)} className={`min-h-11 rounded-full px-5 text-[13px] font-semibold ${degree === value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{value} 次</button>)}</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0"><PolynomialPlot degree={degree} coefficients={coefficients} /></div>
      <div className="space-y-4">
        <div className="rounded-[18px] bg-violet-500/[0.06] p-5"><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-violet-700">x=5 的新特征</p><p className="mt-3 break-words font-mono text-[15px] leading-7 text-black/68">[{transformed.join(', ')}]</p></div>
        <Metric label="特征个数" value={String(degree)} />
        <Metric label="训练 MSE" value={mse.toFixed(4)} />
        <p className="rounded-[15px] bg-blue/[0.055] p-4 text-[13px] leading-6 text-black/60">模型对 {`[x, x²${degree >= 3 ? ', x³' : ''}]`} 仍是线性的；弯曲来自特征变换，而不是换成另一套代价函数。</p>
      </div>
    </div>
  </LabShell>
}

function LogisticRegressionLab() {
  const [w, setW] = useState(1.4)
  const [b, setB] = useState(0)
  const [probe, setProbe] = useState(1)
  const sx = (x: number) => 48 + ((x + 4) / 8) * 440
  const sy = (probability: number) => 260 - probability * 200
  const curve = Array.from({ length: 101 }, (_, index) => -4 + index * 0.08)
    .map((x, index) => `${index ? 'L' : 'M'}${sx(x)},${sy(sigmoid(w * x + b))}`).join(' ')
  const probability = sigmoid(w * probe + b)
  const boundary = Math.abs(w) > 1e-9 ? -b / w : Number.NaN
  const samples = [{ x: -3, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]

  return <LabShell title="Sigmoid函数（逻辑函数）与决策边界" note="调整 w、b 和待预测输入；正类概率估计曲线、0.5 阈值与预测类别实时同步。">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0"><svg role="img" aria-label={`逻辑回归正类概率估计曲线，当前决策边界 x=${Number.isFinite(boundary) ? boundary.toFixed(2) : '未定义'}`} viewBox="0 0 530 305" className="h-auto w-full"><g stroke="rgba(29,29,31,.08)">{[0, 0.5, 1].map((p) => <line key={p} x1="48" x2="488" y1={sy(p)} y2={sy(p)} />)}</g><line x1="48" x2="488" y1="260" y2="260" stroke="rgba(29,29,31,.24)" /><line x1="48" x2="48" y1="60" y2="260" stroke="rgba(29,29,31,.24)" /><line x1="48" x2="488" y1={sy(0.5)} y2={sy(0.5)} stroke="#ff7a45" strokeWidth="2" strokeDasharray="6 6" /><path d={curve} fill="none" stroke="#0071e3" strokeWidth="4" strokeLinecap="round" />{Number.isFinite(boundary) && boundary >= -4 && boundary <= 4 && <line x1={sx(boundary)} x2={sx(boundary)} y1="55" y2="260" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="7 6" />}{samples.map((sample) => <circle key={sample.x} cx={sx(sample.x)} cy={sy(sample.y)} r="6" fill={sample.y ? '#34c759' : '#ff453a'} stroke="white" strokeWidth="2" />)}<circle cx={sx(probe)} cy={sy(probability)} r="7" fill="white" stroke="#1d1d1f" strokeWidth="3" /><text x="267" y="297" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">特征 x</text><text x="14" y="35" fill="rgba(29,29,31,.55)" fontSize="13">正类概率估计</text></svg></div>
      <div className="space-y-5"><Slider label="权重 w" value={w} min={0.2} max={3} step={0.1} onChange={setW} /><Slider label="偏置 b" value={b} min={-3} max={3} step={0.1} onChange={setB} /><Slider label="待预测输入 x" value={probe} min={-4} max={4} step={0.1} onChange={setProbe} /><Metric label="正类概率估计 p̂" value={probability.toFixed(4)} /><Metric label="预测类别" value={probability >= 0.5 ? '1' : '0'} /><Metric label="决策边界" value={Number.isFinite(boundary) ? `x=${boundary.toFixed(3)}` : '未定义'} /></div>
    </div>
  </LabShell>
}

function LogisticCostLab() {
  const [label, setLabel] = useState<0 | 1>(1)
  const [probability, setProbability] = useState(0.8)
  const loss = binaryCrossEntropy(probability, label)
  const sx = (p: number) => 48 + p * 440
  const sy = (value: number) => 260 - (Math.min(value, 4.6) / 4.6) * 200
  const curve = Array.from({ length: 99 }, (_, index) => 0.01 + index * 0.01)
    .map((p, index) => `${index ? 'L' : 'M'}${sx(p)},${sy(binaryCrossEntropy(p, label))}`).join(' ')
  return <LabShell title="单样本二元交叉熵损失" note="切换真实类别标签并调整正类概率估计，观察自信但错误的预测为什么受到巨大惩罚。"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0"><svg role="img" aria-label={`真实类别标签 ${label} 时的二元交叉熵损失曲线，当前损失 ${loss.toFixed(4)}`} viewBox="0 0 530 305" className="h-auto w-full"><line x1="48" x2="488" y1="260" y2="260" stroke="rgba(29,29,31,.24)" /><line x1="48" x2="48" y1="60" y2="260" stroke="rgba(29,29,31,.24)" /><path d={curve} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" /><circle cx={sx(probability)} cy={sy(loss)} r="7" fill="white" stroke="#ff7a45" strokeWidth="4" /><text x="267" y="297" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">正类概率估计 p̂</text><text x="12" y="35" fill="rgba(29,29,31,.55)" fontSize="13">损失</text></svg></div><div className="space-y-5"><div className="grid grid-cols-2 gap-2" role="group" aria-label="真实类别标签">{([0, 1] as const).map((value) => <button key={value} type="button" aria-pressed={label === value} onClick={() => setLabel(value)} className={`min-h-11 rounded-full text-[13px] font-semibold ${label === value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>真实 y={value}</button>)}</div><Slider label="正类概率估计 p̂" value={probability} min={0.01} max={0.99} step={0.01} onChange={setProbability} /><Metric label="当前损失" value={loss.toFixed(4)} /><p className="rounded-[15px] bg-violet-500/[0.06] p-4 text-[13px] leading-6 text-black/60">{label === 1 ? 'y=1 时，希望 p̂ 接近 1；p̂ 越接近 0，−log(p̂) 越大。' : 'y=0 时，希望 p̂ 接近 0；p̂ 越接近 1，−log(1−p̂) 越大。'}</p></div></div></LabShell>
}

const overfitSamples: LinearSample[] = [
  { x: -1, y: -0.2 }, { x: -0.7, y: -0.72 }, { x: -0.35, y: -0.18 }, { x: -0.05, y: 0.08 },
  { x: 0.25, y: 0.62 }, { x: 0.55, y: 0.35 }, { x: 0.8, y: 0.92 }, { x: 1, y: 0.72 },
]

function OverfittingRegularizationLab() {
  const [lambda, setLambda] = useState(0.1)
  const coefficients = fitPolynomialRegression(overfitSamples, 6, lambda) ?? [0]
  const coefficientNorm = Math.sqrt(coefficients.slice(1).reduce((sum, value) => sum + value * value, 0))
  const sx = (x: number) => 48 + ((x + 1) / 2) * 440
  const sy = (y: number) => 160 - Math.max(-1.5, Math.min(1.5, y)) * 72
  const curve = Array.from({ length: 101 }, (_, index) => -1 + index * 0.02)
    .map((x, index) => `${index ? 'L' : 'M'}${sx(x)},${sy(polynomialPrediction(x, coefficients))}`).join(' ')
  const mse = polynomialMeanSquaredError(overfitSamples, coefficients)
  return <LabShell title="L2正则化怎样影响高次项" note="固定六次多项式，只改变 λ；曲线由带 L2 正则项的最小二乘数值结果实时计算。"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0"><svg role="img" aria-label={`六次多项式L2正则化拟合，lambda=${lambda.toFixed(2)}`} viewBox="0 0 530 305" className="h-auto w-full"><line x1="48" x2="488" y1={sy(0)} y2={sy(0)} stroke="rgba(29,29,31,.18)" /><line x1="48" x2="48" y1="50" y2="270" stroke="rgba(29,29,31,.22)" /><path d={curve} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />{overfitSamples.map((sample) => <circle key={sample.x} cx={sx(sample.x)} cy={sy(sample.y)} r="6" fill="white" stroke="#0071e3" strokeWidth="2.5" />)}<text x="267" y="297" textAnchor="middle" fill="rgba(29,29,31,.55)" fontSize="13">x</text><text x="13" y="35" fill="rgba(29,29,31,.55)" fontSize="13">y</text></svg></div><div className="space-y-5"><div className="grid grid-cols-3 gap-2">{[{ label: '无', value: 0 }, { label: '适中', value: 0.1 }, { label: '很强', value: 10 }].map((item) => <button key={item.label} type="button" aria-pressed={lambda === item.value} onClick={() => setLambda(item.value)} className={`min-h-11 rounded-full text-[13px] font-semibold ${lambda === item.value ? 'bg-blue text-white' : 'bg-black/[0.045] text-black/60'}`}>{item.label}</button>)}</div><Slider label="正则化强度 λ" value={lambda} min={0} max={10} step={0.1} onChange={setLambda} /><Metric label="权重 L2 范数" value={coefficientNorm.toFixed(3)} /><Metric label="训练 MSE" value={mse.toFixed(4)} /><p className="rounded-[15px] bg-blue/[0.055] p-4 text-[13px] leading-6 text-black/60">λ 增大时通常会抑制权重规模并使曲线更平缓；最终结果仍同时受到数据拟合项影响，λ 过大也可能让模型过于简单。</p></div></div></LabShell>
}

function RegularizedModelsLab() {
  const [model, setModel] = useState<'linear' | 'logistic'>('linear')
  const [lambda, setLambda] = useState(1)
  const [weight, setWeight] = useState(3)
  const sampleCount = 5
  const dataGradient = model === 'linear' ? -0.8 : -0.25
  const penaltyGradient = lambda * weight / sampleCount
  const totalGradient = dataGradient + penaltyGradient
  return <LabShell title="数据梯度 + 正则化梯度" note="线性回归与逻辑回归的数据拟合项不同，但 L2 正则项带来的权重梯度形式相同。"><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div className="rounded-[22px] bg-black/[0.025] p-5 sm:p-7"><div className="grid grid-cols-2 gap-2" role="group" aria-label="模型类型">{([{ id: 'linear', label: '线性回归' }, { id: 'logistic', label: '逻辑回归' }] as const).map((item) => <button key={item.id} type="button" aria-pressed={model === item.id} onClick={() => setModel(item.id)} className={`min-h-11 rounded-full text-[13px] font-semibold ${model === item.id ? 'bg-blue text-white' : 'bg-white text-black/60 shadow-sm'}`}>{item.label}</button>)}</div><div className="mt-7 space-y-3 font-mono text-[15px] leading-7 text-black/68"><p>数据拟合项梯度 = {dataGradient.toFixed(3)}</p><p>正则化梯度 = (λ/m)w = {penaltyGradient.toFixed(3)}</p><p className="border-t border-black/[0.07] pt-3 font-semibold text-blue">总梯度 = {totalGradient.toFixed(3)}</p><p className="text-[13px] font-sans text-black/50">在当前课程约定下，偏置 b 不加入正则项，因此没有这部分梯度。</p></div></div><div className="space-y-6"><Slider label="正则化强度 λ" value={lambda} min={0} max={10} step={0.1} onChange={setLambda} /><Slider label="当前权重 w" value={weight} min={-5} max={5} step={0.1} onChange={setWeight} /><Metric label="样本数 m" value={String(sampleCount)} /><Metric label="更新方向" value={totalGradient > 0 ? 'w 减小' : totalGradient < 0 ? 'w 增大' : '暂不改变'} /></div></div></LabShell>
}

export default function MachineLearningLab({ type }: { type: string }) {
  if (type === 'supervised-toggle') return <SupervisedToggleLab />
  if (type === 'linear-regression') return <LinearRegressionLab />
  if (type === 'cost-function') return <CostFunctionLab />
  if (type === 'gradient-descent') return <GradientDescentLab />
  if (type === 'learning-rate') return <LearningRateLab />
  if (type === 'vectorization') return <VectorizationLab />
  if (type === 'feature-scaling') return <FeatureScalingLab />
  if (type === 'convergence-learning-rate') return <ConvergenceLearningRateLab />
  if (type === 'polynomial-regression') return <PolynomialRegressionLab />
  if (type === 'logistic-regression') return <LogisticRegressionLab />
  if (type === 'logistic-cost') return <LogisticCostLab />
  if (type === 'overfitting-regularization') return <OverfittingRegularizationLab />
  if (type === 'regularized-models') return <RegularizedModelsLab />
  return null
}
