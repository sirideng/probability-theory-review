import type { MachineLearningLesson } from '../types/content'

export const classificationLessons: MachineLearningLesson[] = [
  {
    id: 'classification-logistic-regression',
    number: '11',
    title: '分类、逻辑回归与决策边界',
    englishTitle: 'Classification & Logistic Regression',
    videoRange: '视频 26—28',
    summary: '分类模型通常先产生得分或概率估计，再通过决策规则输出类别；二分类逻辑回归依次计算线性得分、正类概率估计和预测类别。',
    problem: '房价预测的答案是连续数值，而“肿瘤是否恶性”“邮件是否为垃圾邮件”的答案只有有限类别。若仍直接使用线性回归，预测可能小于 0 或大于 1，无法稳定解释为概率。',
    intuition: [
      '二分类通常把两个类别记作 y=0 和 y=1。模型先计算线性得分 z=\\mathbf w^{\\mathsf T}\\mathbf x+b，再通过Sigmoid函数（逻辑函数）得到正类概率估计 \\hat p。',
      '在逻辑回归模型假设下，\\hat p 用于估计条件概率 P(y=1\\mid\\mathbf x)；它不是已经发生的频率，也不是对单个样本的确定保证。',
      '采用分类阈值 τ 后，模型把 \\hat p 转换为预测类别 \\hat y。当 τ=0.5 时，\\hat p\\ge0.5 等价于 z\\ge0，因此决策边界由 \\mathbf w^{\\mathsf T}\\mathbf x+b=0 决定。',
      '一维边界是一个点，二维边界通常是一条直线；加入多项式特征后，边界也可以弯曲。',
    ],
    formulas: [
      { label: '线性得分', formula: 'z=\\mathbf w^{\\mathsf T}\\mathbf x+b', explanation: 'z 是Sigmoid函数之前的实数线性得分。', symbols: [{ symbol: '\\mathbf x', meaning: '输入特征向量' }, { symbol: '\\mathbf w', meaning: '权重向量' }, { symbol: 'b', meaning: '偏置' }] },
      { label: 'Sigmoid函数（逻辑函数）', formula: '\\hat p=\\sigma(z)=\\frac{1}{1+e^{-z}},\\qquad 0<\\hat p<1', explanation: '在逻辑回归模型假设下，\\hat p 用于估计 P(y=1\\mid\\mathbf x)。', symbols: [{ symbol: 'z', meaning: '线性得分' }, { symbol: '\\hat p', meaning: '正类概率估计' }, { symbol: 'e', meaning: '自然常数' }] },
      { label: '预测类别与决策边界', formula: '\\hat y=\\begin{cases}1,&\\hat p\\ge\\tau\\\\0,&\\hat p<\\tau\\end{cases},\\qquad \\tau=0.5\\Rightarrow \\mathbf w^{\\mathsf T}\\mathbf x+b=0', explanation: '阈值 τ 把概率估计转换为预测类别；本节默认 τ=0.5，也可按任务代价调整。', symbols: [{ symbol: '\\hat y', meaning: '预测类别' }, { symbol: '\\tau', meaning: '分类阈值' }] },
    ],
    algorithm: [
      { title: '计算线性得分', detail: '把各特征乘对应权重后求和，再加偏置 b。' },
      { title: '得到概率估计', detail: '将线性得分送入Sigmoid函数，得到正类概率估计 \\hat p。' },
      { title: '应用分类阈值', detail: '本节采用 τ=0.5，将概率估计转成预测类别 \\hat y。' },
      { title: '解释边界', detail: '令线性得分为 0，得到模型在特征空间中的决策边界。' },
    ],
    example: {
      title: '从线性得分得到概率与类别',
      setup: '某样本的线性得分 z=\\ln 4，分类阈值为 0.5。',
      steps: [
        { text: '把线性得分代入Sigmoid函数。', formula: '\\hat p=\\sigma(\\ln4)=\\frac{1}{1+e^{-\\ln4}}=\\frac{1}{1+1/4}=0.8' },
        { text: '在模型假设下，把输出解释为正类条件概率估计。', formula: '\\hat p\\approx P(y=1\\mid\\mathbf x)' },
        { text: '采用 τ=0.5 并与阈值比较。', formula: '\\hat p=0.8\\ge0.5\\Longrightarrow\\hat y=1' },
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
      { wrong: '逻辑回归只输出连续数值，不能用于分类。', why: '它先产生线性得分与概率估计，再通过决策规则得到类别。', correct: '区分 z、\\hat p 与 \\hat y 三个量。' },
      { wrong: '概率估计大于 0.5 就说明样本一定属于正类。', why: '概率估计表达模型下的不确定性，阈值只是决策规则。', correct: '当采用 0.5 阈值时，模型把 \\hat p\\ge0.5 的样本预测为正类。' },
      { wrong: '决策边界是训练样本连成的线。', why: '边界由模型参数满足 z=0 的点组成。', correct: '先写出 \\mathbf w^{\\mathsf T}\\mathbf x+b=0，再判断边界形状。' },
    ],
    recap: ['分类模型通常先产生得分或概率估计，再通过决策规则输出类别。', 'z 是线性得分，\\hat p 是正类概率估计，\\hat y 是预测类别。', '在逻辑回归模型假设下，\\hat p 用于估计条件概率 P(y=1\\mid\\mathbf x)。', '采用 0.5 阈值时，决策边界对应 z=0。'],
    probabilityLink: { label: '概率论关联：条件概率', to: '/knowledge/conditional-probability' },
  },
  {
    id: 'logistic-cost-gradient',
    number: '12',
    title: '逻辑损失、代价函数与梯度下降',
    englishTitle: 'Logistic Loss & Gradient Descent',
    videoRange: '视频 29—31',
    summary: '单样本使用二元交叉熵损失，训练集取平均得到逻辑回归代价函数；二者不可混为同一个量。',
    problem: '将Sigmoid预测与平方误差组合时，所得参数目标通常不再具有二元交叉熵逻辑回归所具有的良好凸优化结构，因此本课程采用二元交叉熵作为损失函数。',
    intuition: [
      '真实类别标签 y=1 时，单样本损失为 -\\log\\hat p；y=0 时，损失为 -\\log(1-\\hat p)。',
      '两个分支合并为二元交叉熵损失，也称对数损失（log loss）；在当前二分类逻辑回归中二者指同一表达式。',
      '对训练集全部单样本损失取平均得到逻辑回归代价函数 J(\\mathbf w,b)。预测正确且有把握时损失接近 0；自信地预测错误时损失迅速增大。',
      '梯度公式的代数结构与线性回归相似，但逻辑回归中的 \\hat p 是Sigmoid概率估计，J 是平均二元交叉熵代价。',
    ],
    formulas: [
      { label: '单样本二元交叉熵损失', formula: 'L(\\hat p,y)=-y\\log\\hat p-(1-y)\\log(1-\\hat p)', explanation: '二元交叉熵损失也称对数损失；y∈{0,1}，因此每次只保留一个对数项。', symbols: [{ symbol: '\\hat p', meaning: '正类概率估计，0<\\hat p<1' }, { symbol: 'y', meaning: '真实类别标签 0 或 1' }, { symbol: 'L', meaning: '单样本损失' }] },
      { label: '逻辑回归代价函数', formula: 'J(\\mathbf w,b)=\\frac1m\\sum_{i=1}^{m}L\\!\\left(\\hat p^{(i)},y^{(i)}\\right)', explanation: '对训练集全部单样本二元交叉熵损失取平均。', symbols: [{ symbol: 'm', meaning: '训练样本数量' }, { symbol: 'i', meaning: '样本编号' }, { symbol: 'J', meaning: '当前参数对应的训练集代价' }] },
      { label: '代价函数梯度', formula: '\\frac{\\partial J}{\\partial w_j}=\\frac1m\\sum_{i=1}^{m}(\\hat p^{(i)}-y^{(i)})x_j^{(i)},\\qquad\\frac{\\partial J}{\\partial b}=\\frac1m\\sum_{i=1}^{m}(\\hat p^{(i)}-y^{(i)})', explanation: '使用当前Sigmoid概率估计计算梯度，再同步更新全部权重与偏置。', symbols: [{ symbol: 'w_j', meaning: '第 j 个特征的权重' }, { symbol: 'x_j^{(i)}', meaning: '第 i 个样本的第 j 个特征' }, { symbol: '\\hat p^{(i)}', meaning: '第 i 个样本的正类概率估计' }] },
    ],
    algorithm: [
      { title: '前向计算概率估计', detail: '对每个样本计算线性得分 z 和Sigmoid概率估计 \\hat p。' },
      { title: '计算损失与代价', detail: '根据真实类别标签计算单样本二元交叉熵损失，再对训练集取平均。' },
      { title: '计算全部梯度', detail: '先用同一组旧参数得到 dw 与 db。' },
      { title: '同步更新参数', detail: '按学习率减去梯度，进入下一轮。' },
    ],
    example: {
      title: '正确概率不同带来的损失',
      setup: '真实类别标签 y=1，比较正类概率估计 \\hat p=0.8 与 \\hat p=0.1。',
      steps: [
        { text: '较正确的概率估计。', formula: 'L(\\hat p=0.8,y=1)=-\\log0.8\\approx0.2231' },
        { text: '自信但错误的概率估计。', formula: 'L(\\hat p=0.1,y=1)=-\\log0.1\\approx2.3026' },
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
      notes: ['np.clip 用于避免有限精度计算出现 log(0)，不改变理论损失函数的定义。', '代码变量 p 对应数学符号 \\hat p，损失使用自然对数。', '训练集代价是全部单样本二元交叉熵损失的平均。'],
    },
    interaction: 'logistic-cost',
    misconceptions: [
      { wrong: '逻辑回归继续使用线性回归的平方误差即可得到同样的优化结构。', why: 'Sigmoid预测与平方误差组合时，参数目标通常不再具有二元交叉熵逻辑回归的良好凸结构。', correct: '当前二分类逻辑回归使用二元交叉熵损失。' },
      { wrong: '梯度代数形式相似，所以线性回归与逻辑回归完全相同。', why: '二者的预测函数、单样本损失和训练集代价不同。', correct: '线性回归使用实数预测值；逻辑回归使用 \\hat p 这一Sigmoid概率估计。' },
      { wrong: '把概率精确设为 0 或 1 代入对数没有问题。', why: '错误类别会出现 log(0)，数学上趋于无穷。', correct: '理论上使用开区间概率，代码中做数值截断。' },
    ],
    recap: ['单样本使用二元交叉熵损失 L，训练集取平均得到逻辑回归代价 J。', '二元交叉熵在当前二分类逻辑回归中也称对数损失。', '正确且自信的预测损失接近 0，自信但错误的预测受到强惩罚。', '公式统一使用 \\hat p 表示正类概率估计。'],
  },
  {
    id: 'overfitting-regularization',
    number: '13',
    title: '过拟合与正则化思想',
    englishTitle: 'Overfitting & Regularization',
    videoRange: '视频 32—34',
    summary: '过拟合的核心表现是训练集拟合很好，但对未见数据的泛化表现较差；L2正则化通过惩罚较大权重来调节拟合与复杂度。',
    problem: '高次多项式可以把训练误差压得很低，却可能在样本之间剧烈摆动，对训练集之外的数据表现更差。怎样在保留有效信息的同时抑制这种复杂度？',
    intuition: [
      '欠拟合通常与高偏差相关：模型过于简单，连训练集的主要规律也没有学到。过拟合通常与高方差相关：模型对训练样本变化较敏感。这里的“相关”不是严格等价。',
      '概率论中的随机变量方差描述随机变量的波动；机器学习中的模型方差描述模型对训练样本变化的敏感程度。二者有关联，但不是同一个定义。',
      '增加训练数据、移除无关或高度冗余的特征、加入正则化都可能缓解过拟合；机械减少特征也可能丢失有效信息。当前课程重点是L2正则化。',
      'L2正则化把数据拟合项与权重平方惩罚共同组成完整目标函数。较大权重受到更强惩罚，但最终参数仍同时受到数据拟合项影响。',
      'λ=0 表示不正则化；适当 λ 可能改善泛化；λ 过大可能使模型过于简单而欠拟合。本课程约定偏置 b 不加入正则项。',
    ],
    formulas: [
      { label: 'L2正则化目标函数', formula: 'J_{\\mathrm{reg}}(\\mathbf w,b)=J_{\\mathrm{data}}(\\mathbf w,b)+\\frac{\\lambda}{2m}\\sum_{j=1}^{n}w_j^2', explanation: 'J_data 是数据拟合部分，权重平方和是正则项，二者共同组成完整正则化目标函数 J_reg。', symbols: [{ symbol: 'J_{\\mathrm{data}}', meaning: '模型原有的数据拟合代价' }, { symbol: 'J_{\\mathrm{reg}}', meaning: '完整正则化目标函数' }, { symbol: '\\lambda\\ge0', meaning: '正则化强度超参数' }, { symbol: 'n', meaning: '特征数量' }, { symbol: 'b', meaning: '本课程约定不加入正则项的偏置' }] },
      { label: '线性回归数据拟合项', formula: 'J_{\\mathrm{data}}(\\mathbf w,b)=\\frac{1}{2m}\\sum_{i=1}^{m}(f_{\\mathbf w,b}(\\mathbf x^{(i)})-y^{(i)})^2', explanation: '线性回归使用平方误差之和除以 2m。', symbols: [{ symbol: 'y^{(i)}', meaning: '第 i 个样本的真实目标值' }] },
      { label: '逻辑回归数据拟合项', formula: 'J_{\\mathrm{data}}(\\mathbf w,b)=\\frac1m\\sum_{i=1}^{m}L(\\hat p^{(i)},y^{(i)})', explanation: '逻辑回归使用训练集平均二元交叉熵代价。', symbols: [{ symbol: 'L', meaning: '单样本二元交叉熵损失' }, { symbol: '\\hat p^{(i)}', meaning: '第 i 个样本的正类概率估计' }] },
    ],
    algorithm: [
      { title: '识别拟合状态', detail: '结合训练集与未见数据表现判断欠拟合、合适拟合或过拟合。' },
      { title: '选择应对方式', detail: '考虑增加数据、移除无关或高度冗余特征，或在目标函数中加入正则项。' },
      { title: '从较小 λ 开始', detail: '比较多个非负 λ，而不是默认越大越好。' },
      { title: '观察复杂度变化', detail: '检查权重规模和曲线形状是否更平稳，同时避免明显欠拟合。' },
    ],
    example: {
      title: '计算一组权重的 L2 惩罚',
      setup: '样本数 m=5，权重为 [3,-4]，λ=2，偏置 b=10。',
      steps: [
        { text: '计算权重平方和，不包含 b。', formula: '3^2+(-4)^2=25' },
        { text: '乘正则化系数。', formula: '\\frac{\\lambda}{2m}\\sum_jw_j^2=\\frac{2}{2\\times5}\\times25=5' },
        { text: '把 5 加到数据拟合项 J_data 上，得到完整目标 J_reg。' },
      ],
      result: '这组权重贡献 5 的正则项；在本课程约定下，b=10 不进入惩罚项。',
    },
    python: {
      code: `import numpy as np

weights = np.array([3.0, -4.0])
m, lambda_ = 5, 2.0
penalty = lambda_ * np.sum(weights ** 2) / (2 * m)
print(penalty)`,
      output: '5.0',
      notes: ['lambda_ 对应正则化强度超参数 λ。', '偏置 b 没有放入 weights，符合本课程不正则化偏置的约定。', '代码只计算正则项；完整目标函数还要加上 J_data。'],
    },
    interaction: 'overfitting-regularization',
    misconceptions: [
      { wrong: '训练误差越小，模型一定越好。', why: '模型可能记住训练噪声，对未见数据的泛化表现反而更差。', correct: '训练集拟合只是一个维度，还要结合未见数据表现评估泛化能力。' },
      { wrong: 'λ 越大越能解决过拟合。', why: '过强惩罚会把有效权重也压小，导致欠拟合。', correct: 'λ 是需要选择的平衡参数。' },
      { wrong: 'L2正则化会自动删除所有无关特征。', why: 'L2正则化通常抑制权重规模，但不保证权重精确变为 0。', correct: '它对较大权重施加更强惩罚，不是硬删除特征的规则。' },
    ],
    recap: ['欠拟合通常与高偏差相关，过拟合通常与高方差相关，但不是严格等价。', '概率论中的随机变量方差描述随机变量的波动；机器学习中的模型方差描述模型对训练样本变化的敏感程度，二者不是同一个定义。', '移除无关或高度冗余特征可能缓解过拟合，机械减少特征也可能丢失信息。', 'J_reg 由 J_data 与L2正则项共同组成。', 'L2正则化通常抑制权重规模，最终参数仍受数据拟合项影响。', '本课程约定偏置 b 不正则化。'],
    probabilityLink: { label: '概率论基础：方差表示随机变量的波动', to: '/knowledge/variance' },
  },
  {
    id: 'regularized-linear-logistic',
    number: '14',
    title: '正则化线性回归与逻辑回归',
    englishTitle: 'Regularized Linear & Logistic Regression',
    videoRange: '视频 35—36',
    summary: 'L2正则化把数据拟合项与权重惩罚组成完整目标函数，并在权重梯度中增加 (λ/m)w；线性回归与逻辑回归共享这一正则项结构。',
    problem: '目标函数加入L2正则项后，参数更新也应包含正则项的导数；否则代码优化的仍是未正则化的数据拟合项。',
    intuition: [
      '无论线性回归还是逻辑回归，L2正则项对 w_j 的导数都是 (λ/m)w_j，因此两者都在数据梯度上增加同一形式的正则化梯度。',
      '在本课程约定下，偏置 b 没有进入正则项，所以它的梯度不含 λb/m。实现时应显式区分 weights 与 bias。',
      '在当前使用普通梯度下降和L2正则项的设置下，更新公式可以改写成权重衰减形式；但数据梯度仍可能使某些权重在单次更新中增大。',
      '两种模型的正则项相同，但数据拟合部分不同：线性回归使用实数预测值和平方误差代价，逻辑回归使用Sigmoid概率估计和二元交叉熵代价。',
    ],
    formulas: [
      { label: '完整正则化目标函数', formula: 'J_{\\mathrm{reg}}(\\mathbf w,b)=J_{\\mathrm{data}}(\\mathbf w,b)+\\frac{\\lambda}{2m}\\sum_{j=1}^{n}w_j^2', explanation: '数据拟合项与L2正则项共同组成梯度下降实际优化的目标函数。', symbols: [{ symbol: 'J_{\\mathrm{data}}', meaning: '线性或逻辑回归各自的数据拟合代价' }, { symbol: 'J_{\\mathrm{reg}}', meaning: '完整正则化目标函数' }, { symbol: '\\lambda\\ge0', meaning: '正则化强度超参数' }] },
      { label: '正则化权重梯度', formula: '\\frac{\\partial J_{\\mathrm{reg}}}{\\partial w_j}=\\frac{\\partial J_{\\mathrm{data}}}{\\partial w_j}+\\frac{\\lambda}{m}w_j', explanation: '两种模型共享正则化梯度 λw_j/m，但各自的数据梯度不同。', symbols: [{ symbol: '\\partial J_{\\mathrm{data}}/\\partial w_j', meaning: '数据拟合项对第 j 个权重的梯度' }, { symbol: '\\lambda w_j/m', meaning: 'L2正则项带来的附加梯度' }] },
      { label: '偏置梯度', formula: '\\frac{\\partial J_{\\mathrm{reg}}}{\\partial b}=\\frac{\\partial J_{\\mathrm{data}}}{\\partial b}', explanation: '在本课程约定下 b 不正则化，因此偏置梯度不含 λb/m。', symbols: [{ symbol: 'b', meaning: '偏置参数' }, { symbol: 'm', meaning: '训练样本数量' }] },
      { label: '权重衰减形式', formula: 'w_{j,\\text{new}}=\\left(1-\\alpha\\frac{\\lambda}{m}\\right)w_j-\\alpha\\frac{\\partial J_{\\mathrm{data}}}{\\partial w_j}', explanation: '在普通梯度下降下可分解出权重衰减因子；数据梯度仍可能使更新后的绝对值增大。', symbols: [{ symbol: '\\alpha', meaning: '学习率超参数' }, { symbol: '1-\\alpha\\lambda/m', meaning: '当前设置下的权重衰减因子' }] },
    ],
    algorithm: [
      { title: '计算模型输出', detail: '线性回归输出实数预测值；逻辑回归先计算线性得分，再经Sigmoid函数得到概率估计。' },
      { title: '计算数据梯度', detail: '线性回归使用真实目标值，逻辑回归使用真实类别标签，分别计算各自的数据梯度。' },
      { title: '只给权重加正则化梯度', detail: '每个 dw_j 加上 λw_j/m；在本课程约定下 db 不增加正则项。' },
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
      result: '新权重为 2.96；这一步绝对值减小是数据梯度与正则化梯度共同作用的结果，不代表每次更新后每个权重都必然变小。',
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
      notes: ['浮点数显示 0.399999... 与数学上的 0.4 等价。', '线性和逻辑回归共享 λw/m 这一正则化梯度结构，但数据梯度来自各自模型。', '在本课程约定下，偏置更新只使用数据梯度。'],
    },
    interaction: 'regularized-models',
    misconceptions: [
      { wrong: '只修改目标函数显示，不修改梯度也能完成正则化训练。', why: '参数更新仍会沿未正则化数据拟合项的方向移动。', correct: '目标函数与梯度应来自同一个数学定义。' },
      { wrong: '线性和逻辑回归加入正则后完全相同。', why: '它们只共享正则项，预测函数与数据损失仍不同。', correct: '分别计算各自预测，再加相同的 λw/m。' },
      { wrong: '偏置在所有正则化约定下都必须加 λb/m。', why: '本课程定义的L2正则项不包含 b。', correct: '在当前课程约定下，代码把权重与偏置分开处理。' },
    ],
    recap: ['J_reg 由 J_data 与L2正则项组成。', '权重梯度增加 λw_j/m；在本课程约定下，偏置梯度不含正则项。', '普通梯度下降下可写成权重衰减形式，但单次更新后权重绝对值不保证减小。', '线性与逻辑回归共享正则项结构，数据拟合项与模型输出不同。', '学习进度已到视频 36，下一主题尚未展开。'],
  },
]
