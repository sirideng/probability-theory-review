export type DistributionParameters = Record<string, number>

export type ProbabilityMode = 'left' | 'right' | 'interval' | 'two-tail'
export type CalculatorTool = 'probability' | 'quantile'

export type DistributionCalculationState = {
  tool: CalculatorTool
  mode: ProbabilityMode
  a: number
  b: number
  probability: number
  highPrecision: boolean
}

export type DistributionSupport = {
  min: number
  max: number
  discrete: boolean
  convention?: string
}

export type DistributionModel = {
  slug: string
  kind: 'continuous' | 'discrete'
  value: (x: number, params: DistributionParameters) => number
  cdf: (x: number, params: DistributionParameters) => number
  quantile: (probability: number, params: DistributionParameters) => number
  support: (params: DistributionParameters) => DistributionSupport
  chartDomain: (params: DistributionParameters) => [number, number]
  validateParameters: (params: DistributionParameters) => string[]
}

export type ProbabilityRequest = {
  mode: ProbabilityMode
  a: number
  b: number
}

const clampProbability = (value: number) => Math.min(1, Math.max(0, value))

function combination(n: number, k: number) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) return 0
  let result = 1
  for (let i = 1; i <= Math.min(k, n - k); i += 1) result = result * (n - i + 1) / i
  return result
}

function binomialPmf(k: number, n: number, p: number) {
  if (!Number.isInteger(k) || k < 0 || k > n) return 0
  return combination(n, k) * p ** k * (1 - p) ** (n - k)
}

function poissonPmf(k: number, lambda: number) {
  if (!Number.isInteger(k) || k < 0) return 0
  let term = Math.exp(-lambda)
  for (let index = 1; index <= k; index += 1) term *= lambda / index
  return term
}

// Abramowitz-Stegun 7.1.26; the maximum absolute error is about 1.5e-7.
function erf(x: number) {
  const sign = x < 0 ? -1 : 1
  const absolute = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * absolute)
  const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
  return sign * (1 - polynomial * Math.exp(-absolute * absolute))
}

export function standardNormalCdf(z: number) {
  if (z === 0) return 0.5
  if (z === Number.POSITIVE_INFINITY) return 1
  if (z === Number.NEGATIVE_INFINITY) return 0
  return clampProbability(0.5 * (1 + erf(z / Math.SQRT2)))
}

// Peter J. Acklam's inverse-normal rational approximation, followed by one Halley step.
export function standardNormalQuantile(probability: number) {
  if (!(probability > 0 && probability < 1)) return probability === 0 ? Number.NEGATIVE_INFINITY : probability === 1 ? Number.POSITIVE_INFINITY : Number.NaN
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239]
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1]
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416]
  const low = 0.02425
  const high = 1 - low
  let x: number

  if (probability < low) {
    const q = Math.sqrt(-2 * Math.log(probability))
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  } else if (probability <= high) {
    const q = probability - 0.5
    const r = q * q
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
      / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - probability))
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }

  const error = standardNormalCdf(x) - probability
  const density = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI)
  return x - error / (density + x * error / 2)
}

function probabilityParameterErrors(params: DistributionParameters) {
  return params.p > 0 && params.p < 1 ? [] : ['成功概率 p 必须满足 0 < p < 1。']
}

