import { useCallback, useEffect, useState } from 'react'
import { clearMachineLearningProgress, MACHINE_LEARNING_PROGRESS_EVENT, readMachineLearningProgress, writeMachineLearningProgress } from './machineLearningProgressStore'

export { MACHINE_LEARNING_PROGRESS_KEY } from './machineLearningProgressStore'

export function useMachineLearningProgress() {
  const [completed, setCompleted] = useState<string[]>(() => readMachineLearningProgress())

  useEffect(() => {
    const update = () => setCompleted(readMachineLearningProgress())
    window.addEventListener(MACHINE_LEARNING_PROGRESS_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(MACHINE_LEARNING_PROGRESS_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    const current = readMachineLearningProgress()
    writeMachineLearningProgress(current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }, [])

  const clear = useCallback(() => clearMachineLearningProgress(), [])
  return { completed, toggle, clear }
}
