export type NumpyReferenceItem = {
  id: string
  category: '数组基础' | '数据处理' | '线性代数'
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
    category: '数组基础',
    title: '创建 NumPy 数组',
    syntax: 'np.array · np.zeros · np.ones · np.arange',
    summary: '把 Python 列表转换为统一数据类型的数组，或按指定形状快速创建初始数组。',
    code: `import numpy as np

x = np.array([1.0, 2.0, 3.0])
zeros = np.zeros((2, 3))
sequence = np.arange(0, 6, 2)

print(x)
print(zeros)
print(sequence)`,
    outputs: [
      '[1. 2. 3.]',
      `[[0. 0. 0.]
 [0. 0. 0.]]`,
      '[0 2 4]',
    ],
    notes: ['机器学习数据通常使用数值数组表示。', 'np.arange 的终点不包含在结果中。'],
  },
  {
    id: 'shape-reshape',
    category: '数组基础',
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
    id: 'indexing-filtering',
    category: '数据处理',
    title: '索引、切片与条件筛选',
    syntax: 'X[row, column] · X[:, j] · X[condition]',
    summary: '选择单个元素、某一特征列，或使用布尔条件筛选满足要求的样本。',
    code: `import numpy as np

X = np.array([[60, 1], [90, 2], [120, 3]])

print(X[:, 0])
print(X[X[:, 0] >= 90])`,
    outputs: [
      '[ 60  90 120]',
      `[[ 90   2]
 [120   3]]`,
    ],
    notes: ['冒号表示保留该维度的全部位置。', '布尔筛选返回满足条件的行，不会修改原数组。'],
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
    outputs: [
      '[ 3. 20.]',
      '[ 1.633  8.165]',
      '[11. 23. 35.]',
    ],
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
    id: 'dot-matmul',
    category: '线性代数',
    title: '点积与批量预测',
    syntax: 'np.dot(w, x) · X @ w',
    summary: '单个样本可用点积得到标量预测；整个特征矩阵与权重向量相乘可同时得到全部样本的预测。',
    code: `import numpy as np

X = np.array([[1., 2.], [3., 4.]])
w = np.array([0.5, 1.0])
b = 0.2

print(np.dot(w, X[0]) + b)
print(X @ w + b)`,
    outputs: ['2.7', '[2.7 5.7]'],
    notes: ['np.dot(w,x) 对单个样本输出标量。', 'X @ w 对 m 个样本输出长度为 m 的预测向量。'],
  },
]
