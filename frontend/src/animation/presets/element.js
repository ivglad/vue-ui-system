// Пресеты анимаций для одиночных элементов
import { DURATION_SM, DURATION_XS } from './constants.js'

export const elementPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATION_SM } },
    exit: { opacity: 0, transition: { duration: DURATION_XS } },
  },
  fadeInUp: {
    initial: { y: 8, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { y: 8, opacity: 0, transition: { duration: DURATION_XS } },
  },
  fadeInDown: {
    initial: { y: -8, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { y: -8, opacity: 0, transition: { duration: DURATION_XS } },
  },
  slideX: {
    initial: { x: 12, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { x: 12, opacity: 0, transition: { duration: DURATION_XS } },
  },
  slideY: {
    initial: { y: 12, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { y: 12, opacity: 0, transition: { duration: DURATION_XS } },
  },
  scaleIn: {
    initial: { scale: 0.96, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: DURATION_SM } },
    exit: { scale: 0.96, opacity: 0, transition: { duration: DURATION_XS } },
  },
}

export default elementPresets
