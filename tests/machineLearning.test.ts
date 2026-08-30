import assert from 'node:assert/strict'
import test from 'node:test'
import {
  gradientStep,
  fitPolynomialRegression,
  linearCost,
  linearGradients,
  multiGradientPath,
  multiLinearCost,
  multiLinearGradients,
  quadraticContour2D,
  polynomialFeatures,
  polynomialMeanSquaredError,
  polynomialPrediction,
  sigmoid,
  binaryCrossEntropy,
  logisticCost,
  logisticGradients,
  regularizedLinearCost,
  scaleColumn,
} from '../src/utils/machineLearningMath.ts'
import { machineLearningLessons } from '../src/data/machine-learning-course.ts'
import { MACHINE_LEARNING_PROGRESS_KEY, clearMachineLearningProgress, readMachineLearningProgress, writeMachineLearningProgress } from '../src/utils/machineLearningProgressStore.ts'
import { tokenizePythonLine } from '../src/utils/pythonSyntax.ts'

test('linear regression cost and gradients use the documented formulas', () => {
  const samples = [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }]
  assert.equal(linearCost(samples, 2, 0), 0)
  assert.deepEqual(linearGradients(samples, 0, 0), { dw: -28 / 3, db: -4 })
  const next = gradientStep(samples, 0, 0, 0.1)
  assert.ok(next.w > 0)
  assert.ok(next.b > 0)
})

test('feature scaling keeps order and z-score has zero mean', () => {
  const values = [300, 1650, 3000]
  const chosenScale = scaleColumn(values, 'chosen')
  const meanScaled = scaleColumn(values, 'mean')
  const zScores = scaleColumn(values, 'zscore')
  assert.deepEqual(chosenScale, [0.1, 0.55, 1])
  assert.ok(meanScaled[0] < meanScaled[1] && meanScaled[1] < meanScaled[2])
  assert.ok(Math.abs(zScores.reduce((sum, value) => sum + value, 0)) < 1e-12)
  assert.deepEqual(scaleColumn([0, 0, 0], 'chosen'), [0, 0, 0])
  assert.deepEqual(scaleColumn([5, 5, 5], 'zscore'), [0, 0, 0])
})

test('multivariable regression uses vector cost and one gradient per feature', () => {
  const features = [[1, 0], [0, 1]]
  const targets = [1, 2]
  assert.equal(multiLinearCost(features, targets, [0, 0]), 1.25)
  assert.deepEqual(multiLinearGradients(features, targets, [0, 0]), { dw: [-0.5, -1], db: -1.5 })
})

test('feature scaling contour geometry and paths come from the transformed data', () => {
  const areas = [300, 900, 1650, 2400, 3000]
  const rooms = [1, 3, 2, 4, 5]
  const targets = [-0.42, -0.18, -0.06, 0.24, 0.42]
  const raw = quadraticContour2D(areas.map((area, index) => [area, rooms[index]]), targets)
  const scaledAreas = scaleColumn(areas, 'zscore')
  const scaledRooms = scaleColumn(rooms, 'zscore')
  const scaledFeatures = scaledAreas.map((area, index) => [area, scaledRooms[index]])
  const scaled = quadraticContour2D(scaledFeatures, targets)
  assert.ok(raw && scaled)
  assert.ok(raw.axisRatio > scaled.axisRatio)
  const stablePath = multiGradientPath(scaledFeatures, targets, [0, 0], 0.05, 8)
  assert.ok(stablePath.at(-1)!.cost < stablePath[0].cost)
})

test('an oversized learning rate can increase the real linear regression cost', () => {
  const samples = [{ x: -1, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 3 }]
  const start = linearCost(samples, -2, -1)
  let w = -2
  let b = -1
  for (let index = 0; index < 4; index += 1) {
    const next = gradientStep(samples, w, b, 2.4)
    w = next.w
    b = next.b
  }
  assert.ok(linearCost(samples, w, b) > start)
})

test('polynomial features and least-squares fit match a known quadratic', () => {
  const samples = [0, 1, 2, 3, 4].map((x) => ({ x, y: 1 + 2 * x + 0.5 * x ** 2 }))
  assert.deepEqual(polynomialFeatures(3, 3), [3, 9, 27])
  const coefficients = fitPolynomialRegression(samples, 2)
  assert.ok(coefficients)
  assert.ok(Math.abs(coefficients[0] - 1) < 1e-10)
  assert.ok(Math.abs(coefficients[1] - 2) < 1e-10)
  assert.ok(Math.abs(coefficients[2] - 0.5) < 1e-10)
  assert.ok(Math.abs(polynomialPrediction(3, coefficients) - 11.5) < 1e-10)
  assert.ok(polynomialMeanSquaredError(samples, coefficients) < 1e-20)
})

test('sigmoid and binary cross-entropy match known logistic results', () => {
  assert.equal(sigmoid(0), 0.5)
  assert.ok(sigmoid(1000) <= 1 && sigmoid(1000) > 0.999)
  assert.ok(sigmoid(-1000) >= 0 && sigmoid(-1000) < 0.001)
  assert.ok(Math.abs(binaryCrossEntropy(0.8, 1) - 0.2231435513142097) < 1e-12)
  assert.ok(Math.abs(logisticCost([[0], [0]], [0, 1], [0]) - Math.log(2)) < 1e-12)
})

