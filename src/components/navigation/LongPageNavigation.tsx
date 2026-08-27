import { Check, Copy, List, X } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  buildHashRouteWithSection,
  calculateReadingProgress,
  createUniqueSectionId,
  parseSectionFromHash,
} from '../../utils/longPageNavigation'

type PageHeading = {
  id: string
  title: string
  level: 2 | 3
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function headingTitle(element: HTMLHeadingElement) {
  const clone = element.cloneNode(true) as HTMLHeadingElement
  clone.querySelectorAll('[data-section-copy]').forEach((node) => node.remove())
  return clone.textContent?.replace(/\s+/g, ' ').trim() || '未命名章节'
}

function replaceSectionInAddress(section: string, expectedPathname: string) {
  const currentRoute = (window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash).split('?')[0] || '/'
  if (currentRoute !== expectedPathname) return
  const nextHash = buildHashRouteWithSection(window.location.hash, section)
  if (window.location.hash === nextHash) return

  try {
    window.history.replaceState(window.history.state, '', `${window.location.href.split('#')[0]}${nextHash}`)
  } catch {
    // Local file previews can restrict history APIs; section navigation still works.
  }
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

function TableOfContents({ headings, activeId, onSelect }: { headings: PageHeading[]; activeId: string; onSelect: (id: string) => void }) {
  return <nav aria-label="本页目录" className="long-page-toc-nav">
    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/32">On this page</p>
    <ul className="mt-3 space-y-0.5">
      {headings.map((heading) => <li key={heading.id}>
        <button
          type="button"
          aria-current={heading.id === activeId ? 'location' : undefined}
          onClick={() => onSelect(heading.id)}
          className={`long-page-toc-link ${heading.level === 3 ? 'long-page-toc-link--nested' : ''} ${heading.id === activeId ? 'long-page-toc-link--active' : ''}`}
        >
          <span className="line-clamp-2">{heading.title}</span>
        </button>
      </li>)}
    </ul>
  </nav>
}

export default function LongPageNavigation({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressTrackRef = useRef<HTMLDivElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const drawerId = useId()
  const [headings, setHeadings] = useState<PageHeading[]>([])
  const [activeId, setActiveId] = useState('')
  const [showNavigation, setShowNavigation] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [copyNotice, setCopyNotice] = useState('')
  const skipTriggerRestore = useRef(false)
  const restoringSectionRef = useRef<string | null>(parseSectionFromHash(window.location.hash))
  const initialRestoreHandledRef = useRef(false)

  const scrollToSection = useCallback((id: string, behavior?: ScrollBehavior) => {
    const heading = document.getElementById(id)
    if (!heading) return
    heading.scrollIntoView({ behavior: behavior ?? (prefersReducedMotion() ? 'auto' : 'smooth'), block: 'start' })
    setActiveId(id)
    replaceSectionInAddress(id, pathname)
  }, [pathname])

  const copySectionLink = useCallback(async (id: string, title: string) => {
    const hash = buildHashRouteWithSection(window.location.hash, id)
    const url = `${window.location.href.split('#')[0]}${hash}`
    try {
      await copyText(url)
      setCopyNotice(`已复制“${title}”链接`)
    } catch {
      setCopyNotice('复制失败，请从地址栏复制')
    }
  }, [])

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return
    let scanFrame = 0

    const scan = () => {
      const elements = Array.from(content.querySelectorAll<HTMLHeadingElement>('h2, h3'))
      const used = new Set<string>()
      const nextHeadings = elements.map((element) => {
        const title = headingTitle(element)
        const preferredId = element.dataset.sectionId || element.id
        const id = createUniqueSectionId(title, used, preferredId)
        element.id = id
        element.tabIndex = -1
        element.classList.add('section-anchor-heading')

        let copyButton = element.querySelector<HTMLButtonElement>('[data-section-copy]')
        if (!copyButton) {
          copyButton = document.createElement('button')
          copyButton.type = 'button'
          copyButton.dataset.sectionCopy = 'true'
          copyButton.className = 'section-copy-link'
          copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
          element.appendChild(copyButton)
        }
        copyButton.setAttribute('aria-label', `复制“${title}”本节链接`)
        copyButton.title = '复制本节链接'
        copyButton.onclick = (event) => {
          event.preventDefault()
          event.stopPropagation()
          void copySectionLink(id, title)
        }

        return { id, title, level: Number(element.tagName.slice(1)) as 2 | 3 }
      })

      setHeadings((current) => {
        const unchanged = current.length === nextHeadings.length && current.every((item, index) => {
          const next = nextHeadings[index]
          return item.id === next.id && item.title === next.title && item.level === next.level
        })
        return unchanged ? current : nextHeadings
      })
      const tallEnough = content.scrollHeight > Math.max(window.innerHeight * 1.25, 760)
      setShowNavigation(nextHeadings.length >= 3 && tallEnough)
    }

    const queueScan = () => {
      cancelAnimationFrame(scanFrame)
      scanFrame = requestAnimationFrame(scan)
    }

    scan()
    const mutationObserver = new MutationObserver(queueScan)
    mutationObserver.observe(content, { childList: true, subtree: true, characterData: true })
    const resizeObserver = new ResizeObserver(queueScan)
    resizeObserver.observe(content)
    window.addEventListener('resize', queueScan)

    return () => {
      cancelAnimationFrame(scanFrame)
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('resize', queueScan)
    }
  }, [copySectionLink])

  useEffect(() => {
    const content = contentRef.current
    const bar = progressRef.current
    const track = progressTrackRef.current
    if (!content || !bar || !track) return
    let frame = 0

    const update = () => {
      frame = 0
      const rect = content.getBoundingClientRect()
      const offsetTop = window.innerWidth < 1024 ? 67 : 3
      const progress = calculateReadingProgress({
        scrollY: window.scrollY,
        contentTop: rect.top + window.scrollY,
        contentHeight: rect.height,
        viewportHeight: window.innerHeight,
        offsetTop,
      })
      bar.style.transform = `scaleX(${progress / 100})`
      track.setAttribute('aria-valuenow', String(Math.round(progress)))
    }
    const queueUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    const resizeObserver = new ResizeObserver(queueUpdate)
    resizeObserver.observe(content)
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [])

  useEffect(() => {
    if (!headings.length) return
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element): element is HTMLElement => Boolean(element))
    let scrollFrame = 0

    const updateFromPosition = () => {
      scrollFrame = 0
      if (restoringSectionRef.current) return
      const offset = window.innerWidth < 1024 ? 112 : 60
      let current = elements[0]
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= offset) current = element
        else break
      }
      if (current) setActiveId((value) => value === current.id ? value : current.id)
    }
    const queuePositionUpdate = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateFromPosition)
    }

    const observer = new IntersectionObserver((entries) => {
      if (restoringSectionRef.current) return
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveId((value) => value === visible[0].target.id ? value : visible[0].target.id)
    }, { rootMargin: '-72px 0px -68% 0px', threshold: [0, 1] })
    elements.forEach((element) => observer.observe(element))
    const requestedSection = restoringSectionRef.current
    if (requestedSection && elements.some((element) => element.id === requestedSection)) {
      restoringSectionRef.current = requestedSection
      setActiveId(requestedSection)
    } else {
      updateFromPosition()
    }
    window.addEventListener('scroll', queuePositionUpdate, { passive: true })
    return () => {
      cancelAnimationFrame(scrollFrame)
      observer.disconnect()
      window.removeEventListener('scroll', queuePositionUpdate)
    }
  }, [headings])

  useEffect(() => {
    if (!activeId) return
    const hasSectionInAddress = Boolean(parseSectionFromHash(window.location.hash))
    const firstHeading = headings[0] ? document.getElementById(headings[0].id) : null
    const firstHeadingTop = firstHeading ? firstHeading.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY
    const hasEnteredBody = window.scrollY >= firstHeadingTop - 120
    if (!hasSectionInAddress && !hasEnteredBody) return
    replaceSectionInAddress(activeId, pathname)
  }, [activeId, headings, pathname])

  useEffect(() => {
    if (!headings.length) return
    let initialFrame = 0
    let secondFrame = 0

    const restoreFromAddress = (section = parseSectionFromHash(window.location.hash)) => {
      if (!section || !document.getElementById(section)) return
      restoringSectionRef.current = section
      setActiveId(section)
      initialFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          scrollToSection(section, 'auto')
          window.setTimeout(() => {
            if (restoringSectionRef.current === section) restoringSectionRef.current = null
          }, 60)
        })
      })
    }

    if (!initialRestoreHandledRef.current) {
      initialRestoreHandledRef.current = true
      restoreFromAddress(restoringSectionRef.current)
    }
    const restoreFromHistory = () => restoreFromAddress()
    window.addEventListener('hashchange', restoreFromHistory)
    window.addEventListener('popstate', restoreFromHistory)
    return () => {
      cancelAnimationFrame(initialFrame)
      cancelAnimationFrame(secondFrame)
      window.removeEventListener('hashchange', restoreFromHistory)
      window.removeEventListener('popstate', restoreFromHistory)
    }
  }, [headings, scrollToSection])

  useEffect(() => {
    if (!copyNotice) return
    const timeout = window.setTimeout(() => setCopyNotice(''), 1800)
    return () => window.clearTimeout(timeout)
  }, [copyNotice])

  useEffect(() => {
    if (!drawerOpen) return
    const previousOverflow = document.body.style.overflow
    const mobileTrigger = mobileTriggerRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setDrawerOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const drawer = document.getElementById(drawerId)
      const focusable = drawer?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (!skipTriggerRestore.current) mobileTrigger?.focus()
      skipTriggerRestore.current = false
    }
  }, [drawerId, drawerOpen])

  const selectFromDrawer = (id: string) => {
    skipTriggerRestore.current = true
    setDrawerOpen(false)
    scrollToSection(id)
    window.setTimeout(() => document.getElementById(id)?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 350)
  }

  return <div className={`long-page-grid ${showNavigation ? 'long-page-grid--with-toc' : ''}`}>
    <div
      ref={progressTrackRef}
      className="long-page-progress-track"
      role="progressbar"
      aria-label="正文阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    ><div ref={progressRef} className="long-page-progress-value" /></div>

    {showNavigation && <button
      ref={mobileTriggerRef}
      type="button"
      aria-label="打开本页目录"
      aria-expanded={drawerOpen}
      aria-controls={drawerId}
      onClick={() => setDrawerOpen(true)}
      className="long-page-mobile-trigger liquid-control"
    ><List size={16} />本页目录</button>}

    <div ref={contentRef} data-long-page-content className="long-page-content min-w-0">{children}</div>

    {showNavigation && <aside className="long-page-toc-column" aria-label="页面章节导航">
      <div className="liquid-control long-page-toc-panel border">
        <TableOfContents headings={headings} activeId={activeId} onSelect={scrollToSection} />
      </div>
    </aside>}

    {drawerOpen && <div className="long-page-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}>
      <div id={drawerId} role="dialog" aria-modal="true" aria-labelledby={`${drawerId}-title`} className="long-page-drawer-panel">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <div><p className="eyebrow">ON THIS PAGE</p><h2 id={`${drawerId}-title`} className="mt-1 text-[20px] font-semibold">本页目录</h2></div>
          <button ref={closeButtonRef} type="button" aria-label="关闭本页目录" onClick={() => setDrawerOpen(false)} className="rounded-full p-2 text-black/55 transition hover:bg-black/[0.05]"><X size={20} /></button>
        </div>
        <div className="max-h-[min(68vh,620px)] overflow-y-auto px-3 py-4">
          <TableOfContents headings={headings} activeId={activeId} onSelect={selectFromDrawer} />
        </div>
      </div>
    </div>}

    <div className={`long-page-copy-toast ${copyNotice ? 'long-page-copy-toast--visible' : ''}`} role="status" aria-live="polite">
      {copyNotice ? <><Check size={15} />{copyNotice}</> : <><Copy size={15} />链接已复制</>}
    </div>
  </div>
}
