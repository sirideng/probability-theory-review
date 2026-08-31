export const numpyReferenceCategories = [
  { id: 'numpy-array-shape', label: '数组与形状' },
  { id: 'numpy-data-processing', label: '数据处理' },
  { id: 'numpy-numeric-functions', label: '数值函数' },
  { id: 'numpy-linear-algebra', label: '线性代数' },
] as const

export type NumpyReferenceCategory = (typeof numpyReferenceCategories)[number]['label']

export type NumpyReferenceItem = {
  id: string
  category: NumpyReferenceCategory
  title: string
  syntax: string
  summary: string
  code: string
  outputs: string[]
  notes: string[]
}

export const numpyReferenceItems: NumpyReferenceItem[] = [
  {
    id: 'array-creation',
    category: '数组与形状',
    title: '创建 NumPy 数组',
    syntax: 'np.array · np.zeros · np.ones · np.arange',
    summary: '把 Python 列表转换为统一数据类型的数组，或按指定形状快速创建初始数组。',
    code: `import numpy as np

x = np.array([1.0, 2.0, 3.0])
zeros = np.zeros((2, 3))
ones = np.ones((2, 2))
sequence = np.arange(0, 6, 2)

print(x)
print(zeros)
print(ones)
print(sequence)`,
    outputs: [
      '[1. 2. 3.]',
      `[[0. 0. 0.]
 [0. 0. 0.]]`,
      `[[1. 1.]
 [1. 1.]]`,
      '[0 2 4]',
    ],
    notes: ['np.zeros 与 np.ones 按给定形状创建全 0 或全 1 数组。', 'np.arange 的终点不包含在结果中。'],
  },
  {
    id: 'shape-reshape',
    category: '数组与形状',
    title: '查看形状与变换维度',
    syntax: 'shape · ndim · reshape',
    summary: '先确认样本数和特征数，再在不改变元素总数的前提下调整数组形状。',
    code: `import numpy as np

X = np.arange(6).reshape(2, 3)

print(X)
print(X.shape)
print(X.ndim)`,
    outputs: [
      `[[0 1 2]
 [3 4 5]]`,
      '(2, 3)',
      '2',
    ],
    notes: ['X.shape=(m,n) 通常表示 m 个样本、n 个特征。', 'reshape 前后的元素总数必须相同。'],
  },
  {
    id: 'vector-shapes',
    category: '数组与形状',
    title: '区分一维数组、行向量与列向量',
    syntax: '.T · reshape(-1, 1) · np.newaxis · ravel',
    summary: '用明确的形状区分一维数组、单行矩阵和单列矩阵，避免转置时产生误解。',
    code: `import numpy as np

x = np.array([1., 2., 3.])
column = x.reshape(-1, 1)
row = x[np.newaxis, :]
flat = column.ravel()

print(x.shape)
print(x.T.shape)
print(column.shape)
print(row.shape)
print(flat.shape)`,
    outputs: ['(3,)', '(3,)', '(3, 1)', '(1, 3)', '(3,)'],
    notes: [
      '一维数组 x 的形状是 (m,)，它不是形状明确的行向量或列向量。',
      '常见错误：对一维数组使用 x.T 不会改变形状。',
      '列向量使用 reshape(-1,1)，行向量可使用 x[np.newaxis,:]。',
      'ravel() 可把数组展平为一维。',
    ],
  },
  {
    id: 'dtype-copy-finite',
    category: '数组与形状',
    title: '检查数据类型并安全复制数组',
    syntax: 'dtype · astype · copy · np.isfinite',
    summary: '在缩放或除法前确认数值类型，并用独立副本和有限值检查保护原始数据。',
    code: `import numpy as np

x = np.array([1, 2, 3])
x_float = x.astype(float)
x_copy = x_float.copy()
x_copy[0] = 99
values = np.array([1., np.nan, np.inf])
print(x.dtype)
print(x_float.dtype)
print(x_float)
print(x_copy)
print(np.isfinite(values))`,
    outputs: [
      'int32 或 int64（取决于运行环境）',
      'float64',
      '[1. 2. 3.]',
      '[99.  2.  3.]',
      '[ True False False]',
    ],
    notes: [
      '.astype(float) 返回浮点类型的新数组，适合进行标准化和除法。',
      '.copy() 创建独立副本，修改副本不会影响原数组。',
      'np.isfinite 可检查 NaN 与正负无穷。',
      '不要把整数数组的原地除法当成安全的特征缩放写法。',
    ],
  },
  {
    id: 'indexing-filtering',
    category: '数据处理',
    title: '索引、切片与条件筛选',
    syntax: 'X[row, column] · X[:, j] · X[condition]',
    summary: '选择单个元素、某一特征列，或使用布尔条件筛选满足要求的样本。',
    code: `import numpy as np

X = np.array([[60, 1], [90, 2], [120, 3]])

print(X[1, 0])
print(X[:, 0])
print(X[X[:, 0] >= 90])`,
    outputs: [
      '90',
      '[ 60  90 120]',
      `[[ 90   2]
 [120   3]]`,
    ],
    notes: ['X[1,0] 表示第 2 行、第 1 列；NumPy 索引从 0 开始。', '冒号保留该维度的全部位置；布尔筛选返回满足条件的行。'],
  },
  {
    id: 'axis-aggregation',
    category: '数据处理',
    title: '按轴求和、均值与标准差',
    syntax: 'sum · mean · std · axis',
    summary: '沿指定轴汇总数据；机器学习中常用 axis=0 分别统计每个特征列。',
    code: `import numpy as np

X = np.array([[1., 10.], [3., 20.], [5., 30.]])

print(X.mean(axis=0))
print(X.std(axis=0).round(3))
print(X.sum(axis=1))`,
    outputs: ['[ 3. 20.]', '[ 1.633  8.165]', '[11. 23. 35.]'],
    notes: ['axis=0 沿样本方向汇总，得到每个特征的统计量。', 'np.std 默认使用 ddof=0，即总体标准差口径。'],
  },
  {
    id: 'vectorization-broadcasting',
    category: '数据处理',
    title: '向量化运算与广播',
    syntax: 'X * scale · X + bias',
    summary: '对整个数组一次执行逐元素运算；广播会把兼容形状的较小数组扩展到计算所需形状。',
    code: `import numpy as np

X = np.array([[1., 2.], [3., 4.]])
scale = np.array([10., 100.])

print(X * scale)
print(X + 1)`,
    outputs: [
      `[[ 10. 200.]
 [ 30. 400.]]`,
      `[[2. 3.]
 [4. 5.]]`,
    ],
    notes: ['乘法符号 * 表示逐元素相乘，不是矩阵乘法。', '广播要求参与运算的维度彼此兼容。'],
  },
  {
    id: 'feature-matrix',
    category: '数据处理',
    title: '拼接特征列与构造多项式特征',
    syntax: 'np.column_stack · np.concatenate',
    summary: '把多个一维特征按列组合，并在需要时加入全 1 的偏置列。',
    code: `import numpy as np

x = np.array([1., 2., 3.])
X_poly = np.column_stack([x, x ** 2, x ** 3])
bias = np.ones((len(x), 1))
X_design = np.concatenate(
    [bias, X_poly], axis=1
)

print(X_poly)
print(X_design)`,
    outputs: [
      `[[ 1.  1.  1.]
 [ 2.  4.  8.]
 [ 3.  9. 27.]]`,
      `[[ 1.  1.  1.  1.]
 [ 1.  2.  4.  8.]
 [ 1.  3.  9. 27.]]`,
    ],
    notes: [
      'np.column_stack 将多个一维数组按列组成特征矩阵。',
      'axis=1 增加特征列，样本数量保持不变。',
      '首列全为 1 时可在矩阵形式中表示偏置项；本例对应多项式特征构造。',
    ],
  },
  {
    id: 'classification-thresholds',
    category: '数据处理',
    title: '将概率估计转换为预测类别',
    syntax: 'comparison · astype(int) · np.where',
    summary: '用分类阈值产生布尔判断，再转换为二分类预测结果。',
    code: `import numpy as np

probability = np.array([0.2, 0.5, 0.8])
condition = probability >= 0.5
prediction = condition.astype(int)
prediction_where = np.where(condition, 1, 0)

print(prediction)
print(prediction_where)`,
    outputs: ['[0 1 1]', '[0 1 1]'],
    notes: [
      '比较运算得到布尔数组，astype(int) 将 False/True 转换为 0/1。',
      'np.where(condition,a,b) 根据条件从两个结果中选择。',
      '分类阈值是决策规则，不会改变原来的概率估计。',
    ],
  },
  {
    id: 'numeric-functions',
    category: '数值函数',
    title: '指数、对数、平方根与数值截断',
    syntax: 'np.exp · np.log · np.sqrt · np.clip · **',
    summary: '集中处理逻辑回归概率、对数损失、平方根和逐元素幂运算。',
    code: `import numpy as np

z = np.array([-2., 0., 2.])
p = 1 / (1 + np.exp(-z))
safe_p = np.clip(p, 1e-15, 1 - 1e-15)

print(p.round(3))
print(np.log(safe_p).round(3))
print(np.sqrt([1., 4., 9.]))
print(np.array([1., 2., 3.]) ** 2)`,
    outputs: ['[0.119 0.5   0.881]', '[-2.127 -0.693 -0.127]', '[1. 2. 3.]', '[1. 4. 9.]'],
    notes: [
      'np.exp 用于计算 Sigmoid 函数；np.log 默认计算自然对数。',
      'np.clip 只是避免有限精度计算出现 log(0)，不改变理论损失函数。',
      '** 表示逐元素幂运算，不是矩阵乘法。',
    ],
  },
  {
    id: 'dot-matmul',
    category: '线性代数',
    title: '点积与批量预测',
    syntax: 'np.dot(w, x) · X @ w',
    summary: '单个样本可用点积得到标量预测；特征矩阵与权重向量相乘可批量预测。',
    code: `import numpy as np

X = np.array([[1., 2.], [3., 4.]])
w = np.array([0.5, 1.0])
b = 0.2

print(np.dot(w, X[0]) + b)
print(X @ w + b)`,
    outputs: ['2.7', '[2.7 5.7]'],
    notes: ['np.dot(w,x) 对单个样本输出标量。', 'X @ w 使用矩阵乘法，对 m 个样本输出长度为 m 的预测向量。'],
  },
  {
    id: 'norm-lstsq',
    category: '线性代数',
    title: '计算权重范数与最小二乘解',
    syntax: 'np.linalg.norm · np.sum(w ** 2) · np.linalg.lstsq',
    summary: '检查权重规模，并用最小二乘数值结果验证线性模型参数。',
    code: `import numpy as np

w = np.array([3., 4.])
print(np.linalg.norm(w))
print(np.sum(w ** 2))

X = np.array([[1., 1.], [1., 2.], [1., 3.]])
y = np.array([2., 3., 4.])
coef, *_ = np.linalg.lstsq(X, y, rcond=None)
print(coef.round(3))`,
    outputs: ['5.0', '25.0', '[1. 1.]'],
    notes: [
      'np.linalg.norm(w) 默认计算向量的 L2 范数。',
      'np.sum(w ** 2) 是权重平方和，对应当前课程的 L2 正则项结构。',
      'np.linalg.lstsq 数值求解最小二乘问题；课程仍以梯度下降为训练主线。',
    ],
  },
]
