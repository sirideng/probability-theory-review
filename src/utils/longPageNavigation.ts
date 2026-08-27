export type ReadingProgressInput = {
  scrollY: number
  contentTop: number
  contentHeight: number
  viewportHeight: number
  offsetTop?: number
}

export function slugifySectionTitle(title: string, fallback = 'section') {
  const slug = title
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  return slug || fallback
}

export function createUniqueSectionId(title: string, used: Set<string>, preferredId?: string) {
  const base = slugifySectionTitle(preferredId || title)
  let id = base
  let suffix = 2

  while (used.has(id)) {
    id = `${base}-${suffix}`
    suffix += 1
  }

  used.add(id)
  return id
}

export function calculateReadingProgress({
  scrollY,
  contentTop,
  contentHeight,
  viewportHeight,
  offsetTop = 0,
}: ReadingProgressInput) {
  const start = contentTop - offsetTop
  const end = contentTop + contentHeight - viewportHeight

  if (end <= start) return scrollY >= start ? 100 : 0

  return Math.min(100, Math.max(0, ((scrollY - start) / (end - start)) * 100))
}

export function parseSectionFromHash(hash: string) {
  const route = hash.startsWith('#') ? hash.slice(1) : hash
  const queryIndex = route.indexOf('?')
  if (queryIndex < 0) return null
  return new URLSearchParams(route.slice(queryIndex + 1)).get('section')
}

export function buildHashRouteWithSection(hash: string, section: string | null) {
  const route = (hash.startsWith('#') ? hash.slice(1) : hash) || '/'
  const queryIndex = route.indexOf('?')
  const pathname = queryIndex >= 0 ? route.slice(0, queryIndex) : route
  const params = new URLSearchParams(queryIndex >= 0 ? route.slice(queryIndex + 1) : '')

  if (section) params.set('section', section)
  else params.delete('section')

  const query = params.toString()
  return `#${pathname}${query ? `?${query}` : ''}`
}
