export type PythonTokenType = 'plain' | 'keyword' | 'builtin' | 'function' | 'module' | 'string' | 'number' | 'comment' | 'operator'

export type PythonToken = {
  value: string
  type: PythonTokenType
}

const keywords = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'case', 'class', 'continue', 'def', 'del', 'elif', 'else',
  'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'match', 'nonlocal', 'not',
  'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'True', 'False', 'None',
])

const builtins = new Set([
  'abs', 'all', 'any', 'bool', 'dict', 'enumerate', 'float', 'int', 'len', 'list', 'map', 'max', 'min', 'print',
  'range', 'round', 'set', 'str', 'sum', 'tuple', 'zip',
])

const modules = new Set(['np', 'numpy', 'math', 'random'])
const operatorPattern = /^(?:\*\*|\/\/|==|!=|<=|>=|:=|->|\+=|-=|\*=|\/=|[+\-*/%=<>:@.,()[\]{}])$/
const tokenPattern = /#[^\n]*|(?:[fFrRbBuU]{0,2})(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?\b|\b[A-Za-z_]\w*\b|\*\*|\/\/|==|!=|<=|>=|:=|->|\+=|-=|\*=|\/=|\s+|./g

export function tokenizePythonLine(line: string): PythonToken[] {
  const values = line.match(tokenPattern) ?? []
  return values.map((value, index) => {
    if (value.startsWith('#')) return { value, type: 'comment' }
    if (/^(?:[fFrRbBuU]{0,2})(?:"|'|""")/.test(value)) return { value, type: 'string' }
    if (/^(?:\d|\.\d)/.test(value)) return { value, type: 'number' }
    if (keywords.has(value)) return { value, type: 'keyword' }
    if (builtins.has(value)) return { value, type: 'builtin' }
    if (modules.has(value)) return { value, type: 'module' }
    if (operatorPattern.test(value)) return { value, type: 'operator' }
    if (/^[A-Za-z_]\w*$/.test(value)) {
      let previous: string | undefined
      for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
        if (!/^\s+$/.test(values[previousIndex])) {
          previous = values[previousIndex]
          break
        }
      }
      const next = values.slice(index + 1).find((token) => !/^\s+$/.test(token))
      if (previous === 'def' || previous === 'class' || next === '(') return { value, type: 'function' }
    }
    return { value, type: 'plain' }
  })
}
