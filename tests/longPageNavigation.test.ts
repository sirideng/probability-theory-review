import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildHashRouteWithSection,
  calculateReadingProgress,
  createUniqueSectionId,
  parseSectionFromHash,
  slugifySectionTitle,
} from '../src/utils/longPageNavigation.ts'

test('section slug is readable, stable and unique', () => {
  assert.equal(slugifySectionTitle('重要公式 · 条件概率'), '重要公式-条件概率')
  assert.equal(slugifySectionTitle('Bias–Variance Trade-off'), 'bias-variance-trade-off')
  const used = new Set<string>()
  assert.equal(createUniqueSectionId('核心性质', used), '核心性质')
  assert.equal(createUniqueSectionId('核心性质', used), '核心性质-2')
  assert.equal(createUniqueSectionId('忽略标题', used, 'important-formulas'), 'important-formulas')
})

test('reading progress uses actual content bounds and clamps to 0–100', () => {
  const base = { contentTop: 200, contentHeight: 1800, viewportHeight: 800, offsetTop: 0 }
  assert.equal(calculateReadingProgress({ ...base, scrollY: 0 }), 0)
  assert.equal(calculateReadingProgress({ ...base, scrollY: 700 }), 50)
  assert.equal(calculateReadingProgress({ ...base, scrollY: 1200 }), 100)
  assert.equal(calculateReadingProgress({ ...base, scrollY: 9999 }), 100)
})

test('hash-route deep link parsing preserves the router hash', () => {
  const hash = '#/knowledge/conditional-probability?mode=review&section=important-formulas'
  assert.equal(parseSectionFromHash(hash), 'important-formulas')
  assert.equal(
    buildHashRouteWithSection('#/knowledge/conditional-probability?mode=review', 'important-formulas'),
    '#/knowledge/conditional-probability?mode=review&section=important-formulas',
  )
  assert.equal(
    buildHashRouteWithSection(hash, null),
    '#/knowledge/conditional-probability?mode=review',
  )
})
