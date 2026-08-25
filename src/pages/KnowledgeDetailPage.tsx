import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  Clock3,
  Dumbbell,
  Lightbulb,
  Link2,
  ListChecks,
  Sigma,
  Sparkles,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import MathFormula from '../components/math/MathFormula'
import ConceptVisual from '../components/knowledge/ConceptVisual'
import chapter1 from '../data/knowledge/chapter-1.json'
import chapter2 from '../data/knowledge/chapter-2.json'
import chapter3 from '../data/knowledge/chapter-3.json'
import chapter4 from '../data/knowledge/chapter-4.json'
import chapter5 from '../data/knowledge/chapter-5.json'
import enhancementData from '../data/exam-enhancements.json'
import exerciseData from '../data/lecture-exercises.json'
import type { KnowledgeConnection, KnowledgeEnhancement, KnowledgePoint, LectureExerciseGroup } from '../types/content'

const knowledge = [...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5] as KnowledgePoint[]
const enhancements = enhancementData as KnowledgeEnhancement[]
const exerciseGroups = exerciseData as LectureExerciseGroup[]

function connectionPath(item: KnowledgeConnection) {
  if (item.type === 'distribution') return `/distributions/${item.slug}`
  if (item.type === 'data-science') return '/data-science'
  return `/knowledge/${item.slug}`
}

function SectionHeading({ number, title, icon }: { number: string; title: string; icon: ReactNode }) {
  return <div className="flex items-center gap-3.5"><span className="section-number icon-blue">{number}</span><div className="flex items-center gap-2.5"><h2 className="text-[24px] font-semibold tracking-[-0.035em] sm:text-[30px]">{title}</h2>{icon}</div></div>
}

