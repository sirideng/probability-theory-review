export const MACHINE_LEARNING_PROGRESS_KEY = 'probability-atlas:machine-learning-progress:v1'
export const MACHINE_LEARNING_PROGRESS_EVENT = 'probability-atlas:machine-learning-progress-change'

export function readMachineLearningProgress(storage: Pick<Storage, 'getItem'> = window.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(MACHINE_LEARNING_PROGRESS_KEY) || '{}') as { completed?: unknown }
    return Array.isArray(parsed.completed) ? parsed.completed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function writeMachineLearningProgress(completed: string[], storage: Pick<Storage, 'setItem'> = window.localStorage) {
  const unique = [...new Set(completed)]
  storage.setItem(MACHINE_LEARNING_PROGRESS_KEY, JSON.stringify({ completed: unique }))
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MACHINE_LEARNING_PROGRESS_EVENT))
  return unique
}

export function clearMachineLearningProgress(storage: Pick<Storage, 'removeItem'> = window.localStorage) {
  storage.removeItem(MACHINE_LEARNING_PROGRESS_KEY)
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MACHINE_LEARNING_PROGRESS_EVENT))
}
