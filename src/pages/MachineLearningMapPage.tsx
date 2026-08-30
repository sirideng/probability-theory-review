import { ArrowLeft, ArrowRight, BookOpenText, BrainCircuit, CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { machineLearningLessons, machineLearningScope } from '../data/machine-learning-course'
import { useMachineLearningProgress } from '../utils/machineLearningProgress'

export default function MachineLearningMapPage() {
  const { completed, clear } = useMachineLearningProgress()
  const percent = Math.round((completed.length / machineLearningLessons.length) * 100)

  return <div className="page-container pb-24 pt-10 sm:pt-16">
    <Link to="/" className="liquid-control inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium text-black/60 transition hover:text-blue"><ArrowLeft size={16} />返回概率论首页</Link>
    <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_360px] xl:items-end">
      <div><p className="eyebrow">MACHINE LEARNING · {machineLearningScope.videos.toUpperCase()}</p><h1 className="mt-4 text-[48px] font-bold leading-[1.02] tracking-[-0.06em] sm:text-[72px]">机器学习</h1><p className="mt-3 text-[24px] font-medium tracking-[-0.03em] text-blue sm:text-[30px]">从直观理解到算法实现</p><p className="mt-6 max-w-3xl text-[17px] leading-8 text-black/58">沿着吴恩达机器学习课程的学习进度，从平方误差代价函数与特征工程继续学习逻辑回归、二元交叉熵损失、过拟合与 L2 正则化。</p></div>
      <aside className="liquid-content-card rounded-[26px] border p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-black/50">独立学习进度</p><p className="mt-2 text-[26px] font-semibold tracking-tight">{completed.length} / {machineLearningLessons.length} 模块</p></div><span className="grid h-12 w-12 place-items-center rounded-[15px] bg-blue/10 text-blue"><BrainCircuit size={23} /></span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-blue to-violet-500 transition-[width]" style={{ width: `${percent}%` }} /></div><div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-black/55"><span>当前整理到：{machineLearningScope.current}</span>{completed.length > 0 && <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-black/50 hover:bg-black/[0.04]"><RotateCcw size={14} />清除机器学习进度</button>}</div></aside>
    </section>

    <section className="liquid-content-card mt-12 rounded-[28px] border p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">CURRENT SCOPE</p><h2 className="mt-2 text-[25px] font-semibold tracking-[-0.035em]">当前学习到：{machineLearningScope.current}</h2></div><span className="rounded-full bg-blue/[0.07] px-4 py-2 text-[13px] font-semibold text-blue">已整理：{machineLearningScope.videos}</span></div>
      <p className="mt-5 text-[14px] leading-7 text-black/55">{machineLearningScope.note}</p>
    </section>

    <section className="mt-16"><div className="text-center"><p className="eyebrow">LEARNING MAP</p><h2 className="mt-3 text-[34px] font-bold tracking-[-0.045em] sm:text-[44px]">{machineLearningLessons.length} 个学习模块</h2><p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-black/52">相关视频被重新组织为可复习的知识章节，不机械复制视频目录。</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">{machineLearningLessons.map((lesson) => {
        const done = completed.includes(lesson.id)
        return <Link key={lesson.id} to={`/machine-learning/${lesson.id}`} className="liquid-content-card group min-w-0 rounded-[26px] border p-6 transition hover:-translate-y-0.5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><span className="section-number icon-blue">{lesson.number}</span>{done ? <CheckCircle2 size={21} className="text-green-600" aria-label="已学习" /> : <Circle size={21} className="text-black/20" aria-label="尚未标记" />}</div>
          <p className="mt-7 text-[12px] font-semibold text-black/50">{lesson.videoRange}</p><h3 className="mt-2 text-[23px] font-semibold tracking-[-0.03em]">{lesson.title}</h3><p className="mt-1 text-[13px] text-black/45">{lesson.englishTitle}</p><p className="mt-4 text-[15px] leading-7 text-black/55">{lesson.summary}</p><span className="mt-6 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-blue">进入学习 <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
        </Link>})}</div>
    </section>

    <section className="liquid-content-card mt-12 flex flex-col gap-5 rounded-[26px] border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex items-start gap-4"><span className="icon-tile icon-violet"><BookOpenText size={21} /></span><div><h2 className="text-[20px] font-semibold">辅助环境：Jupyter Notebook</h2><p className="mt-2 max-w-3xl text-[14px] leading-7 text-black/55">Notebook 可以把解释、NumPy 代码和运行结果放在同一页。它是学习与实验环境，不是独立的机器学习算法模块。</p></div></div><Link to="/machine-learning/machine-learning-basics" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-blue px-5 text-[14px] font-semibold text-white">从模块 01 开始</Link></section>
  </div>
}
