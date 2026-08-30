import type { MachineLearningLesson } from '../types/content'

export const classificationLessons: MachineLearningLesson[] = [
  {
    id: 'classification-logistic-regression',
    number: '11',
    title: '分类、逻辑回归与决策边界',
    englishTitle: 'Classification & Logistic Regression',
    videoRange: '视频 26—28',
    summary: '分类模型输出类别；逻辑回归先用 Sigmoid 把线性得分映射为 0 到 1 的概率，再用阈值作出分类判断。',
    problem: '房价预测的答案是连续数值，而“肿瘤是否恶性”“邮件是否为垃圾邮件”的答案只有有限类别。若仍直接使用线性回归，预测可能小于 0 或大于 1，无法稳定解释为概率。',
    intuition: [
      '二分类通常把两个类别记作 y=0 和 y=1。模型先计算线性得分 z=\\mathbf w^T\\mathbf x+b，再通过 Sigmoid 得到 0 到 1 之间的数。',
      '逻辑回归的输出可解释为模型对 P(y=1\\mid\\mathbf x) 的估计；它不是已经发生的频率，也不是对单个样本的确定保证。',
      '当阈值取 0.5 时，Sigmoid 输出至少为 0.5 等价于 z\\ge 0，因此决策边界由 \\mathbf w^T\\mathbf x+b=0 决定。',
      '一维边界是一个点，二维边界通常是一条直线；加入多项式特征后，边界也可以弯曲。',
    ],
    formulas: [
      { label: 'Sigmoid 函数', formula: 'g(z)=\\frac{1}{1+e^{-z}},\\qquad 0<g(z)<1', explanation: '把任意实数得分压缩到 0 与 1 之间。', symbols: [{ symbol: 'z', meaning: '线性得分' }, { symbol: 'e', meaning: '自然常数' }, { symbol: 'g(z)', meaning: '属于正类的估计概率' }] },
      { label: '逻辑回归模型', formula: 'f_{\\mathbf w,b}(\\mathbf x)=g(\\mathbf w^T\\mathbf x+b)\\approx P(y=1\\mid\\mathbf x)', explanation: '先计算加权和，再通过 Sigmoid 得到概率估计。', symbols: [{ symbol: '\\mathbf x', meaning: '输入特征向量' }, { symbol: '\\mathbf w', meaning: '权重向量' }, { symbol: 'b', meaning: '偏置' }, { symbol: 'f_{\\mathbf w,b}', meaning: '正类概率估计' }] },
      { label: '0.5 阈值与决策边界', formula: '\\hat y=\\begin{cases}1,&f_{\\mathbf w,b}(\\mathbf x)\\ge 0.5\\\\0,&f_{\\mathbf w,b}(\\mathbf x)<0.5\\end{cases},\\qquad \\mathbf w^T\\mathbf x+b=0', explanation: '边界两侧分别被判为不同类别；阈值也可按任务代价调整。', symbols: [{ symbol: '\\hat y', meaning: '预测类别' }, { symbol: '0.5', meaning: '本节采用的默认分类阈值' }] },
    ],
    algorithm: [
      { title: '计算线性得分', detail: '把各特征乘对应权重后求和，再加偏置 b。' },
      { title: '映射为概率', detail: '将得分送入 Sigmoid，得到正类概率估计。' },
      { title: '应用分类阈值', detail: '默认以 0.5 为界，将概率转成类别 0 或 1。' },
      { title: '解释边界', detail: '令线性得分为 0，得到模型在特征空间中的决策边界。' },
    ],
    example: {
      title: '从线性得分得到概率与类别',
      setup: '某样本的线性得分 z=\\ln 4，分类阈值为 0.5。',
      steps: [
        { text: '把得分代入 Sigmoid。', formula: 'g(\\ln4)=\\frac{1}{1+e^{-\\ln4}}=\\frac{1}{1+1/4}=0.8' },
        { text: '把输出解释为正类概率估计。', formula: 'P(y=1\\mid\\mathbf x)\\approx0.8' },
        { text: '与阈值比较。', formula: '0.8\\ge0.5\\Longrightarrow\\hat y=1' },
      ],
      result: '模型给出 80% 的正类概率估计，并在默认阈值下预测类别 1。',
    },
    python: {
      code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

z = np.log(4)
probability = sigmoid(z)
prediction = int(probability >= 0.5)
print(round(probability, 3))
print(prediction)`,
      output: '0.8\n1',
      notes: ['probability 是概率估计，prediction 才是离散类别。', '改变阈值会改变预测类别，但不会改变模型当前输出的概率。', '实际训练时，z 由特征、权重和偏置共同决定。'],
    },
    interaction: 'logistic-regression',
    misconceptions: [
      { wrong: '逻辑回归只能做连续数值预测，因为名字里有“回归”。', why: '它使用连续概率作为中间输出，最终用于分类。', correct: '逻辑回归是经典二分类算法。' },
      { wrong: '概率大于 0.5 就说明事件一定发生。', why: '概率表达不确定性，0.8 仍保留 0.2 的另一类可能。', correct: '阈值只把概率转换为模型的决策。' },
      { wrong: '决策边界是训练样本连成的线。', why: '边界由模型参数满足 z=0 的点组成。', correct: '先写出 \\mathbf w^T\\mathbf x+b=0，再判断边界形状。' },
    ],
    recap: ['分类预测离散类别。', 'Sigmoid 把实数得分映射到 0 与 1 之间。', '逻辑回归输出可解释为正类概率估计。', '0.5 阈值对应 z=0 的决策边界。'],
    probabilityLink: { label: '概率论关联：条件概率', to: '/knowledge/conditional-probability' },
  },
  {
    id: 'logistic-cost-gradient',
    number: '12',
    title: '逻辑损失、成本函数与梯度下降',
    englishTitle: 'Logistic Loss & Gradient Descent',
    videoRange: '视频 29—31',
    summary: '二元交叉熵会重罚“自信但错误”的预测，并形成适合逻辑回归训练的成本函数。',
    problem: '逻辑回归套用平方误差会形成难以优化的非凸成本。我们需要一种既符合概率含义，又能在正确类别概率趋近 0 时给予强烈惩罚的损失。',
    intuition: [
      '真实标签 y=1 时，只关心模型是否把 f 推向 1，单样本损失为 -\\log f；y=0 时，希望 f 接近 0，损失为 -\\log(1-f)。',
      '两个分支可以写成同一个二元交叉熵公式。预测正确且有把握时损失接近 0；自信地预测错误时损失迅速增大。',
      '把全部样本损失取平均得到成本 J。虽然模型和成本与线性回归不同，逻辑回归梯度的代数形式仍是“预测减标签”乘特征。',
      '梯度公式相似不代表任务相同：逻辑回归中的 f 是 Sigmoid 输出，成本是交叉熵。',
    ],
    formulas: [
      { label: '单样本逻辑损失', formula: 'L(f,y)=-y\\log f-(1-y)\\log(1-f)', explanation: 'y 只能为 0 或 1，因此每次只保留其中一个对数项。', symbols: [{ symbol: 'f', meaning: '模型给出的正类概率，0<f<1' }, { symbol: 'y', meaning: '真实标签 0 或 1' }, { symbol: 'L', meaning: '单个样本的损失' }] },
      { label: '逻辑回归成本', formula: 'J(\\mathbf w,b)=\\frac1m\\sum_{i=1}^{m}L\\!\\left(f_{\\mathbf w,b}(\\mathbf x^{(i)}),y^{(i)}\\right)', explanation: '对全部训练样本的逻辑损失取平均。', symbols: [{ symbol: 'm', meaning: '训练样本数' }, { symbol: 'i', meaning: '样本编号' }, { symbol: 'J', meaning: '当前参数的平均训练成本' }] },
      { label: '梯度', formula: '\\frac{\\partial J}{\\partial w_j}=\\frac1m\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})x_j^{(i)},\\qquad\\frac{\\partial J}{\\partial b}=\\frac1m\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})', explanation: '使用当前 Sigmoid 概率计算误差，再同步更新各权重与偏置。', symbols: [{ symbol: 'w_j', meaning: '第 j 个特征的权重' }, { symbol: 'x_j^{(i)}', meaning: '第 i 个样本的第 j 个特征' }, { symbol: 'f^{(i)}', meaning: '第 i 个样本的 Sigmoid 输出' }] },
    ],
    algorithm: [
      { title: '前向计算概率', detail: '对每个样本计算 z 和 Sigmoid 输出 f。' },
      { title: '计算交叉熵', detail: '根据真实标签计算每个样本损失并求平均。' },
      { title: '计算全部梯度', detail: '先用同一组旧参数得到 dw 与 db。' },
      { title: '同步更新参数', detail: '按学习率减去梯度，进入下一轮。' },
    ],
    example: {
      title: '正确概率不同带来的损失',
      setup: '真实标签 y=1，比较模型输出 p=0.8 与 p=0.1。',
      steps: [
        { text: '较正确的预测。', formula: 'L(0.8,1)=-\\log0.8\\approx0.2231' },
        { text: '自信但错误的预测。', formula: 'L(0.1,1)=-\\log0.1\\approx2.3026' },
        { text: '第二个损失约为第一个的 10.3 倍。' },
      ],
      result: '交叉熵会明显惩罚给真实类别很低概率的预测。',
    },
    python: {
      code: `import numpy as np

def binary_loss(p, y):
    p = np.clip(p, 1e-15, 1 - 1e-15)
    return -y * np.log(p) - (1 - y) * np.log(1 - p)

print(round(binary_loss(0.8, 1), 4))
print(round(binary_loss(0.1, 1), 4))`,
      output: '0.2231\n2.3026',
      notes: ['clip 防止数值计算中直接出现 log(0)。', '损失使用自然对数。', '训练成本是全部单样本损失的平均。'],
    },
    interaction: 'logistic-cost',
    misconceptions: [
      { wrong: '逻辑回归继续使用线性回归的平方误差即可。', why: 'Sigmoid 与平方误差组合会使优化形状不理想。', correct: '二分类逻辑回归使用二元交叉熵。' },
      { wrong: '梯度形式一样，所以两个算法完全相同。', why: '预测函数与成本函数已经改变。', correct: '辨认公式中的 f 是线性输出还是 Sigmoid 概率。' },
      { wrong: '把概率精确设为 0 或 1 代入对数没有问题。', why: '错误类别会出现 log(0)，数学上趋于无穷。', correct: '理论上使用开区间概率，代码中做数值截断。' },
    ],
    recap: ['逻辑损失是二元交叉熵。', '正确且自信的预测损失接近 0。', '自信但错误的预测受到强惩罚。', '梯度更新仍需同步进行。'],
  },
  {
    id: 'overfitting-regularization',
    number: '13',
    title: '过拟合与正则化思想',
    englishTitle: 'Overfitting & Regularization',
    videoRange: '视频 32—34',
    summary: '过拟合模型把训练样本的偶然波动也当成规律；正则化通过限制权重规模，在拟合数据与保持简单之间取得平衡。',
    problem: '高次多项式可以把训练误差压得很低，却可能在样本之间剧烈摆动，对新数据表现更差。怎样在不删除全部有用特征的情况下抑制这种复杂度？',
    intuition: [
      '欠拟合通常表现为高偏差：模型过于简单，连训练数据的主要规律也没有学到。过拟合通常表现为高方差：模型紧贴训练数据，却对新样本敏感。',
      '减轻过拟合可以从更多训练数据、减少无关特征、加入正则化三个方向入手。当前课程重点是 L2 正则化。',
      'L2 正则化在原数据成本后增加权重平方和。较大的权重会付出更高代价，因此训练会倾向于选择更平缓的模型。',
      'λ=0 表示不正则化；λ 适中可以改善泛化；λ 过大则会把权重压得过小，重新造成欠拟合。课程约定通常不惩罚偏置 b。',
    ],
    formulas: [
      { label: '正则化线性回归成本', formula: 'J(\\mathbf w,b)=\\frac{1}{2m}\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})^2+\\frac{\\lambda}{2m}\\sum_{j=1}^{n}w_j^2', explanation: '第一项负责拟合数据，第二项限制权重规模。', symbols: [{ symbol: '\\lambda', meaning: '非负正则化参数' }, { symbol: 'n', meaning: '特征数量' }, { symbol: 'w_j', meaning: '第 j 个特征权重' }, { symbol: 'b', meaning: '通常不加入惩罚的偏置' }] },
      { label: '正则化逻辑回归成本', formula: 'J(\\mathbf w,b)=\\frac1m\\sum_{i=1}^{m}L(f^{(i)},y^{(i)})+\\frac{\\lambda}{2m}\\sum_{j=1}^{n}w_j^2', explanation: '数据损失换成交叉熵，L2 惩罚项保持相同。', symbols: [{ symbol: 'L', meaning: '二元交叉熵损失' }, { symbol: '\\lambda/(2m)', meaning: '惩罚强度的标准缩放' }] },
    ],
    algorithm: [
      { title: '识别拟合状态', detail: '结合训练表现和新数据表现判断欠拟合、合适拟合或过拟合。' },
      { title: '选择应对方式', detail: '考虑增加数据、精简特征，或在成本中加入正则项。' },
      { title: '从较小 λ 开始', detail: '比较多个非负 λ，而不是默认越大越好。' },
      { title: '观察复杂度变化', detail: '检查权重规模和曲线形状是否更平稳，同时避免明显欠拟合。' },
    ],
    example: {
      title: '计算一组权重的 L2 惩罚',
      setup: '样本数 m=5，权重为 [3,-4]，λ=2，偏置 b=10。',
      steps: [
        { text: '计算权重平方和，不包含 b。', formula: '3^2+(-4)^2=25' },
        { text: '乘正则化系数。', formula: '\\frac{\\lambda}{2m}\\sum_jw_j^2=\\frac{2}{2\\times5}\\times25=5' },
        { text: '把 5 加到原数据成本上。' },
      ],
      result: '这组权重贡献 5 的正则惩罚；b=10 不进入课程约定的惩罚项。',
    },
    python: {
      code: `import numpy as np

weights = np.array([3.0, -4.0])
m, lambda_ = 5, 2.0
penalty = lambda_ * np.sum(weights ** 2) / (2 * m)
print(penalty)`,
      output: '5.0',
      notes: ['lambda_ 是 Python 中避免与关键字混淆的变量名。', '偏置 b 没有放入 weights。', '完整成本还要加上模型自身的数据拟合成本。'],
    },
    interaction: 'overfitting-regularization',
    misconceptions: [
      { wrong: '训练误差越小，模型一定越好。', why: '模型可能记住训练噪声，泛化到新数据时反而更差。', correct: '训练拟合只是一个维度，还要关注模型复杂度和泛化。' },
      { wrong: 'λ 越大越能解决过拟合。', why: '过强惩罚会把有效权重也压小，导致欠拟合。', correct: 'λ 是需要选择的平衡参数。' },
      { wrong: '正则化会自动删除所有无关特征。', why: 'L2 主要连续地缩小权重，不保证精确变为 0。', correct: '把它理解为限制权重规模，而不是硬删除规则。' },
    ],
    recap: ['欠拟合偏向高偏差，过拟合偏向高方差。', '更多数据、减少特征和正则化都可帮助缓解过拟合。', 'L2 正则化惩罚权重平方和。', 'λ 过小作用弱，过大可能欠拟合。', '课程约定通常不正则化偏置 b。'],
    probabilityLink: { label: '概率论关联：偏差与方差', to: '/knowledge/variance' },
  },
  {
    id: 'regularized-linear-logistic',
    number: '14',
    title: '正则化线性回归与逻辑回归',
    englishTitle: 'Regularized Linear & Logistic Regression',
    videoRange: '视频 35—36',
    summary: '在线性回归和逻辑回归的权重梯度中加入 (λ/m)w，就能把 L2 正则化真正接入梯度下降。',
    problem: '成本函数已经加入权重惩罚后，参数更新也必须包含惩罚项的导数；否则代码优化的仍是未正则化目标。',
    intuition: [
      '无论线性回归还是逻辑回归，L2 正则项对 w_j 的导数都是 (λ/m)w_j，因此两者的权重梯度都在原数据梯度上加同一项。',
      '偏置 b 没有进入惩罚项，所以它的梯度保持原样。实现时应显式区分 weights 与 bias。',
      '把更新式整理后，原权重先乘 1-αλ/m，再减去数据梯度部分，因此 L2 更新也常被称作权重衰减。',
      '两种模型的正则项相同，但数据梯度中的预测不同：线性回归用 w^Tx+b，逻辑回归用 Sigmoid 概率。',
    ],
    formulas: [
      { label: '正则化权重梯度', formula: '\\frac{\\partial J}{\\partial w_j}=\\frac1m\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})x_j^{(i)}+\\frac{\\lambda}{m}w_j', explanation: '线性与逻辑回归都使用这个结构；区别在 f 的定义。', symbols: [{ symbol: 'f^{(i)}', meaning: '线性预测或 Sigmoid 概率' }, { symbol: '\\lambda w_j/m', meaning: 'L2 惩罚带来的附加梯度' }] },
      { label: '偏置梯度', formula: '\\frac{\\partial J}{\\partial b}=\\frac1m\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})', explanation: '由于 b 不正则化，公式中没有 λb/m。', symbols: [{ symbol: 'b', meaning: '偏置参数' }, { symbol: 'm', meaning: '样本数' }] },
      { label: '权重衰减形式', formula: 'w_j:=\\left(1-\\alpha\\frac{\\lambda}{m}\\right)w_j-\\alpha\\left[\\frac1m\\sum_{i=1}^{m}(f^{(i)}-y^{(i)})x_j^{(i)}\\right]', explanation: '正则化会在每轮更新中轻微收缩权重。', symbols: [{ symbol: '\\alpha', meaning: '学习率' }, { symbol: '1-\\alpha\\lambda/m', meaning: '权重衰减因子' }] },
    ],
    algorithm: [
      { title: '计算模型预测', detail: '线性回归直接输出得分，逻辑回归还需经过 Sigmoid。' },
      { title: '计算数据梯度', detail: '先汇总预测与真实目标之间的误差贡献。' },
      { title: '只给权重加惩罚', detail: '每个 dw_j 加上 λw_j/m，db 不变。' },
      { title: '同步更新', detail: '使用同一轮梯度更新全部权重和偏置。' },
    ],
    example: {
      title: '手算一次正则化权重更新',
      setup: 'm=5，λ=2，当前 w=3，数据部分梯度为 -0.8，学习率 α=0.1。',
      steps: [
        { text: '正则化附加梯度。', formula: '\\frac{\\lambda}{m}w=\\frac25\\times3=1.2' },
        { text: '合并总梯度。', formula: '\\frac{\\partial J}{\\partial w}=-0.8+1.2=0.4' },
        { text: '完成一步更新。', formula: 'w_{new}=3-0.1\\times0.4=2.96' },
      ],
      result: '新权重为 2.96；若这是偏置 b，则不应添加 1.2 的正则化梯度。',
    },
    python: {
      code: `m = 5
lambda_ = 2.0
alpha = 0.1
w = 3.0
data_gradient = -0.8

regularization_gradient = lambda_ * w / m
total_gradient = data_gradient + regularization_gradient
w_new = w - alpha * total_gradient
print(regularization_gradient)
print(total_gradient)
print(w_new)`,
      output: '1.2\n0.3999999999999999\n2.96',
      notes: ['浮点数显示 0.399999... 与数学上的 0.4 等价。', '线性和逻辑回归都可复用这段正则梯度结构。', '偏置更新只使用数据梯度。'],
    },
    interaction: 'regularized-models',
    misconceptions: [
      { wrong: '只修改成本显示，不修改梯度也能完成正则化训练。', why: '参数更新仍会沿未正则化成本的方向移动。', correct: '成本与梯度必须来自同一个目标函数。' },
      { wrong: '线性和逻辑回归加入正则后完全相同。', why: '它们只共享正则项，预测函数与数据损失仍不同。', correct: '分别计算各自预测，再加相同的 λw/m。' },
      { wrong: '偏置也必须加 λb/m。', why: '本课程定义的惩罚和不包含 b。', correct: '代码中把权重与偏置分开处理。' },
    ],
    recap: ['L2 正则化给每个权重梯度增加 λw_j/m。', '偏置梯度不含正则项。', 'L2 更新可解释为权重衰减。', '线性与逻辑回归共享惩罚结构，但预测函数不同。', '学习进度已到视频 36，下一主题尚未展开。'],
  },
]
