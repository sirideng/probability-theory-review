import { ArrowLeft, ArrowRight, BrainCircuit, ChartNoAxesCombined, FlaskConical, GitCompareArrows, Goal, LibraryBig, Sigma } from 'lucide-react'
import { Link } from 'react-router-dom'
import MathFormula from '../components/math/MathFormula'
import LongPageNavigation from '../components/navigation/LongPageNavigation'
import PageHeader from '../components/ui/PageHeader'
import bridgeData from '../data/statistics-bridge.json'
import type { StatisticsBridgeTopic } from '../types/content'

const bridgeTopics = bridgeData as StatisticsBridgeTopic[]

const dataScienceTopics = [
  { icon: ChartNoAxesCombined, title: '正态分布', question: '为什么在数据中反复出现？', link: '测量误差 · 中心极限定理' },
  { icon: Goal, title: '最大似然估计', question: '模型如何从数据中学习参数？', link: '概率模型 · 参数估计' },
  { icon: GitCompareArrows, title: '线性回归', question: '最小二乘背后有什么概率假设？', link: '条件期望 · 正态误差' },
]

const machineLearningPaths = [
  { id: 'supervised-generalization', title: '监督学习与泛化', note: '条件分布 · 经验风险 · 偏差—方差' },
  { id: 'probabilistic-classification', title: '概率模型与分类', note: '最大似然 · 逻辑回归 · 交叉熵' },
  { id: 'regularization-training', title: '正则化与模型训练', note: 'MAP · L1/L2 · 梯度下降' },
]