export default function KnowledgeDetailPage() {
  const { slug } = useParams()
  const point = knowledge.find((item) => item.slug === slug)
  const enhancement = enhancements.find((item) => item.slug === slug)
  const exerciseGroup = exerciseGroups.find((item) => item.slug === slug)

  if (!point) {
    return <div className="page-container-narrow pb-20 pt-20 text-center"><h1 className="text-3xl font-semibold tracking-tight">这个知识点尚未收录</h1><p className="mt-3 text-base text-black/45">请返回学习地图选择已经开放的知识节点。</p><Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue px-5 py-3 text-sm font-semibold text-white shadow-sm"><ArrowLeft size={16}/>返回学习地图</Link></div>
  }

  const currentIndex = knowledge.findIndex((item) => item.slug === point.slug)
  const nextPoint = knowledge[currentIndex + 1]

  return (
    <div className="page-container-narrow pb-28 pt-8 sm:pt-14">
      <div className="sticky top-20 z-10 -ml-2 w-fit lg:top-4">
        <Link to="/" className="liquid-control inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[15px] font-medium text-black/55 transition hover:text-blue"><ArrowLeft size={17} /> 返回学习地图</Link>
      </div>

      <header className="mt-10 border-b border-black/[0.075] pb-12">
        <p className="eyebrow">{point.chapter}</p>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="text-[48px] font-bold leading-[1.05] tracking-[-0.06em] sm:text-[64px]">{point.title}</h1><p className="mt-3 text-lg font-medium text-black/28">{point.englishTitle}</p></div>
          <div className="flex items-center gap-4 text-sm text-black/38"><span className="inline-flex items-center gap-1.5"><Clock3 size={15} />{point.readTime} 分钟</span><span>更新于 {point.updatedAt}</span></div>
        </div>
        <p className="mt-8 max-w-3xl text-[20px] leading-9 text-black/58 sm:text-[21px]">{point.summary}</p>
      </header>

      <div className="mt-8 grid gap-5">
        <section className="knowledge-section">
          <SectionHeading number="01" title="知识总结" icon={<Lightbulb size={21} className="text-blue" />} />
          <div className="mt-5 space-y-4">{point.core.map((text) => <p key={text} className="knowledge-body">{text}</p>)}</div>
          {enhancement && <div className="mt-7 rounded-[18px] border border-blue/10 bg-blue/[0.035] p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue/70">讲义速记</p><ul className="mt-4 space-y-3">{enhancement.lectureSummary.map((item) => <li key={item} className="flex gap-3 text-[16px] leading-7 text-black/60"><Check size={16} className="mt-1.5 shrink-0 text-blue" /><span>{item}</span></li>)}</ul></div>}
        </section>

        <section className="knowledge-section">
          <SectionHeading number="02" title="重要公式" icon={<Sigma size={20} className="text-violet-600" />} />
          <p className="knowledge-body mt-5">{point.definition.intro}</p>
          <div className="mt-5 space-y-3">{point.definition.formulas.map((formula) => <MathFormula key={formula} value={formula} block className="formula-display" />)}</div>
          <div className="mt-7 divide-y divide-black/[0.06]">{point.properties.map((item) => <div key={item.label} className="grid min-w-0 gap-2 py-5 first:pt-0 sm:grid-cols-[150px_1fr]"><h3 className="text-[15px] font-semibold text-ink">{item.label}</h3><div className="min-w-0"><p className="knowledge-body">{item.text}</p>{item.formula && <MathFormula value={item.formula} block className="property-formula mt-3" />}</div></div>)}</div>
        </section>

        <section className="knowledge-section">
          <SectionHeading number="03" title="理解说明" icon={<Sparkles size={20} className="text-orange-500" />} />
          <div className="mt-5 space-y-4">{point.intuition.map((text) => <p key={text} className="knowledge-body">{text}</p>)}</div>
          {point.visual && <ConceptVisual visual={point.visual} />}
        </section>

        <section className="knowledge-section">
          <SectionHeading number="04" title="常考题型" icon={<ListChecks size={20} className="text-blue" />} />
          <ul className="mt-6 space-y-4">{point.exams.map((item, index) => <li key={item} className="flex gap-3 text-[17px] leading-8 text-black/60"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue/10 text-[11px] font-semibold text-blue">{index + 1}</span><span>{item}</span></li>)}</ul>
          {enhancement && <div className="mt-7 divide-y divide-black/[0.07] border-t border-black/[0.07]">{enhancement.problemTypes.map((item) => <article key={item.title} className="py-6"><h3 className="text-[19px] font-semibold tracking-tight">{item.title}</h3><dl className="mt-4 grid gap-3 text-[15px] leading-7 sm:grid-cols-[88px_1fr]"><dt className="font-semibold text-black/40">题型特点</dt><dd className="text-black/60">{item.features}</dd><dt className="font-semibold text-black/40">解题方法</dt><dd className="text-black/60">{item.method}</dd><dt className="font-semibold text-black/40">关键步骤</dt><dd className="flex flex-wrap gap-2">{item.steps.map((step, index) => <span key={step} className="rounded-full bg-black/[0.045] px-3 py-1 text-[13px] text-black/55">{index + 1}. {step}</span>)}</dd></dl></article>)}</div>}
        </section>

        {enhancement && <section className="knowledge-section">
          <SectionHeading number="05" title="典型例题" icon={<BookOpenCheck size={20} className="text-green-600" />} />
          <div className="mt-6 space-y-5">{enhancement.examples.map((example) => <article key={example.title} className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-[#fbfbfd]"><div className="border-b border-black/[0.06] bg-white px-5 py-5 sm:px-7"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[20px] font-semibold tracking-tight">{example.title}</h3><span className="text-[11px] font-medium text-black/35">{example.source}</span></div><p className="mt-4 text-[17px] leading-8 text-black/65">{example.problem}</p></div><div className="px-5 py-6 sm:px-7"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/35">解题思路</p><p className="mt-3 text-[16px] leading-7 text-black/58">{example.analysis}</p><ol className="mt-5 space-y-4">{example.steps.map((step, index) => <li key={`${step.text}-${index}`} className="grid gap-2 sm:grid-cols-[30px_1fr]"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue/10 text-[11px] font-semibold text-blue">{index + 1}</span><div><p className="text-[16px] leading-7 text-black/62">{step.text}</p>{step.formula && <MathFormula value={step.formula} block className="property-formula mt-2" />}</div></li>)}</ol><div className="mt-6 rounded-[16px] bg-green-50/70 p-4 text-[15px] leading-7 text-green-900/70"><span className="font-semibold text-green-700">答案：</span>{example.answer}{example.answerFormula && <MathFormula value={example.answerFormula} block className="mt-2 overflow-x-auto text-[18px] text-green-800" />}</div></div></article>)}</div>
        </section>}

        {exerciseGroup && <section className="knowledge-section">
          <SectionHeading number="06" title="讲义强化训练" icon={<Dumbbell size={20} className="text-blue" />} />
          <div className="mt-5 flex flex-col gap-3 rounded-[18px] border border-blue/10 bg-blue/[0.035] px-5 py-4 text-[14px] leading-6 text-black/52 sm:flex-row sm:items-center sm:justify-between">
            <span>后半部分习题已按当前知识点筛选、整理并验算。</span>
            <span className="shrink-0 font-medium text-blue/75">{exerciseGroup.sourceRange}</span>
          </div>
          <div className="mt-6 space-y-5">
            {exerciseGroup.exercises.map((exercise, index) => <article key={exercise.id} className="overflow-hidden rounded-[20px] border border-black/[0.065] bg-[#fbfbfd]">
              <div className="border-b border-black/[0.06] bg-white px-5 py-5 sm:px-7">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="grid h-7 min-w-7 place-items-center rounded-full bg-blue/10 px-2 text-[11px] font-semibold text-blue">{index + 1}</span>
                  <h3 className="text-[19px] font-semibold tracking-tight sm:text-[20px]">{exercise.title}</h3>
                  <span className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-semibold ${exercise.difficulty === '强化' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-700'}`}>{exercise.difficulty}</span>
                </div>
                <p className="mt-2 text-[11px] font-medium text-black/32">{exercise.source}</p>
                <p className="mt-4 text-[17px] leading-8 text-black/66">{exercise.problem}</p>
              </div>
              <div className="px-5 py-5 sm:px-7">
                <dl className="grid gap-3 text-[15px] leading-7 sm:grid-cols-[72px_1fr]">
                  <dt className="font-semibold text-black/38">考查重点</dt><dd className="text-black/58">{exercise.focus}</dd>
                  <dt className="font-semibold text-black/38">入手方法</dt><dd className="text-black/58">{exercise.method}</dd>
                </dl>
                <details className="group mt-5 rounded-[16px] border border-black/[0.06] bg-white open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[14px] font-semibold text-blue marker:hidden sm:px-5">
                    查看完整解答
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-blue/10 text-base transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-black/[0.06] px-4 py-5 sm:px-5">
                    <ol className="space-y-4">{exercise.steps.map((step, stepIndex) => <li key={`${exercise.id}-${stepIndex}`} className="grid min-w-0 gap-2 sm:grid-cols-[28px_1fr]"><span className="grid h-7 w-7 place-items-center rounded-full bg-black/[0.045] text-[11px] font-semibold text-black/45">{stepIndex + 1}</span><div className="min-w-0"><p className="text-[15px] leading-7 text-black/60">{step.text}</p>{step.formula && <MathFormula value={step.formula} block className="property-formula mt-2" />}</div></li>)}</ol>
                    <div className="mt-5 rounded-[14px] bg-green-50/70 px-4 py-3.5 text-[15px] leading-7 text-green-900/70"><span className="font-semibold text-green-700">结论：</span>{exercise.answer}{exercise.answerFormula && <MathFormula value={exercise.answerFormula} block className="mt-2 overflow-x-auto text-[17px] text-green-800" />}</div>
                  </div>
                </details>
              </div>
            </article>)}
          </div>
        </section>}

        <section className="knowledge-section">
          <SectionHeading number="07" title="易错点总结" icon={<AlertTriangle size={20} className="text-rose-500" />} />
          <ul className="mt-6 space-y-4">{point.mistakes.map((item) => <li key={item} className="flex gap-3 text-[17px] leading-8 text-black/60"><span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-500"><span className="h-1.5 w-1.5 rounded-full bg-current" /></span><span>{item}</span></li>)}</ul>
        </section>

        <section className="knowledge-section">
          <SectionHeading number="08" title="关联知识" icon={<Link2 size={20} className="text-violet-600" />} />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">前置知识</p>
          {point.prerequisites.length > 0 ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{point.prerequisites.map((item) => <Link key={item.slug} to={connectionPath(item)} className="connection-card group"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1.5 text-sm leading-6 text-black/45">{item.note}</p></div><ArrowRight size={16} className="shrink-0 text-black/20 group-hover:text-blue" /></Link>)}</div> : <p className="mt-3 text-[16px] leading-7 text-black/50">这是概率论的起点，只需具备基本集合与函数概念。</p>}
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.12em] text-black/35">后续联系</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">{point.connections.map((item) => <Link key={`${item.slug}-${item.title}`} to={connectionPath(item)} className="connection-card group"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1.5 text-sm leading-6 text-black/45">{item.note}</p></div><ArrowRight size={16} className="shrink-0 text-black/20 group-hover:translate-x-0.5 group-hover:text-blue" /></Link>)}</div>
        </section>
      </div>

      {nextPoint && <Link to={`/knowledge/${nextPoint.slug}`} className="liquid-content-card group mt-10 flex items-center justify-between rounded-[24px] border p-7 text-ink transition hover:border-blue/15"><div><p className="text-xs font-medium text-black/40">下一知识点</p><p className="mt-1.5 text-xl font-semibold tracking-tight">{nextPoint.title}</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-blue/10"><ArrowRight size={18} className="text-blue transition group-hover:translate-x-0.5" /></span></Link>}
    </div>
  )
}
