import { ArrowRight, CircleDashed } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import distributionData from '../data/distributions.json'
import type { Distribution } from '../types/content'

const distributions = distributionData as Distribution[]

export default function DistributionLibraryPage() {
  return (
    <div className="page-container pb-24 pt-10 sm:pt-16">
      <PageHeader eyebrow="VISUAL LIBRARY" title="概率分布图像库" description="不要孤立地背公式。先看随机变量如何分布，再观察参数怎样改变形状，最后把图像与使用场景对应起来。" />

      <div className="mt-12 flex items-end justify-between">
        <div><h2 className="text-[28px] font-semibold tracking-[-0.035em]">全部分布</h2><p className="mt-1.5 text-base text-black/48">本科概率论基础分布，以及数理统计衔接预览</p></div>
        <span className="text-sm font-medium text-black/30">{distributions.length} 个分布</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {distributions.map((item) => {
          const isReady = item.status === 'ready'
          const content = (
            <div className={`distribution-card ${isReady ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-card' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-[14px] text-sm font-semibold" style={{ backgroundColor: `${item.color}16`, color: item.color }}>{item.symbol.split('(')[0]}</div>
              </div>
              <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35">{item.type} · {item.englishName}</p>
              <h3 className="mt-1.5 text-[22px] font-semibold tracking-[-0.025em]">{item.name}</h3>
              <p className="mt-3 min-h-[50px] text-[15px] leading-6 text-black/50">{item.summary}</p>
              <div className="mt-5 flex items-center justify-between border-t border-black/[0.06] pt-4"><span className="font-mono text-[18px] font-medium tracking-tight text-black/55 sm:text-[20px]">{item.symbol}</span>{isReady ? <ArrowRight size={18} className="text-blue" /> : <CircleDashed size={17} className="text-black/20" />}</div>
            </div>
          )
          return isReady ? <Link key={item.slug} to={`/distributions/${item.slug}`}>{content}</Link> : <div key={item.slug}>{content}</div>
        })}
      </div>
    </div>
  )
}
