import { tokenizePythonLine, type PythonTokenType } from '../../utils/pythonSyntax'

const tokenColors: Record<PythonTokenType, string> = {
  plain: 'text-[#f4f4f5]',
  keyword: 'font-semibold text-[#ff7ab2]',
  builtin: 'text-[#ffd580]',
  function: 'text-[#82d2ff]',
  module: 'text-[#78dce8]',
  string: 'text-[#a8db8f]',
  number: 'text-[#d5b0ff]',
  comment: 'italic text-[#82909f]',
  operator: 'text-[#f2a65a]',
}

export default function PythonCodeBlock({ code }: { code: string }) {
  const lines = code.split('\n')
  const lineNumberWidth = Math.max(2, String(lines.length).length)

  return <pre className="w-full min-w-0 max-w-full overflow-x-auto py-5 font-mono text-[15px] leading-[1.8] sm:text-[16px]" aria-label="Python 示例代码">
    <code className="block w-max min-w-full">
      {lines.map((line, lineIndex) => <span key={lineIndex} className="grid grid-cols-[3.25rem_minmax(0,1fr)] px-4 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:px-5">
        <span aria-hidden="true" className="select-none border-r border-white/[0.07] pr-3 text-right text-white/30">{String(lineIndex + 1).padStart(lineNumberWidth, '0')}</span>
        <span className="pl-4">{line ? tokenizePythonLine(line).map((token, tokenIndex) => <span key={`${lineIndex}-${tokenIndex}`} className={tokenColors[token.type]}>{token.value}</span>) : '\u00a0'}</span>
      </span>)}
    </code>
  </pre>
}
