import { type ReactNode, useLayoutEffect, useState } from 'react'
import { BarChart3, BookOpenText, BrainCircuit, ExternalLink, GraduationCap, House, Menu, ScanText, Sigma, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { machineLearningLessons, machineLearningScope } from '../../data/machine-learning-course'

const lectureHref = '../2026考研数学-基础阶段-概率讲义+习题-张翀.pdf'

const probabilityNavItems = [
  { to: '/', label: '学习地图', icon: House, end: true },
  { to: '/distributions', label: '分布图像', icon: BarChart3 },
  { to: '/formulas', label: '公式速查', icon: Sigma },
  { to: '/review', label: '考前速览', icon: ScanText },
  { to: '/data-science', label: '连接科学', icon: BrainCircuit },
]

const machineLearningNavItems = [
  { to: '/machine-learning', label: '学习地图', icon: House, end: true },
]

type CourseMode = 'probability' | 'machine-learning'

function CourseSwitcher({ mode, onNavigate, compact = false }: { mode: CourseMode; onNavigate?: () => void; compact?: boolean }) {
  const courses = [
    { to: '/', label: '概率论', shortLabel: '概率', icon: Sigma, active: mode === 'probability' },
    { to: '/machine-learning', label: '机器学习', shortLabel: '机器学习', icon: GraduationCap, active: mode === 'machine-learning' },
  ]

  return (
    <nav aria-label="课程切换" className={`grid grid-cols-2 gap-1 rounded-[16px] border border-black/[0.06] bg-black/[0.025] p-1 ${compact ? 'w-[204px]' : 'w-full'}`}>
      {courses.map(({ to, label, shortLabel, icon: Icon, active }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          aria-label={`切换到${label}`}
          className={`flex min-h-10 items-center justify-center gap-1.5 rounded-[12px] px-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15 ${
            active
              ? 'bg-white text-blue shadow-[0_5px_16px_rgba(0,0,0,0.08)]'
              : 'text-black/55 hover:bg-white/65 hover:text-ink'
          }`}
        >
          <Icon size={15} strokeWidth={active ? 2.3 : 1.9} aria-hidden="true" />
          <span>{compact ? shortLabel : label}</span>
        </Link>
      ))}
    </nav>
  )
}

function Navigation({ mode, onNavigate }: { mode: CourseMode; onNavigate?: () => void }) {
  const navItems = mode === 'machine-learning' ? machineLearningNavItems : probabilityNavItems

  return (
    <nav aria-label="主导航" className="space-y-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex min-h-11 items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-medium transition-all duration-200 ${
              isActive
                ? 'liquid-nav-active text-blue'
                : 'text-black/55 hover:bg-black/[0.045] hover:text-ink'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`grid h-7 w-7 place-items-center rounded-[9px] ${isActive ? 'bg-blue text-white shadow-sm' : 'text-black/45'}`}>
                <Icon size={16} strokeWidth={isActive ? 2.25 : 1.8} />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
      {mode === 'probability' && (
        <a
          href={lectureHref}
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          aria-label="查看讲义（在新标签页打开）"
          className="group flex min-h-11 items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14px] font-medium text-black/55 transition-all duration-200 hover:bg-black/[0.045] hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/15"
        >
          <span className="grid h-7 w-7 place-items-center rounded-[9px] text-black/45">
            <BookOpenText size={16} strokeWidth={1.8} />
          </span>
          <span>查看讲义</span>
          <ExternalLink className="ml-auto text-black/35" size={13} aria-hidden="true" />
        </a>
      )}
    </nav>
  )
}

let learningMapScrollY = 0

function RouteScrollManager() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const previousMode = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousMode
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo(0, pathname === '/' ? learningMapScrollY : 0)

    return () => {
      if (pathname === '/') learningMapScrollY = window.scrollY
    }
  }, [pathname])

  return null
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const courseMode: CourseMode = pathname.startsWith('/machine-learning') ? 'machine-learning' : 'probability'
  const courseMeta = courseMode === 'machine-learning'
    ? { eyebrow: 'Machine Learning', title: '机器学习', detail: `${machineLearningScope.videos} · ${machineLearningLessons.length} 模块` }
    : { eyebrow: 'Probability Atlas', title: '概率论', detail: '应用统计学 · 概率论' }

  return (
    <div className="app-liquid-background min-h-screen text-ink">
      <RouteScrollManager />
      <aside className="liquid-sidebar fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r px-4 py-5 lg:block">
        <div className="mb-6 border-b border-black/[0.055] px-1 pb-5">
          <CourseSwitcher mode={courseMode} />
          <p className="mt-3 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">{courseMeta.eyebrow}</p>
        </div>
        <Navigation mode={courseMode} />
        <div className="liquid-control absolute bottom-5 left-4 right-4 rounded-[18px] border p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Course Notebook</p>
          <p className="mt-2 text-[13px] font-semibold leading-5">{courseMeta.detail}</p>
          <p className="mt-0.5 text-[11px] text-black/45">{courseMode === 'machine-learning' ? '独立路线 · 独立进度' : '北师大珠海 · 长期复习'}</p>
        </div>
      </aside>

      <header className="liquid-toolbar sticky top-0 z-20 flex h-16 items-center justify-between border-b px-5 lg:hidden">
        <CourseSwitcher mode={courseMode} compact />
        <button aria-label="打开菜单" className="rounded-[10px] p-2 text-black/60 transition hover:bg-black/5" onClick={() => setMobileOpen(true)}>
          <Menu size={21} />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="liquid-sidebar h-full w-[292px] border-r p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <span className="text-lg font-semibold tracking-tight">{courseMeta.title}导航</span>
              <button aria-label="关闭菜单" className="rounded-lg p-2 hover:bg-black/5" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <CourseSwitcher mode={courseMode} onNavigate={() => setMobileOpen(false)} />
            <div className="my-5 h-px bg-black/[0.06]" />
            <Navigation mode={courseMode} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:ml-[248px]">{children}</main>
    </div>
  )
}
