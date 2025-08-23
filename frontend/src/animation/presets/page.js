// Пресеты анимаций для переходов между страницами
import { DURATION_SM, DURATION_XS } from './constants.js'

export const pagePresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATION_SM } },
    exit: { opacity: 0, transition: { duration: DURATION_XS } },
  },
  slideLeft: {
    initial: { x: 24, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { x: -24, opacity: 0, transition: { duration: DURATION_XS } },
  },
  slideRight: {
    initial: { x: -24, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { x: 24, opacity: 0, transition: { duration: DURATION_XS } },
  },
  scaleFade: {
    initial: { scale: 0.98, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { scale: 0.98, opacity: 0, transition: { duration: DURATION_XS } },
  },
}

export default pagePresets
