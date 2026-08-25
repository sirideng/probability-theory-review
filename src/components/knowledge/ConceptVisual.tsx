import type { KnowledgeVisual } from '../../types/content'

const bars = [22, 46, 74, 58, 34, 18]

export default function ConceptVisual({ visual }: { visual: KnowledgeVisual }) {
  const common = 'h-auto w-full'
  let graphic

  switch (visual.type) {
    case 'sets':
      graphic = <svg viewBox="0 0 560 230" className={common}><rect x="25" y="22" width="510" height="180" rx="26" fill="#f2f2f7" stroke="#1d1d1f" strokeOpacity=".08" /><ellipse cx="235" cy="112" rx="135" ry="72" fill="#0071e3" fillOpacity=".18" stroke="#0071e3" strokeOpacity=".35" /><ellipse cx="330" cy="120" rx="128" ry="70" fill="#8b5cf6" fillOpacity=".18" stroke="#8b5cf6" strokeOpacity=".35" /><text x="165" y="92" fill="#0071e3" fontWeight="600">A</text><text x="391" y="100" fill="#7c3aed" fontWeight="600">B</text><text x="277" y="128" textAnchor="middle" fill="#1d1d1f" fillOpacity=".55" fontSize="13">A ∩ B</text><text x="505" y="187" fill="#1d1d1f" fillOpacity=".28" fontSize="12">Ω</text></svg>
      break
    case 'events':
      graphic = <svg viewBox="0 0 560 230" className={common}><rect x="30" y="42" width="135" height="142" rx="22" fill="#e8f3ff" /><text x="97" y="75" textAnchor="middle" fill="#0071e3" fontWeight="600">随机现象</text>{['结果 1','结果 2','结果 3'].map((t,i)=><text key={t} x="97" y={108+i*25} textAnchor="middle" fill="#1d1d1f" fillOpacity=".45" fontSize="12">{t}</text>)}<path d="M185 113 H245" stroke="#1d1d1f" strokeOpacity=".2" strokeWidth="2" markerEnd="url(#arrow)"/><rect x="260" y="24" width="270" height="178" rx="26" fill="#f4efff" stroke="#8b5cf6" strokeOpacity=".15" /><text x="395" y="58" textAnchor="middle" fill="#7c3aed" fontWeight="600">样本空间 Ω</text>{['ω₁','ω₂','ω₃','…'].map((t,i)=><g key={t}><circle cx={312+i*56} cy="122" r="20" fill="white"/><text x={312+i*56} y="127" textAnchor="middle" fill="#1d1d1f" fillOpacity=".55" fontSize="12">{t}</text></g>)}</svg>
      break
    case 'tree':
      graphic = <svg viewBox="0 0 560 230" className={common}><circle cx="60" cy="115" r="15" fill="#1d1d1f"/><g stroke="#0071e3" strokeWidth="2" fill="none"><path d="M75 112 C140 112 145 55 210 55"/><path d="M75 118 C140 118 145 175 210 175"/><path d="M225 55 C300 55 320 30 390 30"/><path d="M225 55 C300 55 320 88 390 88"/><path d="M225 175 C300 175 320 145 390 145"/><path d="M225 175 C300 175 320 205 390 205"/></g>{[[210,55,'A₁'],[210,175,'A₂'],[405,30,'B'],[405,88,'Bᶜ'],[405,145,'B'],[405,205,'Bᶜ']].map(([x,y,t])=><g key={`${x}${y}`}><circle cx={Number(x)} cy={Number(y)} r="16" fill="white" stroke="#0071e3" strokeOpacity=".45"/><text x={Number(x)} y={Number(y)+4} textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".6">{t}</text></g>)}<text x="280" y="220" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".32">沿路径相乘 · 互斥路径相加</text></svg>
      break
    case 'mapping':
      graphic = <svg viewBox="0 0 560 230" className={common}><rect x="40" y="30" width="180" height="170" rx="80" fill="#e8f3ff"/><rect x="340" y="30" width="180" height="170" rx="80" fill="#f4efff"/>{['HHT','HTH','THH','TTT'].map((t,i)=><text key={t} x="130" y={65+i*38} textAnchor="middle" fontSize="12" fill="#1d1d1f" fillOpacity=".55">{t}</text>)}{['3','2','1','0'].map((t,i)=><text key={t} x="430" y={65+i*38} textAnchor="middle" fontSize="13" fill="#7c3aed" fontWeight="600">{t}</text>)}<path d="M226 112 H330" stroke="#0071e3" strokeWidth="2.5"/><text x="278" y="98" textAnchor="middle" fill="#0071e3" fontWeight="600">X(ω)</text></svg>
      break
    case 'cdf':
      graphic = <svg viewBox="0 0 560 230" className={common}><g stroke="#1d1d1f" strokeOpacity=".15"><path d="M45 190 H525"/><path d="M55 202 V25"/></g><path d="M55 185 C120 184 150 176 190 160 C235 142 250 102 295 78 C340 55 385 45 515 42" fill="none" stroke="#5856d6" strokeWidth="4" strokeLinecap="round"/><path d="M55 190 H150 V155 H245 V112 H340 V72 H440 V42 H515" fill="none" stroke="#0071e3" strokeWidth="2.5" strokeDasharray="6 5"/><text x="70" y="38" fontSize="12" fill="#1d1d1f" fillOpacity=".35">F(x)</text><text x="514" y="213" fontSize="12" fill="#1d1d1f" fillOpacity=".35">x</text></svg>
      break
    case 'pmf':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M45 190 H525" stroke="#1d1d1f" strokeOpacity=".15"/>{bars.map((h,i)=><g key={i}><rect x={80+i*70} y={190-h*1.7} width="36" height={h*1.7} rx="7" fill="#0071e3" fillOpacity={.28+i*.06}/><text x={98+i*70} y="211" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".35">{i}</text></g>)}</svg>
      break
    case 'density':
      graphic = <svg viewBox="0 0 560 230" className={common}><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5856d6" stopOpacity=".35"/><stop offset="1" stopColor="#5856d6" stopOpacity=".03"/></linearGradient></defs><path d="M40 190 H525" stroke="#1d1d1f" strokeOpacity=".15"/><path d="M55 188 C150 185 180 150 225 92 C260 47 295 47 330 92 C375 150 405 185 505 188" fill="none" stroke="#5856d6" strokeWidth="4"/><path d="M185 157 C200 135 210 112 225 92 C260 47 295 47 330 92 C345 112 355 135 370 157 L370 190 H185Z" fill="url(#area)"/><text x="185" y="210" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".4">a</text><text x="370" y="210" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".4">b</text><text x="278" y="174" textAnchor="middle" fontSize="12" fill="#5856d6">P(a &lt; X ≤ b)</text></svg>
      break
    case 'joint':
      graphic = <svg viewBox="0 0 560 230" className={common}><g stroke="#1d1d1f" strokeOpacity=".08">{[90,150,210,270,330,390,450].map(x=><path key={x} d={`M${x} 25 V200`}/>)}{[45,85,125,165].map(y=><path key={y} d={`M55 ${y} H505`}/>)}</g><path d="M55 200 H515 M60 210 V20" stroke="#1d1d1f" strokeOpacity=".18"/>{Array.from({length:25},(_,i)=>{const x=100+(i*73)%360;const y=175-((i*47)%125);return <circle key={i} cx={x} cy={y} r="5" fill={i%2?'#5856d6':'#0071e3'} fillOpacity=".45"/>})}<text x="510" y="218" fontSize="11" fill="#1d1d1f" fillOpacity=".35">X</text><text x="43" y="30" fontSize="11" fill="#1d1d1f" fillOpacity=".35">Y</text></svg>
      break
    case 'region':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M55 195 H515 M65 205 V22" stroke="#1d1d1f" strokeOpacity=".18"/><path d="M100 180 L260 55 L445 180 Z" fill="#5856d6" fillOpacity=".15" stroke="#5856d6" strokeOpacity=".55" strokeWidth="2"/><path d="M180 180 V118 M260 180 V55 M340 180 V113" stroke="#0071e3" strokeOpacity=".45" strokeDasharray="4 4"/><text x="275" y="130" textAnchor="middle" fill="#5856d6" fontWeight="600">D</text><text x="275" y="216" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".35">积分区域 = 事件区域 ∩ 密度支持集</text></svg>
      break
    case 'expectation':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M70 150 H490" stroke="#1d1d1f" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round"/><path d="M280 150 L248 196 H312 Z" fill="#5856d6" fillOpacity=".25"/><circle cx="120" cy="127" r="18" fill="#0071e3" fillOpacity=".25"/><circle cx="195" cy="116" r="29" fill="#0071e3" fillOpacity=".35"/><circle cx="350" cy="120" r="25" fill="#8b5cf6" fillOpacity=".32"/><circle cx="440" cy="130" r="15" fill="#8b5cf6" fillOpacity=".22"/><path d="M280 70 V145" stroke="#5856d6" strokeDasharray="5 5"/><text x="280" y="57" textAnchor="middle" fill="#5856d6" fontWeight="600">E(X)</text></svg>
      break
    case 'variance':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M45 190 H520" stroke="#1d1d1f" strokeOpacity=".15"/><path d="M55 188 C190 185 210 62 280 55 C350 62 370 185 505 188" fill="none" stroke="#0071e3" strokeWidth="3"/><path d="M55 188 C120 175 175 118 280 108 C385 118 440 175 505 188" fill="none" stroke="#8b5cf6" strokeWidth="3"/><path d="M280 42 V192" stroke="#1d1d1f" strokeOpacity=".12" strokeDasharray="4 5"/><text x="385" y="90" fill="#8b5cf6" fontSize="12">方差较大</text><text x="315" y="52" fill="#0071e3" fontSize="12">方差较小</text></svg>
      break
    case 'relationship':
      graphic = <svg viewBox="0 0 560 230" className={common}>{[0,1,2].map(group=><g key={group} transform={`translate(${group*180+10},0)`}><path d="M20 190 H165 M25 198 V35" stroke="#1d1d1f" strokeOpacity=".12"/>{Array.from({length:10},(_,i)=>{const x=40+i*11;const base=group===0?170-i*12:group===1?55+i*12:105+Math.sin(i*2)*48;return <circle key={i} cx={x} cy={base+(i%3-1)*7} r="4" fill={group===0?'#34c759':group===1?'#ff3b30':'#8b5cf6'} fillOpacity=".55"/>})}<text x="92" y="218" textAnchor="middle" fontSize="10" fill="#1d1d1f" fillOpacity=".35">{group===0?'正相关':group===1?'负相关':'零线性相关'}</text></g>)}</svg>
      break
    case 'bound':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M45 190 H520" stroke="#1d1d1f" strokeOpacity=".15"/><path d="M55 188 C170 185 205 58 280 52 C355 58 390 185 505 188" fill="none" stroke="#5856d6" strokeWidth="3.5"/><path d="M55 188 C105 185 135 177 170 150 L170 190 H55Z M390 150 C425 177 455 185 505 188 L505 190 H390Z" fill="#ff3b30" fillOpacity=".16"/><path d="M170 58 V190 M390 58 V190" stroke="#ff3b30" strokeOpacity=".45" strokeDasharray="5 5"/><text x="280" y="213" textAnchor="middle" fontSize="11" fill="#1d1d1f" fillOpacity=".4">μ − ε | μ | μ + ε</text></svg>
      break
    case 'convergence':
      graphic = <svg viewBox="0 0 560 230" className={common}><path d="M45 115 H520" stroke="#5856d6" strokeOpacity=".35" strokeDasharray="5 5"/><text x="30" y="119" fill="#5856d6" fontSize="11">μ</text>{[0,1,2,3].map(i=><path key={i} d={`M55 ${50+i*43} C130 ${190-i*35}, 210 ${70+i*20}, 300 ${112+(i-1)*5} S430 ${115+(i%2?3:-3)}, 510 115`} fill="none" stroke={i%2?'#0071e3':'#8b5cf6'} strokeOpacity=".55" strokeWidth="2"/>)}<text x="490" y="210" fill="#1d1d1f" fillOpacity=".35" fontSize="11">n 增大</text></svg>
      break
    case 'clt':
      graphic = <svg viewBox="0 0 560 230" className={common}><g transform="translate(20,0)">{[30,65,100].map((x,i)=><rect key={x} x={x} y={170-i*35} width="26" height={20+i*35} rx="4" fill="#ff9500" fillOpacity=".3"/>)}<text x="82" y="215" textAnchor="middle" fontSize="10" fill="#1d1d1f" fillOpacity=".35">n = 1</text></g><path d="M175 115 H230" stroke="#1d1d1f" strokeOpacity=".2"/><path d="M255 190 C315 185 330 80 380 68 C430 80 445 185 505 190" fill="#5856d6" fillOpacity=".12" stroke="#5856d6" strokeWidth="3"/><text x="380" y="215" textAnchor="middle" fontSize="10" fill="#1d1d1f" fillOpacity=".35">n 增大后接近正态</text></svg>
      break
    default:
      graphic = null
  }

  return <figure className="mt-6 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-5 sm:p-7">{graphic}<figcaption className="mt-3 text-center text-sm leading-6 text-black/45">{visual.caption}</figcaption></figure>
}
