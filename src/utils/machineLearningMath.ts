export type LinearSample = { x: number; y: number }
export type FeatureScalingMode = 'raw' | 'chosen' | 'mean' | 'zscore'

export function linearPrediction(x: number, w: number, b: number) {
  return w * x + b
}

export function linearCost(samples: LinearSample[], w: number, b: number) {
  if (!samples.length) return 0
  return samples.reduce((sum, sample) => {
    const error = linearPrediction(sample.x, w, b) - sample.y
    return sum + error * error
  }, 0) / (2 * samples.length)
}

export function linearGradients(samples: LinearSample[], w: number, b: number) {
  if (!samples.length) return { dw: 0, db: 0 }
  const totals = samples.reduce((sum, sample) => {
    const error = linearPrediction(sample.x, w, b) - sample.y
    return { dw: sum.dw + error * sample.x, db: sum.db + error }
  }, { dw: 0, db: 0 })
  return { dw: totals.dw / samples.length, db: totals.db / samples.length }
}

export function gradientStep(samples: LinearSample[], w: number, b: number, alpha: number) {
  const { dw, db } = linearGradients(samples, w, b)
  return { w: w - alpha * dw, b: b - alpha * db, dw, db }
}

export function polynomialFeatures(value: number, degree: number) {
  const safeDegree = Math.max(0, Math.floor(degree))
  return Array.from({ length: safeDegree }, (_, index) => value ** (index + 1))
}

export function polynomialPrediction(value: number, coefficients: number[]) {
  return coefficients.reduce((prediction, coefficient, index) => prediction + coefficient * value ** index, 0)
}

function solveLinearSystem(matrix: number[][], vector: number[]) {
  const size = vector.length
  const augmented = matrix.map((row, index) => [...row, vector[index]])
  for (let column = 0; column < size; column += 1) {
    let pivot = column
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row
    }
    if (Math.abs(augmented[pivot][column]) < 1e-12) return null
    ;[augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]]
    const divisor = augmented[column][column]
    for (let entry = column; entry <= size; entry += 1) augmented[column][entry] /= divisor
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue
      const factor = augmented[row][column]
      for (let entry = column; entry <= size; entry += 1) augmented[row][entry] -= factor * augmented[column][entry]
    }
  }
  return augmented.map((row) => row[size])
}

export function fitPolynomialRegression(samples: LinearSample[], degree: number, lambda = 0) {
  const safeDegree = Math.max(0, Math.floor(degree))
  const parameterCount = safeDegree + 1
  if (samples.length < parameterCount) return null
  const matrix = Array.from({ length: parameterCount }, () => Array.from({ length: parameterCount }, () => 0))
  const vector = Array.from({ length: parameterCount }, () => 0)
  samples.forEach(({ x, y }) => {
    const row = [1, ...polynomialFeatures(x, safeDegree)]
    row.forEach((left, leftIndex) => {
      vector[leftIndex] += left * y
      row.forEach((right, rightIndex) => { matrix[leftIndex][rightIndex] += left * right })
    })
  })
  for (let index = 1; index < parameterCount; index += 1) matrix[index][index] += Math.max(0, lambda)
  return solveLinearSystem(matrix, vector)
}

export function polynomialMeanSquaredError(samples: LinearSample[], coefficients: number[]) {
  if (!samples.length) return 0
  return samples.reduce((sum, sample) => {
    const error = polynomialPrediction(sample.x, coefficients) - sample.y
    return sum + error * error
  }, 0) / samples.length
}

export function sigmoid(value: number) {
  if (value >= 0) return 1 / (1 + Math.exp(-value))
  const exponential = Math.exp(value)
  return exponential / (1 + exponential)
}

export function binaryCrossEntropy(probability: number, label: 0 | 1) {
  const safeProbability = Math.min(1 - 1e-15, Math.max(1e-15, probability))
  return label === 1 ? -Math.log(safeProbability) : -Math.log(1 - safeProbability)
}

export function logisticCost(features: number[][], labels: Array<0 | 1>, weights: number[], bias = 0, lambda = 0) {
  if (!features.length || features.length !== labels.length) return 0
  const dataCost = features.reduce((sum, row, index) => {
    const score = row.reduce((value, feature, column) => value + feature * (weights[column] ?? 0), bias)
    return sum + binaryCrossEntropy(sigmoid(score), labels[index])
  }, 0) / features.length
  const penalty = Math.max(0, lambda) * weights.reduce((sum, weight) => sum + weight * weight, 0) / (2 * features.length)
  return dataCost + penalty
}