const models: Record<string, DistributionModel> = {
  bernoulli: {
    slug: 'bernoulli', kind: 'discrete',
    value: (x, params) => x === 0 ? 1 - params.p : x === 1 ? params.p : 0,
    cdf: (x, params) => x < 0 ? 0 : x < 1 ? 1 - params.p : 1,
    quantile: (probability, params) => probability <= 1 - params.p ? 0 : 1,
    support: () => ({ min: 0, max: 1, discrete: true }),
    chartDomain: () => [-0.6, 1.6],
    validateParameters: probabilityParameterErrors,
  },
  binomial: {
    slug: 'binomial', kind: 'discrete',
    value: (x, params) => binomialPmf(x, params.n, params.p),
    cdf: (x, params) => {
      if (x < 0) return 0
      if (x >= params.n) return 1
      let sum = 0
      for (let k = 0; k <= Math.floor(x); k += 1) sum += binomialPmf(k, params.n, params.p)
      return clampProbability(sum)
    },
    quantile: (probability, params) => {
      let cumulative = 0
      for (let k = 0; k <= params.n; k += 1) {
        cumulative += binomialPmf(k, params.n, params.p)
        if (cumulative >= probability) return k
      }
      return params.n
    },
    support: (params) => ({ min: 0, max: params.n, discrete: true }),
    chartDomain: (params) => [-0.6, params.n + 0.6],
    validateParameters: (params) => [
      ...probabilityParameterErrors(params),
      ...Number.isInteger(params.n) && params.n > 0 ? [] : ['试验次数 n 必须为正整数。'],
    ],
  },
  poisson: {
    slug: 'poisson', kind: 'discrete',
    value: (x, params) => poissonPmf(x, params.lambda),
    cdf: (x, params) => {
      if (x < 0) return 0
      const upper = Math.floor(x)
      let term = Math.exp(-params.lambda)
      let sum = term
      for (let k = 1; k <= upper; k += 1) {
        term *= params.lambda / k
        sum += term
      }
      return clampProbability(sum)
    },
    quantile: (probability, params) => {
      let term = Math.exp(-params.lambda)
      let cumulative = term
      let k = 0
      while (cumulative < probability && k < 100000) {
        k += 1
        term *= params.lambda / k
        cumulative += term
      }
      return k
    },
    support: () => ({ min: 0, max: Number.POSITIVE_INFINITY, discrete: true }),
    chartDomain: (params) => [-0.6, Math.max(12, Math.ceil(params.lambda + 4.5 * Math.sqrt(params.lambda))) + 0.6],
    validateParameters: (params) => params.lambda > 0 ? [] : ['参数 λ 必须大于 0。'],
  },
  geometric: {
    slug: 'geometric', kind: 'discrete',
    value: (x, params) => Number.isInteger(x) && x >= 1 ? (1 - params.p) ** (x - 1) * params.p : 0,
    cdf: (x, params) => x < 1 ? 0 : clampProbability(1 - (1 - params.p) ** Math.floor(x)),
    quantile: (probability, params) => Math.max(1, Math.ceil(Math.log(1 - probability) / Math.log(1 - params.p))),
    support: () => ({ min: 1, max: Number.POSITIVE_INFINITY, discrete: true, convention: 'X 表示首次成功所需的试验次数，计入成功的那一次，因此从 1 开始。' }),
    chartDomain: (params) => [0.4, Math.max(12, Math.ceil(Math.log(0.002) / Math.log(1 - params.p))) + 0.6],
    validateParameters: probabilityParameterErrors,
  },
  uniform: {
    slug: 'uniform', kind: 'continuous',
    value: (x, params) => x >= params.a && x <= params.b ? 1 / (params.b - params.a) : 0,
    cdf: (x, params) => x < params.a ? 0 : x >= params.b ? 1 : (x - params.a) / (params.b - params.a),
    quantile: (probability, params) => params.a + probability * (params.b - params.a),
    support: (params) => ({ min: params.a, max: params.b, discrete: false }),
    chartDomain: (params) => {
      const margin = Math.max(1, (params.b - params.a) * 0.3)
      return [params.a - margin, params.b + margin]
    },
    validateParameters: (params) => params.b > params.a ? [] : ['均匀分布必须满足 a < b。'],
  },
  exponential: {
    slug: 'exponential', kind: 'continuous',
    value: (x, params) => x >= 0 ? params.lambda * Math.exp(-params.lambda * x) : 0,
    cdf: (x, params) => x < 0 ? 0 : clampProbability(1 - Math.exp(-params.lambda * x)),
    quantile: (probability, params) => -Math.log1p(-probability) / params.lambda,
    support: () => ({ min: 0, max: Number.POSITIVE_INFINITY, discrete: false }),
    chartDomain: (params) => [0, -Math.log(0.002) / params.lambda],
    validateParameters: (params) => params.lambda > 0 ? [] : ['参数 λ 必须大于 0。'],
  },
  normal: {
    slug: 'normal', kind: 'continuous',
    value: (x, params) => Math.exp(-0.5 * ((x - params.mean) / params.sigma) ** 2) / (params.sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x, params) => standardNormalCdf((x - params.mean) / params.sigma),
    quantile: (probability, params) => params.mean + params.sigma * standardNormalQuantile(probability),
    support: () => ({ min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY, discrete: false }),
    chartDomain: (params) => [params.mean - 4.2 * params.sigma, params.mean + 4.2 * params.sigma],
    validateParameters: (params) => params.sigma > 0 ? [] : ['标准差 σ 必须大于 0。'],
  },
}

