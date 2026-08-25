import { Fragment } from 'react'
import MathFormula from './MathFormula'

export default function InlineMathText({ value }: { value: string }) {
  return value.split(/(\$[^$]+\$)/g).map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return <MathFormula key={part + '-' + index} value={part.slice(1, -1)} className="inline-math" />
    }

    return <Fragment key={part + '-' + index}>{part}</Fragment>
  })
}
