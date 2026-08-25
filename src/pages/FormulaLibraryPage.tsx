import { ArrowRight, Search, Sigma } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MathFormula from '../components/math/MathFormula'
import PageHeader from '../components/ui/PageHeader'
import formulaData from '../data/formulas.json'
import type { FormulaItem } from '../types/content'

const formulas = formulaData as FormulaItem[]
const categories = ['全部', ...Array.from(new Set(formulas.map((item) => item.category)))]

export default function FormulaLibraryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const filtered = useMemo(() => formulas.filter((item) => {
    const matchesCategory = category === '全部' || item.category === category
    const haystack = [item.name, item.category, item.formula, item.condition, ...item.keywords].join(' ').toLowerCase()
    return matchesCategory && haystack.includes(query.trim().toLowerCase())
  }), [category, query])

  return <div className="page-container pb-24 pt-10 sm:pt-16">
    <PageHeader eyebrow="FORMULA INDEX" title="公式速查库" description="按知识场景搜索公式，确认使用条件后再带入计算。每条公式都可以返回对应知识页或交互分布页。" />
      <label className="liquid-control mt-10 flex max-w-3xl items-center gap-3 rounded-[18px] border px-5 py-4 transition focus-within:border-blue/25"><Search size={19} className="text-black/35"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="搜索：已知、方差、正态、首次成功……" className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-black/28"/><span className="text-sm text-black/30">{filtered.length} 条</span></label>
      <div className="mt-5 flex flex-wrap gap-2">{categories.map((item)=><button key={item} onClick={()=>setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${category===item?'bg-blue text-white shadow-[0_4px_12px_rgba(0,113,227,0.18)]':'liquid-control border text-black/48 hover:text-ink'}`}>{item}</button>)}</div>
      <div className="mt-9 grid min-w-0 gap-5 lg:grid-cols-2">{filtered.map((item)=><article key={`${item.category}-${item.name}`} className="liquid-content-card min-w-0 rounded-[26px] border p-6 sm:p-7"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-blue/75">{item.category}</span><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-black/[0.035]"><Sigma size={16} className="text-black/25"/></span></div><h2 className="mt-4 text-[22px] font-semibold tracking-[-0.025em]">{item.name}</h2><MathFormula value={item.formula} block className="formula-display mt-5"/><p className="mt-5 text-[16px] leading-7 text-black/52"><span className="font-semibold text-black/68">使用条件：</span>{item.condition}</p><div className="mt-4 flex flex-wrap gap-1.5">{item.keywords.map((keyword)=><span key={keyword} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] text-black/45">{keyword}</span>)}</div>{item.slug && <Link to={item.type==='distribution'?`/distributions/${item.slug}`:`/knowledge/${item.slug}`} className="group mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 text-sm font-semibold text-blue">查看完整解释 <ArrowRight size={16} className="transition group-hover:translate-x-0.5"/></Link>}</article>)}</div>
    {filtered.length===0&&<div className="mt-16 text-center"><p className="text-base font-medium text-black/45">没有找到相关公式</p><p className="mt-2 text-sm text-black/30">试试“条件”“均值”“独立”或切换到“全部”分类</p></div>}
  </div>
}