export function getDistributionModel(slug: string) {
  return models[slug]
}

export function supportedDistributionSlugs() {
  return Object.keys(models)
}

export function calculateProbability(model: DistributionModel, params: DistributionParameters, request: ProbabilityRequest) {
  const { a, b, mode } = request
  if (model.kind === 'continuous') {
    if (mode === 'left') return model.cdf(b, params)
    if (mode === 'right') return 1 - model.cdf(a, params)
    if (mode === 'interval') return model.cdf(b, params) - model.cdf(a, params)
    return model.cdf(a, params) + 1 - model.cdf(b, params)
  }

  if (mode === 'left') return model.cdf(Math.floor(b), params)
  if (mode === 'right') return 1 - model.cdf(Math.ceil(a) - 1, params)
  if (mode === 'interval') return model.cdf(Math.floor(b), params) - model.cdf(Math.ceil(a) - 1, params)
  return model.cdf(Math.floor(a), params) + 1 - model.cdf(Math.ceil(b) - 1, params)
}

export function validateProbabilityRequest(model: DistributionModel, request: ProbabilityRequest) {
  const errors: string[] = []
  if ((request.mode === 'right' || request.mode === 'interval' || request.mode === 'two-tail') && !Number.isFinite(request.a)) errors.push('请输入有效的边界 a。')
  if ((request.mode === 'left' || request.mode === 'interval' || request.mode === 'two-tail') && !Number.isFinite(request.b)) errors.push('请输入有效的边界 b。')
  if ((request.mode === 'interval' || request.mode === 'two-tail') && request.a > request.b) errors.push('边界必须满足 a ≤ b。')
  if (request.mode === 'two-tail' && request.a === request.b) errors.push('双尾模式需要 a < b，避免两侧事件重叠。')
  void model
  return errors
}

export function selectionContains(mode: ProbabilityMode, x: number, a: number, b: number) {
  if (mode === 'left') return x <= b
  if (mode === 'right') return x >= a
  if (mode === 'interval') return x >= a && x <= b
  return x <= a || x >= b
}

export function createDefaultCalculation(model: DistributionModel, params: DistributionParameters): DistributionCalculationState {
  const [domainMin, domainMax] = model.chartDomain(params)
  const lower = model.quantile(0.25, params)
  const upper = model.quantile(0.75, params)
  return {
    tool: 'probability',
    mode: 'interval',
    a: Number.isFinite(lower) ? lower : domainMin,
    b: Number.isFinite(upper) ? upper : domainMax,
    probability: 0.95,
    highPrecision: false,
  }
}

export function describeProbabilityMode(mode: ProbabilityMode, a: number, b: number) {
  if (mode === 'left') return `P(X ≤ ${b})`
  if (mode === 'right') return `P(X ≥ ${a})`
  if (mode === 'interval') return `P(${a} ≤ X ≤ ${b})`
  return `P(X ≤ ${a}) + P(X ≥ ${b})`
}