export default function DataSciencePage() {
  return <LongPageNavigation><div className="page-container pb-24 pt-10 sm:pt-16">
    <div className="sticky top-20 z-10 -ml-2 w-fit lg:top-4">
      <Link to="/" className="liquid-control inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[15px] font-medium text-black/55 transition hover:text-blue"><ArrowLeft size={17} /> 返回学习地图</Link>
    </div>
    <div className="mt-10"><PageHeader eyebrow="PROBABILITY → STATISTICS → DATA SCIENCE" title="从概率走向统计与预测" description="讲义后半部分的数理统计内容已经整理为预备路径：先从总体与样本建立统计语言，再进入抽样分布、参数估计，最终连接真实数据分析。" /></div>

    <section className="liquid-content-card mt-10 overflow-hidden rounded-[32px] border p-8 text-ink sm:p-12">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue/10"><LibraryBig size={24} className="text-blue" /></span>
      <p className="mt-10 text-sm font-medium text-black/65">讲义第 60–70 页 · 数理统计预备</p>
      <h2 className="mt-3 max-w-4xl text-[32px] font-semibold leading-[1.18] tracking-[-0.04em] sm:text-[44px]">概率论给出模型，数理统计用样本反推模型。</h2>
      <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-medium text-black/50">
        <span className="rounded-full bg-black/[0.045] px-3.5 py-2">总体与样本</span><ArrowRight size={14} />
        <span className="rounded-full bg-black/[0.045] px-3.5 py-2">抽样分布</span><ArrowRight size={14} />
        <span className="rounded-full bg-black/[0.045] px-3.5 py-2">参数估计</span><ArrowRight size={14} />
        <span className="rounded-full bg-black/[0.045] px-3.5 py-2">统计推断</span>
      </div>
    </section>

    <div className="mt-6 grid min-w-0 gap-5">
      {bridgeTopics.map((topic, index) => <section key={topic.id} className="liquid-content-card min-w-0 rounded-[28px] border p-6 sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="section-number icon-violet">{String(index + 1).padStart(2, '0')}</span>
            <div><h2 className="text-[24px] font-semibold tracking-[-0.035em] sm:text-[29px]">{topic.title}</h2><p className="mt-1 text-sm text-black/32">{topic.englishTitle}</p></div>
          </div>
          <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-black/65">{topic.source}</span>
        </div>

        <p className="mt-6 max-w-4xl text-[17px] leading-8 text-black/60">{topic.summary}</p>
        <div className="mt-7 grid gap-7 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">知识要点</p>
            <ul className="mt-4 space-y-3">{topic.keyPoints.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-7 text-black/58"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{item}</li>)}</ul>
          </div>
          <div className="min-w-0 lg:border-l lg:border-black/[0.06] lg:pl-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">考试关注</p>
            <div className="mt-3 flex flex-wrap gap-2">{topic.examFocus.map((item) => <span key={item} className="rounded-full bg-blue/[0.055] px-3 py-1.5 text-[12px] font-medium text-blue/75">{item}</span>)}</div>
          </div>
        </div>
        <div className="mt-7 min-w-0 rounded-[20px] border border-black/[0.055] bg-[#fbfbfd] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-violet-600"><Sigma size={15} />核心公式</div>
          <div className="mt-3 grid gap-x-6 xl:grid-cols-2">{topic.formulas.map((item) => <div key={item.label} className="min-w-0 border-t border-black/[0.06] py-5"><h3 className="text-[14px] font-semibold">{item.label}</h3><MathFormula value={item.formula} block className="property-formula mt-3" /><p className="mt-2 text-[13px] leading-6 text-black/45">{item.note}</p></div>)}</div>
        </div>
        {topic.examples?.length ? <div className="mt-6 min-w-0 rounded-[22px] border border-blue/10 bg-blue/[0.025] p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue"><FlaskConical size={15} />典型例题</div>
          <div className="mt-4 space-y-5">{topic.examples.map((example) => <article key={example.title} className="overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/80">
            <div className="border-b border-black/[0.06] px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[19px] font-semibold tracking-tight">{example.title}</h3><span className="text-xs font-medium text-black/65">{example.source}</span></div>
              <p className="mt-4 text-[16px] leading-7 text-black/65">{example.problem}</p>
              {example.problemFormula && <MathFormula value={example.problemFormula} block className="property-formula mt-3" />}
            </div>
            <div className="px-4 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/65">解题思路</p>
              <p className="mt-3 text-[15px] leading-7 text-black/60">{example.analysis}</p>
              <ol className="mt-5 space-y-4">{example.steps.map((step, stepIndex) => <li key={`${example.title}-${stepIndex}`} className="grid gap-2 sm:grid-cols-[28px_1fr]"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue/10 text-[11px] font-semibold text-blue">{stepIndex + 1}</span><div><p className="text-[15px] leading-7 text-black/62">{step.text}</p>{step.formula && <MathFormula value={step.formula} block className="property-formula mt-2" />}</div></li>)}</ol>
              <div className="mt-6 rounded-[15px] bg-green-50/75 p-4 text-[15px] leading-7 text-green-900/75"><span className="font-semibold text-green-700">结论：</span>{example.answer}{example.answerFormula && <MathFormula value={example.answerFormula} block className="mt-2 overflow-x-auto text-[18px] text-green-800" />}</div>
            </div>
          </article>)}</div>
        </div> : null}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-5 text-[12px] text-black/65"><span className="font-semibold text-black/70">需要先会：</span>{topic.prerequisites.map((item) => <span key={item} className="rounded-full bg-black/[0.04] px-2.5 py-1">{item}</span>)}</div>
      </section>)}
    </div>

    <section className="mt-14 border-t border-black/[0.07] pt-12">
      <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-violet-500/10"><FlaskConical size={22} className="text-violet-600" /></span><div><p className="eyebrow">NEXT CONNECTION</p><h2 className="mt-1 text-[28px] font-semibold tracking-[-0.04em]">继续走向数据科学</h2></div></div>
      <p className="mt-5 max-w-3xl text-[17px] leading-8 text-black/55">统计推断把概率模型和真实样本连接起来；机器学习则把这种连接扩展为可重复训练、评估和预测的模型。</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">{dataScienceTopics.map(({ icon: Icon, title, question, link }) => <article key={title} className="liquid-content-card rounded-[24px] border p-7"><div className="icon-tile icon-violet"><Icon size={19} /></div><h3 className="mt-7 text-[21px] font-semibold tracking-tight">{title}</h3><p className="mt-3 min-h-[52px] text-[15px] leading-7 text-black/52">{question}</p><p className="mt-6 border-t border-black/[0.06] pt-4 text-xs font-semibold text-violet-600">{link}</p></article>)}</div>
    </section>

    <section className="mt-14 border-t border-black/[0.07] pt-12">
      <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-blue/10"><BrainCircuit size={22} className="text-blue" /></span><div><p className="eyebrow">MACHINE LEARNING BRIDGE</p><h2 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] sm:text-[34px]">机器学习分支入口</h2></div></div>
      <p className="mt-5 max-w-4xl text-[17px] leading-8 text-black/55">回归分析保留在本页；其余机器学习过渡内容按学习目标拆为三个独立页面，也可以直接从学习地图进入。</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {machineLearningPaths.map((path) => <Link key={path.id} to={`/machine-learning/bridge/${path.id}`} className="liquid-content-card group rounded-[22px] border p-6 transition hover:-translate-y-0.5">
          <h3 className="text-[19px] font-semibold tracking-[-0.025em]">{path.title}</h3>
          <p className="mt-3 text-[13px] leading-6 text-black/45">{path.note}</p>
          <span className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-blue">进入专题 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span>
        </Link>)}
      </div>
    </section>
  </div></LongPageNavigation>
}
