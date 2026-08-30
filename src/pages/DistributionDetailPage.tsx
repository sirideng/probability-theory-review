import { useState } from 'react'
import { AlertTriangle, ArrowLeft, BookOpenCheck, ChartSpline, Check, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import DistributionChart, { type DistributionSeries } from '../components/distributions/DistributionChart'
import DistributionCalculatorPanel from '../components/distributions/DistributionCalculatorPanel'
import InlineMathText from '../components/math/InlineMathText'
import MathFormula from '../components/math/MathFormula'
import LongPageNavigation from '../components/navigation/LongPageNavigation'
import distributionData from '../data/distributions.json'
import type { Distribution } from '../types/content'
import { createDefaultCalculation, getDistributionModel, type DistributionCalculationState } from '../utils/distributionMath'

type ParamConfig = { key: string; label: string; symbol: string; min: number; max: number; step: number }

const settings: Record<string, { initial: Record<string, number>; controls: ParamConfig[] }> = {
  bernoulli: { initial: { p: 0.5 }, controls: [{ key: 'p', label: '成功概率', symbol: 'p', min: 0.05, max: 0.95, step: 0.05 }] },
  binomial: { initial: { n: 12, p: 0.5 }, controls: [{ key: 'n', label: '试验次数', symbol: 'n', min: 2, max: 30, step: 1 }, { key: 'p', label: '成功概率', symbol: 'p', min: 0.05, max: 0.95, step: 0.05 }] },
  poisson: { initial: { lambda: 4 }, controls: [{ key: 'lambda', label: '平均发生次数', symbol: 'λ', min: 0.5, max: 12, step: 0.5 }] },
  geometric: { initial: { p: 0.35 }, controls: [{ key: 'p', label: '成功概率', symbol: 'p', min: 0.1, max: 0.9, step: 0.05 }] },
  uniform: { initial: { a: -2, b: 2 }, controls: [{ key: 'a', label: '左端点', symbol: 'a', min: -4, max: 2.5, step: 0.5 }, { key: 'b', label: '右端点', symbol: 'b', min: -2.5, max: 4, step: 0.5 }] },
  exponential: { initial: { lambda: 1 }, controls: [{ key: 'lambda', label: '事件发生率', symbol: 'λ', min: 0.2, max: 3, step: 0.1 }] },
  normal: { initial: { mean: 0, sigma: 1 }, controls: [{ key: 'mean', label: '均值', symbol: 'μ', min: -3, max: 3, step: 0.1 }, { key: 'sigma', label: '标准差', symbol: 'σ', min: 0.5, max: 2.5, step: 0.1 }] },
  'chi-square': { initial: { nu: 5 }, controls: [{ key: 'nu', label: '自由度', symbol: 'ν', min: 1, max: 20, step: 1 }] },
  'student-t': { initial: { nu: 5 }, controls: [{ key: 'nu', label: '自由度', symbol: 'ν', min: 1, max: 30, step: 1 }] },
  'f-distribution': { initial: { d1: 5, d2: 10 }, controls: [{ key: 'd1', label: '分子自由度', symbol: 'ν₁', min: 1, max: 20, step: 1 }, { key: 'd2', label: '分母自由度', symbol: 'ν₂', min: 2, max: 30, step: 1 }] },
}

function RangeControl({ control, value, onChange, color }: { control: ParamConfig; value: number; onChange: (value: number) => void; color: string }) {
  const progress = (value - control.min) / (control.max - control.min) * 100
  const inputId = `distribution-parameter-${control.key}`
  return <div className="block"><div className="flex items-center justify-between gap-4"><label htmlFor={inputId} className="text-[15px] font-semibold">{control.label} <span className="ml-1 font-serif text-black/35">{control.symbol}</span></label><output htmlFor={inputId} className="min-w-[56px] rounded-lg px-2.5 py-1 text-center font-mono text-sm font-semibold" style={{ color, backgroundColor: `${color}12` }}>{Number.isInteger(control.step) ? value : value.toFixed(2).replace(/0$/, '')}</output></div><input id={inputId} aria-label={`${control.label} ${control.symbol}`} type="range" min={control.min} max={control.max} step={control.step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="range-slider mt-4 w-full" style={{ '--progress': `${progress}%`, '--range-color': color } as React.CSSProperties}/></div>
}

export default function DistributionDetailPage() {
  const { slug = 'normal' } = useParams()

  return <DistributionDetailContent key={slug} slug={slug} />
}

function DistributionDetailContent({ slug }: { slug: string }) {
  const distribution = (distributionData as Distribution[]).find((item) => item.slug === slug)
  const setting = settings[slug]
  const [params, setParams] = useState<Record<string, number>>(() => ({ ...(setting?.initial ?? {}) }))
  const [activeSeries, setActiveSeries] = useState<DistributionSeries>('density')
  const model = getDistributionModel(slug)
  const [calculation, setCalculation] = useState<DistributionCalculationState | null>(() => model ? createDefaultCalculation(model, setting?.initial ?? {}) : null)

  if (!distribution || !setting) return <div className="page-container py-20 text-center"><h1 className="text-3xl font-semibold">未找到该分布</h1><Link to="/distributions" className="mt-6 inline-flex text-blue">返回分布图像库</Link></div>

  const effectiveParams = { ...setting.initial, ...params }
  const parameterText = setting.controls.map((control) => `${control.symbol}=${effectiveParams[control.key]}`).join('，')
  const densityLabel = distribution.type === '离散型' ? '概率质量函数' : '概率密度函数'

  const updateParam = (key: string, value: number) => setParams((current) => {
    const next = { ...current, [key]: value }
    if (slug === 'uniform' && key === 'a' && value >= current.b) next.b = Math.min(4, value + 0.5)
    if (slug === 'uniform' && key === 'b' && value <= current.a) next.a = Math.max(-4, value - 0.5)
    return next
  })

  return <LongPageNavigation><div className="page-container pb-28 pt-8 sm:pt-14">
    <div className="sticky top-20 z-10 -ml-2 w-fit lg:top-4">
      <Link to="/distributions" className="liquid-control inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[15px] font-medium text-black/55 transition hover:text-blue"><ArrowLeft size={17}/> 返回分布图像库</Link>
    </div>

      <header className="mt-10 flex flex-col gap-7 border-b border-black/[0.075] pb-11 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2"><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color: distribution.color, backgroundColor: `${distribution.color}12` }}>{distribution.type}{distribution.type === '预留' ? ' · 数理统计预览' : ''}</span><span className="text-sm text-black/35">{distribution.englishName} Distribution</span></div><h1 className="mt-5 text-[48px] font-bold leading-[1.05] tracking-[-0.06em] sm:text-[64px]">{distribution.name}</h1><p className="mt-5 max-w-3xl text-[18px] leading-8 text-black/55">{distribution.summary}</p></div><div className="liquid-control rounded-[18px] border px-5 py-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-black/35">Notation</p><p className="mt-1 font-serif text-xl italic" style={{ color: distribution.color }}>X ~ {distribution.symbol}</p></div></header>

      <section className="liquid-content-card mt-8 overflow-hidden rounded-[30px] border"><div className="flex flex-col gap-3 border-b border-black/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><div className="flex items-center gap-2"><ChartSpline size={19} style={{ color: distribution.color }}/><h2 className="text-xl font-semibold tracking-tight">交互分布实验台</h2></div><p className="mt-1.5 text-sm text-black/65">拖动参数与概率边界观察变化；点击图像索引切换重点 · 当前 {parameterText}</p></div><button onClick={() => setParams({ ...setting.initial })} className="liquid-control inline-flex self-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold text-black/65 transition"><RotateCcw size={13}/>重置参数</button></div><div className="grid lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_240px]"><div className="min-w-0 p-3 sm:p-5 xl:p-6"><DistributionChart slug={slug} params={effectiveParams} color={distribution.color} activeSeries={activeSeries} onSeriesChange={setActiveSeries} calculation={calculation ?? undefined} onCalculationChange={calculation ? (patch) => setCalculation((current) => current ? { ...current, ...patch } : current) : undefined}/></div><div className="border-t border-black/[0.06] bg-white/45 p-5 lg:border-l lg:border-t-0 sm:p-6"><div className="mb-6 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal size={17} style={{ color: distribution.color }}/>参数调整</div><div className="space-y-7">{setting.controls.map((control) => <RangeControl key={control.key} control={control} value={effectiveParams[control.key]} onChange={(value) => updateParam(control.key,value)} color={distribution.color}/>)}</div><div className="mt-7 rounded-2xl p-3.5 text-[13px] leading-6 text-black/65" style={{ backgroundColor: `${distribution.color}0d` }}>{distribution.parameterNotes.join('；')}。</div></div></div>{model && calculation ? <DistributionCalculatorPanel slug={slug} model={model} params={effectiveParams} color={distribution.color} state={calculation} onChange={(next) => setCalculation(next)}/> : <div className="border-t border-black/[0.06] bg-amber-50/55 px-6 py-4 text-sm leading-6 text-amber-800 sm:px-8">该预留分布目前仅展示密度形状；精确 CDF 与分位点计算将在数理统计阶段接入，当前不提供近似结果。</div>}</section>

      <section className="liquid-content-card mt-6 rounded-[24px] border p-6 sm:p-8"><div className="flex items-center gap-3"><span className="section-number" style={{ color: distribution.color, backgroundColor: `${distribution.color}12` }}>01</span><h2 data-section-id="distribution-formula" className="text-2xl font-semibold">数学公式 · {activeSeries === 'density' ? densityLabel : '分布函数'}</h2></div>{activeSeries === 'density' ? <MathFormula value={distribution.formula} block className="formula-display mt-6"/> : distribution.cdfFormula ? <MathFormula value={distribution.cdfFormula} block className="formula-display mt-6"/> : <div className="formula-display mt-6 text-left text-[16px] leading-8 text-black/60 sm:text-[17px]"><strong className="text-black/75">无需记忆特殊函数表达式。</strong><span className="ml-2">{distribution.cdfNote}</span></div>}</section>

    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div className="info-card"><span className="info-label">适用场景</span><div className="mt-4 flex gap-3"><Sparkles size={19} className="mt-0.5 shrink-0" style={{ color: distribution.color }}/><p>{distribution.scene}</p></div></div><div className="info-card xl:col-span-1"><span className="info-label">期望</span><MathFormula value={`E(X)=${distribution.expectation}`} block className="mt-5 text-2xl"/></div><div className="info-card"><span className="info-label">方差</span><MathFormula value={`\\operatorname{Var}(X)=${distribution.variance}`} block className="mt-5 text-2xl"/></div><div className="info-card"><span className="info-label">分布类型</span><p className="mt-5 text-xl font-semibold">{distribution.type}</p><p className="mt-2 text-sm text-black/40">{distribution.type === '离散型' ? '柱高表示概率质量' : '曲线下面积表示概率'}</p></div></section>

    {distribution.standardizationExample && <section className="liquid-content-card mt-6 min-w-0 rounded-[28px] border p-6 sm:p-8"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-3"><span className="section-number" style={{ color: distribution.color, backgroundColor: `${distribution.color}12` }}>02</span><div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/45">标准化解题法</p><h2 className="mt-1 text-2xl font-semibold">{distribution.standardizationExample.title}</h2></div></div><span className="self-start rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">{distribution.standardizationExample.source}</span></div><div className="mt-7 rounded-[20px] border border-black/[0.05] bg-white/60 p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">题目</p><p className="mt-3 text-[16px] leading-8 text-black/70 sm:text-[17px]">{distribution.standardizationExample.problem}</p></div><div className="mt-5 rounded-[18px] bg-violet-50/70 p-5"><p className="text-sm font-semibold text-violet-700">入手方法</p><p className="mt-2 text-[15px] leading-7 text-black/60">{distribution.standardizationExample.method}</p></div><div className="mt-7 space-y-5">{distribution.standardizationExample.steps.map((step, index) => <div key={step.text} className="grid min-w-0 gap-3 sm:grid-cols-[36px_1fr]"><span className="grid h-8 w-8 place-items-center rounded-full bg-black/[0.045] text-xs font-semibold text-black/60">{index + 1}</span><div className="min-w-0"><p className="text-[15px] leading-7 text-black/60">{step.text}</p>{step.formula && <MathFormula value={step.formula} block className="property-formula mt-3 w-full"/>}</div></div>)}</div><div className="mt-7 min-w-0 overflow-hidden rounded-[20px] border border-green-600/10 bg-green-50/70 p-5 sm:p-6"><p className="text-sm font-semibold text-green-700">结论</p><p className="mt-2 text-[15px] leading-7 text-black/60">{distribution.standardizationExample.answer}</p><MathFormula value={distribution.standardizationExample.answerFormula} block className="mt-4 max-w-full overflow-x-auto text-xl text-green-700"/></div></section>}

    <section className="mt-6 grid items-start gap-4 lg:grid-cols-3"><div className="knowledge-section !rounded-[24px] !p-6 sm:!p-7"><div className="flex items-center gap-2.5"><BookOpenCheck size={22} className="text-green-600"/><h2 className="text-2xl font-semibold">核心性质</h2></div><ul className="mt-4 space-y-3">{distribution.properties.map((item)=><li key={item} className="flex gap-3 text-[17px] leading-8 text-black/[0.62] sm:text-[18px]"><Check size={18} className="mt-1.5 shrink-0 text-green-600"/><span><InlineMathText value={item}/></span></li>)}</ul></div><div className="knowledge-section !rounded-[24px] !p-6 sm:!p-7"><div className="flex items-center gap-2.5"><Sparkles size={22} className="text-blue"/><h2 className="text-2xl font-semibold">考试重点</h2></div><ul className="mt-4 space-y-3">{distribution.examTips.map((item)=><li key={item} className="flex gap-3 text-[17px] leading-8 text-black/[0.62] sm:text-[18px]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue"/><span><InlineMathText value={item}/></span></li>)}</ul></div><div className="knowledge-section !rounded-[24px] !p-6 sm:!p-7"><div className="flex items-center gap-2.5"><AlertTriangle size={22} className="text-rose-500"/><h2 className="text-2xl font-semibold">易错点</h2></div><ul className="mt-4 space-y-3">{distribution.mistakes.map((item)=><li key={item} className="flex gap-3 text-[17px] leading-8 text-black/[0.62] sm:text-[18px]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500"/><span><InlineMathText value={item}/></span></li>)}</ul></div></section>
  </div></LongPageNavigation>
}
