import { type ReactNode, useLayoutEffect, useState } from 'react'
import { BarChart3, BrainCircuit, House, Menu, ScanText, Sigma, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: '学习地图', icon: House, end: true },
  { to: '/distributions', label: '分布图像', icon: BarChart3 },
  { to: '/formulas', label: '公式速查', icon: Sigma },
  { to: '/review', label: '考前速览', icon: ScanText },
  { to: '/data-science', label: '连接科学', icon: BrainCircuit },
]

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
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

  return (
    <div className="app-liquid-background min-h-screen text-ink">
      <RouteScrollManager />
      <aside className="liquid-sidebar fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r px-4 py-5 lg:block">
        <div className="mb-6 flex items-center gap-3 border-b border-black/[0.055] px-2 pb-5">
          <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-br from-[#147ce5] to-[#0064c8] text-lg font-semibold text-white shadow-[0_8px_20px_rgba(0,113,227,0.22)]">P</div>
          <div>
            <p className="text-[16px] font-semibold tracking-[-0.02em]">概率论</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Probability Atlas</p>
          </div>
        </div>
        <Navigation />
        <div className="liquid-control absolute bottom-5 left-4 right-4 rounded-[18px] border p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Course Notebook</p>
          <p className="mt-2 text-[13px] font-semibold leading-5">应用统计学 · 概率论</p>
          <p className="mt-0.5 text-[11px] text-black/40">北师大珠海 · 长期复习</p>
        </div>
      </aside>

      <header className="liquid-toolbar sticky top-0 z-20 flex h-16 items-center justify-between border-b px-5 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-blue text-sm font-semibold text-white shadow-sm">P</div>
          <span className="font-semibold tracking-tight">概率论</span>
        </div>
        <button aria-label="打开菜单" className="rounded-[10px] p-2 text-black/60 transition hover:bg-black/5" onClick={() => setMobileOpen(true)}>
          <Menu size={21} />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="liquid-sidebar h-full w-[292px] border-r p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-7 flex items-center justify-between">
              <span className="text-lg font-semibold tracking-tight">学习导航</span>
              <button aria-label="关闭菜单" className="rounded-lg p-2 hover:bg-black/5" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <Navigation onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:ml-[248px]">{children}</main>
    </div>
  )
}
