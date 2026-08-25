import type { ReactNode } from 'react'

export default function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-6 border-b border-black/[0.065] pb-10 md:flex-row md:items-end md:justify-between sm:pb-12">
      <div className="max-w-4xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-[42px] font-bold leading-[1.08] tracking-[-0.05em] text-ink sm:text-[56px]">{title}</h1>
        <p className="mt-5 max-w-3xl text-[17px] leading-8 text-black/52 sm:text-[18px]">{description}</p>
      </div>
      {action}
    </header>
  )
}
