import { ArrowLeft, ArrowRight, BrainCircuit, Sigma } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import MathFormula from '../components/math/MathFormula'
import PageHeader from '../components/ui/PageHeader'
import LongPageNavigation from '../components/navigation/LongPageNavigation'
import machineLearningBridgeData from '../data/machine-learning-bridge.json'
import type { MachineLearningBridgeTopic } from '../types/content'

const topics = machineLearningBridgeData as MachineLearningBridgeTopic[]

const groups = [
  {
    id: 'supervised-generalization',
    title: '监督学习与泛化',
    englishTitle: 'Supervised Learning & Generalization',
    description: '从条件分布理解预测目标，再用经验风险、大数定律和偏差—方差权衡解释模型为何需要在新数据上接受检验。',
    topicIds: ['conditional-learning', 'empirical-risk', 'bias-variance'],
  },
  {
    id: 'probabilistic-classification',
    title: '概率模型与分类',
    englishTitle: 'Probabilistic Models & Classification',
    description: '从条件概率模型出发，理解负对数似然怎样产生损失函数，以及逻辑回归如何输出可解释的分类概率。',
    topicIds: ['loss-likelihood', 'logistic-regression'],
  },
  {
    id: 'regularization-training',
    title: '正则化与模型训练',
    englishTitle: 'Regularization & Model Training',
    description: '把贝叶斯先验、最大后验估计和参数惩罚联系起来，再理解梯度下降如何真正求出模型参数。',
    topicIds: ['regularization-map', 'gradient-descent'],
  },
] as const

export default function MachineLearningBridgePage() {
  const { groupId } = useParams()
  const group = groups.find((item) => item.id === groupId)

  if (!group) return <Navigate to="/machine-learning/supervised-generalization" replace />

  const groupTopics = group.topicIds
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is MachineLearningBridgeTopic => Boolean(topic))

  return <LongPageNavigation><div className="page-container pb-24 pt-10 sm:pt-16">
    <Link to="/" className="liquid-control inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium text-black/55 transition hover:text-blue"><ArrowLeft size={15} />返回学习地图</Link>
    <PageHeader eyebrow="PROBABILITY → MACHINE LEARNING" title={group.title} description={group.description} />

    <nav className="liquid-content-card mt-8 grid gap-2 rounded-[22px] border p-2 md:grid-cols-3" aria-label="机器学习过渡专题">
      {groups.map((item) => <Link key={item.id} to={`/machine-learning/${item.id}`} className={`rounded-[16px] px-4 py-3.5 transition ${item.id === group.id ? 'bg-blue text-white shadow-sm' : 'text-black/48 hover:bg-black/[0.035] hover:text-black/70'}`}>
        <span className="block text-[14px] font-semibold">{item.title}</span>
        <span className={`mt-1 block text-[10px] ${item.id === group.id ? 'text-white/65' : 'text-black/28'}`}>{item.englishTitle}</span>
      </Link>)}
    </nav>

    <section className="liquid-content-card mt-6 rounded-[28px] border p-7 sm:p-9">
      <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-blue/10"><BrainCircuit size={21} className="text-blue" /></span><div><p className="eyebrow">LEARNING PATH</p><h2 className="mt-1 text-[24px] font-semibold tracking-[-0.035em]">本页学习顺序</h2></div></div>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-[13px] font-medium text-black/48">
        {groupTopics.map((topic, index) => <span key={topic.id} className="contents"><span className="rounded-full bg-black/[0.045] px-3.5 py-2">{topic.title}</span>{index < groupTopics.length - 1 && <ArrowRight size={14} />}</span>)}
      </div>
    </section>

    <div className="mt-6 grid gap-5">
      {groupTopics.map((topic, index) => <article key={topic.id} className="liquid-content-card min-w-0 rounded-[28px] border p-6 sm:p-9">
        <div className="flex items-start gap-3.5"><span className="section-number icon-blue">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><h2 className="text-[24px] font-semibold leading-tight tracking-[-0.035em] sm:text-[29px]">{topic.title}</h2><p className="mt-1 text-[13px] text-black/32">{topic.englishTitle}</p></div></div>
        <p className="mt-6 max-w-5xl text-[17px] leading-8 text-black/60">{topic.summary}</p>
        <div className="mt-6 min-w-0 rounded-[20px] border border-black/[0.055] bg-[#fbfbfd] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-violet-600"><Sigma size={15} />核心联系</div>
          <MathFormula value={topic.formula} block className="property-formula mt-4 text-[16px]" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] bg-blue/[0.055] p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-blue/70">概率论连接</p><p className="mt-2 text-[15px] leading-7 text-black/55">{topic.probabilityLink}</p></div>
          <div className="rounded-[18px] bg-violet-500/[0.055] p-5"><p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-violet-600/75">机器学习作用</p><p className="mt-2 text-[15px] leading-7 text-black/55">{topic.machineLearningUse}</p></div>
        </div>
        <div className="mt-6 border-t border-black/[0.06] pt-5"><p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-black/35">学习时先抓住</p><ul className="mt-3 grid gap-2 md:grid-cols-3">{topic.studyFocus.map((item) => <li key={item} className="flex gap-2.5 text-[14px] leading-6 text-black/50"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue/70" />{item}</li>)}</ul></div>
      </article>)}
    </div>

    <div className="liquid-content-card mt-8 flex items-center gap-3 rounded-[20px] border px-5 py-4 text-[14px] leading-6 text-black/50"><BrainCircuit size={18} className="shrink-0 text-violet-600" />本专题用于从概率论过渡到机器学习，不计入当前概率论期末主线；学习时先重视概念联系，不必提前追求完整算法证明。</div>
  </div></LongPageNavigation>
}