export function logisticGradients(features: number[][], labels: Array<0 | 1>, weights: number[], bias = 0, lambda = 0) {
  const featureCount = features[0]?.length ?? weights.length
  const dw = Array.from({ length: featureCount }, () => 0)
  if (!features.length || features.length !== labels.length) return { dw, db: 0 }
  let db = 0
  features.forEach((row, index) => {
    const score = row.reduce((value, feature, column) => value + feature * (weights[column] ?? 0), bias)
    const error = sigmoid(score) - labels[index]
    db += error
    row.forEach((feature, column) => { dw[column] += error * feature })
  })
  return {
    dw: dw.map((value, index) => value / features.length + Math.max(0, lambda) * (weights[index] ?? 0) / features.length),
    db: db / features.length,
  }
}

export function regularizedLinearCost(features: number[][], targets: number[], weights: number[], bias = 0, lambda = 0) {
  if (!features.length || features.length !== targets.length) return 0
  const penalty = Math.max(0, lambda) * weights.reduce((sum, weight) => sum + weight * weight, 0) / (2 * features.length)
  return multiLinearCost(features, targets, weights, bias) + penalty
}

export function scaleColumn(values: number[], mode: FeatureScalingMode) {
  if (mode === 'raw' || !values.length) return [...values]
  if (mode === 'chosen') {
    const selectedScale = Math.max(...values.map((value) => Math.abs(value)))
    return values.map((value) => selectedScale ? value / selectedScale : 0)
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  if (mode === 'mean') {
    const range = Math.max(...values) - Math.min(...values)
    return values.map((value) => range ? (value - mean) / range : 0)
  }
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  const standardDeviation = Math.sqrt(variance)
  return values.map((value) => standardDeviation ? (value - mean) / standardDeviation : 0)
}

export function multiLinearCost(features: number[][], targets: number[], weights: number[], bias = 0) {
  if (!features.length || features.length !== targets.length) return 0
  const squaredError = features.reduce((sum, row, index) => {
    const prediction = row.reduce((value, feature, column) => value + feature * (weights[column] ?? 0), bias)
    return sum + (prediction - targets[index]) ** 2
  }, 0)
  return squaredError / (2 * features.length)
}

export function multiLinearGradients(features: number[][], targets: number[], weights: number[], bias = 0) {
  const featureCount = features[0]?.length ?? weights.length
  const dw = Array.from({ length: featureCount }, () => 0)
  if (!features.length || features.length !== targets.length) return { dw, db: 0 }
  let db = 0
  features.forEach((row, index) => {
    const prediction = row.reduce((value, feature, column) => value + feature * (weights[column] ?? 0), bias)
    const error = prediction - targets[index]
    db += error
    row.forEach((feature, column) => { dw[column] += error * feature })
  })
  return { dw: dw.map((value) => value / features.length), db: db / features.length }
}

export function multiGradientPath(
  features: number[][],
  targets: number[],
  initialWeights: number[],
  alpha: number,
  steps: number,
) {
  let weights = [...initialWeights]
  const path = [{ weights: [...weights], cost: multiLinearCost(features, targets, weights) }]
  for (let iteration = 0; iteration < steps; iteration += 1) {
    const { dw } = multiLinearGradients(features, targets, weights)
    weights = weights.map((value, index) => value - alpha * (dw[index] ?? 0))
    const cost = multiLinearCost(features, targets, weights)
    path.push({ weights: [...weights], cost })
    if (!Number.isFinite(cost) || cost > 1e24) break
  }
  return path
}

export function quadraticContour2D(features: number[][], targets: number[]) {
  if (!features.length || features.some((row) => row.length !== 2) || features.length !== targets.length) return null
  let h11 = 0
  let h12 = 0
  let h22 = 0
  let g1 = 0
  let g2 = 0
  features.forEach(([x1, x2], index) => {
    h11 += x1 * x1
    h12 += x1 * x2
    h22 += x2 * x2
    g1 += x1 * targets[index]
    g2 += x2 * targets[index]
  })
  const count = features.length
  h11 /= count
  h12 /= count
  h22 /= count
  g1 /= count
  g2 /= count
  const determinant = h11 * h22 - h12 * h12
  if (Math.abs(determinant) < 1e-12) return null
  const center: [number, number] = [
    (g1 * h22 - g2 * h12) / determinant,
    (h11 * g2 - h12 * g1) / determinant,
  ]
  const trace = h11 + h22
  const discriminant = Math.sqrt((h11 - h22) ** 2 + 4 * h12 * h12)
  const lambdaMax = (trace + discriminant) / 2
  const lambdaMin = (trace - discriminant) / 2
  const angleMax = 0.5 * Math.atan2(2 * h12, h11 - h22)
  return {
    center,
    lambdaMin,
    lambdaMax,
    axisRatio: Math.sqrt(lambdaMax / lambdaMin),
    majorAxisAngleDegrees: (angleMax * 180) / Math.PI + 90,
  }
}
