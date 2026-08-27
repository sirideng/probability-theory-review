import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateProbability, getDistributionModel, standardNormalCdf, standardNormalQuantile } from '../src/utils/distributionMath.ts'

function closeTo(actual: number, expected: number, tolerance: number, message?: string) {
  assert.ok(Math.abs(actual - expected) <= tolerance, message ?? `${actual} should be within ${tolerance} of ${expected}`)
}

test('standard normal known CDF and quantile values', () => {
  closeTo(standardNormalCdf(0), 0.5, 1e-10)
  closeTo(standardNormalQuantile(0.975), 1.9599639845, 2e-6)
  const normal = getDistributionModel('normal')
  assert.ok(normal)
  closeTo(calculateProbability(normal, { mean: 0, sigma: 1 }, { mode: 'interval', a: -1.96, b: 1.96 }), 0.95, 1e-4)
})

test('uniform and exponential interval probabilities use their CDFs', () => {
  const uniform = getDistributionModel('uniform')
  const exponential = getDistributionModel('exponential')
  assert.ok(uniform && exponential)
  closeTo(calculateProbability(uniform, { a: 2, b: 6 }, { mode: 'interval', a: 3, b: 5 }), 0.5, 1e-12)
  closeTo(calculateProbability(exponential, { lambda: 2 }, { mode: 'left', a: 0, b: 1 }), 1 - Math.exp(-2), 1e-12)
})

test('binomial PMF sums to one', () => {
  const model = getDistributionModel('binomial')
  assert.ok(model)
  const params = { n: 18, p: 0.37 }
  const total = Array.from({ length: params.n + 1 }, (_, k) => model.value(k, params)).reduce((sum, value) => sum + value, 0)
  closeTo(total, 1, 1e-12)
})

test('discrete quantiles satisfy q(p)=min{x:F(x)>=p}', () => {
  const examples = [
    { slug: 'bernoulli', params: { p: 0.3 } },
    { slug: 'binomial', params: { n: 12, p: 0.4 } },
    { slug: 'poisson', params: { lambda: 4 } },
    { slug: 'geometric', params: { p: 0.35 } },
  ]
  for (const { slug, params } of examples) {
    const model = getDistributionModel(slug)
    assert.ok(model)
    for (const probability of [0.025, 0.5, 0.95, 0.975]) {
      const q = model.quantile(probability, params)
      assert.ok(model.cdf(q, params) >= probability - 1e-12, `${slug}: F(q) must be at least p`)
      assert.ok(model.cdf(q - 1, params) < probability + 1e-12, `${slug}: q must be the smallest qualifying integer`)
    }
  }
})

test('geometric distribution counts the successful trial and starts at one', () => {
  const model = getDistributionModel('geometric')
  assert.ok(model)
  closeTo(model.value(1, { p: 0.4 }), 0.4, 1e-12)
  closeTo(model.cdf(2, { p: 0.4 }), 0.64, 1e-12)
  assert.equal(model.quantile(0.1, { p: 0.4 }), 1)
})

test('discrete inclusive interval endpoints are handled exactly', () => {
  const model = getDistributionModel('binomial')
  assert.ok(model)
  const params = { n: 5, p: 0.5 }
  const expected = model.value(2, params) + model.value(3, params)
  closeTo(calculateProbability(model, params, { mode: 'interval', a: 1.2, b: 3.8 }), expected, 1e-12)
})
