// Утилиты стаггера
import { STAGGER_STEP } from '../presets/constants.js'

/** Возвращает пропсы с задержкой по индексу */
export const staggerProps = (idx, { step = STAGGER_STEP } = {}) => {
  const delay = Math.max(0, Number(idx) || 0) * step
  return { transition: { delay } }
}

/** Возвращает пропсы контейнера со стаггером дочерних */
export const staggerChildrenProps = ({ step = STAGGER_STEP } = {}) => ({
  transition: { staggerChildren: step },
})
