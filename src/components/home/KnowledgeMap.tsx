import {
  ArrowRight,
  Atom,
  BarChart3,
  Boxes,
  FlaskConical,
  Network,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import curriculumData from '../../data/curriculum.json'
import type { CurriculumChapter, CurriculumTopic } from '../../types/content'

const chapters = curriculumData as CurriculumChapter[]
const chapterIcons = [Atom, Boxes, Network, BarChart3, Sparkles, FlaskConical]
const distributionRoutes: Record<string, string> = {
  'bernoulli-distribution': 'bernoulli',
  'binomial-distribution': 'binomial',
  'poisson-distribution': 'poisson',
  'geometric-distribution': 'geometric',
  'uniform-distribution': 'uniform',
  'exponential-distribution': 'exponential',
  'normal-distribution': 'normal',
}

function TopicRow({ topic, index, tone, chapterStatus }: { topic: CurriculumTopic; index: number; tone: CurriculumChapter['tone']; chapterStatus: CurriculumChapter['status'] }) {
  const route = topic.route ?? (distributionRoutes[topic.slug]
    ? `/distributions/${distributionRoutes[topic.slug]}`
    : chapterStatus === 'future'
      ? '/data-science'
      : `/knowledge/${topic.slug}`)
  const content = (
    <>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[11px] font-bold icon-${tone}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[17px] font-semibold tracking-tight text-ink sm:text-[18px]">{topic.title}</span>
        </span>
        <span className="mt-1.5 block text-[13px] leading-6 text-black/45 sm:text-[14px]">
          {topic.subtopics.join(' · ')}
        </span>
      </span>
      <ArrowRight size={18} className="mt-1 shrink-0 text-black/15 transition group-hover/topic:translate-x-0.5 group-hover/topic:text-blue" />
    </>
  )

  return (
    <Link
      to={route}
      className="group/topic flex items-start gap-4 rounded-xl px-3.5 py-3.5 transition hover:bg-black/[0.035]"
    >
      {content}
    </Link>
  )
}

export default function KnowledgeMap() {
  return (
    <div className="relative left-1/2 mt-12 w-full -translate-x-1/2 px-2 sm:w-[calc(100vw-296px)] sm:max-w-[1900px] sm:px-1">
      <div className="absolute bottom-10 left-[35px] top-10 w-px bg-gradient-to-b from-blue/10 via-blue/40 to-violet-300/20 sm:left-1/2" />
      <div className="space-y-5 sm:space-y-7">
        {chapters.map((chapter, chapterIndex) => {
          const Icon = chapterIcons[chapterIndex]
          const isRight = chapterIndex % 2 === 1
          return (
            <div
              key={chapter.id}
              className={`relative flex sm:w-1/2 ${isRight ? 'sm:ml-auto sm:pl-4' : 'sm:pr-4'}`}
            >
              <div
                className={`absolute left-[21px] top-10 z-10 h-3 w-3 rounded-full border-[3px] border-canvas ${chapter.status === 'future' ? 'bg-violet-400' : 'bg-blue'} sm:left-auto ${isRight ? 'sm:-left-[6px]' : 'sm:-right-[6px]'}`}
              />
              <article className={`liquid-content-card ml-14 w-full overflow-hidden rounded-[24px] border sm:max-w-[560px] ${isRight ? 'sm:ml-0 sm:mr-auto' : 'sm:ml-auto'}`}>
                <header className="border-b border-black/[0.06] p-6">
                  <div className="flex items-start gap-3.5">
                    <div className={`icon-tile icon-${chapter.tone}`}>
                      <Icon size={20} strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold tracking-[0.08em] text-black/30">
                          第 {chapter.number} 章
                        </p>
                        <span className="text-[11px] font-medium text-black/25">
                          {chapter.topics.length} 个节点
                        </span>
                      </div>
                      <h3 className="mt-1 text-[22px] font-semibold tracking-tight">{chapter.title}</h3>
                      <p className="mt-1 text-[11px] font-medium text-black/25">{chapter.englishTitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-black/50">{chapter.summary}</p>
                </header>

                <div className="p-3">
                  {chapter.topics.map((topic, topicIndex) => (
                    <TopicRow key={topic.slug} topic={topic} index={topicIndex} tone={chapter.tone} chapterStatus={chapter.status} />
                  ))}
                </div>

                {chapter.route && (
                  <Link
                    to={chapter.route}
                    className="group flex items-center justify-between border-t border-black/[0.06] px-5 py-3.5 text-xs font-medium text-violet-600 transition hover:bg-violet-50/50"
                  >
                    查看未来连接 <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                  </Link>
                )}
              </article>
            </div>
          )
        })}
      </div>

      <div className="liquid-control relative z-10 mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-medium text-black/35">
        <span className="h-2 w-2 rounded-full bg-blue" /> 概率论主线
        <span className="mx-1 text-black/15">→</span>
        <span className="h-2 w-2 rounded-full bg-violet-400" /> 数理统计与数据科学
      </div>
    </div>
  )
}
