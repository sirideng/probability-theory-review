import katex from 'katex'

export default function MathFormula({ value, block = false, className = '' }: { value: string; block?: boolean; className?: string }) {
  const html = katex.renderToString(value, {
    displayMode: block,
    throwOnError: false,
    strict: false,
    output: 'htmlAndMathml',
  })

  const Element = block ? 'div' : 'span'
  return <Element className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
