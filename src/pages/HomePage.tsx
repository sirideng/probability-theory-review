import { ArrowRight, ArrowUpRight, BarChart3, BookOpenCheck, GraduationCap, Search, Sigma } from 'lucide-react'
import { Link } from 'react-router-dom'
import KnowledgeMap from '../components/home/KnowledgeMap'
import MiniBellCurve from '../components/distributions/MiniBellCurve'
import { useMachineLearningProgress } from '../utils/machineLearningProgress'
import { machineLearningLessons, machineLearningScope } from '../data/machine-learning-course'

const quickCards = [
  { to: '/knowledge/conditional-probability', icon: BookOpenCheck, label: '继续学习', title: '条件概率', meta: '第一章 · 6 分钟', tone: 'blue' },
  { to: '/formulas', icon: Sigma, label: '快速查找', title: '公式速查库', meta: '按场景与关键词搜索', tone: 'orange' },
]

export default function HomePage() {
  const { completed } = useMachineLearningProgress()
  return (
    <div className="page-container pb-24">
      <section className="pt-12 sm:pt-20">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow">PROBABILITY · LEARNING MAP</p>
            <h1 className="mt-4 max-w-[820px] text-[46px] font-bold leading-[1.05] tracking-[-0.06em] sm:text-[70px]">
              看见概率知识之间的<span className="text-blue">连接</span>。
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-black/52 sm:text-[18px]">
              从随机事件出发，沿着概率分布与数字特征，一直走向统计推断。这里不是电子课本，而是一张可以反复回来的学习地图。
            </p>
          </div>
          <Link to="/formulas" className="search-pill group">
            <Search size={18} className="text-black/35" />
            <span className="flex-1 text-sm text-black/40">搜索知识点或公式</span>
            <span className="rounded-md bg-black/[0.05] px-2 py-1 text-[10px] font-medium text-black/35">⌘ K</span>
          </Link>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="learning-directions-title">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">LEARNING DIRECTIONS</p><h2 id="learning-directions-title" className="mt-2 text-[27px] font-semibold tracking-[-0.04em] sm:text-[34px]">选择学习路线</h2></div><p className="text-[13px] text-black/50">两条路线独立记录，互不覆盖</p></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Link to="/" className="liquid-content-card group rounded-[28px] border p-7 transition hover:-translate-y-0.5 sm:p-8"><div className="flex items-start justify-between"><span className="icon-tile icon-blue"><BookOpenCheck size={21} /></span><ArrowUpRight size={18} className="text-black/25 transition group-hover:text-blue" /></div><p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.12em] text-blue/70">当前主线</p><h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">概率论</h3><p className="mt-3 text-[15px] leading-7 text-black/55">从随机事件、概率分布与数字特征，走向极限定理和统计推断。</p><div className="mt-6 flex min-h-11 items-center justify-between border-t border-black/[0.06] pt-5 text-[13px]"><span className="font-semibold text-black/55">5 章 · 完整学习地图</span><span className="inline-flex items-center gap-1.5 font-semibold text-blue">继续学习 <ArrowRight size={14} /></span></div></Link>
          <Link to="/machine-learning" className="liquid-content-card group rounded-[28px] border p-7 transition hover:-translate-y-0.5 sm:p-8"><div className="flex items-start justify-between"><span className="icon-tile icon-violet"><GraduationCap size={22} /></span><ArrowUpRight size={18} className="text-black/25 transition group-hover:text-blue" /></div><p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.12em] text-violet-600/75">当前路线 · {machineLearningScope.videos}</p><h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em]">机器学习</h3><p className="mt-3 text-[15px] leading-7 text-black/55">从回归与特征工程出发，继续学习逻辑回归、过拟合和正则化。</p><div className="mt-6 border-t border-black/[0.06] pt-5"><div className="flex items-center justify-between text-[13px]"><span className="font-semibold text-black/55">{completed.length} / {machineLearningLessons.length} 模块</span><span className="inline-flex items-center gap-1.5 font-semibold text-blue">进入路线 <ArrowRight size={14} /></span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-blue to-violet-500" style={{ width: `${completed.length / machineLearningLessons.length * 100}%` }} /></div></div></Link>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.35fr]">
        {quickCards.map(({ to, icon: Icon, label, title, meta, tone }) => (
          <Link key={title} to={to} className="liquid-content-card group rounded-[26px] border p-6 transition duration-200 hover:-translate-y-0.5 hover:border-blue/10">
            <div className="flex items-start justify-between">
              <div className={`icon-tile icon-${tone}`}><Icon size={20} /></div>
              <ArrowUpRight size={18} className="text-black/20 transition group-hover:text-blue" />
            </div>
            <p className="mt-8 text-xs font-semibold text-black/40">{label}</p>
            <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em]">{title}</h2>
            <p className="mt-1.5 text-[13px] text-black/45">{meta}</p>
          </Link>
        ))}
        <Link to="/distributions/normal" className="liquid-content-card group relative min-h-[210px] overflow-hidden rounded-[26px] border p-6 text-ink transition duration-200 hover:-translate-y-0.5 hover:border-violet-200/50">
          <div className="relative z-10 flex items-start justify-between">
            <div className="icon-tile bg-violet-500/10 text-violet-600"><BarChart3 size={20} /></div>
            <ArrowUpRight size={18} className="text-black/20 transition group-hover:text-blue" />
          </div>
          <div className="absolute bottom-0 right-0 h-[145px] w-[60%] opacity-90"><MiniBellCurve /></div>
          <div className="relative z-10 mt-8">
            <p className="text-xs font-semibold text-black/40">互动可视化</p>
            <h2 className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em]">正态分布</h2>
            <p className="mt-1.5 text-[13px] text-black/45">拖动 μ 与 σ，观察曲线</p>
          </div>
        </Link>
      </section>

      <section className="mt-24">
        <div className="text-center">
          <p className="eyebrow">KNOWLEDGE JOURNEY</p>
          <h2 className="mt-3 text-[34px] font-bold tracking-[-0.045em] sm:text-[44px]">概率论学习地图</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-black/48">顺着主线建立完整框架，也可以从任意节点进入，补上知识之间缺失的连接。</p>
        </div>
        <KnowledgeMap />
      </section>

      <section className="mt-24 overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#eaf4ff] via-[#f0f6ff] to-[#f3efff] p-8 shadow-soft sm:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow text-blue/70">YOUR PATH</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-[32px]">先理解，再记忆，最后建立连接。</h2>
            <p className="mt-4 max-w-xl text-[16px] leading-7 text-black/52">每个知识点都回答三个问题：它是什么意思？什么时候使用？它会通向哪里？</p>
          </div>
          <Link to="/knowledge/conditional-probability" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,113,227,0.2)] transition hover:bg-[#0077ed]">
            开始一个知识点 <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
