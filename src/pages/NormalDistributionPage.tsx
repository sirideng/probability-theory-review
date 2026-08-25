import { useState } from 'react'
import { ArrowLeft, BookOpen, ChartSpline, Info, MoveHorizontal, ScanLine, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import NormalCurveChart from '../components/distributions/NormalCurveChart'
import distributionData from '../data/distributions.json'
import type { Distribution } from '../types/content'

const distribution = (distributionData as Distribution[]).find((item) => item.slug === 'normal')!

function RangeControl({ label, symbol, value, min, max, step, onChange, caption }: { label: string; symbol: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; caption: string }) {
  const progress = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <div className="flex items-center justify-between"><span className="text-sm font-semibold">{label} <span className="ml-1 font-serif text-black/35">{symbol}</span></span><output className="min-w-[52px] rounded-lg bg-violet-50 px-2.5 py-1 text-center font-mono text-sm font-semibold text-violet-600">{value.toFixed(1)}</output></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="range-slider mt-4 w-full" style={{ '--progress': `${progress}%` } as React.CSSProperties} />
      <p className="mt-2 text-[11px] leading-5 text-black/35">{caption}</p>
    </label>
  )
}

export default function NormalDistributionPage() {
  const [mean, setMean] = useState(0)
  const [sigma, setSigma] = useState(1)

  return (
    <div className="page-container pb-20 pt-8 sm:pt-12">
      <Link to="/distributions" className="inline-flex items-center gap-1.5 text-sm font-medium text-black/45 transition hover:text-ink"><ArrowLeft size={16} /> 返回分布图像库</Link>

      <header className="mt-9 flex flex-col gap-6 border-b border-black/[0.08] pb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-600">连续型分布</span><span className="text-xs text-black/30">{distribution.englishName} Distribution</span></div>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">{distribution.name}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-black/50">{distribution.summary} 它的形状由位置参数 μ 与尺度参数 σ 共同决定。</p>
        </div>
          <div className="liquid-control rounded-2xl border px-5 py-4"><p className="text-[10px] font-semibold uppercase tracking-wider text-black/30">Notation</p><p className="mt-1 font-serif text-xl italic text-violet-600">X ~ N(μ, σ²)</p></div>
      </header>

      <section className="liquid-content-card mt-8 overflow-hidden rounded-[28px] border">
        <div className="flex flex-col gap-2 border-b border-black/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div><div className="flex items-center gap-2"><ChartSpline size={18} className="text-violet-600" /><h2 className="font-semibold">密度曲线实验台</h2></div><p className="mt-1 text-xs text-black/35">拖动参数，图像会实时更新</p></div>
          <button onClick={() => { setMean(0); setSigma(1) }} className="self-start rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-black/45 transition hover:bg-black/[0.08]">重置为标准正态</button>
        </div>
        <div className="grid lg:grid-cols-[1fr_290px]">
          <div className="min-w-0 p-4 sm:p-7"><NormalCurveChart mean={mean} sigma={sigma} /><div className="mt-1 flex justify-center gap-5 text-[11px] text-black/35"><span>曲线总面积始终为 1</span><span>·</span><span>关于 x = μ 对称</span></div></div>
          <div className="border-t border-black/[0.06] bg-[#fafafa] p-6 lg:border-l lg:border-t-0 sm:p-7">
            <div className="space-y-9">
              <RangeControl label="均值" symbol="μ" value={mean} min={-3} max={3} step={0.1} onChange={setMean} caption="控制曲线的中心位置；改变 μ，曲线左右平移。" />
              <RangeControl label="标准差" symbol="σ" value={sigma} min={0.5} max={2.5} step={0.1} onChange={setSigma} caption="控制数据的离散程度；σ 越大，曲线越矮、越宽。" />
            </div>
            <div className="mt-9 rounded-2xl bg-violet-50 p-4"><div className="flex gap-2 text-violet-700"><Info size={16} className="mt-0.5 shrink-0" /><p className="text-xs leading-5">当前约 68% 的数据落在 <strong>[{(mean - sigma).toFixed(1)}, {(mean + sigma).toFixed(1)}]</strong> 内，也就是 μ ± σ。</p></div></div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="info-card"><span className="info-label">使用场景</span><div className="mt-4 flex gap-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-violet-500" /><p>{distribution.scene}</p></div></div>
        <div className="info-card"><span className="info-label">概率密度</span><p className="mt-4 break-words font-serif text-[15px] italic leading-6">{distribution.formula}</p></div>
        <div className="info-card"><span className="info-label">期望</span><p className="mt-4 font-serif text-3xl italic text-violet-600">E(X) = {distribution.expectation}</p><p className="mt-2 text-xs text-black/35">决定分布中心</p></div>
        <div className="info-card"><span className="info-label">方差</span><p className="mt-4 font-serif text-3xl italic text-violet-600">Var(X) = {distribution.variance}</p><p className="mt-2 text-xs text-black/35">决定数据离散程度</p></div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="knowledge-section"><div className="flex gap-4"><div className="icon-tile icon-blue"><MoveHorizontal size={19} /></div><div><h2 className="text-lg font-semibold">μ 改变：平移，不变形</h2><p className="mt-2 text-sm leading-6 text-black/50">均值决定对称轴。只改变 μ，峰值沿横轴移动，曲线的高低和胖瘦保持不变。</p></div></div></div>
        <div className="knowledge-section"><div className="flex gap-4"><div className="icon-tile icon-violet"><ScanLine size={19} /></div><div><h2 className="text-lg font-semibold">σ 改变：宽窄与峰高</h2><p className="mt-2 text-sm leading-6 text-black/50">标准差增大时数据更分散。因为总面积必须为 1，所以曲线在变宽的同时也会变矮。</p></div></div></div>
      </section>

      <section className="mt-6 rounded-[24px] bg-gradient-to-br from-[#eaf3ff] to-[#f3efff] p-6 sm:p-8">
        <div className="flex items-start gap-4"><div className="icon-tile bg-white text-blue shadow-sm"><BookOpen size={19} /></div><div><p className="text-xs font-semibold text-blue/70">为什么它重要</p><h2 className="mt-1 text-xl font-semibold">它是概率论通往统计推断的一座桥。</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">许多独立小影响叠加后会近似正态；样本均值在适当条件下也会趋近正态。因此置信区间、假设检验和许多机器学习模型都能在它之上建立。</p></div></div>
      </section>
    </div>
  )
}
