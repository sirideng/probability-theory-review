import { ArrowLeft, Braces, Check, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PythonCodeBlock from '../components/code/PythonCodeBlock'
import { numpyReferenceItems } from '../data/numpy-reference'

export default function NumpyReferencePage() {
  return <div className="page-container pb-24 pt-8 sm:pt-14">
    <Link to="/machine-learning" className="liquid-control inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium text-black/60 transition hover:text-blue"><ArrowLeft size={16} />返回机器学习地图</Link>

    <header className="mt-10 border-b border-black/[0.07] pb-10">
      <div className="flex items-center gap-3"><span className="icon-tile icon-blue"><Braces size={21} /></span><p className="eyebrow">NUMPY QUICK REFERENCE</p></div>
      <h1 className="mt-6 text-[44px] font-bold leading-[1.05] tracking-[-0.055em] sm:text-[68px]">NumPy 速查</h1>
      <p className="mt-4 max-w-4xl text-[17px] leading-8 text-black/58">集中整理机器学习中最常用的 NumPy 语法。先确认数组形状与运算对象，再对照代码、输出和使用说明。</p>
    </header>

    <section className="liquid-content-card mt-8 rounded-[24px] border p-5 sm:p-7">
      <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-violet-500/10 text-violet-600"><Layers3 size={20} /></span><div><h2 className="text-[19px] font-semibold">当前收录范围</h2><p className="mt-2 text-[14px] leading-7 text-black/55">首批收录 {numpyReferenceItems.length} 组基础方法，覆盖数组、形状、筛选、聚合、广播和线性代数；它是辅助速查页，不改变视频 1—36 的课程范围与学习进度。</p></div></div>
    </section>

    <section className="mt-12 grid min-w-0 gap-6 xl:grid-cols-2">
      {numpyReferenceItems.map((item) => <article key={item.id} className="liquid-content-card min-w-0 overflow-hidden rounded-[26px] border">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-blue/[0.07] px-3 py-1.5 text-[12px] font-semibold text-blue">{item.category}</span><code className="max-w-full overflow-x-auto rounded-lg bg-black/[0.045] px-2.5 py-1.5 text-[12px] text-black/55">{item.syntax}</code></div>
          <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.03em]">{item.title}</h2>
          <p className="mt-3 text-[15px] leading-7 text-black/58">{item.summary}</p>
        </div>
        <div className="mx-4 overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#16181d] text-white sm:mx-6"><PythonCodeBlock code={item.code} /></div>
        <div className="p-5 sm:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/48">输出</p>
          <div className="mt-3 flex min-w-0 items-start gap-3 overflow-x-auto pb-1">
            {item.outputs.map((output, outputIndex) => <pre key={`${item.id}-output-${outputIndex}`} aria-label={`输出 ${outputIndex + 1}`} className="min-w-fit shrink-0 whitespace-pre rounded-[14px] bg-black/[0.035] px-4 py-3 font-mono text-[14px] leading-7 text-black/72">{output}</pre>)}
          </div>
          <ul className="mt-5 space-y-2">{item.notes.map((note) => <li key={note} className="flex gap-2.5 text-[14px] leading-7 text-black/55"><Check size={16} className="mt-1.5 shrink-0 text-green-600" />{note}</li>)}</ul>
        </div>
      </article>)}
    </section>
  </div>
}
