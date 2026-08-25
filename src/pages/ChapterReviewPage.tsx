import { AlertTriangle, ArrowRight, BookOpenCheck, Check, ListChecks, Sigma } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import MathFormula from '../components/math/MathFormula'
import PageHeader from '../components/ui/PageHeader'
import reviewData from '../data/chapter-reviews.json'
import chapter1 from '../data/knowledge/chapter-1.json'
import chapter2 from '../data/knowledge/chapter-2.json'
import chapter3 from '../data/knowledge/chapter-3.json'
import chapter4 from '../data/knowledge/chapter-4.json'
import chapter5 from '../data/knowledge/chapter-5.json'
import type { ChapterReview, KnowledgePoint } from '../types/content'

const reviews = reviewData as ChapterReview[]
const knowledge = [...chapter1, ...chapter2, ...chapter3, ...chapter4, ...chapter5] as KnowledgePoint[]
const pointBySlug = new Map(knowledge.map((point) => [point.slug, point]))

export default function ChapterReviewPage() {
  const { chapterId = 'chapter-1' } = useParams()
  const review = reviews.find((item) => item.id === chapterId) ?? reviews[0]

  return (
    <div className="page-container-narrow pb-28 pt-10 sm:pt-16">
      <PageHeader
        eyebrow="EXAM QUICK REVIEW"
        title={`第 ${review.number} 章 · ${review.title}`}
        description={review.summary}
      />

      <nav aria-label="章节速览切换" className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {reviews.map((item) => (
          <Link
            key={item.id}
            to={`/review/${item.id}`}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              item.id === review.id
                ? 'bg-blue text-white shadow-[0_6px_16px_rgba(0,113,227,0.2)]'
                : 'liquid-control border text-black/50 hover:text-ink'
            }`}
          >
            第 {item.number} 章
          </Link>
        ))}
      </nav>

      <div className="mt-7 flex items-center justify-between rounded-[18px] border border-blue/10 bg-blue/[0.035] px-5 py-4 text-sm text-black/55">
        <span>内容依据：{review.source}</span>
        <span className="hidden font-medium text-blue sm:inline">考前一页速览</span>
      </div>

      <section className="knowledge-section mt-5">
        <div className="flex items-center gap-3">
          <span className="section-number icon-blue"><BookOpenCheck size={18} /></span>
          <h2 className="text-[27px] font-semibold tracking-[-0.035em]">核心概念</h2>
        </div>
        <div className="mt-7 divide-y divide-black/[0.06]">
          {review.essentials.map((item) => (
            <div key={item.title} className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[150px_1fr]">
              <h3 className="text-[16px] font-semibold">{item.title}</h3>
              <p className="text-[16px] leading-7 text-black/58">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="knowledge-section mt-5">
        <div className="flex items-center gap-3">
          <span className="section-number icon-violet"><Sigma size={18} /></span>
          <h2 className="text-[27px] font-semibold tracking-[-0.035em]">必会公式清单</h2>
        </div>
        <div className="mt-7 space-y-4">
          {review.formulas.map((item) => (
            <article key={item.label} className="min-w-0 rounded-[18px] border border-black/[0.05] bg-[#fbfbfd] p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-[13px] text-black/40">{item.note}</p>
              </div>
              <MathFormula value={item.formula} block className="formula-display mt-4" />
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-section mt-5">
        <div className="flex items-center gap-3">
          <span className="section-number icon-green"><ListChecks size={18} /></span>
          <h2 className="text-[27px] font-semibold tracking-[-0.035em]">高频题型</h2>
        </div>
        <div className="mt-7 divide-y divide-black/[0.06]">
          {review.problemTypes.map((item, index) => (
            <div key={item.title} className="grid gap-3 py-5 first:pt-0 sm:grid-cols-[38px_170px_1fr]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-green-50 text-[11px] font-semibold text-green-700">{index + 1}</span>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-[16px] leading-7 text-black/58">{item.method}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="knowledge-section mt-5">
        <div className="flex items-center gap-3">
          <span className="section-number icon-rose"><AlertTriangle size={18} /></span>
          <h2 className="text-[27px] font-semibold tracking-[-0.035em]">高频错误清单</h2>
        </div>
        <ul className="mt-7 space-y-4">
          {review.mistakes.map((item) => (
            <li key={item} className="flex gap-3 text-[17px] leading-8 text-black/60">
              <span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-500"><span className="h-1.5 w-1.5 rounded-full bg-current" /></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="knowledge-section mt-5">
        <div className="flex items-center gap-3">
          <span className="section-number icon-blue"><Check size={18} /></span>
          <h2 className="text-[27px] font-semibold tracking-[-0.035em]">回到本章知识点</h2>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {review.nodeSlugs.map((slug) => {
            const point = pointBySlug.get(slug)
            if (!point) return null
            return (
              <Link key={slug} to={`/knowledge/${slug}`} className="connection-card group">
                <div><h3 className="font-semibold">{point.title}</h3><p className="mt-1.5 text-sm text-black/40">{point.englishTitle}</p></div>
                <ArrowRight size={16} className="shrink-0 text-black/20 transition group-hover:translate-x-0.5 group-hover:text-blue" />
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