test('regularization penalizes weights but does not change the bias gradient', () => {
  const features = [[1], [1]]
  const labels: Array<0 | 1> = [0, 1]
  const plain = logisticGradients(features, labels, [2], 0, 0)
  const regularized = logisticGradients(features, labels, [2], 0, 3)
  assert.ok(Math.abs(regularized.dw[0] - plain.dw[0] - 3) < 1e-12)
  assert.equal(regularized.db, plain.db)
  assert.ok(regularizedLinearCost([[1], [2]], [1, 2], [1], 0, 2) > multiLinearCost([[1], [2]], [1, 2], [1], 0))
})

test('L2 regularization reduces the fitted polynomial coefficient norm', () => {
  const samples = [-1, -0.7, -0.3, 0, 0.3, 0.7, 1].map((x, index) => ({ x, y: x + (index % 2 ? 0.16 : -0.16) }))
  const plain = fitPolynomialRegression(samples, 6, 0)
  const regularized = fitPolynomialRegression(samples, 6, 10)
  assert.ok(plain && regularized)
  const norm = (values: number[]) => Math.sqrt(values.slice(1).reduce((sum, value) => sum + value * value, 0))
  assert.ok(norm(regularized) < norm(plain))
})

test('Python syntax highlighter distinguishes learning-code token types', () => {
  const tokens = tokenizePythonLine('for value in np.array([1, 2]):  # sample')
  const byValue = new Map(tokens.map((token) => [token.value, token.type]))
  assert.equal(byValue.get('for'), 'keyword')
  assert.equal(byValue.get('in'), 'keyword')
  assert.equal(byValue.get('np'), 'module')
  assert.equal(byValue.get('array'), 'function')
  assert.equal(byValue.get('1'), 'number')
  assert.equal(byValue.get('# sample'), 'comment')
  assert.equal(tokenizePythonLine('print("hello")').find((token) => token.value === 'print')?.type, 'builtin')
  assert.equal(tokenizePythonLine('name = "model"').find((token) => token.value === '"model"')?.type, 'string')
})

test('machine learning progress uses its own storage key and preserves other data', () => {
  const values = new Map<string, string>([['probability-progress', '["conditional-probability"]']])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
  writeMachineLearningProgress(['linear-regression-model', 'linear-regression-model'], storage)
  assert.deepEqual(readMachineLearningProgress(storage), ['linear-regression-model'])
  assert.equal(values.get('probability-progress'), '["conditional-probability"]')
  assert.ok(values.has(MACHINE_LEARNING_PROGRESS_KEY))
  clearMachineLearningProgress(storage)
  assert.equal(values.get('probability-progress'), '["conditional-probability"]')
  assert.equal(values.has(MACHINE_LEARNING_PROGRESS_KEY), false)
})

test('machine learning route contains exactly the learned video 1-36 scope', () => {
  assert.equal(machineLearningLessons.length, 14)
  assert.equal(machineLearningLessons.at(-1)?.id, 'regularized-linear-logistic')
  const courseText = JSON.stringify(machineLearningLessons)
  for (const learnedTopic of ['收敛判断', '特征工程', '逻辑回归', '交叉熵', '过拟合', '正则化']) {
    assert.equal(courseText.includes(learnedTopic), true)
  }
  for (const futureTopic of ['神经网络']) {
    assert.equal(courseText.includes(futureTopic), false)
  }
})

test('machine learning terminology is consistent across all 14 modules', () => {
  const courseText = JSON.stringify(machineLearningLessons)
  for (const outdatedTerm of ['成本函数', '当前成本', '成本曲线', '多重线性回归', '按范围缩放', 'Z-score标准化', 'L2正则化', 'Sigmoid函数', '训练数据集', '直接输出得分', '参数目标', '代价值']) {
    assert.equal(courseText.includes(outdatedTerm), false, `found outdated term: ${outdatedTerm}`)
  }
  for (const requiredTerm of ['单样本二元交叉熵损失', '逻辑回归代价函数', '多元线性回归', '按选定尺度缩放', 'Scaling by a Chosen Scale', 'Z-score 标准化', 'L2 正则化', 'Sigmoid 函数', '代价函数值', '启发式停止条件', '总体标准差口径', '验证集', '测试集', '0<αλ/m<1']) {
    assert.equal(courseText.includes(requiredTerm), true, `missing required term: ${requiredTerm}`)
  }
  assert.match(courseText, /np\.linalg\.lstsq/)
  assert.match(courseText, /不属于本节训练主线/)
  assert.match(courseText, /概率论中的随机变量方差描述随机变量的波动/)
  assert.match(courseText, /机器学习中的模型方差描述模型对训练样本变化的敏感程度/)
  assert.match(courseText, /测试集只用于模型确定后的最终评估/)
  assert.match(courseText, /完整更新还包含数据拟合项的梯度/)
})

test('machine learning lesson ids and video 1-36 ranges remain unchanged', () => {
  assert.deepEqual(machineLearningLessons.map(({ id, videoRange }) => [id, videoRange]), [
    ['machine-learning-basics', '视频 1—2'],
    ['supervised-unsupervised', '视频 3—5'],
    ['linear-regression-model', '视频 6'],
    ['cost-function', '视频 7—9'],
    ['gradient-descent', '视频 10—12'],
    ['learning-rate-training', '视频 13—15'],
    ['multiple-features-vectorization', '视频 16—19'],
    ['feature-scaling', '视频 20—21'],
    ['convergence-learning-rate', '视频 22—23'],
    ['feature-engineering-polynomial-regression', '视频 24—25'],
    ['classification-logistic-regression', '视频 26—28'],
    ['logistic-cost-gradient', '视频 29—31'],
    ['overfitting-regularization', '视频 32—34'],
    ['regularized-linear-logistic', '视频 35—36'],
  ])
  assert.equal(MACHINE_LEARNING_PROGRESS_KEY, 'probability-atlas:machine-learning-progress:v1')
})
