import { ArrowLeft, ArrowRight, BookOpenCheck, Check, Code2, Lightbulb, RotateCcw, Sigma, TriangleAlert } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import LongPageNavigation from '../components/navigation/LongPageNavigation'
import MathFormula from '../components/math/MathFormula'
import PythonCodeBlock from '../components/code/PythonCodeBlock'
import { getMachineLearningLesson, machineLearningLessons } from '../data/machine-learning-course'
import { useMachineLearningProgress } from '../utils/machineLearningProgress'

const MachineLearningLab = lazy(() => import('../components/machine-learning/MachineLearningLab'))

export default function MachineLearningLessonPage() {
  const { lessonId } = useParams()
  const lesson = getMachineLearningLesson(lessonId)
  const { completed, toggle } = useMachineLearningProgress()
  if (!lesson) return <Navigate to="/machine-learning" replace />

  const index = machineLearningLessons.findIndex((item) => item.id === lesson.id)
  const previous = machineLearningLessons[index - 1]
  const next = machineLearningLessons[index + 1]
  const done = completed.includes(lesson.id)

  return <LongPageNavigation><div className="page-container pb-24 pt-8 sm:pt-14">
    <div className="sticky top-20 z-10 -ml-2 w-fit lg:top-4">
      <Link to="/machine-learning" className="liquid-control inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium text-black/60 transition hover:text-blue"><ArrowLeft size={16} />返回机器学习地图</Link>
    </div>
    <header className="mt-12 border-b border-black/[0.07] pb-10"><div className="flex flex-wrap items-center gap-3"><span className="section-number icon-blue">{lesson.number}</span><span className="rounded-full bg-blue/[0.07] px-3 py-1.5 text-[12px] font-semibold text-blue">{lesson.videoRange}</span></div><h1 className="mt-6 text-[42px] font-bold leading-[1.08] tracking-[-0.055em] sm:text-[64px]">{lesson.title}</h1><p className="mt-3 text-[18px] text-black/45">{lesson.englishTitle}</p><p className="mt-7 max-w-4xl text-[18px] leading-8 text-black/60">{lesson.summary}</p></header>

    <div className="mt-8 grid gap-6">
      <LessonSection number="01" title="本节要解决的问题" icon={<Lightbulb size={20} />}><p className="knowledge-body">{lesson.problem}</p></LessonSection>

      <LessonSection number="02" title="数学定义与符号" icon={<Sigma size={20} />}><div className="space-y-6">{lesson.formulas.map((item) => <article key={item.label} className="min-w-0 rounded-[20px] border border-black/[0.055] bg-[#fbfbfd] p-4 sm:p-6"><h3 className="text-[17px] font-semibold">{item.label}</h3><MathFormula value={item.formula} block className="formula-display mt-4" /><p className="mt-4 text-[15px] leading-7 text-black/58">{item.explanation}</p><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[500px] border-collapse text-left text-[14px]"><thead><tr className="border-b border-black/10 text-black/50"><th className="px-3 py-3">符号</th><th className="px-3 py-3">含义</th></tr></thead><tbody>{item.symbols.map((symbol) => <tr key={symbol.symbol} className="border-b border-black/[0.06]"><td className="px-3 py-3"><MathFormula value={symbol.symbol} className="text-[16px]" /></td><td className="px-3 py-3 leading-6 text-black/60">{symbol.meaning}</td></tr>)}</tbody></table></div></article>)}</div></LessonSection>

      <LessonSection number="03" title="算法怎样运行" icon={<RotateCcw size={20} />}><ol className="grid gap-3">{lesson.algorithm.map((step, stepIndex) => <li key={step.title} className="grid gap-3 rounded-[18px] bg-black/[0.025] p-4 sm:grid-cols-[42px_1fr] sm:p-5"><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-blue/10 text-[12px] font-bold text-blue">{String(stepIndex + 1).padStart(2, '0')}</span><div><h3 className="text-[16px] font-semibold">{step.title}</h3><p className="mt-1 text-[15px] leading-7 text-black/55">{step.detail}</p></div></li>)}</ol></LessonSection>

      <LessonSection number="04" title="手算例题" icon={<Check size={20} />}><article className="overflow-hidden rounded-[20px] border border-blue/10 bg-blue/[0.025]"><div className="border-b border-blue/10 p-5 sm:p-6"><h3 className="text-[19px] font-semibold">{lesson.example.title}</h3><p className="mt-3 text-[16px] leading-7 text-black/62">{lesson.example.setup}</p></div><ol className="space-y-4 p-5 sm:p-6">{lesson.example.steps.map((step, stepIndex) => <li key={stepIndex} className="grid gap-2 sm:grid-cols-[30px_1fr]"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue text-[11px] font-semibold text-white">{stepIndex + 1}</span><div><p className="text-[15px] leading-7 text-black/62">{step.text}</p>{step.formula && <MathFormula value={step.formula} block className="property-formula mt-2" />}</div></li>)}</ol><p className="border-t border-blue/10 bg-white/60 p-5 text-[15px] leading-7 text-black/62 sm:px-6"><span className="font-semibold text-blue">结果解释：</span>{lesson.example.result}</p></article></LessonSection>

      <LessonSection number="05" title="Python 实现" icon={<Code2 size={20} />}><div className="overflow-hidden rounded-[20px] bg-[#16181d] text-white shadow-soft"><div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5"><span className="text-[13px] font-semibold text-white/70">NumPy · 与公式对应</span><span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[12px] text-white/55">python</span></div><div className="grid min-w-0 2xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]"><div className="min-w-0 overflow-hidden"><PythonCodeBlock code={lesson.python.code} /></div><aside aria-label="Python 代码对应公式" className="min-w-0 border-t border-white/10 bg-white/[0.015] p-5 2xl:border-l 2xl:border-t-0 2xl:px-5 2xl:py-6"><p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-white/45">Formula Reference</p><h3 className="mt-1.5 text-[16px] font-semibold text-white/80">对应公式</h3><div className="mt-5 space-y-4">{lesson.formulas.map((item) => <div key={item.label} className="min-w-0 rounded-[14px] border border-white/[0.08] bg-white/[0.035] p-3.5"><p className="text-[12px] font-semibold text-[#82d2ff]">{item.label}</p><MathFormula value={item.formula} block className="python-formula-reference mt-3 max-w-full overflow-x-auto py-1 text-[15px] leading-7 text-white/90" /></div>)}</div></aside></div></div><div className="mt-4 rounded-[16px] bg-black/[0.035] p-4 sm:p-5"><p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-black/55">输出</p><pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[15px] leading-7 text-black/72 sm:text-[16px]">{lesson.python.output}</pre></div><ul className="mt-5 grid gap-2">{lesson.python.notes.map((note) => <li key={note} className="flex gap-2.5 text-[14px] leading-7 text-black/55"><Check size={16} className="mt-1.5 shrink-0 text-green-600" />{note}</li>)}</ul></LessonSection>

      {lesson.interaction !== 'none' && <LessonSection number="06" title="交互演示" icon={<RotateCcw size={20} />}><Suspense fallback={<div className="h-44 animate-pulse rounded-[24px] bg-black/[0.04]" />}><MachineLearningLab type={lesson.interaction} /></Suspense></LessonSection>}

      <LessonSection number={lesson.interaction === 'none' ? '06' : '07'} title="常见误区" icon={<TriangleAlert size={20} />}><div className="grid gap-4 lg:grid-cols-2">{lesson.misconceptions.map((item) => <article key={item.wrong} className="rounded-[18px] border border-rose-500/10 bg-rose-500/[0.035] p-5"><p className="text-[15px] font-semibold text-rose-700">错误理解：{item.wrong}</p><p className="mt-3 text-[14px] leading-7 text-black/55">为什么错误：{item.why}</p><p className="mt-3 border-t border-rose-500/10 pt-3 text-[14px] leading-7 text-black/62"><span className="font-semibold text-green-700">正确理解：</span>{item.correct}</p></article>)}</div></LessonSection>

      <LessonSection number={lesson.interaction === 'none' ? '07' : '08'} title="本节回顾" icon={<BookOpenCheck size={20} />}><ul className="grid gap-3 sm:grid-cols-2">{lesson.recap.map((item) => <li key={item} className="flex gap-3 rounded-[16px] bg-blue/[0.04] p-4 text-[15px] leading-7 text-black/60"><Check size={17} className="mt-1.5 shrink-0 text-blue" />{item}</li>)}</ul>{lesson.probabilityLink && <Link to={lesson.probabilityLink.to} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-500/[0.08] px-4 text-[14px] font-semibold text-violet-700">{lesson.probabilityLink.label}<ArrowRight size={15} /></Link>}</LessonSection>
    </div>

    <footer className="liquid-content-card mt-8 rounded-[26px] border p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><button type="button" aria-pressed={done} onClick={() => toggle(lesson.id)} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold ${done ? 'bg-green-600 text-white' : 'bg-blue text-white'}`}><Check size={16} />{done ? '已标记为学会' : '标记为已学会'}</button><p className="text-[13px] text-black/50">机器学习进度使用独立存储，不会修改概率论数据。</p></div><div className="mt-6 grid gap-3 border-t border-black/[0.06] pt-6 sm:grid-cols-3">{previous ? <Link to={`/machine-learning/${previous.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black/[0.045] px-4 text-[14px] font-semibold text-black/60"><ArrowLeft size={15} />上一节：{previous.title}</Link> : <span />}{next ? <Link to={`/machine-learning/${next.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue px-4 text-[14px] font-semibold text-white">下一节：{next.title}<ArrowRight size={15} /></Link> : <Link to="/machine-learning" className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue px-4 text-[14px] font-semibold text-white">完成路线，返回地图</Link>}<Link to="/machine-learning" className="inline-flex min-h-11 items-center justify-center rounded-full bg-black/[0.045] px-4 text-[14px] font-semibold text-black/60">返回机器学习地图</Link></div></footer>
  </div></LongPageNavigation>
}

function LessonSection({ number, title, icon, children }: { number: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="knowledge-section"><div className="flex items-center gap-3"><span className="section-number icon-blue">{number}</span><span className="text-blue">{icon}</span><h2 className="text-[25px] font-semibold tracking-[-0.035em] sm:text-[31px]">{title}</h2></div><div className="mt-7 min-w-0">{children}</div></section>
}
